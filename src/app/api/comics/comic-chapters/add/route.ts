import prisma from "@/lib/prisma";
import ComicChaptersModel from "../../../../../model/comicChapter";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const chapter = await ComicChaptersModel.create({
    ...body,
  });
  if (chapter) {
    return new Response(JSON.stringify(chapter), { status: 200 });
  }
}
