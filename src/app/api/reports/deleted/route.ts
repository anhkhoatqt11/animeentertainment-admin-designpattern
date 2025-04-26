import prisma from "@/lib/prisma";
import ReportModel from "../../../../model/userReports";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  body.reportList.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  var deleteRecord = await ReportModel.deleteMany({ _id: { $in: idList } });
  if (deleteRecord) {
    return new Response(JSON.stringify(deleteRecord), { status: 200 });
  }
}
