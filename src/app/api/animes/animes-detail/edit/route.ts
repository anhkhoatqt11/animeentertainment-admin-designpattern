import prisma from "@/lib/prisma";
import AnimesModel from "../../../../../model/animes";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  var anime = await AnimesModel.findById(body.animeId);
  if (!anime) {
    return new Response(JSON.stringify(""), { status: 400 });
  }
  const idList: mongoose.Types.ObjectId[] = [];
  const genreList: mongoose.Types.ObjectId[] = [];
  body.episodes?.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  body.genres.map((item) => {
    genreList.push(new mongoose.Types.ObjectId(item));
  });
  console.log(body);
  anime.coverImage = body.coverImage;
  anime.landspaceImage = body.landspaceImage;
  anime.movieName = body.movieName;
  anime.genres = genreList;
  anime.publishTime = body.publishTime;
  anime.ageFor = body.ageFor;
  anime.publisher = body.publisher;
  anime.description = body.description;
  anime.episodes = idList;
  await anime?.save();
  if (anime) {
    return new Response(JSON.stringify(anime), { status: 200 });
  }
}
