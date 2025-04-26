import prisma from "@/lib/prisma";
import Comics from "../../../../../model/comics";
import connectMongoDB from "@/lib/mongodb";
export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const comicId = body.comicId;
  await Comics.findByIdAndDelete(comicId);
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
  });
}
