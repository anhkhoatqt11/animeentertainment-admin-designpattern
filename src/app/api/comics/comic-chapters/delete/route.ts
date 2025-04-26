import prisma from "@/lib/prisma";
import ComicChaptersModel from "../../../../../model/comicChapter";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const chapterId = body.chapterId;
  await ComicChaptersModel.findByIdAndDelete(chapterId);
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
  });
}
