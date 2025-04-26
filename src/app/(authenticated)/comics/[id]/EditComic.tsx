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
import { postRequest } from "@/lib/fetch";
import { useComicChapters } from "@/hooks/useComicChapters";
import { useComics } from "@/hooks/useComics";
import Loader from "@/components/Loader";
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
  isNew: boolean;
  isEditing: boolean;
  isDeleting: boolean;
};

export function EditComic({ comicId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [landspaceImage, setLandspaceImage] = React.useState([]);
  const [coverImage, setCoverImage] = React.useState([]);
  const [defaultCover, setDefaultCover] = useState("");
  const [defaultLandspace, setDefaultLandspace] = useState("");
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
  const [actionType, setActionType] = useState(1);
  const { startUpload } = useUploadThing("imageUploader");
  const { createNewChapter, editChapter, deleteChapter } = useComicChapters();
  const { editComic, deleteComic, fetchComicById } = useComics();
  const route = useRouter();

  useEffect(() => {
    const fetchDetailComic = async () => {
      let chapterCopy: ComicChap[] = [];
      await fetchComicById(comicId).then((res) => {
        setDefaultCover(res[0]?.coverImage);
        setDefaultLandspace(res[0]?.landspaceImage);
        setComicName(res[0]?.comicName);
        setDescription(res[0]?.description);
        setGenreSelected(res[0]?.genres);
        setAuthor(res[0]?.author);
        setArtist(res[0]?.artist);
        setPublisher(res[0]?.publisher);
        setWeeklyTime(res[0]?.newChapterTime);
        setAgeFor(new Set([res[0]?.ageFor]));
        setChapterIdList(res[0]?.chapterList);
        res[0]?.detailChapterList.map((item, index) => {
          chapterCopy.push({
            _id: item?._id,
            chapterName: item?.chapterName,
            coverImage: item?.coverImage,
            content: item?.content,
            views: item?.views,
            unlockPrice: item?.unlockPrice,
            isNew: false,
            isEditing: true,
            isDeleting: false,
          });

          if (index === res[0]?.detailChapterList.length - 1) {
            setDetailChapterList(chapterCopy);
          }
        });
      });
    };
    fetchDetailComic();
  }, []);
  const onSubmit = async () => {
    if (
      !comicName ||
      !description ||
      !publisher ||
      !artist ||
      !author ||
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
    processChapter(coverUrl, landspaceUrl);
  };

  const processChapter = async (coverUrl, landspaceUrl) => {
    detailChapterList.map((item, index) => {
      if (item.isDeleting) {
        if (item.isEditing) {
          // delete from database
          const body = {
            chapterId: item._id,
          };
          deleteChapter(body).then((res) => {
            var indexDelete = chapterIdList.findIndex((i) => i === item._id);
            chapterIdList.toSpliced(indexDelete, 1);
            if (index === detailChapterList.length - 1) {
              processEditing(coverUrl, landspaceUrl);
            }
          });
        }
      } else {
        if (item.isNew) {
          // adding to database
          const data = {
            coverImage: item.coverImage,
            chapterName: item.chapterName,
            unlockPrice: item.unlockPrice,
            publicTime: new Date(),
            content: item.content,
            comments: [],
            likes: [],
            views: 0,
            userUnlocked: [],
          };
          createNewChapter(data).then(async (res) => {
            chapterIdList.push(res?._id);
            if (index === detailChapterList.length - 1) {
              await processEditing(coverUrl, landspaceUrl);
            }
          });
        } else {
          // editing from database
          const data = {
            _id: item._id,
            coverImage: item.coverImage,
            chapterName: item.chapterName,
            unlockPrice: item.unlockPrice,
            content: item.content,
          };
          editChapter(data).then((res) => {
            if (index === detailChapterList.length - 1) {
              processEditing(coverUrl, landspaceUrl);
            }
          });
        }
      }
    });
    if (detailChapterList.length === 0) {
      processEditing(coverUrl, landspaceUrl);
    }
  };

  const processEditing = async (coverUrl, landspaceUrl) => {
    const data = {
      comicId: comicId,
      coverImage: coverUrl !== "" ? coverUrl : defaultCover,
      landspaceImage: landspaceUrl !== "" ? landspaceUrl : defaultLandspace,
      comicName: comicName,
      genres: genreSelected,
      author: author,
      artist: artist,
      newChapterTime: weeklyTime,
      ageFor: ageFor.currentKey,
      publisher: publisher,
      description: description,
      chapterList: chapterIdList,
    };
    await editComic(data).then((res) => {
      toast.success("Đã sửa thông tin bộ truyện");
      setIsLoading(false);
    });
  };

  const removeComic = () => {
    setIsLoading(true);
    const data = {
      comicId: comicId,
    };
    detailChapterList?.map(async (item, index) => {
      const body = {
        chapterId: item._id,
      };
      deleteChapter(body);
      if (item.isEditing && !item.isDeleting) {
        removeImageSourceFromDB(item.coverImage);
        item.content?.map((i) => {
          removeImageSourceFromDB(i);
        });
      }
      if (index === detailChapterList.length - 1) {
        deleteComic(data).then(async (res) => {
          toast.success("Đã xóa phim khỏi danh sách");
          removeImageSourceFromDB(defaultCover);
          removeImageSourceFromDB(defaultLandspace);
          setIsLoading(false);
          route.push("/comics");
        });
      }
    });
    if (detailChapterList.length === 0) {
      deleteComic(data).then(async (res) => {
        toast.success("Đã xóa phim khỏi danh sách");
        removeImageSourceFromDB(defaultCover);
        removeImageSourceFromDB(defaultLandspace);
        setIsLoading(false);
        route.push("/comics");
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
                    ? "Bạn có chắc chắn muốn sửa thông tin truyện này"
                    : "Bạn có chắc chắn muốn xóa thông tin truyện này"}
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
                    } else removeComic();
                  }}
                >
                  {actionType === 1 ? "Sửa truyện" : "Xóa truyện"}
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
            defaultCover,
            defaultLandspace,
            comicName,
            setComicName,
            author,
            setAuthor,
            artist,
            setArtist,
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
        <ComicChapterInformation
          props={{
            detailChapterList,
            setDetailChapterList,
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <Button
            className={`w-full bg-transparent border-2 border-emerald-500 text-emerald-500 m-0 p-0 font-medium text-sm hover:bg-emerald-500 transition ease-in-out hover:scale-[1.01] hover:text-white py-6`}
            radius="sm"
            onClick={onOpen}
          >
            Sửa thông tin truyện
          </Button>
          <Button
            className={`w-full text-white bg-red-400 m-0 p-0 font-medium text-sm hover:bg-red-500 transition ease-in-out hover:scale-[1.01] hover:text-white py-6`}
            radius="sm"
            onClick={() => {
              setActionType(2);
              onOpen();
            }}
          >
            Xóa truyện
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
