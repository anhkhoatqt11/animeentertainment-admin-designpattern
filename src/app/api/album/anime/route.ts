import prisma from "@/lib/prisma";
import AnimeAlbumModel from "../../../../model/animeAlbum";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();

  const url = new URL(request.url);

  const albumList = await AnimeAlbumModel.aggregate([
    {
      $lookup: {
        from: "animes",
        localField: "animeList",
        foreignField: "_id",
        as: "list",
      },
    },
    {
      $project: {
        "list.movieName": 1,
        "list.coverImage": 1,
        "list.landspaceImage": 1,
        albumName: 1,
        comicList: 1,
      },
    },
  ]);

  return new Response(JSON.stringify(albumList), { status: 200 });
}
