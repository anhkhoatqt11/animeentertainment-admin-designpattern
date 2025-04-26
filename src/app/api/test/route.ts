import prisma from "@/lib/prisma";
import AdvertisementsModel from "../../../model/animeepisodes";
import AnimeEpisodeModel from "../../../model/animeepisodes";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const Advertisements = await AnimeEpisodeModel.updateMany(
      {},
      {
        $set: {
          content: "https://utfs.io/f/efec0fcc-ebd1-4f67-9f80-2788445e0663-jli6mh.mp4",
        },
      },
      {
        //options
        returnNewDocument: true,
        new: true,
        strict: false,
      }
    );

    return new Response(JSON.stringify(Advertisements), { status: 200 });
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}
