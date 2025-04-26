import prisma from "@/lib/prisma";
import ChallengesModel from "@/model/challenges";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";


export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const question = await ChallengesModel.updateMany(
    {},
    {
      $pull: {
        questionCollection: {
          questionId: new mongoose.Types.ObjectId(body.questionId),
        },
      },
    },
    {
      //options
      returnNewDocument: true,
      new: true,
      strict: false,
    }
  );
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
  });
}
