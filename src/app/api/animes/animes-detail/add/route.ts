import prisma from "@/lib/prisma";
import AnimesModel from "../../../../../model/animes";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  const genreList: mongoose.Types.ObjectId[] = [];
  body.episodes.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  body.genres.map((item) => {
    genreList.push(new mongoose.Types.ObjectId(item));
  });
  const episode = await AnimesModel.create({
    coverImage: body.coverImage,
    landspaceImage: body.landspaceImage,
    movieName: body.movieName,
    genres: genreList,
    publishTime: body.publishTime,
    ageFor: body.ageFor,
    publisher: body.publisher,
    description: body.description,
    episodes: idList,
  });
  if (episode) {
    return new Response(JSON.stringify(episode), { status: 200 });
  }
}
