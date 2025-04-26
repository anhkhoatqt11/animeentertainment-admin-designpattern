import prisma from "@/lib/prisma";
import ComicChapterModel from "../../../../../model/comicChapter";
import AnimeEpisodeModel from "../../../../../model/animeepisodes";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const destinationId = body.destinationId;
  const parentCommentId = body.parentCommentId;
  const type = body.type;
  if (type === "comic") {
    var chapter = await ComicChapterModel.findById(destinationId);
    var newCommentArray = chapter.comments.filter(
      (item) => item._id.toString() !== parentCommentId
    );
    chapter.comments = newCommentArray;
    var res = await ComicChapterModel.findByIdAndUpdate(destinationId, chapter);
    if (res) {
      return new Response(JSON.stringify(res), { status: 200 });
    }
  } else {
    var episode = await AnimeEpisodeModel.findById(destinationId);
    var newCommentArray = episode.comments.filter(
      (item) => item._id.toString() !== parentCommentId
    );
    episode.comments = newCommentArray;
    var res = await AnimeEpisodeModel.findByIdAndUpdate(destinationId, episode);
    if (res) {
      return new Response(JSON.stringify(res), { status: 200 });
    }
  }
}
