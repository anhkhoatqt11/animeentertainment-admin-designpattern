import prisma from "@/lib/prisma";
import AnimeEpisodesModel from "../../../../../model/animeepisodes";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const episodeId = body.episodeId;
  await AnimeEpisodesModel.findByIdAndDelete(episodeId);
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
  });
}
