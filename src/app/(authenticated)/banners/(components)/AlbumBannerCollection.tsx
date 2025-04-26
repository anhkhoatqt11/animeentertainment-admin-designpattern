"use client";

import React from "react";
import ComicItem from "../../album/(components)/ComicItem";
import AnimeItem from "../../album/(components)/AnimeItem";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function AlbumBannerCollection({ bannerList, setBannerList }) {
  const router = useRouter();
  return (
    <div className="grid-cols-1 grid gap-4 mb-6">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between items-end p-4 pb-0">
        <h1 className="font-semibold text-xl">Danh sách banner truyện tranh</h1>
      </div>
      <div className="rounded bg-white m-4 p-4 mt-0">
        <div>
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {bannerList.map((item) =>
              item.list.map(
                (comic, index) =>
                  comic.type === "Comic" && (
                    <ComicItem item={comic} key={`comic-${item._id}`} />
                  )
              )
            )}
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 mt-3">
              <Button
                className={`w-full bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white  transition ease-in-out duration-500 font-medium py-6 text-sm`}
                onClick={() => {
                  router.push("banners/edit-comics");
                }}
              >
                Sửa banner
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:justify-between items-end p-4 pb-0">
        <h1 className="font-semibold text-xl">Danh sách banner animes</h1>
      </div>
      <div className="rounded bg-white m-4 p-4 mt-0">
        <div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {bannerList.map((item) =>
              item.list.map(
                (anime, index) =>
                  anime.type === "Anime" && (
                    <AnimeItem item={anime} key={`anime-${item._id}`} />
                  )
              )
            )}
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 mt-3">
              <Button
                className={`w-full bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white  transition ease-in-out duration-500 font-medium py-6 text-sm`}
                onClick={() => {
                  router.push("banners/edit-animes");
                }}
              >
                Sửa banner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumBannerCollection;
