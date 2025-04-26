"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Accordion, AccordionItem } from "@nextui-org/react";
import ComicItem from "./ComicItem";
import { BiBookAdd } from "react-icons/bi";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useAlbum } from "@/hooks/useAlbum";
import toast, { Toaster } from "react-hot-toast";

function ComicCollection({ comicAlbumList, setComicAlbumList }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [subjectId, setSubjectId] = useState();
  const { deleteComicAlbum } = useAlbum();
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };
  const onDeleteAlbum = async () => {
    setComicAlbumList(comicAlbumList.filter((i) => i._id !== subjectId));
    await deleteComicAlbum({ _id: subjectId }).then((res) => {
      toast.success("Album đã bị xóa");
    });
  };
  const router = useRouter();
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
                <p>Bạn có chắc chắn muốn xóa thông tin album này</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  variant="ghost"
                  onClick={() => {
                    onClose();
                    onDeleteAlbum();
                  }}
                >
                  Xóa album
                </Button>
                <Button color="primary" onClick={onClose}>
                  Hủy
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="grid-cols-1 grid gap-4 mb-6">
        <Toaster />
        <div className="flex flex-col gap-2 md:flex-row md:justify-between items-end p-4 pb-0">
          <h1 className="font-semibold text-xl">Bộ sưu tập truyện tranh</h1>
          <Button
            className={`h-[50px] w-full md:w-[200px] rounded-md m-0 p-0 font-medium shadow-md bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ease-in-out hover:scale-105 text-sm text-white`}
            onClick={() => {
              router.push("/album/comic/addNewAlbum");
            }}
          >
            <BiBookAdd className="mr-2" />
            Tạo album mới
          </Button>
        </div>
        <div className="rounded bg-white m-4 p-4 mt-0">
          <Accordion
            showDivider={false}
            className="p-2 flex flex-col gap-1 w-full"
            variant="shadow"
            itemClasses={itemClasses}
          >
            {comicAlbumList.map((item, index) => (
              <AccordionItem
                key={index}
                aria-label={item.albumName}
                title={item.albumName}
                isCompact
              >
                <div>
                  <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {item?.list.map((item) => (
                      <ComicItem item={item} key={`comic-${item._id}`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Button
                      className={`w-full bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white  transition ease-in-out duration-500 font-medium py-6 text-sm`}
                      onClick={() => {
                        router.push(`album/comic/${item._id}`);
                      }}
                    >
                      Sửa album
                    </Button>
                    <Button
                      className={`w-full bg-red-400 border-2 border-red-400 text-white hover:scale-[1.01] hover:border-black transition ease-in-out duration-500 font-medium py-6 text-sm`}
                      onClick={() => {
                        onOpen();
                        setSubjectId(item._id);
                      }}
                    >
                      Xóa album
                    </Button>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default ComicCollection;
