"use client";

import React, { useEffect, useState } from "react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
// import { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileDialog } from "@/components/ui/FileDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Input,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { url } from "inspector";
import { Zoom } from "@/components/ui/zoom-image";
import { DatePicker } from "@/components/ui/date-picker";
import { FileWithPath } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";
import { EpisodeItemCard } from "./EpisodeItemCard";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { VideoUploader } from "@/components/videoUpload/VideoUploader";
import { useAnimeEpisodes } from "@/hooks/useAnimeEpisodes";
import { postRequest } from "@/lib/fetch";
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

function AnimeEpisodeInformation({ props }) {
  const [defaultImage, setDefaultImage] = useState("");
  const [coverImage, setCoverImage] = React.useState([]);
  const [episodeName, setEpisodeName] = useState("");
  const [editMode, setEditMode] = useState(-1);
  const [adList, setAdList] = useState();
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const addEpisode = async () => {
    if (coverImage.length <= 0) {
      toast.error("Tập phim phải có 1 hình bìa");
      return;
    }
    if (!episodeName) {
      toast.error("Vui lòng nhập tên tập phim");
      return;
    }
    if (!videoUrl) {
      toast.error("Vui lòng tải video tập phim");
      return;
    }

    processData();
  };

  const processData = async () => {
    setIsProcessing(true);
    const [posterImage] = await Promise.all([
      startUpload([...coverImage]).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split("_")[1] ?? image.key,
          url: image.url,
        }));
        return formattedImages ?? null;
      }),
    ]);
    props.setEpisodeList([
      ...props.episodeList,
      {
        episodeName: episodeName,
        coverImage: posterImage ? posterImage[0]?.url : "",
        content: videoUrl,
        views: 0,
        totalTime: duration,
        isNew: true,
        isEditing: false,
        isDeleting: false,
      },
    ]);
    setCoverImage([]);
    setEpisodeName("");
    setVideoUrl("");
    setDefaultImage("");
    setDuration(0);
    toast.success("Đã thêm tập mới");
    setIsProcessing(false);
    return;
  };

  const editEpisode = async () => {
    if (!episodeName) {
      toast.error("Vui lòng nhập tên tập phim");
      return;
    }
    if (!videoUrl) {
      toast.error("Vui lòng tải video tập phim");
      return;
    }
    processEditData();
  };

  const processEditData = async () => {
    console.log(defaultImage, episodeName, videoUrl);
    setIsProcessing(true);
    if (coverImage.length > 0) {
      const [posterImage] = await Promise.all([
        startUpload([...coverImage]).then((res) => {
          const formattedImages = res?.map((image) => ({
            id: image.key,
            name: image.key.split("_")[1] ?? image.key,
            url: image.url,
          }));
          return formattedImages ?? null;
        }),
      ]);
      const parts = defaultImage?.split("/");
      const keyPart = parts?.[parts.length - 1];
      const imageKey = keyPart?.split("?")[0];
      await postRequest({
        endPoint: "/api/uploadthing/deleteImage",
        formData: { imageKey },
        isFormData: false,
      });
      props.setEpisodeList(
        props.episodeList.map((item, index) =>
          index === editMode
            ? {
                ...item,
                episodeName: episodeName,
                coverImage: posterImage ? posterImage[0]?.url : "",
                content: videoUrl,
                views: item.views,
                totalTime: duration,
                isNew: !item.isEditing,
                isEditing: item.isEditing,
                isDeleting: false,
              }
            : item
        )
      );
    } else {
      props.setEpisodeList(
        props.episodeList.map((item, index) =>
          index === editMode
            ? {
                ...item,
                episodeName: episodeName,
                coverImage: defaultImage,
                content: videoUrl,
                views: item.views,
                totalTime: duration,
                isNew: !item.isEditing,
                isEditing: item.isEditing,
                isDeleting: false,
              }
            : item
        )
      );
    }
    setCoverImage([]);
    setEpisodeName("");
    setVideoUrl("");
    setDefaultImage("");
    setDuration(0);
    setEditMode(-1);
    toast.success("Đã sửa tập phim");
    setIsProcessing(false);
  };

  const removeEpisode = async () => {
    setIsProcessing(true);
    if (videoUrl !== "") {
      const parts = videoUrl?.split("/");
      const keyPart = parts?.[parts.length - 1];
      const videoKey = keyPart?.split("?")[0];
      await postRequest({
        endPoint: "/api/uploadthing/deleteVideo",
        formData: { videoKey },
        isFormData: false,
      });
    }
    if (defaultImage !== "") {
      const parts = defaultImage?.split("/");
      const keyPart = parts?.[parts.length - 1];
      const imageKey = keyPart?.split("?")[0];
      await postRequest({
        endPoint: "/api/uploadthing/deleteImage",
        formData: { imageKey },
        isFormData: false,
      });
    }
    props.setEpisodeList(
      props.episodeList.map((item, index) =>
        index === editMode
          ? {
              ...item,
              isDeleting: true,
            }
          : item
      )
    );
    setCoverImage([]);
    setEpisodeName("");
    setVideoUrl("");
    setDefaultImage("");
    setDuration(0);
    setEditMode(-1);
    toast.success("Đã xóa tập phim");
    setIsProcessing(false);
  };

  return (
    <div className="grid-cols-1 grid gap-4 mb-6 mt-5">
      <Toaster />
      <h1 className="font-semibold text-xl">Danh sách tập phim</h1>
      <div className="flex flex-col gap-3 w-full rounded bg-white p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full lg:w-[70%]">
            <div className=" w-full h-[360px] border-1 rounded">
              {coverImage[0]?.preview || coverImage[0]?.url || defaultImage ? (
                <img
                  src={
                    coverImage[0]?.preview || coverImage[0]?.url || defaultImage
                  }
                  alt={coverImage[0]?.name || defaultImage}
                  className={`h-[360px] w-full rounded-md object-cover object-center`}
                />
              ) : (
                <></>
              )}
            </div>
            <FileDialog
              name="images"
              maxFiles={1}
              maxSize={1024 * 1024 * 4}
              files={coverImage}
              setFiles={setCoverImage}
              disabled={false}
              className={`p-0 px-6`}
            />
            {/* thong tin khac */}
            <div className="gap-6 mt-6">
              {/* ten phim */}
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Tên tập phim: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="md"
                  value={episodeName}
                  placeholder="Nhập tên tập phim"
                  onChange={(e) => {
                    setEpisodeName(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* mo ta */}
            <div className="gap-6">
              {/* ten phim */}
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Nội dung: <span className="text-red-500">*</span>
                </Label>
                <VideoUploader
                  videoUrl={videoUrl}
                  setVideoUrl={setVideoUrl}
                  setDuration={setDuration}
                  videoKey={undefined}
                  setVideoKey={undefined}
                />
              </div>
            </div>
            {editMode === -1 ? (
              <Button
                disabled={isProcessing}
                className={`w-full hover:scale-[1.01] transition ease-in-out duration-500 font-medium py-6 text-sm`}
                onClick={() => {
                  addEpisode();
                }}
              >
                Thêm tập phim
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  disabled={isProcessing}
                  className={`w-full bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white transition ease-in-out duration-500 font-medium py-6 text-sm`}
                  onClick={() => {
                    editEpisode();
                  }}
                >
                  Sửa tập phim
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className={`w-full bg-red-400  hover:text-white hover:scale-[1.05] hover:bg-red-500 transition ease-in-out duration-500 font-medium py-6 text-sm`}
                    onClick={() => {
                      removeEpisode();
                    }}
                  >
                    Xóa tập
                  </Button>
                  <Button
                    className={`w-full transition ease-in-out duration-500 font-medium py-6 text-sm`}
                    onClick={() => {
                      setCoverImage([]);
                      setEpisodeName("");
                      setVideoUrl("");
                      setDuration(0);
                      setDefaultImage("");
                      setEditMode(-1);
                      setCoverImage([]);
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-[30%]">
            <div className=" w-full h-full border-1 rounded overflow-hidden">
              {props.episodeList.map((item, index) =>
                !item.isDeleting ? (
                  <EpisodeItemCard
                    id={index}
                    item={item}
                    setEpisodeName={setEpisodeName}
                    setDefaultImage={setDefaultImage}
                    setVideoUrl={setVideoUrl}
                    setEditMode={setEditMode}
                    setDuration={setDuration}
                  />
                ) : (
                  <></>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeEpisodeInformation;
