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
      $push: {
        questionCollection: {
          questionId: new mongoose.Types.ObjectId(),
          questionName: body.questionName,
          answers: body.answers,
          correctAnswerID: body.correctAnswerID,
          mediaUrl: body.mediaUrl,
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
  if (question) {
    return new Response(JSON.stringify(question), { status: 200 });
  }
}
