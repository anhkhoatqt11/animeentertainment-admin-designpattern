"use client";
import { Button } from "@nextui-org/button";
import { CiEdit } from "react-icons/ci";
import { AdvertisementModal } from "./AdvertisementModal";
import { HiBan, HiOutlineTicket } from "react-icons/hi";
import { useDisclosure } from "@nextui-org/modal";
import { currencyFormat } from "@/lib/utils";
export type AdvertisementItem = {
  _id: string;
  representative: string;
  pricePerAd: number;
  adVideoUrl: string;
  forwardLink: string;
  amount: number;
};

export const AdvertisementItemComponent = ({ props }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //   const unableOrAble = async (value) => {
  //     const data = {
  //       id: props.id,
  //       trangThai: value,
  //     };
  //     await editVoucher(data);

  //     props.setCouponList(
  //       props.couponList.map((item) =>
  //         item.id === props.id
  //           ? {
  //               id: item.id,
  //               code: props.code,
  //               price: props.price ? props.price : null,
  //               percent: props.percent ? props.percent : null,
  //               start: props.start,
  //               end: props.end,
  //               ticketName: props.ticketName,
  //               ticketId: props.ticketId,
  //               state: !value
  //                 ? "Vô hiệu"
  //                 : prismaDateToNextDate(props.end).getTime() >=
  //                   new Date().getTime()
  //                 ? "Đang sử dụng"
  //                 : "Hết hạn",
  //               trangThai: value,
  //             }
  //           : item
  //       )
  //     );
  //   };

  return (
    <>
      <AdvertisementModal
        props={{
          isOpen,
          onOpen,
          onOpenChange,
          orderId: props.orderId,
          representative: props.representative,
          pricePerAd: props.pricePerAd,
          adVideoUrl: props.adVideoUrl,
          forwardLink: props.forwardLink,
          amount: props.amount,
          advertisementList: props.advertisementList,
          setAdvertisementList: props.setAdvertisementList,
          action: "edit",
        }}
      />
      <div className="grid grid-cols-10 shadow-md rounded-md px-12 py-4 mb-4 bg-white">
        <div className="text-gray-600 col-span-3 text-sm flex align-middle items-center overflow-hidden text-ellipsis p-1">
          {props.orderId}
        </div>
        <div className="text-gray-600 col-span-2 text-sm flex align-middle items-center truncate p-1 font-semibold">
          {props.representative}
        </div>
        <div className="text-gray-600 col-span-2 text-sm flex align-middle items-center truncate p-1">
          {currencyFormat(props.pricePerAd)}
        </div>
        <div className="text-gray-600 col-span-2 text-sm flex align-middle items-center truncate p-1">
          {props.amount}
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          <div
            className="p-3 border-1 border-emerald-400 rounded-md h-12 w-12 transition ease-in-out hover:bg-white hover:scale-105 hover:shadow hover:text-emerald-400"
            onClick={onOpen}
          >
            <CiEdit className="w-6 h-6" />
          </div>
        </div>
      </div>
    </>
  );
};
