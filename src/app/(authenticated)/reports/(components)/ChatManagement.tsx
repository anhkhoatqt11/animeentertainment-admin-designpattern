"use client";

import Loader from "@/components/Loader";
import { useReports } from "@/hooks/useReports";
import { Button, Chip, Tooltip, User } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoDotFill } from "react-icons/go";
import { IoIosCloseCircle } from "react-icons/io";

export function ChatManagement({ reportId }) {
  const [detailReport, setDetailReport] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const {
    fetchReportDetail,
    deleteParentComment,
    deleteChildComment,
    editReportStatus,
  } = useReports();

  const fetchReport = async () => {
    setIsLoaded(false);
    var result = await fetchReportDetail(reportId);
    setDetailReport(result[0]);
    console.log(result[0]);
    setIsLoaded(true);
  };
  const onCompletedReport = async (reportId) => {
    const data = {
      completedId: reportId,
    };
    await editReportStatus(data);
    toast.success("Đã hoàn tất xử lý báo cáo");
    setTimeout(() => {
      router.push(`/reports`);
    }, 1000);
  };
  useEffect(() => {
    fetchReport();
  }, []);
  return (
    <div>
      <Toaster />
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-full">
          <h1 className="font-semibold text-[18px]">Báo cáo bình luận</h1>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row mt-3 gap-3">
              <img
                src={
                  detailReport?.type === "comic"
                    ? detailReport?.chapterInformation[0]?.coverImage
                    : detailReport?.episodeInformation[0]?.coverImage
                }
                width={60}
                height={60}
                className="rounded overflow-hidden"
              />
              <div className="flex flex-col justify-between">
                <div className="flex flex-row gap-3 items-center">
                  <p className="text-blue-500  font-medium text-[16px]">
                    {detailReport?.type === "comic"
                      ? detailReport?.chapterInformation[0]?.chapterName
                      : detailReport?.episodeInformation[0]?.episodeName}
                  </p>
                  <Button
                    className="bg-emerald-400 text-white"
                    size="sm"
                    onClick={() => {
                      onCompletedReport(reportId);
                    }}
                  >
                    Hoàn tất xử lý
                  </Button>
                </div>
                <p className="text-gray-500 text-[13px]">
                  Ngày báo cáo:{" "}
                  {new Date(detailReport?.reportTime).toDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            {(detailReport?.type === "comic"
              ? detailReport?.chapterInformation[0]?.comments
              : detailReport?.episodeInformation[0]?.comments
            ).map((item) => (
              <div>
                <div
                  className="flex flex-row gap-3 items-center my-6"
                  key={item._id}
                >
                  <GoDotFill
                    className={
                      detailReport?.commentId === item._id
                        ? "text-red-500"
                        : "text-emerald-400"
                    }
                  />
                  <User
                    name={item.userName}
                    description={item.content}
                    avatarProps={{
                      src: item.avatar,
                    }}
                  />
                  {detailReport?.commentId === item._id ? (
                    <Chip
                      color="danger"
                      size="sm"
                      variant="faded"
                      className="font-semibold"
                    >
                      {detailReport?.reportContent}
                    </Chip>
                  ) : (
                    <></>
                  )}
                  <div
                    className="items-end"
                    onClick={async () => {
                      const data = {
                        destinationId: detailReport?.destinationId,
                        parentCommentId: item._id,
                        type: detailReport?.type,
                      };
                      await deleteParentComment(data);
                      toast.success("Đã xóa bình luận");
                      fetchReport();
                    }}
                  >
                    <Tooltip color="danger" content={"Xóa bình luận"}>
                      <div>
                        <IoIosCloseCircle className="text-red-500" size={18} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
                {item.replies.map((item2) => (
                  <div
                    className="flex flex-row gap-3 items-center my-6 ml-8"
                    key={item2._id}
                  >
                    <GoDotFill
                      className={
                        detailReport?.commentId === item2._id
                          ? "text-red-500"
                          : "text-emerald-400"
                      }
                    />
                    <User
                      name={item2.userName}
                      description={item2.content}
                      avatarProps={{
                        src: item2.avatar,
                      }}
                    />
                    {detailReport?.commentId === item2._id ? (
                      <Chip
                        color="danger"
                        size="sm"
                        variant="faded"
                        className="font-semibold"
                      >
                        {detailReport?.reportContent}
                      </Chip>
                    ) : (
                      <></>
                    )}
                    <div className="items-end">
                      <Tooltip color="danger" content={"Xóa bình luận"}>
                        <div
                          onClick={async () => {
                            const data = {
                              destinationId: detailReport?.destinationId,
                              childCommentId: item2._id,
                              parentCommentId: item._id,
                              type: detailReport?.type,
                            };
                            await deleteChildComment(data);
                            toast.success("Đã xóa bình luận");
                            fetchReport();
                          }}
                        >
                          <IoIosCloseCircle
                            className="text-red-500"
                            size={18}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
