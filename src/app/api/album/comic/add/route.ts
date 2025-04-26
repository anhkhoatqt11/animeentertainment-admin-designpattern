import ComicAlbumModel from "../../../../../model/comicAlbum";
import mongoose from "mongoose";
export async function POST(req: Request) {
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  body.comicList.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  const album = await ComicAlbumModel.create({
    albumName: body.albumName,
    comicList: idList,
  });
  if (album) {
    return new Response(JSON.stringify(album), { status: 200 });
  }
}
