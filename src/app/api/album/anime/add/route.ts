import AnimeAlbumModel from "../../../../../model/animeAlbum";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";


export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  body.animeList.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  const album = await AnimeAlbumModel.create({
    albumName: body.albumName,
    animeList: idList,
  });
  if (album) {
    return new Response(JSON.stringify(album), { status: 200 });
  }
}
