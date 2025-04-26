import prisma from "@/lib/prisma";
import ReportModel from "../../../../model/userReports";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const completedId = body.completedId;
  var updatedRecord = await ReportModel.updateOne(
    { _id: completedId },
    {
      $set: {
        status: "completed",
      },
    }
  );
  if (updatedRecord) {
    return new Response(JSON.stringify(updatedRecord), { status: 200 });
  }
}
