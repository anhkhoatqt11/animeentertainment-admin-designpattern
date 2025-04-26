"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
// import { ourFileRouter } from '@/app/api/uploadthing/core';

interface VideoUploadProps {
  onChange: any;
  endpoint: keyof typeof ourFileRouter;
}

export const VideoUploadInput = ({ onChange, endpoint }: VideoUploadProps) => {
  return (
    <UploadDropzone
      className="h-[360px] ut-button:bg-blue-500 ut-label:text-lg ut-allowed-content:ut-uploading:text-blue-300"
      // onUploadProgress={(progress) => {
      //   console.log(
      //     '🚀 ~ file: VideoUploadInput.tsx:18 ~ VideoUploadInput ~ progress:',
      //     progress
      //   );
      // }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
