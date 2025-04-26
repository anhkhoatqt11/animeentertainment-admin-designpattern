"use client";

import { AlbumCheckbox } from "@/components/ui/AlbumCheckbox";
import { Button } from "@nextui-org/button";
import { Label } from "@/components/ui/label";
import { useBanners } from "@/hooks/useBanners";
import { CheckboxGroup, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { set } from "mongoose";
import React from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";


export function EditComicBanner() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [searchKey, setSearchKey] = useState("");
    const [copyList, setCopyList] = useState([]);
    const { fetchComicList, fetchBanners, editBanner } = useBanners();
    const [groupSelected, setGroupSelected] = React.useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [choiceList, setChoiceList] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            await fetchComicList().then((res) => {
                setCopyList(res);
                setChoiceList(res);
            });
            await fetchBanners().then((res) => {
                const comicIds = res?.flatMap(item =>
                    item.list.filter(subItem => subItem.type === 'Comic').map(subItem => subItem._id)
                );
                setGroupSelected(comicIds);
                setIsLoading(false);
            });
        }
        fetchList();
    }, [])

    useEffect(() => {
        console.log(groupSelected);
    }, [groupSelected])


    const searchSubmit = () => {
        setCopyList(
            choiceList.filter((item) =>
                item?.comicName.toLowerCase().includes(searchKey.toLowerCase())
            )
        );

    };

    const onSubmit = async () => {
        if (groupSelected.length < 2) {
            toast.error("Banner phải có ít nhất 2 bộ");
            return;
        }
        setIsLoading(true);
        const data = {
            _id: "65f840bd3be42c25a6a39428",
            list: groupSelected,
        };
        await editBanner(data).then((res) => {
            toast.success("Banner đã được cập nhật");
            setIsLoading(false);
        });
    }



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
                                <p>Bạn có chắc chắn muốn sửa thông tin banner?</p>
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
                                    Sửa banner
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
                    <h1 className="font-semibold text-xl">Chỉnh sửa banner</h1>
                    <div className="flex flex-col gap-3 w-full rounded bg-white p-4">
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <Label className="font-bold text-sm">
                                    Danh sách comic
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex flex-row items-center">
                                    <Input
                                        className="h-[52px] w-full md:w-[270px] bg-white"
                                        variant="bordered"
                                        radius="sm"
                                        label={`Nhập tên comic ...`}
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
                                                name: item?.comicName,
                                                image: item?.coverImage,
                                                type: `comic`,
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
                        Sửa banner
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
    )

}