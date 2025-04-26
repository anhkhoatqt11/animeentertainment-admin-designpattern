"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { BiBookAdd } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { Form } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";

export function SearchAndCreateBar({ setSearchWord, setSort, setIsLoaded }) {
  const [searchKey, setSearchKey] = useState("");
  try {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchSubmit();
    });
  } catch (except) {}
  const searchSubmit = () => {
    setIsLoaded(false);
    setSearchWord(searchKey);
  };
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["new"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <div className="flex flex-col gap-2 md:flex-row md:justify-between p-4 pb-0">
      <Button
        className={`h-[50px] w-full md:w-[200px] rounded-md m-0 p-0 font-medium shadow-md bg-gradient-to-r from-violet-500 to-fuchsia-500 transition ease-in-out hover:scale-105 text-sm text-white`}
        onClick={() => {
          router.push("/animes/addNewAnime");
        }}
      >
        <BiBookAdd className="mr-2" />
        Tạo phim mới
      </Button>
      <div className="flex flex-row items-center">
        <Input
          className="h-[52px] w-full md:w-[270px] bg-white"
          variant="bordered"
          radius="sm"
          label="Nhập tên anime ..."
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <Button
          className="h-[40px] w-[0px] rounded-md m-0 p-0 -ml-[0px] min-w-unit-12 bg-white z-10 hover:bg-white"
          onClick={searchSubmit}
        >
          <MagnifyingGlassIcon className={`h-6 w-6 text-[#3BE1AA]`} />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={"outline"}
              size={"sm"}
              className="ml-3 h-[52px] w-[52px] bg-white text-neutral-800 text-base hover:bg-gray-100 hover:text-neutral active:scale-75 transition ease-in-out duration-200"
            >
              {selectedValue === "new" ? (
                <HiSortAscending className="text-[#3BE1AA]" />
              ) : (
                <HiSortDescending className="text-[#3BE1AA]" />
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem
              key="new"
              onClick={() => {
                setIsLoaded(false);
                setSort(-1);
              }}
            >
              Phim mới nhất
            </DropdownItem>
            <DropdownItem
              key="old"
              onClick={() => {
                setIsLoaded(false);
                setSort(1);
              }}
            >
              Phim cũ nhất
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

export default SearchAndCreateBar;
