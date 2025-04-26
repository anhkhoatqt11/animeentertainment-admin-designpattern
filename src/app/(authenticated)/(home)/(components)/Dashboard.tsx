"use client";

import { MdMovieFilter, MdOutlineShowChart } from "react-icons/md";
import {
  IoPodium,
  IoTrendingDownOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { FaBookQuran } from "react-icons/fa6";
import { RiAdvertisementFill } from "react-icons/ri";
import { FaCoins } from "react-icons/fa6";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import { DoughnutChart } from "./DoughnutChart";
import { LineChart } from "./LineChart";
import UserTable from "./UserTable";
import { useDashboard } from "@/hooks/useDashboard";
import Loader from "@/components/Loader";
Chart.register(CategoryScale);

type propsLineDate = {
  label: string;
  data: number[];
  borderColor: string;
  fill: boolean;
  tension: number;
};

function getLast12MonthsLabels() {
  const labels = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleString("default", { month: "short" });
    labels.push(month);
  }
  return labels;
}

export function Dashboard() {
  const { fetchAllDashboard } = useDashboard();
  const [dashboardData, setDashboardData] = useState({});
  const [adsRevenuePercentage, setAdsRevenuePercentage] = useState(0);
  const [revenuePercentage, setRevenuePercentage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      const result = await fetchAllDashboard();
      setDashboardData(result);
      setIsLoaded(true);
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardData.adsRevenue && dashboardData.revenue) {
      setChartDataLine({
        labels: getLast12MonthsLabels(),
        datasets: [
          {
            label: "Doanh thu quảng cáo",
            data: dashboardData.adsRevenue,
            borderColor: "rgb(255, 99, 132)",
            fill: false,
            tension: 0.4,
          },
          {
            label: "Doanh thu thanh toán",
            data: dashboardData.revenue,
            borderColor: "rgb(59, 228, 146)",
            fill: false,
            tension: 0.4,
          },
        ],
      });

      setChartDataDoughnut({
        labels: ["Doanh thu quảng cáo", "Doanh thu thanh toán"],
        datasets: [
          {
            label: "Tổng thu",
            data: [
              dashboardData.adsRevenue.reduce((acc, val) => acc + val, 0),
              dashboardData.revenue.reduce((acc, val) => acc + val, 0),
            ],
            backgroundColor: ["rgb(255, 99, 132)", "rgb(59, 228, 146)"],
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      });
    }
  }, [dashboardData]);

  const [chartDataDoughnut, setChartDataDoughnut] = useState({
    labels: ["Doanh thu quảng cáo", "Doanh thu thanh toán"],
    datasets: [
      {
        label: "Tổng thu",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(59, 228, 146)"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  });

  const [chartDataLine, setChartDataLine] = useState({
    labels: getLast12MonthsLabels(),
    datasets: [
      {
        label: "Doanh thu quảng cáo",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Doanh thu thanh toán",
        data: [],
        borderColor: "rgb(59, 228, 146)",
        fill: false,
        tension: 0.4,
      },
    ],
  });

  return (
    <div className="h-full">
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <div className="bg-white rounded-[16px] shadow h-fit p-6">
              <div className="flex flex-row justify-between items-center">
                <div className="rounded-full bg-blue-500/5 border-1 border-blue-500 h-10 w-10 flex justify-center items-center">
                  <MdMovieFilter className="text-blue-500 w-6 h-6" />
                </div>
                <IoPodium className="text-blue-500 w-8 h-8" />
              </div>
              <div className="mt-6 flex flex-row gap-2 items-end">
                <div className="font-semibold text-[20px]">
                  {dashboardData?.comicCount || 0}
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                Số lượng truyện phát hành
              </div>
            </div>
            <div className="bg-white rounded-[16px] shadow h-fit p-6">
              <div className="flex flex-row justify-between items-center">
                <div className="rounded-full bg-emerald-400/5 border-1 border-emerald-400 h-10 w-10 flex justify-center items-center">
                  <FaBookQuran className="text-emerald-400 w-5 h-5" />
                </div>
                <IoPodium className="text-emerald-400 w-8 h-8" />
              </div>
              <div className="mt-6 flex flex-row gap-2 items-end">
                <div className="font-semibold text-[20px]">
                  {dashboardData?.animeCount || 0}
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                Số lượng anime phát hành
              </div>
            </div>
            <div className="bg-white rounded-[16px] shadow h-fit p-6">
              <div className="flex flex-row justify-between items-center">
                <div className="rounded-full bg-fuchsia-500/5 border-1 border-fuchsia-500 h-10 w-10 flex justify-center items-center">
                  <RiAdvertisementFill className="text-fuchsia-500 w-6 h-6" />
                </div>
                {parseFloat(dashboardData?.adsRevenueGrowth) < 0 ? (
                  <>
                    <IoTrendingDownOutline className="text-fuchsia-500 w-8 h-8" />{" "}
                  </>
                ) : (
                  <>
                    <IoTrendingUpOutline className="text-fuchsia-500 w-8 h-8" />{" "}
                  </>
                )}
              </div>
              <div className="mt-6 flex flex-row gap-2 items-end">
                <div className="font-semibold text-[20px]">
                  {dashboardData?.adsRevenueCurrentMonth.toLocaleString() || 0}{" "}
                  $
                </div>
                {parseFloat(dashboardData?.adsRevenueGrowth) < 0 ? (
                  <BiSolidDownArrow className="text-red-500 w-3 h-3 mb-2" />
                ) : (
                  <BiSolidUpArrow className="text-emerald-400 w-3 h-3 mb-2" />
                )}
                <div className="text-[12px] mb-1">
                  {dashboardData?.adsRevenueGrowth}%
                </div>
              </div>
              <div className="text-gray-500 text-sm">Doanh thu quảng cáo</div>
            </div>
            <div className="bg-white rounded-[16px] shadow h-fit p-6">
              <div className="flex flex-row justify-between items-center">
                <div className="rounded-full bg-yellow-400/5 border-1 border-yellow-400 h-10 w-10 flex justify-center items-center">
                  <FaCoins className="text-yellow-400 w-6 h-6" />
                </div>
                {parseFloat(dashboardData?.revenueGrowth) < 0 ? (
                  <>
                    <IoTrendingDownOutline className="text-yellow-400 w-8 h-8" />{" "}
                  </>
                ) : (
                  <>
                    <IoTrendingUpOutline className="text-yellow-400 w-8 h-8" />
                  </>
                )}
              </div>
              <div className="mt-6 flex flex-row gap-2 items-end">
                <div className="font-semibold text-[20px]">
                  {dashboardData?.revenueCurrentMonth.toLocaleString() || 0} $
                </div>
                {parseFloat(dashboardData?.revenueGrowth) < 0 ? (
                  <BiSolidDownArrow className="text-red-500 w-3 h-3 mb-2" />
                ) : (
                  <BiSolidUpArrow className="text-emerald-400 w-3 h-3 mb-2" />
                )}
                <div className="text-[12px] mb-1">
                  {dashboardData?.revenueGrowth}%
                </div>
              </div>
              <div className="text-gray-500 text-sm">Doanh thu thanh toán</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <LineChart chartData={chartDataLine} />
            <DoughnutChart chartData={chartDataDoughnut} />
          </div>

          <div className="font-medium text-xl p-3 pl-0 mt-3">
            Người dùng Skylark mobile
            <UserTable />
          </div>
        </div>
      )}
    </div>
  );
}
