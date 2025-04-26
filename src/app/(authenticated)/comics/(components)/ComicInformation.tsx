"use client";

import React, { useEffect, useState } from "react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
// import { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileDialog } from "@/components/ui/FileDialog";
import { ImageList } from "@/components/ui/ImageList";
import { Button } from "@/components/ui/button";
import DialogCustom from "@/components/ui/dialogCustom";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import {
  CheckboxGroup,
  Input,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { url } from "inspector";
import { Zoom } from "@/components/ui/zoom-image";
import { DatePicker } from "@/components/ui/date-picker";
import { FileWithPath } from "react-dropzone";
import { useGenres } from "@/hooks/useGenres";
import { CustomCheckbox } from "@/components/ui/CustomCheckBox";

function ComicInformation({ props }) {
  const ageList = [
    "10+",
    "11+",
    "12+",
    "13+",
    "14+",
    "15+",
    "16+",
    "17+",
    "18+",
  ];
  const [genreList, setGenreList] = useState([]);
  const { fetchAllGenres } = useGenres();
  useEffect(() => {
    const getAllGenres = async () => {
      props.setIsLoading(true);
      await fetchAllGenres().then((res) => {
        setGenreList(res);
        props.setIsLoading(false);
      });
    };
    getAllGenres();
  }, []);
  return (
    <div className="grid-cols-1 grid gap-4 mb-6">
      <h1 className="font-semibold text-xl">Thông tin bộ truyện</h1>
      <div className="flex flex-col gap-3 w-full rounded bg-white p-4">
        <div className="flex flex-row gap-3">
          <div className="flex flex-col gap-3 w-[70%]">
            <div className=" w-full h-41 border-1 rounded">
              <img
                src={
                  props.landspaceImage[0]?.preview ||
                  props.landspaceImage[0]?.url ||
                  props.defaultLandspace
                }
                alt={props.landspaceImage[0]?.name}
                className={`h-[360px] w-full rounded-md object-cover object-center`}
              />
            </div>
            <FileDialog
              name="images"
              maxFiles={1}
              maxSize={1024 * 1024 * 4}
              files={props.landspaceImage}
              setFiles={props.setLandspaceImage}
              disabled={false}
              className={`p-0 px-6`}
            />
          </div>
          <div className="flex flex-col gap-3 w-[30%]">
            <div className=" w-full h-41 border-1 rounded">
              <img
                src={
                  props.coverImage[0]?.preview ||
                  props.coverImage[0]?.url ||
                  props.defaultCover
                }
                alt={props.coverImage[0]?.name}
                className={`h-[360px] w-full rounded-md object-cover object-center`}
              />
            </div>
            <FileDialog
              name="images"
              maxFiles={1}
              maxSize={1024 * 1024 * 4}
              files={props.coverImage}
              setFiles={props.setCoverImage}
              disabled={false}
              className={`p-0 px-6 `}
            />
          </div>
        </div>
        {/* thong tin khac */}
        <div className="gap-6 mt-6">
          {/* ten phim */}
          <div className="flex flex-col gap-3 w-full">
            <Label className="font-bold text-sm">
              Tên bộ truyện: <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-full"
              radius="sm"
              variant="bordered"
              size="md"
              value={props.comicName}
              placeholder="Nhập tên bộ truyện"
              onChange={(e) => {
                props.setComicName(e.target.value);
              }}
            />
          </div>
        </div>
        {/* mo ta */}
        <div className="gap-6">
          {/* ten phim */}
          <div className="flex flex-col gap-3 w-full">
            <Label className="font-bold text-sm">
              Mô tả: <span className="text-red-500">*</span>
            </Label>
            <Textarea
              className="w-full"
              radius="sm"
              variant="bordered"
              size="md"
              value={props.description}
              placeholder="Nhập mô tả phim"
              onChange={(e) => {
                props.setDescription(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label className="font-bold text-sm">
            Thể loại: <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-col gap-1 w-full">
            <CheckboxGroup
              label="Chọn loại sự kiện"
              orientation="horizontal"
              value={props.genreSelected}
              onChange={props.setGenreSelected}
            >
              {genreList.map((item) => (
                <CustomCheckbox key={item?._id} value={item?._id}>
                  {item?.genreName}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <Label className="font-bold text-sm">
              Tác giả: <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-full"
              radius="sm"
              variant="bordered"
              size="md"
              value={props.author}
              placeholder="Nhập tên tác giả"
              onChange={(e) => {
                props.setAuthor(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label className="font-bold text-sm">
              Họa sĩ: <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-full"
              radius="sm"
              variant="bordered"
              size="md"
              value={props.artist}
              placeholder="Nhập tên họa sĩ"
              onChange={(e) => {
                props.setArtist(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full">
            <Label className="font-bold text-sm">
              Nhà sản xuất: <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-full"
              radius="sm"
              variant="bordered"
              size="md"
              value={props.publisher}
              placeholder="Nhập tên nhà sản xuất"
              onChange={(e) => {
                props.setPublisher(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label className="font-bold text-sm">
              Khung giờ phát tập mới: <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-full"
              radius="sm"
              variant="bordered"
              size="md"
              value={props.weeklyTime}
              placeholder="Nhập khung giờ phát sóng tập mới"
              onChange={(e) => {
                props.setWeeklyTime(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-3 w-full md:w-[150px]">
            <Label className="font-bold text-sm">
              Độ tuổi: <span className="text-red-500">*</span>
            </Label>
            <Select
              variant={"bordered"}
              label="Chọn độ tuổi"
              defaultSelectedKeys={["10+"]}
              selectedKeys={props.ageFor}
              radius="sm"
              className="w-full md:w-[150px]"
              onSelectionChange={props.setAgeFor}
            >
              {ageList.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComicInformation;
