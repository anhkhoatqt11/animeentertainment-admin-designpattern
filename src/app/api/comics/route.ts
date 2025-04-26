import prisma from "@/lib/prisma";
import ComicsModel from "../../../model/comics";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const page = parseInt(searchParams?.get("page")); // Retrieves the value of the 'skip' parameter
  const limit = parseInt(searchParams?.get("limit")); // Retrieves the value of the 'limit' parameter
  const searchWord = searchParams.get("name");
  const sort = parseInt(searchParams?.get("sort"));
  const comics = await ComicsModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$comicName",
            regex: searchWord,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
    {
      $lookup: {
        from: "comicchapters",
        localField: "chapterList",
        foreignField: "_id",
        as: "detailChapterList",
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$detailChapterList.views",
        },
      },
    },
    {
      $project: {
        detailChapterList: 0,
      },
    },
    { $sort: { _id: sort } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
  const countItem = await ComicsModel.aggregate([
    {
      $addFields: {
        result: {
          $regexMatch: {
            input: "$comicName",
            regex: searchWord,
            options: "i",
          },
        },
      },
    },
    { $match: { result: true } },
    {
      $lookup: {
        from: "comicchapters",
        localField: "chapterList",
        foreignField: "_id",
        as: "detailChapterList",
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$detailChapterList.views",
        },
      },
    },
    {
      $project: {
        chapterList: 0,
      },
    },
  ]);

  const data = {
    data: comics,
    totalPages: Math.ceil(countItem.length / limit),
    totalItems: comics.length,
  };

  return new Response(JSON.stringify(data), { status: 200 });
}
