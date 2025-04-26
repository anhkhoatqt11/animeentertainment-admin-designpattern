"use client";

import {
  Button,
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
  useDisclosure,
} from "@nextui-org/react";
import { Settings } from "lucide-react";
import { BiBookAdd } from "react-icons/bi";
import { MdLeaderboard, MdSettings } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useUsers } from "@/hooks/useUsers";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@nextui-org/react";

export function SearchAndActionBar({ setIsLoaded }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [searchKey, setSearchKey] = useState("");
  const { fetchUsersChallengePoint } = useUsers();

  const { data } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const res = await fetchUsersChallengePoint();
      console.log(res);
      return res;
    },
  });

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const aTotalPoints = a.challenges.reduce(
        (acc, curr) => acc + curr.point,
        0
      );
      const bTotalPoints = b.challenges.reduce(
        (acc, curr) => acc + curr.point,
        0
      );
      if (aTotalPoints !== bTotalPoints) {
        return bTotalPoints - aTotalPoints; // Sort by total points descending
      } else {
        // If total points are equal, sort by time
        return b.challenges[0]?.time - a.challenges[0]?.time;
      }
    });
  }, [data]);

  const columns = [
    { name: "Tên", uid: "name" },
    { name: "Điểm", uid: "point" },
    { name: "Thời gian thực hiện", uid: "time" },
  ];

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <TableCell>
            <div className="flex flex-row items-center gap-3">
              <Image
                src={user.avatar}
                width="32px"
                height="32px"
                className="rounded-full hidden md:block"
              />
              {user.username}
            </div>
          </TableCell>
        );
      case "point":
        return <TableCell>{user.challenges[0]?.point}</TableCell>;
      case "time":
        return <TableCell>{user.challenges[0]?.time}</TableCell>;
      default:
        return <TableCell>{cellValue}</TableCell>;
    }
  }, []);

  return (
    <>
      <Modal size={"3xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Bảng xếp hạng
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
                    items={sortedData || []}
                    emptyContent={"Người dùng tìm kiếm không tồn tại."}
                  >
                    {(item) => (
                      <TableRow key={item.id}>
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
      <div className="flex flex-col gap-2 md:flex-row md:justify-between p-6 pb-0">
        <Button
          className={`h-[50px] w-full md:w-[200px] rounded-md m-0 p-0 font-medium shadow-md bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ease-in-out hover:scale-105 text-sm text-white`}
          onClick={() => {
            router.push("/challenge/addQuestion");
          }}
        >
          <BiBookAdd className="mr-2" />
          Tạo câu hỏi mới
        </Button>
        <div className="flex flex-row gap-0">
          <Button
            className={`h-[50px] w-full md:w-[200px] rounded-md m-0 p-0 font-medium shadow-md bg-blue-500 transition ease-in-out hover:scale-105 text-sm text-white`}
            onPress={() => onOpen()}
          >
            <MdLeaderboard className="mr-2" />
            Bảng xếp hạng
          </Button>
        </div>
      </div>
    </>
  );
}
