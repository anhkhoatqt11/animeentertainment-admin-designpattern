import prisma from "@/lib/prisma";
import UsersModel from "../../../../model/users";
import mongoose from "mongoose";
import { postRequest } from "@/lib/fetch";
import connectMongoDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();

  const users = await UsersModel.updateMany(
    {},
    {
      $push: {
        notifications: {
          sourceId: new mongoose.Types.ObjectId(body.sourceId),
          type: body.type,
          content: body.content,
          status: "sent",
          sentTime: new Date(),
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
  const allUsers = await UsersModel.find();
  allUsers.forEach(async (item) => {
    const data = {
      title: `Ping pong. ${body.type === "chapter" ? "Chương mới đã ra mắt" : "Tập mới đã ra mắt"
        }`,
      body: body.content,
      userId: item._id.toString(),
    };
    const res = await postRequest({
      endPoint: "https://skylark-entertainment-1v0l91qho-son-dangs-projects.vercel.app/api/users/sendPushNoti",
      isFormData: false,
      formData: data,
    });
  });
  if (users) {
    return new Response(JSON.stringify(users), { status: 200 });
  }
}
