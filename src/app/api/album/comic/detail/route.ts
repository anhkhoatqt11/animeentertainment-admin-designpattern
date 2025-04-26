import prisma from "@/lib/prisma";
import ComicAlbumModel from "../../../../../model/comicAlbum";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const albumId = searchParams.get("albumId");
  const albumDetail = await ComicAlbumModel.findById(albumId);

  return new Response(JSON.stringify(albumDetail), { status: 200 });
}
