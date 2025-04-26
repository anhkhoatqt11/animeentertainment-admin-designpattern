import prisma from "@/lib/prisma";
import UserReportModel from "../../../../model/userReports";
import ComicChapterModel from "../../../../model/comicChapter";
import AnimeEpisodeModel from "../../../../model/animeepisodes";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const reportId = searchParams?.get("reportId");
  const report = await UserReportModel.findById(reportId);
  if (report.type === "comic") {
    console.log(reportId);
    const commentDetail = await UserReportModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(reportId?.toString()) } },
      {
        $lookup: {
          from: "comicchapters",
          localField: "destinationId",
          foreignField: "_id",
          as: "chapterInformation",
        },
      },
      {
        $project: {
          "chapterInformation.publicTime": 0,
          "chapterInformation.content": 0,
          "chapterInformation.likes": 0,
          "chapterInformation.userUnlocked": 0,
          "chapterInformation.views": 0,
          "chapterInformation.unlockPrice": 0,
        },
      },
    ]);
    return new Response(JSON.stringify(commentDetail), { status: 200 });
  } else {
    const commentDetail = await UserReportModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(reportId?.toString()) } },
      {
        $lookup: {
          from: "animeepisodes",
          localField: "destinationId",
          foreignField: "_id",
          as: "episodeInformation",
        },
      },
      {
        $project: {
          "episodeInformation.publicTime": 0,
          "episodeInformation.content": 0,
          "episodeInformation.likes": 0,
          "episodeInformation.userUnlocked": 0,
          "episodeInformation.views": 0,
          "episodeInformation.unlockPrice": 0,
        },
      },
    ]);
    return new Response(JSON.stringify(commentDetail), { status: 200 });
  }
}
