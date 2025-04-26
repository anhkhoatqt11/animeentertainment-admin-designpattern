import prisma from "@/lib/prisma";
import AnimesModel from "../../../../model/animes";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const animes = await AnimesModel.find();
  return new Response(JSON.stringify(animes), { status: 200 });
}
