import prisma from "@/lib/prisma";
import ComicsModel from "../../../../model/comics";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const comics = await ComicsModel.find();
  return new Response(JSON.stringify(comics), { status: 200 });
}
