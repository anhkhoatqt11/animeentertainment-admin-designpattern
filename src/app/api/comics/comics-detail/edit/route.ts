import prisma from "@/lib/prisma";
import ComicsModel from "../../../../../model/comics";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";
export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  var comic = await ComicsModel.findById(body.comicId);
  if (!comic) {
    return new Response(JSON.stringify(""), { status: 400 });
  }
  const idList: mongoose.Types.ObjectId[] = [];
  const genreList: mongoose.Types.ObjectId[] = [];
  body.chapterList?.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  body.genres.map((item) => {
    genreList.push(new mongoose.Types.ObjectId(item));
  });
  comic.coverImage = body.coverImage;
  comic.landspaceImage = body.landspaceImage;
  comic.comicName = body.comicName;
  comic.artist = body.artist;
  comic.author = body.author;
  comic.genres = genreList;
  comic.newChapterTime = body.newChapterTime;
  comic.ageFor = body.ageFor;
  comic.publisher = body.publisher;
  comic.description = body.description;
  comic.chapterList = idList;
  await comic?.save();
  if (comic) {
    return new Response(JSON.stringify(comic), { status: 200 });
  }
}
