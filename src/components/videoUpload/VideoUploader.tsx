"use client";

import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { VideoUploadInput } from "@/components/videoUpload/VideoUploadInput";
import { postRequest } from "@/lib/fetch";
import toast from "react-hot-toast";

interface ChapterVideoFormProps {
  // initialData: Chapter & { muxData?: MuxData | null };
  initialData?: { videoUrl: string; muxData?: any };
  courseId?: string;
  chapterId?: string;
  videoUrl: string;
  setVideoUrl: any;
  videoKey: any;
  setVideoKey: any;
  setDuration: any;
}

export const VideoUploader = ({
  videoUrl,
  setVideoUrl,
  setDuration,
}: ChapterVideoFormProps) => {
  const parts = videoUrl?.split("/");

  // Get the last part of the URL, which contains the key
  const keyPart = parts?.[parts.length - 1];

  // If you want to remove any query parameters, you can split by '?' and take the first part
  const videoKey = keyPart?.split("?")[0];
  const onDelete = async () => {
    const res = await postRequest({
      endPoint: "/api/uploadthing/deleteVideo",
      formData: { videoKey },
      isFormData: false,
    });
    console.log(res);
    toast.success("Đã xóa video thành công");
    setVideoUrl(null);
    setDuration(0);
  };

  return (
    <div className="relative ">
      {/* {!isEditing &&
        (!initialData?.videoUrl ? null : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
          </div>
        ))} */}
      {videoUrl && (
        <div>
          <div className=" mt-2 px-2 relative">
            <ReactPlayer
              width={(window.innerWidth * 1) / 2}
              url={videoUrl}
              controls={true}
              onDuration={(duration) => {
                console.log(Math.floor(duration));
                setDuration(Math.floor(duration));
              }}
            />
            <div className="w-[200px] absolute top-0 right-3">
              <Button
                onClick={onDelete}
                variant={"destructive"}
                className="absolute right-0 "
              >
                Xóa video khỏi server
              </Button>
            </div>
          </div>
        </div>
      )}

      {!videoUrl && (
        <div>
          <VideoUploadInput
            endpoint="chapterVideo"
            onChange={(video) => {
              setVideoUrl(video.url);
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Video có thể mất một khoảng thời gian để được xử lý. Xin vui lòng
            chờ đợi
          </div>
        </div>
      )}
    </div>
  );
};
