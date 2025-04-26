import prisma from "@/lib/prisma";
import UsersModel from "../../../../model/users";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const idList: mongoose.Types.ObjectId[] = [];
  body.userList.map((item) => {
    idList.push(new mongoose.Types.ObjectId(item));
  });
  var updatedRecord = await UsersModel.updateMany(
    { _id: { $in: idList } },
    {
      $set: {
        accessCommentDate: new Date(
          body.year,
          body.month,
          body.day,
          body.hour,
          body.minute,
          body.second,
          0
        ),
      },
    }
  );
  if (updatedRecord) {
    return new Response(JSON.stringify(updatedRecord), { status: 200 });
  }
}
