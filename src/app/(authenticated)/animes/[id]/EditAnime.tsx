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
import { postRequest } from "@/lib/fetch";
import Loader from "@/components/Loader";
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type AnimeEp = {
  _id: string;
  episodeName: string;
  coverImage: string;
  content: string;
  views: number;
  totalTime: number;
  isNew: boolean;
  isEditing: boolean;
  isDeleting: boolean;
};

export function EditAnime({ animeId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [landspaceImage, setLandspaceImage] = React.useState([]);
  const [coverImage, setCoverImage] = React.useState([]);
  const [defaultCover, setDefaultCover] = useState("");
  const [defaultLandspace, setDefaultLandspace] = useState("");
  const [movieName, setMovieName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [genreSelected, setGenreSelected] = React.useState([]);
  const [publisher, setPublisher] = React.useState("");
  const [weeklyTime, setWeeklyTime] = React.useState("");
  const [ageFor, setAgeFor] = React.useState(new Set(["10+"]));
  const [defaultAgeFor, setDefaultAgeFor] = useState("");
  const [episodeList, setEpisodeList] = useState<AnimeEp[]>([]);
  const [episodeIdList, setEpisodeIdList] = useState([]);
  const [actionType, setActionType] = useState(1);
  const { startUpload } = useUploadThing("imageUploader");
  const { createNewEpisode, editEpisode, deleteEpisode } = useAnimeEpisodes();
  const { editAnime, deleteAnime, fetchAnimeById } = useAnimes();
  const route = useRouter();

  useEffect(() => {
    const fetchDetailAnime = async () => {
      let episodeCopy: AnimeEp[] = [];
      await fetchAnimeById(animeId).then((res) => {
        setDefaultCover(res[0]?.coverImage);
        setDefaultLandspace(res[0]?.landspaceImage);
        setMovieName(res[0]?.movieName);
        setDescription(res[0]?.description);
        setGenreSelected(res[0]?.genres);
        setPublisher(res[0]?.publisher);
        setWeeklyTime(res[0]?.publishTime);
        setAgeFor(new Set([res[0]?.ageFor]));
        setDefaultAgeFor(res[0]?.ageFor);
        setEpisodeIdList(res[0]?.episodes);
        res[0]?.episodeList.map((item, index) => {
          episodeCopy.push({
            _id: item?._id,
            episodeName: item?.episodeName,
            coverImage: item?.coverImage,
            content: item?.content,
            views: item?.views,
            totalTime: item?.totalTime,
            isNew: false,
            isEditing: true,
            isDeleting: false,
          });

          if (index === res[0]?.episodeList.length - 1) {
            setEpisodeList(episodeCopy);
          }
        });
      });
    };
    fetchDetailAnime();
  }, []);
  const onSubmit = async () => {
    if (!movieName || !description || !publisher || !weeklyTime) {
      toast.error("Vui lòng nhập tất cả thông tin");
      return;
    }
    if (genreSelected.length <= 0 || genreSelected.length > 3) {
      toast.error("Phải có tối thiểu 1 thể loại phim và tối đa 3 thể loại");
      return;
    }
    setIsLoading(true);
    scroll();
    var coverUrl = "",
      landspaceUrl = "";
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
      const parts = defaultCover?.split("/");
      const keyPart = parts?.[parts.length - 1];
      const imageKey = keyPart?.split("?")[0];
      await postRequest({
        endPoint: "/api/uploadthing/deleteImage",
        formData: { imageKey },
        isFormData: false,
      });
      coverUrl = posterImage ? posterImage[0]?.url : "";
    }
    if (landspaceImage.length > 0) {
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
      const parts = defaultLandspace?.split("/");
      const keyPart = parts?.[parts.length - 1];
      const imageKey = keyPart?.split("?")[0];
      await postRequest({
        endPoint: "/api/uploadthing/deleteImage",
        formData: { imageKey },
        isFormData: false,
      });
      landspaceUrl = landspacePoster ? landspacePoster[0]?.url : "";
    }
    processEpisode(coverUrl, landspaceUrl);
  };

  const processEpisode = async (coverUrl, landspaceUrl) => {
    episodeList.map((item, index) => {
      if (item.isDeleting) {
        if (item.isEditing) {
          // delete from database
          const body = {
            episodeId: item._id,
          };
          deleteEpisode(body).then((res) => {
            var indexDelete = episodeIdList.findIndex((i) => i === item._id);
            episodeIdList.toSpliced(indexDelete, 1);
            if (index === episodeList.length - 1) {
              processEditing(coverUrl, landspaceUrl);
            }
          });
        }
      } else {
        if (item.isNew) {
          // adding to database
          const data = {
            coverImage: item.coverImage,
            episodeName: item.episodeName,
            totalTime: item.totalTime,
            publicTime: new Date(),
            content: item.content,
            comments: [],
            likes: [],
            views: 0,
          };
          createNewEpisode(data).then(async (res) => {
            episodeIdList.push(res?._id);
            if (index === episodeList.length - 1) {
              await processEditing(coverUrl, landspaceUrl);
            }
          });
        } else {
          // editing from database
          const data = {
            _id: item._id,
            coverImage: item.coverImage,
            episodeName: item.episodeName,
            totalTime: item.totalTime,
            content: item.content,
          };
          editEpisode(data).then((res) => {
            if (index === episodeList.length - 1) {
              processEditing(coverUrl, landspaceUrl);
            }
          });
        }
      }
    });
    if (episodeList.length === 0) {
      processEditing(coverUrl, landspaceUrl);
    }
  };

  const processEditing = async (coverUrl, landspaceUrl) => {
    const data = {
      animeId: animeId,
      coverImage: coverUrl !== "" ? coverUrl : defaultCover,
      landspaceImage: landspaceUrl !== "" ? landspaceUrl : defaultLandspace,
      movieName: movieName,
      genres: genreSelected,
      publishTime: weeklyTime,
      ageFor: ageFor.currentKey || defaultAgeFor,
      publisher: publisher,
      description: description,
      episodes: episodeIdList,
    };
    await editAnime(data).then((res) => {
      toast.success("Đã sửa thông tin bộ phim");
      setIsLoading(false);
    });
  };

  const removeAnime = () => {
    setIsLoading(true);
    const data = {
      animeId: animeId,
    };
    episodeList?.map(async (item, index) => {
      const body = {
        episodeId: item._id,
      };
      deleteEpisode(body);
      if (item.isEditing && !item.isDeleting) {
        removeImageSourceFromDB(item.coverImage);
        removeVideoSourceFromDB(item.content);
      }
      if (index === episodeList.length - 1) {
        deleteAnime(data).then(async (res) => {
          toast.success("Đã xóa phim khỏi danh sách");
          removeImageSourceFromDB(defaultCover);
          removeImageSourceFromDB(defaultLandspace);
          setIsLoading(false);
          route.push("/animes");
        });
      }
    });
    if (episodeList.length === 0) {
      deleteAnime(data).then(async (res) => {
        toast.success("Đã xóa phim khỏi danh sách");
        removeImageSourceFromDB(defaultCover);
        removeImageSourceFromDB(defaultLandspace);
        setIsLoading(false);
        route.push("/animes");
      });
    }
  };

  const removeImageSourceFromDB = async (url) => {
    const parts = url?.split("/");
    const keyPart = parts?.[parts.length - 1];
    const imageKey = keyPart?.split("?")[0];
    await postRequest({
      endPoint: "/api/uploadthing/deleteImage",
      formData: { imageKey },
      isFormData: false,
    });
  };

  const removeVideoSourceFromDB = async (url) => {
    const parts = url?.split("/");
    const keyPart = parts?.[parts.length - 1];
    const videoKey = keyPart?.split("?")[0];
    await postRequest({
      endPoint: "/api/uploadthing/deleteVideo",
      formData: { videoKey },
      isFormData: false,
    });
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
                <p>
                  {actionType === 1
                    ? "Bạn có chắc chắn muốn sửa thông tin phim này"
                    : "Bạn có chắc chắn muốn xóa thông tin phim này"}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={actionType === 1 ? "success" : "danger"}
                  variant="light"
                  onPress={() => {
                    onClose();
                    if (actionType === 1) {
                      onSubmit();
                    } else removeAnime();
                  }}
                >
                  {actionType === 1 ? "Sửa phim" : "Xóa phim"}
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
            defaultCover,
            defaultLandspace,
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
        <div className="grid grid-cols-2 gap-3">
          <Button
            className={`w-full bg-transparent border-2 border-emerald-500 text-emerald-500 m-0 p-0 font-medium text-sm hover:bg-emerald-500 transition ease-in-out hover:scale-[1.01] hover:text-white py-6`}
            radius="sm"
            onClick={onOpen}
          >
            Sửa thông tin phim
          </Button>
          <Button
            className={`w-full text-white bg-red-400 m-0 p-0 font-medium text-sm hover:bg-red-500 transition ease-in-out hover:scale-[1.01] hover:text-white py-6`}
            radius="sm"
            onClick={() => {
              setActionType(2);
              onOpen();
            }}
          >
            Xóa phim
          </Button>
        </div>

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
