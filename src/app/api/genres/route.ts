import prisma from "@/lib/prisma";
import GenresModel from "../../../model/genres";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);

  const genres = await GenresModel.find();

  return new Response(JSON.stringify(genres), { status: 200 });
}
