import { useState } from "react";
import React from "react";
import { Doughnut } from "react-chartjs-2";

type props = {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
    }[];
  };
};
export function DoughnutChart({ chartData }: props) {
  return (
    <div
      className="chart-container bg-white rounded-[16px] shadow my-3 p-3"
      style={{ width: screen.width * 0.8 * 0.3 }}
    >
      <Doughnut
        style={{ marginTop: "20px" }}
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Sơ đồ tỉ lệ thu nhập (Đơn vị: %)`,
            },
          },
        }}
      />
    </div>
  );
}
