import { useState } from "react";
import React from "react";
import { Line } from "react-chartjs-2";

type props = {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      fill: boolean;
      tension: number;
    }[];
  };
};
export function LineChart({ chartData }: props) {
  return (
    <div
      className="chart-container bg-white rounded-[16px] shadow my-3 mr-3 p-3"
      style={{ width: screen.width * 0.8 * 0.6 }}
    >
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Sơ đồ doanh thu năm (Đơn vị: VND)`,
            },
          },
        }}
      />
    </div>
  );
}
