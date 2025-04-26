"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  Avatar,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from "@nextui-org/react";
import { BiBookAdd } from "react-icons/bi";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AlbumCheckbox } from "@/components/ui/AlbumCheckbox";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { MdHistory } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { useAdvertisement } from "@/hooks/useAdvertisement";

function AnimeEpisodeListComponent({
  animeEpisodeList,
  setAnimeEpisodeList,
  groupSelected,
  setGroupSelected,
  videoUrl,
  setVideoUrl,
  linkUrl,
  setLinkUrl,
  totalPrice,
  setTotalPrice,
  session
}) {
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };
  const router = useRouter();
  const [orderHistory, setOrderHistory] = React.useState<any[]>([]);

  const { fetchOrder } = useAdvertisement();


  useEffect(() => {
    const fetchOrderHistory = async () => {
      var result = await fetchOrder(session?.user.id);
      setOrderHistory(result);
    }
    fetchOrderHistory();
  })

  useEffect(() => {
    setTotalPrice(parseInt(groupSelected.length) * 100000);
  }, [groupSelected.length])


  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Ngày thực hiện", uid: "orderDate" },
    { name: "Phương thức thanh toán", uid: "paymentMethod" },
    { name: "Tổng số tiền", uid: "price" },
    { name: "Trạng thái", uid: 'status' }
  ];

  const renderCell = React.useCallback((history, columnKey) => {
    const cellValue = history[columnKey];
    switch (columnKey) {
      case "id":
        return <TableCell>{history._id}</TableCell>;
      case "orderDate":
        return <TableCell>{new Date(history.orderDate).toDateString()}</TableCell>;
      case "paymentMethod":
        return <TableCell>{history.paymentMethod}</TableCell>;
      case "price":
        return <TableCell>{history.price.toLocaleString()} VNĐ</TableCell>;
      case "status":
        let statusText = "";
        switch (cellValue) {
          case "completed":
            statusText = "Đã hoàn thành";
            break;
          case "pending":
            statusText = "Đang chờ";
            break;
          case "failed":
            statusText = "Thất bại";
            break;
          default:
            statusText = "Không rõ"; // Handle if status is unknown
            break;
        }
        return <TableCell>{statusText}</TableCell>;
      default:
        return <TableCell>{cellValue}</TableCell>;
    }
  }, []);



  return (
    <>
      <Modal size={"4xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Lịch sử đặt quảng cáo
              </ModalHeader>
              <ModalBody>
                <Table
                  className="rounded-sm mb-6"
                  aria-label="Leaderboard table"
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                      >
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={orderHistory}
                    emptyContent={"Người dùng tìm kiếm không tồn tại."}
                  >
                    {(item) => (
                      <TableRow key={item._id}>
                        {(columnKey) => renderCell(item, columnKey)}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="grid-cols-1 grid gap-4">
        <Toaster />
        <div className="flex flex-col gap-2 md:flex-row md:justify-between items-center p-4 pb-0">
          <h1 className="font-semibold text-xl">Đặt quảng cáo</h1>
          <div className="flex flex-row items-center">
            <Button
              className={`h-[50px] w-full md:w-[200px] rounded-md m-0 p-0 font-medium shadow-md bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ease-in-out hover:scale-105 text-sm text-white`}
              onClick={() => { onOpen() }}
            >
              <MdHistory className="mr-2" />
              Xem lịch sử đặt
            </Button>
          </div>
        </div>
        <div className="rounded bg-white m-4 p-4 mt-0">
          <div className="gap-6 mb-4">
            <div className="flex flex-col gap-3 w-full">
              <Label className="font-bold text-sm">
                Url video quảng cáo: <span className="text-red-500">*</span>
              </Label>
              <Input
                className="w-full"
                radius="sm"
                variant="bordered"
                size="md"
                value={videoUrl}
                placeholder="Nhập url video"
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="gap-6 mb-4">
            <div className="flex flex-col gap-3 w-full">
              <Label className="font-bold text-sm">
                Url trang chuyển tiếp: <span className="text-red-500">*</span>
              </Label>
              <Input
                className="w-full"
                radius="sm"
                variant="bordered"
                size="md"
                value={linkUrl}
                placeholder="Nhập url trang chuyển tiếp"
                onChange={(e) => {
                  setLinkUrl(e.target.value);
                }}
              />
            </div>
          </div>
          <Label className="font-bold text-sm">
            Chọn tập phim: <span className="text-red-500">*</span>
          </Label>
          {/* <div className="flex flex-row items-center mb-4 mt-3">
            <Input
              className="h-[52px] w-full bg-white"
              variant="bordered"
              radius="sm"
              label="Nhập tên anime ..."
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button
              className="h-[40px] w-[0px] rounded-md m-0 p-0 -ml-[50px] min-w-unit-12 bg-white z-10 hover:bg-white"
              onClick={searchSubmit}
            >
              <MagnifyingGlassIcon className={`h-6 w-6 text-[#3BE1AA]`} />
            </Button>
          </div> */}
          <Accordion
            showDivider={false}
            className="p-2 flex flex-col gap-1 w-full"
            variant="shadow"
            selectionMode="multiple"
            itemClasses={itemClasses}
          >
            {animeEpisodeList.map((item, index) => (
              <AccordionItem
                key={index}
                startContent={
                  <Avatar
                    isBordered
                    color="success"
                    radius="sm"
                    src={item.landspaceImage}
                  />
                }
                subtitle={item.episodeList.length + " tập"}
                aria-label={item.movieName}
                title={item.movieName}
                isCompact
              >
                <div>
                  <div className="flex flex-col gap-1 w-full">
                    <CheckboxGroup
                      value={groupSelected}
                      onChange={setGroupSelected}
                      classNames={{
                        base: "w-full",
                      }}
                      orientation="horizontal"
                    >
                      {item?.episodeList.map((item) => (
                        <AlbumCheckbox
                          value={item?._id}
                          info={{
                            name: `${item?.episodeName}`,
                            image: `${item?.coverImage}`,
                            type: `anime`,
                          }}
                          statusColor="secondary"
                        />
                      ))}
                    </CheckboxGroup>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="flex flex-row justify-between mt-6">
            <Label className="font-semibold text-xl">Tổng tiền:</Label>
            <Label className="font-semibold text-xl text-emerald-400">
              {totalPrice.toLocaleString()} VNĐ
            </Label>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnimeEpisodeListComponent;
