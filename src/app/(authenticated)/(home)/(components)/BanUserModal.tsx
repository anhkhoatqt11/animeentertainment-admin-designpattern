"use client";
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
  DateInput,
} from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { TimeInput } from "@nextui-org/react";
import {
  parseDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  Time,
  ZonedDateTime,
  today,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { useUsers } from "@/hooks/useUsers";

export const BanUserModal = ({ props }) => {
  const [value, setValue] = useState(parseDate("2024-04-04"));
  let formatter = useDateFormatter({ dateStyle: "full" });
  let [valueTime, setValueTime] = useState(
    parseAbsoluteToLocal("2024-04-08T18:45:22Z")
  );
  let formatterTime = useDateFormatter({
    dateStyle: "short",
    timeStyle: "long",
  });
  const { editAccessCommentDate } = useUsers();

  const editBanUser = async (close) => {
    if (
      new Date(value.year, value.month - 1, value.day).getTime() -
        new Date().getTime() <
      0
    ) {
      toast.error("Ngày mở khóa phải lớn hơn ngày hiện tại");
      return;
    } else {
      const data = {
        userList: props.userListPick,
        year: value.year,
        month: value.month - 1,
        day: value.day,
        hour: valueTime.hour,
        minute: valueTime.minute,
        second: valueTime.second,
      };
      await editAccessCommentDate(data);
      toast.success("Cập nhật thành công");
      props.refetch();
    }
    close();
  };
  const onUnlockCommentFunction = async () => {
    const data = {
      userList: props.userListPick,
      year: 2024,
      month: 0,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    };
    await editAccessCommentDate(data);
    toast.success("Cập nhật thành công");
    props.refetch();
  };

  return (
    <div>
      {props.actionType === "open" ? (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Xác nhận
                </ModalHeader>
                <ModalBody>
                  <p>
                    Bạn có chắc chắn muốn mở khóa tính năng comment cho những
                    users này
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="success"
                    variant="ghost"
                    onClick={() => {
                      onClose();
                      onUnlockCommentFunction();
                    }}
                  >
                    Mở khóa
                  </Button>
                  <Button color="primary" onClick={onClose}>
                    Hủy
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader></ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 w-full">
                      <Label className="font-bold text-sm">
                        Ngày mở khóa: <span className="text-red-500">*</span>
                      </Label>
                      <I18nProvider locale="vi-VN">
                        <DateInput
                          label="Chọn ngày"
                          value={value}
                          onChange={setValue}
                          minValue={today(getLocalTimeZone())}
                        />
                      </I18nProvider>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <Label className="font-bold text-sm">
                        Khung giờ mở khóa:{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <TimeInput
                        label="Chọn khung giờ"
                        value={valueTime}
                        onChange={setValueTime}
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
                      editBanUser(onClose);
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
      )}
    </div>
  );
};
