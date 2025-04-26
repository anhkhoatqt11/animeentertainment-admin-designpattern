import prisma from "@/lib/prisma";
import ChallengesModel from "@/model/challenges";
import UserModel from "@/model/users";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();

  const challenge = await ChallengesModel.updateMany(
    {},
    {
      $set: {
        challengeName: body.challengeName,
        endTime: body.endTime,
      },
    },
    {
      //options
      returnNewDocument: true,
      new: true,
      strict: false,
    }
  );
  await UserModel.updateMany(
    {},
    {
      $set: {
        challenges: [],
      },
    },
    {
      //options
      returnNewDocument: true,
      new: true,
      strict: false,
    }
  );
  if (challenge) {
    return new Response(JSON.stringify(challenge), { status: 200 });
  }
}
