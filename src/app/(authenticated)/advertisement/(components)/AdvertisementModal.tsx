"use client";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { useAdvertisement } from "@/hooks/useAdvertisement";
import { checkNumber } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AdvertisementModal = ({ props }) => {
  const [orderId, setOrderId] = useState(props.orderId);
  const [pricePerAd, setPricePerAd] = useState(props.pricePerAd);
  const [representative, setRepresentative] = useState(props.representative);
  const [adVideoUrl, setAdVideoUrl] = useState(props.adVideoUrl);
  const [forwardLink, setForwardLink] = useState(props.forwardLink);
  const [amount, setAmount] = useState(props.amount);
  const { editAdvertisement, createAdvertisement } = useAdvertisement();
  const editAdvertisementAction = async (close) => {
    if (
      !representative ||
      !pricePerAd ||
      !adVideoUrl ||
      !forwardLink ||
      !amount
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!checkNumber(pricePerAd) || !checkNumber(amount)) {
      toast.error(
        "Định dạng giá hoặc số lượng không đúng, vui lòng chỉ nhập số"
      );
      return;
    }
    if (props.action === "edit") {
      props.setAdvertisementList(
        props.advertisementList.map((item) =>
          item._id === props.orderId
            ? {
                _id: props.orderId,
                representative: representative,
                pricePerAd: pricePerAd,
                amount: amount,
                adVideoUrl: adVideoUrl,
                forwardLink: forwardLink,
              }
            : item
        )
      );
      const data = {
        _id: orderId,
        representative: representative,
        pricePerAd: pricePerAd,
        amount: amount,
        adVideoUrl: adVideoUrl,
        forwardLink: forwardLink,
      };
      await editAdvertisement(data).then((res) => {
        toast.success("Sửa phiếu đặt quảng cáo thành công");
      });
    } else {
      const data = {
        representative: representative,
        pricePerAd: pricePerAd,
        amount: amount,
        adVideoUrl: adVideoUrl,
        forwardLink: forwardLink,
      };
      await createAdvertisement(data).then((res) => {
        props.setAdvertisementList([
          ...props.advertisementList,
          {
            _id: res?._id,
            representative: representative,
            pricePerAd: pricePerAd,
            amount: amount,
            adVideoUrl: adVideoUrl,
            forwardLink: forwardLink,
          },
        ]);
        toast.success("Thêm phiếu đặt quảng cáo thành công");
      });
    }
    close();
  };
  useEffect(() => {
    if (props.isOpen) {
      setOrderId(props.action === "edit" ? props.orderId : "");
      setRepresentative(
        props.action === "edit" && props.representative
          ? props.representative
          : ""
      );
      setPricePerAd(
        props.action === "edit" && props.pricePerAd ? props.pricePerAd : ""
      );
      setAdVideoUrl(
        props.action === "edit" && props.adVideoUrl ? props.adVideoUrl : ""
      );
      setForwardLink(
        props.action === "edit" && props.forwardLink ? props.forwardLink : ""
      );
      setAmount(props.action === "edit" && props.amount ? props.amount : "");
    }
  }, [
    props.orderId,
    props.representative,
    props.pricePerAd,
    props.adVideoUrl,
    props.forwardLink,
    props.amount,
    props.isOpen,
  ]);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 w-full">
                  <Label className="font-bold text-sm">
                    Người đại diện: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="w-full"
                    radius="sm"
                    value={representative}
                    label="Nhập tên người đại diện"
                    onChange={(e) => {
                      setRepresentative(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label className="font-bold text-sm">
                    Mức giá: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="w-full"
                    radius="sm"
                    value={pricePerAd}
                    label="Nhập giá (VNĐ)"
                    onChange={(e) => {
                      setPricePerAd(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label className="font-bold text-sm">
                    Video quảng cáo (URL):{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="w-full"
                    radius="sm"
                    value={adVideoUrl}
                    label="Nhập url"
                    onChange={(e) => {
                      setAdVideoUrl(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label className="font-bold text-sm">
                    Trang chuyển tiếp: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="w-full"
                    radius="sm"
                    value={forwardLink}
                    label="Nhập link chuyển tiếp"
                    onChange={(e) => {
                      setForwardLink(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label className="font-bold text-sm">
                    Số lượng quảng cáo: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className="w-full"
                    radius="sm"
                    value={amount}
                    label="Nhập số lượng"
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button
                className="w-28"
                color="success"
                variant="light"
                radius="sm"
                onPress={() => {
                  editAdvertisementAction(onClose);
                }}
              >
                Xác nhận
              </Button>
              <Button
                className="w-28"
                color="primary"
                radius="sm"
                onPress={onClose}
              >
                Hủy
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
