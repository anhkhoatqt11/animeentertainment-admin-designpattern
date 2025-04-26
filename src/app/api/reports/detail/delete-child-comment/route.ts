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
  const childCommentId = body.childCommentId;
  const type = body.type;
  if (type === "comic") {
    var chapter = await ComicChapterModel.findById(destinationId);
    chapter.comments.map(async (item) => {
      if (item._id.toString() === parentCommentId) {
        var newCommentArray = item.replies.filter(
          (item) => item._id.toString() !== childCommentId
        );
        item.replies = newCommentArray;
        await ComicChapterModel.findByIdAndUpdate(destinationId, chapter).then(
          (res) => {
            if (res) {
              return new Response(JSON.stringify(res), { status: 200 });
            }
          }
        );
      }
    });
  } else {
    var episode = await AnimeEpisodeModel.findById(destinationId);
    episode.comments.map(async (item) => {
      if (item._id.toString() === parentCommentId) {
        var newCommentArray = item.replies.filter(
          (item) => item._id.toString() !== childCommentId
        );
        item.replies = newCommentArray;
        await AnimeEpisodeModel.findByIdAndUpdate(destinationId, episode).then(
          (res) => {
            if (res) {
              return new Response(JSON.stringify(res), { status: 200 });
            }
          }
        );
      }
    });
  }
  return new Response(JSON.stringify(""), { status: 200 });
}
