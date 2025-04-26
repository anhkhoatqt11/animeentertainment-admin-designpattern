import prisma from "@/lib/prisma";
import AdvertisementModel from "../../../../model/advertisements";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  var ad = await AdvertisementModel.findById(body._id);
  if (!ad) {
    return new Response(JSON.stringify(""), { status: 400 });
  }
  ad.representative = body.representative;
  ad.pricePerAd = body.pricePerAd;
  ad.adVideoUrl = body.adVideoUrl;
  ad.forwardLink = body.forwardLink;
  ad.amount = body.amount;
  await ad?.save();
  if (ad) {
    return new Response(JSON.stringify(ad), { status: 200 });
  }
}
