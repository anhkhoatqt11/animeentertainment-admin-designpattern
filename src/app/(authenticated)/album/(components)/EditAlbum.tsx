"use client";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Label } from "@/components/ui/label";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { CheckboxGroup, Input } from "@nextui-org/react";
import { AlbumCheckbox } from "@/components/ui/AlbumCheckbox";
import { useAlbum } from "@/hooks/useAlbum";

export function EditAlbum({ albumId, type }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [albumName, setAlbumName] = React.useState("");
  const [copyList, setCopyList] = useState([]);
  const [choiceList, setChoiceList] = useState([]);
  const [groupSelected, setGroupSelected] = React.useState([]);
  const [searchKey, setSearchKey] = useState("");
  const {
    fetchAnimeList,
    fetchComicList,
    fetchAnimeAlbumDetail,
    fetchComicAlbumDetail,
    editAnimeAlbum,
    editComicAlbum,
  } = useAlbum();
  const route = useRouter();

  try {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchSubmit();
    });
  } catch (except) {}

  useEffect(() => {
    const fetchList = async () => {
      if (type === "comic") {
        await fetchComicList().then((res) => {
          setChoiceList(res);
          setCopyList(res);
        });
        await fetchComicAlbumDetail(albumId).then((result) => {
          setAlbumName(result?.albumName);
          setGroupSelected(result?.comicList);
        });
      } else {
        await fetchAnimeList().then((res) => {
          setChoiceList(res);
          setCopyList(res);
        });
        await fetchAnimeAlbumDetail(albumId).then((result) => {
          setAlbumName(result?.albumName);
          setGroupSelected(result?.animeList);
        });
      }
      setIsLoading(false);
    };
    fetchList();
  }, []);

  const searchSubmit = () => {
    if (type === "comic") {
      setCopyList(
        choiceList.filter((item) =>
          item?.comicName.toLowerCase().includes(searchKey.toLowerCase())
        )
      );
    } else {
      setCopyList(
        choiceList.filter((item) =>
          item?.movieName.toLowerCase().includes(searchKey.toLowerCase())
        )
      );
    }
  };

  const onSubmit = async () => {
    if (!albumName) {
      toast.error("Vui lòng nhập tên album");
      return;
    }
    if (groupSelected.length < 2) {
      toast.error("Album phải có ít nhất 2 bộ");
      return;
    }
    setIsLoading(true);
    if (type === "comic") {
      const data = {
        _id: albumId,
        albumName: albumName,
        comicList: groupSelected,
      };
      await editComicAlbum(data).then((res) => {
        toast.success("Sửa thông tin album thành công");
        setIsLoading(false);
      });
    } else {
      const data = {
        _id: albumId,
        albumName: albumName,
        animeList: groupSelected,
      };
      await editAnimeAlbum(data).then((res) => {
        toast.success("Sửa thông tin album thành công");
        setIsLoading(false);
      });
    }
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
                <p>Bạn có chắc chắn muốn sửa thông tin album này</p>
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
                  Sửa album
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
        <Toaster />
        <div className="grid-cols-1 grid gap-4 mb-6">
          <h1 className="font-semibold text-xl">Thông tin album</h1>
          <div className="flex flex-col gap-3 w-full rounded bg-white p-4">
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Tên album: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="md"
                  value={albumName}
                  placeholder="Nhập tên album"
                  onChange={(e) => {
                    setAlbumName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <Label className="font-bold text-sm">
                  {type === "comic"
                    ? "Danh sách truyện tranh:"
                    : "Danh sách phim anime"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-row items-center">
                  <Input
                    className="h-[52px] w-full md:w-[270px] bg-white"
                    variant="bordered"
                    radius="sm"
                    label={`Nhập tên ${
                      type === "comic" ? "truyện ..." : "anime ..."
                    }`}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <Button
                    className="h-[40px] w-fit rounded-md m-0 p-0 -ml-[60px] min-w-unit-12 bg-transparent z-10 hover:bg-transparent"
                    onClick={searchSubmit}
                  >
                    <MagnifyingGlassIcon className={`h-6 w-6 text-[#3BE1AA]`} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <CheckboxGroup
                  value={groupSelected}
                  onChange={setGroupSelected}
                  classNames={{
                    base: "w-full",
                  }}
                  orientation="horizontal"
                >
                  {copyList?.map((item) => (
                    <AlbumCheckbox
                      value={item?._id}
                      info={{
                        name: `${
                          type === "comic" ? item?.comicName : item?.movieName
                        }`,
                        image: `${
                          type === "comic"
                            ? item?.coverImage
                            : item?.landspaceImage
                        }`,
                        type: `${type}`,
                      }}
                      statusColor="secondary"
                    />
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Button
            className={`w-full bg-transparent border-2 border-emerald-500 text-emerald-500 m-0 p-0 font-medium text-sm hover:bg-emerald-500 transition ease-in-out hover:scale-[1.01] hover:text-white py-6`}
            radius="sm"
            onClick={onOpen}
          >
            Sửa thông tin album
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
