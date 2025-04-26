import prisma from "@/lib/prisma";
import ComicChapterModel from "../../../../model/comicChapter";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const comics = await ComicChapterModel.aggregate([
    {
      $lookup: {
        from: "comics",
        localField: "_id",
        foreignField: "chapterList",
        as: "chapterOwner",
      },
    },
    {
      $project: {
        publicTime: 1,
        "chapterOwner._id": 1,
        "chapterOwner.comicName": 1,
        "chapterOwner.coverImage": 1,
      },
    },

    {
      $group: {
        _id: {
          chapterOwnerId: "$chapterOwner._id",
          coverImage: "$chapterOwner.coverImage",
          comicName: "$chapterOwner.comicName",
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
