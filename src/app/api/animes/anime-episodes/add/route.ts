import prisma from "@/lib/prisma";
import AnimeEpisodesModel from "../../../../../model/animeepisodes";
import connectMongoDB from "@/lib/mongodb";
import mongoose from "mongoose";
export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const episode = await AnimeEpisodesModel.create({
    ...body,
    advertisements: new mongoose.Types.ObjectId("6625e11ee7249f20295e5240"),
  });
  if (episode) {
    return new Response(JSON.stringify(episode), { status: 200 });
  }
}
