"use client";

import Loader from "@/components/Loader";
import { RadioGroup, Radio, cn } from "@nextui-org/react";
import { useNotification } from "@/hooks/useNotification";
import React, { useEffect, useState } from "react";
import { CustomRadioNotification } from "@/components/ui/CustomRadioNotification";

export function NewestChapterList({
  setImageChoice,
  itemChoice,
  setItemChoice,
}) {
  const [comicList, setComicList] = useState();
  const { fetchNewestChapter } = useNotification();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchNewestChapterComic = async () => {
      var result = await fetchNewestChapter();
      setComicList(result);
      setIsLoaded(true);
    };

    fetchNewestChapterComic();
  }, []);

  useEffect(() => {
    var find = comicList?.find(
      (item) => item._id.chapterOwnerId === itemChoice
    );
    setImageChoice(
      find?._id?.coverImage
        ? find?._id?.coverImage
        : "https://th.bing.com/th/id/R.c04ccba2ba93fa7fadbb75fe656966cf?rik=HaatgAaElky1Qg&pid=ImgRaw&r=0"
    );
  }, [itemChoice]);

  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };
  return (
    <div className="px-6">
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <RadioGroup
          orientation="horizontal"
          label="Danh sách truyện cập nhật mới nhất"
          onValueChange={setItemChoice}
        >
          {comicList?.map((item) => (
            <CustomRadioNotification
              key={item?._id.movieOwnerId}
              value={item?._id.chapterOwnerId}
              info={{
                name: `${item?._id.comicName}`,
                image: `${item?._id.coverImage}`,
                time: `${item?.publicTime[0]}`,
              }}
            />
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
