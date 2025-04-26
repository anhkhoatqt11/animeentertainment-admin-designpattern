import prisma from "@/lib/prisma";
import AnimeEpisodesModel from "../../../../../model/animeepisodes";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  var episode = await AnimeEpisodesModel.findById(body._id);
  if (!episode) {
    return new Response(JSON.stringify(""), { status: 400 });
  }
  episode.coverImage = body.coverImage;
  episode.episodeName = body.episodeName;
  episode.totalTime = body.totalTime;
  episode.content = body.content;
  await episode?.save();
  if (episode) {
    return new Response(JSON.stringify(episode), { status: 200 });
  }
}
