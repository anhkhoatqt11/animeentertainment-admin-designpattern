"use client";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ComicInformation from "../(components)/ComicInformation";
import ComicChapterInformation from "../(components)/ComicChapterInformation";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Loader from "@/components/Loader";
import { useComicChapters } from "@/hooks/useComicChapters";
import { useComics } from "@/hooks/useComics";
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type ComicChap = {
  chapterName: string;
  coverImage: string;
  publicTime: Date;
  content: [];
  views: number;
  comments: [];
  likes: [];
  unlockPrice: number;
  userUnlocked: [];
};

export function AddNewComic() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [landspaceImage, setLandspaceImage] = React.useState([]);
  const [coverImage, setCoverImage] = React.useState([]);
  const [comicName, setComicName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [genreSelected, setGenreSelected] = React.useState([]);
  const [artist, setArtist] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [publisher, setPublisher] = React.useState("");
  const [weeklyTime, setWeeklyTime] = React.useState("");
  const [ageFor, setAgeFor] = React.useState(new Set(["10+"]));
  const [detailChapterList, setDetailChapterList] = useState<ComicChap[]>([]);
  const [chapterIdList, setChapterIdList] = useState([]);
  const { startUpload } = useUploadThing("imageUploader");
  const { createNewChapter } = useComicChapters();
  const { createNewComic } = useComics();
  const route = useRouter();

  const onSubmit = async () => {
    if (landspaceImage.length <= 0 || coverImage.length <= 0) {
      toast.error(
        "Truyện bắt buộc phải có một ảnh bìa ngang và một ảnh bìa dọc"
      );
      return;
    }
    if (
      !comicName ||
      !description ||
      !publisher ||
      !author ||
      !artist ||
      !weeklyTime
    ) {
      toast.error("Vui lòng nhập tất cả thông tin");
      return;
    }
    if (genreSelected.length <= 0 || genreSelected.length > 3) {
      toast.error("Phải có tối thiểu 1 thể loại phim và tối đa 3 thể loại");
      return;
    }
    setIsLoading(true);
    scroll();
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
    const [landspacePoster] = await Promise.all([
      startUpload([...landspaceImage]).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split("_")[1] ?? image.key,
          url: image.url,
        }));
        return formattedImages ?? null;
      }),
    ]);
    detailChapterList.map((item, index) => {
      console.log(item);
      const data = {
        coverImage: item.coverImage,
        chapterName: item.chapterName,
        publicTime: new Date(),
        // *
        content: item.content,
        comments: [],
        likes: [], // list of user liked
        views: 0,
        unlockPrice: item.unlockPrice,
        userUnlocked: [],
      };
      createNewChapter(data).then((res) => {
        chapterIdList.push(res?._id);
        console.log(res?.chapterName);
        if (index === detailChapterList.length - 1) {
          const data = {
            coverImage: posterImage ? posterImage[0]?.url : "",
            landspaceImage: landspacePoster ? landspacePoster[0]?.url : "",
            comicName: comicName,
            author: author,
            artist: artist,
            genres: genreSelected,
            newChapterTime: weeklyTime,
            ageFor: ageFor.currentKey,
            publisher: publisher,
            description: description,
            chapterList: chapterIdList,
          };
          createNewComic(data).then((res) => {
            toast.success("Đã thêm bộ truyện mới thành công");
            setIsLoading(false);
          });
        }
      });
    });
    if (detailChapterList.length === 0) {
      const data = {
        coverImage: posterImage ? posterImage[0]?.url : "",
        landspaceImage: landspacePoster ? landspacePoster[0]?.url : "",
        comicName: comicName,
        author: author,
        artist: artist,
        genres: genreSelected,
        newChapterTime: weeklyTime,
        ageFor: ageFor.currentKey,
        publisher: publisher,
        description: description,
        chapterList: chapterIdList,
      };
      createNewComic(data).then((res) => {
        toast.success("Đã thêm bộ truyện mới thành công");
        setIsLoading(false);
      });
    }
  };

  const scroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn tạo truyện này</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  variant="light"
                  onPress={() => {
                    onClose();
                    onSubmit();
                  }}
                >
                  Tạo truyện
                </Button>
                <Button color="primary" onPress={onClose}>
                  Hủy
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="relative min-h-[1032px]">
        <ComicInformation
          props={{
            landspaceImage,
            setLandspaceImage,
            coverImage,
            setCoverImage,
            comicName,
            setComicName,
            description,
            setDescription,
            artist,
            setArtist,
            author,
            setAuthor,
            genreSelected,
            setGenreSelected,
            publisher,
            setPublisher,
            weeklyTime,
            setWeeklyTime,
            ageFor,
            setAgeFor,
            setIsLoading,
          }}
        />
        <ComicChapterInformation
          props={{
            detailChapterList,
            setDetailChapterList,
          }}
        />
        <Button
          className={`w-full rounded-md m-0 p-0 font-medium text-sm shadow-md bg-gradient-to-r from-[#A958FE] to-[#DA5EF0] transition ease-in-out hover:scale-[1.01] text-white py-6`}
          radius="sm"
          onClick={onOpen}
        >
          Tạo truyện mới
        </Button>
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
