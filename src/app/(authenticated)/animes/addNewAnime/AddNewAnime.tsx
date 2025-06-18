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
import { useDraftManager } from "@/hooks/useDraftManager";
import { DraftManager } from "@/components/DraftManager";
import { FileText, Save, Clock } from "lucide-react";
import draftSystemUtils from "@/lib/utils/draftSystemUtils";
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
  const { isOpen: isDraftOpen, onOpen: onDraftOpen, onOpenChange: onDraftOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [landspaceImage, setLandspaceImage] = React.useState<any[]>([]);
  const [coverImage, setCoverImage] = React.useState<any[]>([]);
  const [movieName, setMovieName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [genreSelected, setGenreSelected] = React.useState<any[]>([]);
  const [publisher, setPublisher] = React.useState("");
  const [weeklyTime, setWeeklyTime] = React.useState("");
  const [ageFor, setAgeFor] = React.useState<any>(new Set([]));
  const [episodeList, setEpisodeList] = useState<AnimeEp[]>([]);
  const [episodeIdList, setEpisodeIdList] = useState<string[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const { createNewEpisode } = useAnimeEpisodes();
  const { createNewAnime } = useAnimes();
  const route = useRouter();
  // Draft Management
  const draftManager = useDraftManager();
  // Clear corrupted data on component mount
  useEffect(() => {
    try {
      // Validate and repair draft system
      if (!draftSystemUtils.validateDraftData()) {
        console.log('🔧 Repairing draft system...');
        draftSystemUtils.repairDraftSystem();
      }
      
      // Test if draft manager is working properly
      draftManager.getAllDrafts();
    } catch (error) {
      console.error('Draft manager error on mount:', error);
      console.log('🚨 Performing emergency reset...');
      draftSystemUtils.emergencyReset();
      
      // Reload the page to start fresh
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    draftManager.enableAutoSave(30000); // Auto-save every 30 seconds
    return () => {
      draftManager.disableAutoSave();
    };
  }, []);

  // Update draft state when form data changes
  useEffect(() => {
    draftManager.updateFormState({
      landspaceImage,
      coverImage,
      movieName,
      description,
      genreSelected,
      publisher,
      weeklyTime,
      ageFor,
      episodeList,
      timestamp: Date.now(),
      pageName: "addNewAnime"
    });
  }, [landspaceImage, coverImage, movieName, description, genreSelected, publisher, weeklyTime, ageFor, episodeList]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (draftManager.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleLoadDraft = (key: string) => {
    draftManager.loadDraft(key);
    draftManager.restoreState({
      setLandspaceImage,
      setCoverImage,
      setMovieName,
      setDescription,
      setGenreSelected,
      setPublisher,
      setWeeklyTime,
      setAgeFor,
      setEpisodeList,
    });
  };

  const handleSaveDraft = (name?: string) => {
    return draftManager.saveDraft(name);
  };
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
    const ageForValue = ageFor?.currentKey || (ageFor.size > 0 ? Array.from(ageFor)[0] : "");
    if (!ageForValue) {
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
    
    const newEpisodeIdList: string[] = [];
    
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
        if (res?.data?._id) {
          newEpisodeIdList.push(res.data._id);
        }
        if (index === episodeList.length - 1) {
          const animeData = {
            coverImage: posterImage ? posterImage[0]?.url : "",
            landspaceImage: landspacePoster ? landspacePoster[0]?.url : "",
            movieName: movieName,
            genres: genreSelected,
            publishTime: weeklyTime,
            ageFor: ageForValue,
            publisher: publisher,
            description: description,
            episodes: newEpisodeIdList,
          };
          createNewAnime(animeData).then((res) => {
            toast.success("Đã thêm bộ phim mới thành công");
            setIsLoading(false);
            // Clear draft after successful submission
            draftManager.clearAllDrafts();
          });
        }
      });
    });
    if (episodeList.length === 0) {
      const animeData = {
        coverImage: posterImage ? posterImage[0]?.url : "",
        landspaceImage: landspacePoster ? landspacePoster[0]?.url : "",
        movieName: movieName,
        genres: genreSelected,
        publishTime: weeklyTime,
        ageFor: ageForValue || "10+",
        publisher: publisher,
        description: description,
        episodes: [],
      };
      createNewAnime(animeData).then((res) => {
        toast.success("Đã thêm bộ phim mới thành công");
        setIsLoading(false);
        // Clear draft after successful submission
        draftManager.clearAllDrafts();
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

      <DraftManager
        isOpen={isDraftOpen}
        onClose={onDraftOpenChange}
        drafts={draftManager.getAllDrafts()}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={draftManager.deleteDraft}
        onSaveDraft={handleSaveDraft}
        onClearAllDrafts={draftManager.clearAllDrafts}
        hasUnsavedChanges={draftManager.hasUnsavedChanges()}
      />

      <div className="relative min-h-[1032px]">
        {/* Draft Management Toolbar */}
        <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Thêm phim mới</h2>
            {draftManager.hasUnsavedChanges() && (
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Có thay đổi chưa lưu</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="flat"
              startContent={<Save className="w-4 h-4" />}
              onClick={() => {
                handleSaveDraft();
                toast.success('Đã lưu bản thảo');
              }}
            >
              Lưu bản thảo
            </Button>
            <Button
              variant="flat"
              startContent={<FileText className="w-4 h-4" />}
              onClick={onDraftOpen}
            >
              Quản lý bản thảo ({draftManager.getAllDrafts().length})
            </Button>
          </div>
        </div>

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
