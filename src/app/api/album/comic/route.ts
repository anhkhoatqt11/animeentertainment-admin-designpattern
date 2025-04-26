import prisma from "@/lib/prisma";
import ComicAlbumModel from "../../../../model/comicAlbum";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const albumList = await ComicAlbumModel.aggregate([
    {
      $lookup: {
        from: "comics",
        localField: "comicList",
        foreignField: "_id",
        as: "list",
      },
    },
    {
      $project: {
        "list.comicName": 1,
        "list.coverImage": 1,
        "list.landspaceImage": 1,
        albumName: 1,
        animeList: 1,
      },
    },
  ]);

  return new Response(JSON.stringify(albumList), { status: 200 });
}
