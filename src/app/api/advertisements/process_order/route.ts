import prisma from "@/lib/prisma";
import AdvertisementModel from "../../../../model/advertisements";
import AnimeEpisodesModel from "../../../../model/animeepisodes";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  body.episodeList.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  var updatedRecord = await AnimeEpisodesModel.updateMany(
    { _id: { $in: idList } },
    {
      $set: {
        advertisement: new mongoose.Types.ObjectId(body.advertisementId),
      },
    }
  );

  console.log(updatedRecord);
  if (updatedRecord) {
    return new Response(JSON.stringify(updatedRecord), { status: 200 });
  }
}
