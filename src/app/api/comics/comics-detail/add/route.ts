import prisma from "@/lib/prisma";
import ComicsModel from "../../../../../model/comics";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";
export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  const genreList: mongoose.Types.ObjectId[] = [];
  body.chapterList.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  body.genres.map((item) => {
    genreList.push(new mongoose.Types.ObjectId(item));
  });
  const comic = await ComicsModel.create({
    coverImage: body.coverImage,
    landspaceImage: body.landspaceImage,
    author: body.author,
    artist: body.artist,
    comicName: body.comicName,
    genres: genreList,
    newChapterTime: body.newChapterTime,
    ageFor: body.ageFor,
    publisher: body.publisher,
    description: body.description,
    chapterList: idList,
  });
  if (comic) {
    return new Response(JSON.stringify(comic), { status: 200 });
  }
}
