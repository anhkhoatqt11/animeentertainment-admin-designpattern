import ComicAlbumModel from "../../../../../model/comicAlbum";
import mongoose from "mongoose";
export async function POST(req: Request) {
  const body = await req.json();
  await ComicAlbumModel.findByIdAndDelete(body._id);
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
  });
}
