import AnimeAlbumModel from "../../../../../model/animeAlbum";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  await AnimeAlbumModel.findByIdAndDelete(body._id);
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
  });
}
