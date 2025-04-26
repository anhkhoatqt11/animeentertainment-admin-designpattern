import prisma from "@/lib/prisma";
import AnimesModel from "../../../../model/animes";
import AnimeEpisodesModel from "../../../../model/animeepisodes";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";


export async function GET(request: Request) {
  await connectMongoDB();
  const episodes = await AnimeEpisodesModel.aggregate([
    {
      $match: {
        advertisement: null,
      }
    },
    {
      $lookup: {
        from: "animes",
        localField: "_id",
        foreignField: "episodes",
        as: "movieOwner",
      }
    },
    {
      $group: {
        _id: "$movieOwner._id",
        coverImage: { $first: "$movieOwner.coverImage" },
        landspaceImage: { $first: "$movieOwner.landspaceImage" },
        movieName: { $first: "$movieOwner.movieName" },
        description: { $first: "$movieOwner.description" },
        episodeList: {
          $push: {
            _id: "$_id",
            coverImage: "$coverImage",
            episodeName: "$episodeName",
            advertisement: "$advertisement",
          }
        }
      }
    }
  ])



  return new Response(JSON.stringify(episodes), { status: 200 });
}


  // {
  //   $lookup: {
  //     from: "animeepisodes",
  //     localField: "episodes",
  //     foreignField: "_id",
  //     as: "episodeList",
  //   },
  // },
  // {
  //   $lookup: {
  //     from: "genres",
  //     localField: "genres",
  //     foreignField: "_id",
  //     as: "genreList",
  //   },
  // },
  // {
  //   $project: {
  //     _id: 1,
  //     coverImage: 1,
  //     landspaceImage: 1,
  //     movieName: 1,
  //     description: 1,
  //     genreList: 1,
  //     "episodeList._id": 1,
  //     "episodeList.coverImage": 1,
  //     "episodeList.episodeName": 1,
  //     "episodeList.advertisement": 1,
  //   },
  // },
