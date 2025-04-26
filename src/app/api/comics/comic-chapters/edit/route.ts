import prisma from "@/lib/prisma";
import ComicChaptersModel from "../../../../../model/comicChapter";
import connectMongoDB from "@/lib/mongodb";
export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  var comic = await ComicChaptersModel.findById(body._id);
  if (!comic) {
    return new Response(JSON.stringify(""), { status: 400 });
  }
  comic.coverImage = body.coverImage;
  comic.chapterName = body.chapterName;
  comic.unlockPrice = body.unlockPrice;
  comic.content = body.content;
  await comic?.save();
  if (comic) {
    return new Response(JSON.stringify(comic), { status: 200 });
  }
}
