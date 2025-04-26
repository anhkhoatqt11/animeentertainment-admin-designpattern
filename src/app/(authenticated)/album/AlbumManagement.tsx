"use client";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ComicCollection from "./(components)/ComicCollection";
import { useAlbum } from "@/hooks/useAlbum";
import AnimeCollection from "./(components)/AnimeCollection";
import { Divider } from "@nextui-org/react";

export function AlbumManagement() {
  const { fetchAnimeAlbum, fetchComicAlbum } = useAlbum();
  const [isLoading, setIsLoading] = useState(true);
  const [comicAlbumList, setComicAlbumList] = useState([]);
  const [animeAlbumList, setAnimeAlbumList] = useState([]);
  useEffect(() => {
    const fetchAlbum = async () => {
      await fetchComicAlbum().then((res) => {
        setComicAlbumList(res);
      });
      await fetchAnimeAlbum().then((res) => {
        setAnimeAlbumList(res);
      });
      setIsLoading(false);
    };
    fetchAlbum();
  }, []);
  return (
    <>
      <div className="relative min-h-[1032px]">
        <ComicCollection
          comicAlbumList={comicAlbumList}
          setComicAlbumList={setComicAlbumList}
        />
        <Divider />
        <AnimeCollection
          animeAlbumList={animeAlbumList}
          setAnimeAlbumList={setAnimeAlbumList}
        />
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 z-10 absolute top-0">
            <div className="w-full h-screen flex items-center justify-center ">
              <Loader />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
