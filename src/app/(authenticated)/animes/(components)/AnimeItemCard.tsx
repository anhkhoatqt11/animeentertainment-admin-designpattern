import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { formatNumberWithDots } from "@/lib/utils";

export default function AnimeItemCard({ item }) {
  return (
    <div className="flex flex-col overflow-hidden group shadow-lg bg-transparent rounded-lg border border-gray-50">
      <Link href={`animes/${item?._id}`}>
        <div className="group relative overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img
              src={item.landspaceImage}
              alt={item.movieName}
              className="object-cover h-full w-full transition-transform group-hover:scale-125 duration-300"
            />
          </AspectRatio>
          <div className="px-2 absolute inset-0 z-20 flex items-end bg-gradient-to-t from-[#25253bdc] to-[#20202b00]">
            <div className="flex flex-col w-full">
              <p
                style={{ maxLines: 1, whiteSpace: "nowrap" }}
                className="text-[16px] font-semibold capitalize text-slate-100 text-ellipsis overflow-hidden"
              >
                {item.movieName}
              </p>
              <div className="flex flex-row justify-between">
                <p
                  style={{ maxLines: 1, whiteSpace: "nowrap" }}
                  className="text-[12px] text-white  mb-3 text-ellipsis overflow-hidden font-extralight"
                >
                  {item?.episodes?.length} tập
                </p>
                <p
                  style={{ maxLines: 1, whiteSpace: "nowrap" }}
                  className="text-[12px] text-white  mb-3 text-ellipsis overflow-hidden font-extralight"
                >
                  {formatNumberWithDots(item.totalViews.toString())} lượt xem
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* <div className="flex-1 border-t p-4 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className="font-semibold text-lg truncate">{item.movieName}</h3>
          <Badge>{item.ageFor}</Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-5">
          {item.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Genre: {item.genres}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Publisher: {item.publisher}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Episodes: {item.episodes}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Publish Time: {item.publishTime}
          </p>
        </div>
      </div> */}
    </div>
  );
}
