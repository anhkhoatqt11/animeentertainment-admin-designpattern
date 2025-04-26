"use client";

import { Button } from "@nextui-org/button";
import { CircularProgress, Divider, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDisclosure } from "@nextui-org/modal";
import {
  AdvertisementItem,
  AdvertisementItemComponent,
} from "./(components)/AdvertisementItem";
import { useAdvertisement } from "@/hooks/useAdvertisement";
import { AdvertisementModal } from "./(components)/AdvertisementModal";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export function AdvertisementManagement() {
  const [advertisementList, setAdvertisementList] = useState<
    AdvertisementItem[]
  >([]);
  const [copyList, setCopyList] = useState<AdvertisementItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllAdvertisement } = useAdvertisement();
  const [searchKey, setSearchKey] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchSubmit = () => {
    setCopyList(
      advertisementList.filter((item) =>
        item.representative.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
    setSearchKey("");
  };
  try {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchSubmit();
    });
  } catch (except) { }

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      await fetchAllAdvertisement().then((res) => {
        setAdvertisementList(res);
        setCopyList(res);
        setIsLoading(false);
      });
    };
    fetchEventDetails();
  }, []);

  useEffect(() => {
    setCopyList(advertisementList);
  }, [advertisementList]);

  return (
    <>
      <Toaster />
      <AdvertisementModal
        props={{
          isOpen,
          onOpen,
          onOpenChange,
          advertisementList: advertisementList,
          setAdvertisementList: setAdvertisementList,
          action: "add",
        }}
      />
      <div className="relative min-h-[1032px] p-6">
        <div className="flex flex-row items-center py-4">
          <Input
            className="h-[52px] w-full bg-white"
            variant="bordered"
            radius="sm"
            label="Nhập tên đại diện ..."
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            className="h-[40px] w-[0px] rounded-md m-0 p-0 -ml-[50px] min-w-unit-12 bg-white z-10 hover:bg-white"
            onClick={searchSubmit}
          >
            <MagnifyingGlassIcon className={`h-6 w-6 text-[#3BE1AA]`} />
          </Button>
        </div>
        <div className="w-full px-12 grid grid-cols-10 text-sm lg:text-base font-semibold mt-6 ">
          <div className="col-span-3">Mã đặt</div>
          <div className="col-span-2">Đại diện</div>
          <div className="col-span-2">Giá</div>
          <div className="col-span-2">Số lượng</div>
          <div></div>
        </div>
        <Divider className="my-4" />
        <div>
          {copyList.length === 0 ? (
            <div className="text-gray-800 text-lg font-medium pb-4">
              Hiện tại chưa có đối tác đặt quảng cáo
            </div>
          ) : null}
          {copyList.map((item) => (
            <AdvertisementItemComponent
              key={item.id}
              props={{
                orderId: item._id,
                representative: item.representative,
                pricePerAd: item.pricePerAd,
                adVideoUrl: item.adVideoUrl,
                forwardLink: item.forwardLink,
                amount: item.amount,
                advertisementList: advertisementList,
                setAdvertisementList: setAdvertisementList,
              }}
            ></AdvertisementItemComponent>
          ))}
          <Button
            className={`w-full rounded-md m-0 p-0 font-semibold text-sm shadow-md bg-gradient-to-r from-[#A958FE] to-[#DA5EF0] transition ease-in-out hover:scale-[1.01] text-white py-6`}
            radius="sm"
            onClick={onOpen}
          >
            Tạo phiếu đặt mới
          </Button>
        </div>
        {isLoading ? (
          <div className="w-full h-full flex justify-center bg-gray-200 z-10 absolute top-0">
            <CircularProgress
              color="success"
              aria-label="Loading..."
              classNames={{
                svg: "w-20 h-20 text-gray-600",
              }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
