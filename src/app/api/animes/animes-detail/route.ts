import prisma from "@/lib/prisma";
import AnimesModel from "../../../../model/animes";
import { removeVietnameseTones } from "@/lib/utils";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";


export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const animeId = searchParams.get("animeId");
  const anime = await AnimesModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(animeId || "") },
    },
    {
      $lookup: {
        from: "animeepisodes",
        localField: "episodes",
        foreignField: "_id",
        as: "episodeList",
      },
    },
  ]);

  return new Response(JSON.stringify(anime), { status: 200 });
}
