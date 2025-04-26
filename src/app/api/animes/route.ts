import prisma from "@/lib/prisma";
import AnimesModel from "../../../model/animes";
import { removeVietnameseTones } from "@/lib/utils";
import connectMongoDB from "@/lib/mongodb";


export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const page = parseInt(searchParams?.get("page")); // Retrieves the value of the 'skip' parameter
  const limit = parseInt(searchParams?.get("limit")); // Retrieves the value of the 'limit' parameter
  const searchWord = searchParams.get("name");
  const sort = parseInt(searchParams?.get("sort"));
  const animes = await AnimesModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$movieName",
            regex: searchWord,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
    {
      $lookup: {
        from: "animeepisodes",
        localField: "episodes",
        foreignField: "_id",
        as: "episodeList",
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$episodeList.views",
        },
      },
    },
    {
      $project: {
        episodeList: 0,
      },
    },
    { $sort: { _id: sort } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
  const countItem = await AnimesModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$movieName",
            regex: searchWord,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
    {
      $lookup: {
        from: "animeepisodes",
        localField: "episodes",
        foreignField: "_id",
        as: "episodeList",
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$episodeList.views",
        },
      },
    },
    {
      $project: {
        episodeList: 0,
      },
    },
  ]);

  const data = {
    data: animes,
    totalPages: Math.ceil(countItem.length / limit),
    totalItems: animes.length,
  };

  return new Response(JSON.stringify(data), { status: 200 });
}
