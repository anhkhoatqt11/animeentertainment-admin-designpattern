"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import Loader from "@/components/Loader";
import { FileDialog } from "@/components/ui/FileDialog";
import { Label } from "@/components/ui/label";
import { useChallenge } from "@/hooks/useChallenge";
import { postRequest } from "@/lib/fetch";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type Question = {
  _id: string;
  questionName: string;
  answers: string[];
  correctAnswerID: number;
  mediaUrl: string;
};

export function EditQuestion({ questionId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [questionImage, setQuestionImage] = React.useState([]);
  const [questionName, setQuestionName] = React.useState("");
  const [answers, setAnswers] = useState(
    ["", "", "", ""].map((content) => content)
  );
  const [correctAnswerID, setCorrectAnswerID] = React.useState(0);
  const [defaultQuestionImage, setDefaultQuestionImage] = React.useState("");
  const [actionType, setActionType] = React.useState(1);
  const { deleteQuestion, editQuestion, fetchAllQuestions } = useChallenge();
  const route = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      await fetchAllQuestions().then((res) => {
        res?.questionCollection?.forEach((item) => {
          if (item.questionId === questionId) {
            setQuestionName(item.questionName);
            setDefaultQuestionImage(item.mediaUrl);
            setAnswers(item.answers);
            setCorrectAnswerID(item.correctAnswerID);
            setIsLoading(false);
          }
        });
      });
    };
    fetchQuestion();
  }, []);
  var questionMediaImage = "";
  const onSubmit = async () => {
    if (questionName === "") {
      toast.error("Vui lòng nhập câu hỏi");
      return;
    }
    if (answers.filter((i) => i === "").length > 0) {
      toast.error("Vui lòng nhập đầy đủ câu trả lời");
      return;
    }
    setIsLoading(true);
    if (questionImage.length > 0) {
      const [questionImg] = await Promise.all([
        startUpload([...questionImage]).then((res) => {
          const formattedImages = res?.map((image) => ({
            id: image.key,
            name: image.key.split("_")[1] ?? image.key,
            url: image.url,
          }));
          return formattedImages ?? null;
        }),
      ]);
      const parts = defaultQuestionImage?.split("/");
      const keyPart = parts?.[parts.length - 1];
      const imageKey = keyPart?.split("?")[0];
      await postRequest({
        endPoint: "/api/uploadthing/deleteImage",
        formData: { imageKey },
        isFormData: false,
      });
      questionMediaImage = questionImg ? questionImg[0]?.url : "";
    }
    proccessEditing(questionMediaImage);
  };

  const proccessEditing = async (questionMediaImage) => {
    const data = {
      questionId: questionId,
      questionName: questionName,
      answers: answers,
      correctAnswerID: correctAnswerID,
      mediaUrl:
        questionMediaImage != "" ? questionMediaImage : defaultQuestionImage,
    };
    console.log(answers);
    await editQuestion(data).then((res) => {
      toast.success("Sửa câu hỏi thành công");
      setIsLoading(false);
      route.push("/challenge");
    });
  };

  const removeQuestion = () => {
    setIsLoading(true);
    const data = {
      questionId: questionId,
    };
    deleteQuestion(data).then((res) => {
      removeImageSourceFromDB(defaultQuestionImage);
      removeImageSourceFromDB(questionMediaImage);
      toast.success("Xóa câu hỏi thành công");
      setIsLoading(false);
      route.push("/challenge");
    });
  };

  const removeImageSourceFromDB = async (url) => {
    const parts = url?.split("/");
    const keyPart = parts?.[parts.length - 1];
    const imageKey = keyPart?.split("?")[0];
    await postRequest({
      endPoint: "/api/uploadthing/deleteImage",
      formData: { imageKey },
      isFormData: false,
    });
  };

  const handleSetCorrectAnswer = (index) => {
    setCorrectAnswerID(index);
  };

  const scroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Toaster />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận
              </ModalHeader>
              <ModalBody>
                <p>
                  {actionType === 1
                    ? "Bạn có chắc chắn muốn sửa câu hỏi này"
                    : "Bạn có chắc chắn muốn xóa câu hỏi này"}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color={actionType === 1 ? "success" : "danger"}
                  variant="light"
                  onPress={() => {
                    onClose();
                    if (actionType === 1) {
                      onSubmit();
                    } else removeQuestion();
                  }}
                >
                  {actionType === 1 ? "Sửa câu hỏi" : "Xóa câu hỏi"}
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
        <div className="grid-cols-1 grid gap-4 mb-6">
          <h1 className="font-semibold text-xl">Thông tin câu hỏi</h1>
          <div className="flex flex-col gap-3 w-full rounded bg-white p-4">
            <div className="flex flex-col gap-3 w-full">
              <div className=" w-full h-41 border-1 rounded">
                <img
                  src={
                    questionImage[0]?.preview ||
                    questionImage[0]?.url ||
                    defaultQuestionImage
                  }
                  className={`h-[360px] w-full rounded-md object-cover object-center`}
                />
              </div>
              <FileDialog
                name="images"
                maxFiles={1}
                maxSize={1024 * 1024 * 4}
                files={questionImage}
                setFiles={setQuestionImage}
                disabled={false}
                className={`p-0 px-6`}
              />
            </div>
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Câu hỏi: <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full"
                  radius="sm"
                  variant="bordered"
                  size="lg"
                  value={questionName}
                  placeholder="Nhập câu hỏi"
                  onChange={(e) => {
                    setQuestionName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="gap-6 mt-6">
              <div className="flex flex-col gap-3 w-full">
                <Label className="font-bold text-sm">
                  Câu trả lời: <span className="text-red-500">*</span>
                </Label>
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      className="w-full"
                      radius="sm"
                      variant="bordered"
                      size="lg"
                      value={answer}
                      placeholder={`Nhập câu trả lời ${index + 1}`}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      } // Update here
                      endContent={
                        <>
                          {correctAnswerID === index && (
                            <CheckCircle className="text-green-500" />
                          )}
                        </>
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleSetCorrectAnswer(index)}
                      className="text-blue-500 font-medium hover:text-blue-700"
                    >
                      Key đúng
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Button
          className={`w-full rounded-md m-0 p-0 font-semibold text-base shadow-md bg-emerald-400 transition ease-in-out hover:scale-[1.01] text-white py-6`}
          radius="sm"
          onClick={onOpen}
        >
          Sửa câu hỏi
        </Button>
        <Button
          className={`w-full rounded-md m-0 p-0 mt-3 font-semibold text-base shadow-md bg-transparent border-2 text-red-400 border-red-400 hover:bg-red-400 hover:text-white py-6`}
          radius="sm"
          onClick={() => {
            setActionType(2);
            onOpen();
          }}
        >
          Xóa câu hỏi
        </Button>
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 z-10 absolute top-0">
            <div className="w-full h-screen flex items-center justify-center ">
              <Loader />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
