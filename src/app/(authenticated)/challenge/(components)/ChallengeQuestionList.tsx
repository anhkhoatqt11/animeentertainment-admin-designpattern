"use client";

import Loader from "@/components/Loader";
import { useChallenge } from "@/hooks/useChallenge";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ChallengeItemCard from "./ChallengeItemCard";
import { Button, DateInput, Input, Pagination } from "@nextui-org/react";
import { Label } from "@/components/ui/label";
import { I18nProvider } from "@react-aria/i18n";
import { TimeInput } from "@nextui-org/react";
import {
  parseDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  parseZonedDateTime,
  today,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import toast, { Toaster } from "react-hot-toast";
function ChallengeQuestionList({ props, isLoaded, setIsLoaded }) {
  const { fetchAllQuestions, editChallenge } = useChallenge();
  const [challengeInformation, setChallengeInformation] = useState();
  const [challengeName, setChallengeName] = useState("");
  const [value, setValue] = useState(parseDate("2024-04-04"));
  let formatter = useDateFormatter({ dateStyle: "full" });
  let formatterTime = useDateFormatter({
    dateStyle: "short",
    timeStyle: "long",
  });
  useEffect(() => {
    const fetchChallenge = async () => {
      var result = await fetchAllQuestions();
      setChallengeInformation(result);
      setIsLoaded(true);
      setChallengeName(result?.challengeName);
      setValue(parseAbsoluteToLocal(result?.endTime));
    };
    fetchChallenge();
  }, []);

  const onSavedChange = async () => {
    if (challengeName === "") {
      toast.error("Vui lòng nhập tên chủ đề");
      return;
    }
    const data = {
      challengeName: challengeName,
      endTime: new Date(
        parseZonedDateTime(value.toString()).year,
        parseZonedDateTime(value.toString()).month - 1,
        parseZonedDateTime(value.toString()).day,
        parseZonedDateTime(value.toString()).hour,
        parseZonedDateTime(value.toString()).minute,
        0,
        0
      ),
    };
    await editChallenge(data);
    toast.success("Chỉnh sửa thành công");
  };

  return (
    <div>
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <Toaster />
          <div className="pl-8 pr-8 pb-3 flex flex-col gap-3">
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Tên chủ đề: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                  value={challengeName}
                  placeholder="Nhập tên chủ đề thử thách"
                  onChange={(e) => {
                    setChallengeName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-end">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Ngày mở khóa: <span className="text-red-500">*</span>
                </Label>
                <I18nProvider locale="vi-VN">
                  <DateInput
                    value={value}
                    onChange={setValue}
                    variant="bordered"
                    size="lg"
                    radius="sm"
                    minValue={today(getLocalTimeZone())}
                  />
                </I18nProvider>
              </div>
              <Button
                className="bg-emerald-400 text-white"
                radius="sm"
                size="lg"
                onClick={onSavedChange}
              >
                Bắt đầu thử thách mới
              </Button>
            </div>
          </div>
          <Label className="font-bold text-sm ml-8">Danh sách câu hỏi:</Label>
          <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-1">
            {challengeInformation?.questionCollection?.map((item, index) => (
              <ChallengeItemCard
                item={item}
                index={index}
                key={`question-${item.questionId}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ChallengeQuestionList;
