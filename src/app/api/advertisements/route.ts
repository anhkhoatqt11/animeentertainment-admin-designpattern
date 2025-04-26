import prisma from "@/lib/prisma";
import AdvertisementModel from "../../../model/advertisements";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();

  const url = new URL(request.url);

  const genres = await AdvertisementModel.find();

  return new Response(JSON.stringify(genres), { status: 200 });
}
