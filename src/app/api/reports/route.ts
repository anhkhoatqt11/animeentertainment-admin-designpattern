import prisma from "@/lib/prisma";
import UserReportModel from "../../../model/userReports";
import { statusOptions } from "@/app/(authenticated)/(home)/(components)/data/data";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const page = parseInt(searchParams?.get("page"));
  const limit = parseInt(searchParams?.get("limit"));
  const status = searchParams?.get("status");
  const reports = await UserReportModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$status",
            regex: status === "all" ? "" : status,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userBeReportedId",
        foreignField: "_id",
        as: "userBeReportedInfo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userReportedId",
        foreignField: "_id",
        as: "userReportedInfo",
      },
    },
    {
      $project: {
        _id: 1,
        reportContent: 1,
        type: 1,
        destinationId: 1,
        status: 1,
        "userBeReportedInfo._id": 1,
        "userBeReportedInfo.username": 1,
        "userBeReportedInfo.avatar": 1,
        "userReportedInfo._id": 1,
        "userReportedInfo.username": 1,
        "userReportedInfo.avatar": 1,
      },
    },
  ]);
  const countItem = await UserReportModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$status",
            regex: status === "all" ? "" : status,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
  ]);

  const data = {
    data: reports,
    totalPages: Math.ceil(countItem.length / limit),
    totalItems: reports.length,
  };

  return new Response(JSON.stringify(data), { status: 200 });
}
