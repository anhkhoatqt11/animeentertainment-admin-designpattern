import prisma from "@/lib/prisma";
import UsersModel from "../../../../model/users";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const page = parseInt(searchParams?.get("page")); // Retrieves the value of the 'skip' parameter
  const limit = parseInt(searchParams?.get("limit")); // Retrieves the value of the 'limit' parameter
  const searchWord = searchParams.get("name");
  const status = searchParams?.get("status");
  const users = await UsersModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$username",
            regex: searchWord,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
  const countItem = await UsersModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$username",
            regex: searchWord,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
  ]);

  const data = {
    data: users,
    totalPages: Math.ceil(countItem.length / limit),
    totalItems: users.length,
  };

  return new Response(JSON.stringify(data), { status: 200 });
}
