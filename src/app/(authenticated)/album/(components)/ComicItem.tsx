import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export default function ComicItem({ item }) {
  return (
    <div className="flex flex-col overflow-hidden group shadow-lg bg-transparent rounded-md border border-gray-50">
      <Link href={`comics/${item?._id}`}>
        <div className="group relative overflow-hidden">
          <AspectRatio ratio={2 / 3}>
            <img
              src={item.coverImage}
              alt={item.comicName}
              className="object-cover h-full w-full transition-transform group-hover:scale-125 duration-300"
            />
          </AspectRatio>
          <div className="px-2 pb-2 absolute inset-0 z-20 flex items-end bg-gradient-to-t from-[#25253bdc] to-[#20202b00]">
            <p
              style={{ maxLines: 1, whiteSpace: "nowrap" }}
              className="text-[14px] font-semibold capitalize text-slate-100 text-ellipsis overflow-hidden"
            >
              {item.comicName}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
