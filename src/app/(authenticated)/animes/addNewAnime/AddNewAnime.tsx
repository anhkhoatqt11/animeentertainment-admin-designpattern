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
import AnimeInformation from "../(components)/AnimeInformation";
import AnimeEpisodeInformation from "../(components)/AnimeEpisodeInformation";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useAnimeEpisodes } from "@/hooks/useAnimeEpisodes";
import { useAnimes } from "@/hooks/useAnimes";
import Loader from "@/components/Loader";
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type AnimeEp = {
  episodeName: string;
  coverImage: string;
  content: string;
  adLink: string;
  views: number;
  totalTime: number;
};

export function AddNewAnime() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [landspaceImage, setLandspaceImage] = React.useState([]);
  const [coverImage, setCoverImage] = React.useState([]);
  const [movieName, setMovieName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [genreSelected, setGenreSelected] = React.useState([]);
  const [publisher, setPublisher] = React.useState("");
  const [weeklyTime, setWeeklyTime] = React.useState("");
  const [ageFor, setAgeFor] = React.useState(new Set([]));
  const [episodeList, setEpisodeList] = useState<AnimeEp[]>([]);
  const [episodeIdList, setEpisodeIdList] = useState([]);
  const { startUpload } = useUploadThing("imageUploader");
  const { createNewEpisode } = useAnimeEpisodes();
  const { createNewAnime } = useAnimes();
  const route = useRouter();

  const onSubmit = async () => {
    if (landspaceImage.length <= 0 || coverImage.length <= 0) {
      toast.error("Phim bắt buộc phải có một ảnh bìa ngang và một ảnh bìa dọc");
      return;
    }
    if (!movieName || !description || !publisher || !weeklyTime) {
      toast.error("Vui lòng nhập tất cả thông tin");
      return;
    }
    if (genreSelected.length <= 0 || genreSelected.length > 3) {
      toast.error("Phải có tối thiểu 1 thể loại phim và tối đa 3 thể loại");
      return;
    }
    if (ageFor.currentKey === "") {
      toast.error("Vui lòng chọn độ tuổi phù hợp");
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
    episodeList.map((item, index) => {
      const data = {
        coverImage: item.coverImage,
        episodeName: item.episodeName,
        totalTime: item.totalTime,
        publicTime: new Date(),
        // *
        content: item.content,
        comments: [],
        likes: [], // list of user liked
        views: 0,
      };
      createNewEpisode(data).then((res) => {
        episodeIdList.push(res?._id);
        if (index === episodeList.length - 1) {
          const data = {
            coverImage: posterImage ? posterImage[0]?.url : "",
            landspaceImage: landspacePoster ? landspacePoster[0]?.url : "",
            movieName: movieName,
            genres: genreSelected,
            publishTime: weeklyTime,
            ageFor: ageFor.currentKey,
            publisher: publisher,
            description: description,
            episodes: episodeIdList,
          };
          createNewAnime(data).then((res) => {
            toast.success("Đã thêm bộ phim mới thành công");
            setIsLoading(false);
          });
        }
      });
    });
    if (episodeList.length === 0) {
      const data = {
        coverImage: posterImage ? posterImage[0]?.url : "",
        landspaceImage: landspacePoster ? landspacePoster[0]?.url : "",
        movieName: movieName,
        genres: genreSelected,
        publishTime: weeklyTime,
        ageFor: ageFor.currentKey || "10+",
        publisher: publisher,
        description: description,
        episodes: [],
      };
      createNewAnime(data).then((res) => {
        toast.success("Đã thêm bộ phim mới thành công");
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
                <p>Bạn có chắc chắn muốn tạo phim này</p>
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
                  Tạo phim
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
        <AnimeInformation
          props={{
            landspaceImage,
            setLandspaceImage,
            coverImage,
            setCoverImage,
            movieName,
            setMovieName,
            description,
            setDescription,
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
        <AnimeEpisodeInformation
          props={{
            episodeList,
            setEpisodeList,
          }}
        />
        <Button
          className={`w-full rounded-md m-0 p-0 font-medium text-sm shadow-md bg-gradient-to-r from-[#A958FE] to-[#DA5EF0] transition ease-in-out hover:scale-[1.01] text-white py-6`}
          radius="sm"
          onClick={onOpen}
        >
          Tạo phim mới
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
