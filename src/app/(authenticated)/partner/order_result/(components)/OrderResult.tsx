"use client";

import { CardTitle } from "@/components/ui/card";
import { usePayment } from "@/hooks/usePayment";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const OrderResult = () => {
  const { fetchVNPayStatus } = usePayment();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handlePaymentStatus = (status: string) => {
    if (status === "00" || (status.data && status.data.return_code === 1)) {
      setPaymentStatus("completed");
    } else {
      setPaymentStatus("failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentStatus = await fetchVNPayStatus();
        handlePaymentStatus(paymentStatus?.code);
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setPaymentStatus("failed");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mb-8">
      <img className="h-auto w-full" src="/welcomebanner2.png" alt="" />
      <div className="w-full max-w-screen-md bg-white rounded-lg shadow-lg md:-mt-20 p-4 mb-8">
        <Card className="w-full" radius="sm">
          <CardTitle className="p-4">
            <p className="font-semibold text-2xl text-center ">
              {loading
                ? "Đang xử lý giao dịch..."
                : paymentStatus === "completed"
                ? "Thanh toán thành công"
                : "Thanh toán thất bại"}
            </p>
          </CardTitle>
          <CardBody className="p-4">
            {loading ? (
              <p className="text-center">
                Giao dịch của bạn đang được xử lý ...
              </p>
            ) : paymentStatus === "completed" ? (
              <p className="text-center text-emerald-500 font-medium">
                Bạn đã thanh toán thành công dịch vụ Quảng cáo trên Skylark
              </p>
            ) : (
              <p className="text-center text-red-500 font-medium">
                Đã xảy ra lỗi trong quá trình thanh toán.
              </p>
            )}
          </CardBody>
          <CardFooter className="flex justify-center">
            <Button
              radius="sm"
              className="w-full shadow-md font-medium bg-emerald-500 transition ease-in-out hover:scale-[1.01] text-sm text-white"
              onClick={() => {
                if (paymentStatus === "completed") {
                  router.push("/partner/place_order");
                } else if (paymentStatus === "failed") {
                  router.push("/partner/place_order");
                } else {
                }
              }}
            >
              {loading
                ? "Đang xử lý"
                : paymentStatus === "completed"
                ? "Trang chủ"
                : "Trang chủ"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderResult;
