"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import Loader from "@/components/Loader";
import { FileDialog } from "@/components/ui/FileDialog";
import { Label } from "@/components/ui/label";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDonates } from "@/hooks/useDonates";
const { useUploadThing } = generateReactHelpers<OurFileRouter>();


export function AddDonatePackage({ }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [donatePackageImage, setdonatePackageImage] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [coin, setCoin] = React.useState(0);
  const [answers, setAnswers] = useState(
    ["", "", "", ""].map((content) => content)
  );
  const [correctAnswerID, setCorrectAnswerID] = React.useState(0);
  const [defaultdonatePackageImage, setDefaultdonatePackageImage] = React.useState("");
  const [actionType, setActionType] = React.useState(1);
  const route = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const { addDonatePackage } = useDonates();

  var DonatePackageMediaImage = "";
  const onSubmit = async () => {
    if (donatePackageImage.length === 0) {
      toast.error("Gói donate bắt buộc phải có ảnh minh họa");
      return;
    }
    if (title === "") {
      toast.error("Vui lòng nhập gói donate");
      return;
    }
    setIsLoading(true);
    if (donatePackageImage.length > 0) {
      const [DonatePackageImg] = await Promise.all([
        startUpload([...donatePackageImage]).then((res) => {
          const formattedImages = res?.map((image) => ({
            id: image.key,
            name: image.key.split("_")[1] ?? image.key,
            url: image.url,
          }));
          return formattedImages ?? null;
        }),
      ]);
      DonatePackageMediaImage = DonatePackageImg ? DonatePackageImg[0]?.url : "";
    }
    proccessAdding(DonatePackageMediaImage);
  };

  const proccessAdding = async (DonatePackageMediaImage) => {
    const data = {
      title: title,
      subtitle: subTitle,
      coin: coin,
      coverImage:
        DonatePackageMediaImage != "" ? DonatePackageMediaImage : defaultdonatePackageImage,
    };
    await addDonatePackage(data).then((res) => {
      toast.success("Thêm gói donate thành công");
      setIsLoading(false);
      route.push("/donate");
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
      <Toaster />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận
              </ModalHeader>
              <ModalBody>
                <p>Bạn có muốn thêm gói donate mới</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={actionType === 1 ? "success" : "danger"}
                  variant="light"
                  onPress={() => {
                    onClose();
                    if (actionType === 1) {
                      onSubmit();
                    }
                  }}
                >
                  Thêm gói donate
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
        <div className="grid-cols-1 grid gap-4 mb-6">
          <h1 className="font-semibold text-xl">Thông tin gói Donate</h1>
          <div className="flex flex-col gap-3 w-full rounded bg-white p-4">
            <div className="flex flex-col gap-3 w-full">
              <div className=" h-[360px] w-full border-1 rounded">
                {donatePackageImage[0]?.preview ||
                  donatePackageImage[0]?.url ||
                  defaultdonatePackageImage ? (
                  <img
                    src={
                      donatePackageImage[0]?.preview ||
                      donatePackageImage[0]?.url ||
                      defaultdonatePackageImage
                    }
                    className={`h-[360px] w-full rounded-md object-cover object-center`}
                  />
                ) : (
                  <></>
                )}
              </div>
              <FileDialog
                name="images"
                maxFiles={1}
                maxSize={1024 * 1024 * 4}
                files={donatePackageImage}
                setFiles={setdonatePackageImage}
                disabled={false}
                className={`p-0 px-6`}
              />
            </div>
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Tên gói donate: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                  value={title}
                  placeholder="Nhập tên gói donate"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Thông tin phụ gói donate: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                  value={subTitle}
                  placeholder="Nhập thông tin phụ gói donate"
                  onChange={(e) => {
                    setSubTitle(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Số coin: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                  value={coin}
                  placeholder="Nhập số coin"
                  onChange={(e) => {
                    setCoin(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          className={`w-full rounded-md m-0 p-0 font-semibold text-base shadow-md bg-emerald-400 transition ease-in-out hover:scale-[1.01] text-white py-6`}
          radius="sm"
          onClick={onOpen}
        >
          Tạo gói donate
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
