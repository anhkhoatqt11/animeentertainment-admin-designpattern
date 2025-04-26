import prisma from "@/lib/prisma";
import AnimeEpisodeModel from "../../../../model/animeepisodes";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const comics = await AnimeEpisodeModel.aggregate([
    {
      $lookup: {
        from: "animes",
        localField: "_id",
        foreignField: "episodes",
        as: "movieOwner",
      },
    },
    {
      $project: {
        publicTime: 1,
        "movieOwner._id": 1,
        "movieOwner.movieName": 1,
        "movieOwner.coverImage": 1,
      },
    },

    {
      $group: {
        _id: {
          movieOwnerId: "$movieOwner._id",
          coverImage: "$movieOwner.coverImage",
          movieName: "$movieOwner.movieName",
        },
        publicTime: {
          $top: {
            output: ["$publicTime"],
            sortBy: { publicTime: -1 },
          },
        },
      },
    },
    { $sort: { publicTime: -1 } },
    { $limit: 10 },
  ]);

  return new Response(JSON.stringify(comics), { status: 200 });
}
