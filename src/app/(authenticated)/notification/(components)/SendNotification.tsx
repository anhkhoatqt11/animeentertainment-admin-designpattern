"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@nextui-org/modal";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, Radio } from "@nextui-org/react";
import { NewestChapterList } from "./NewestChapterList";
import { NewestEpisodeList } from "./NewestEpisodeList";
import { FiClock } from "react-icons/fi";
import { useNotification } from "@/hooks/useNotification";

export default function SendNotification() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [selected, setSelected] = React.useState("comic");
  const [itemChoice, setItemChoice] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [imageChoice, setImageChoice] = useState(
    "https://th.bing.com/th/id/R.c04ccba2ba93fa7fadbb75fe656966cf?rik=HaatgAaElky1Qg&pid=ImgRaw&r=0"
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { sendNotification } = useNotification();

  const onSendNotification = async () => {
    if (itemChoice.length === 0 || value === "") {
      toast.error("Vui lòng tạo đủ nội dung thông báo");
      return;
    }
    const data = {
      sourceId: itemChoice![0],
      type: selected === "comic" ? "chapter" : "episode",
      content: value,
    };
    await sendNotification(data);
    toast.success("Đã gửi thông báo đến toàn người dùng skylark");
  };
  useEffect(() => {
    setItemChoice([]);
  }, [selected]);
  return (
    <div>
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Toaster />
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Xác nhận
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Bạn có chắc chắn muốn gửi thông báo này đến toàn bộ người
                      dùng
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="success"
                      variant="ghost"
                      onClick={() => {
                        onClose();
                        onSendNotification();
                      }}
                    >
                      Gửi thông báo
                    </Button>
                    <Button color="primary" onClick={onClose}>
                      Hủy
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className="flex flex-col md:flex-row">
            <div className="md:basis-1/3">
              <h1 className="font-semibold text-[18px]">
                Gửi thông báo đến toàn thể người dùng
              </h1>
              <div className="flex flex-col gap-3 mt-1 mb-3">
                <p className="text-blue-500 font-medium text-[14px]">
                  Chọn danh mục thông báo
                </p>
                <RadioGroup
                  value={selected}
                  color="success"
                  size="sm"
                  onValueChange={setSelected}
                >
                  <Radio value="anime">Thông báo tập anime mới</Radio>
                  <Radio value="comic">Thông báo chương truyện mới</Radio>
                </RadioGroup>
              </div>
              <Input
                label="Nội dung thông báo"
                placeholder="Nhập nội dung"
                value={value}
                variant="bordered"
                onValueChange={setValue}
              />
              <p className="text-fuchsia-500 text-sm mt-3 font-medium">
                Mẫu thông báo
              </p>
              <div className="w-full h-20 bg-white mt-3 rounded-lg p-3 flex flex-row gap-3 mb-3">
                <img
                  src={imageChoice}
                  width={60}
                  height={60}
                  className="object-cover rounded overflow-hidden w-[60px]"
                />
                <div className="flex flex-col justify-between gap-1">
                  <p
                    className="font-medium text-[14px] overflow-hidden text-ellipsis w-[270px] leading-[18px]"
                    style={{ maxLines: 2 }}
                  >
                    {value}
                  </p>
                  <p className="text-gray-500 text-[10px] flex flex-row gap-1">
                    <FiClock size={12} /> {new Date().toDateString()}
                  </p>
                </div>
              </div>
              <Button
                className="mt-3 h-[50px] w-full rounded-md m-0 p-0 font-medium shadow-md bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ease-in-out hover:scale-105 text-sm text-white"
                size="sm"
                onClick={onOpen}
              >
                Gửi thông báo
              </Button>
            </div>
            <div className="md:basis-2/3">
              {selected === "comic" ? (
                <NewestChapterList
                  setImageChoice={setImageChoice}
                  itemChoice={itemChoice}
                  setItemChoice={setItemChoice}
                />
              ) : (
                <NewestEpisodeList
                  setImageChoice={setImageChoice}
                  itemChoice={itemChoice}
                  setItemChoice={setItemChoice}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
