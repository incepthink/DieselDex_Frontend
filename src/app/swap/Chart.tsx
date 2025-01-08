"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Image from "next/image";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  date: string;
  price: number;
}

const sampleData: StockData[] = [
  { date: "Apr", price: 0.0 },
  { date: "May", price: 100.0 },
  { date: "Jun", price: 175.0 },
  { date: "Jul", price: 100.0 },
  { date: "Aug", price: 185.0 },
  { date: "Sep", price: 180.0 },
  { date: "Oct", price: 176.65 },
  { date: "", price: 176.65 },
];

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "category",
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        color: "#6B7280",
      },
    },
    y: {
      type: "linear",
      position: "right",
      grid: {
        color: "#E5E7EB",
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        color: "#6B7280",
        callback: (value) => `${value}`,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "#1F2937",
      titleFont: {
        family: "'Inter', sans-serif",
        size: 14,
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        size: 12,
      },
      callbacks: {
        label: (context) => `$${context.parsed.y.toFixed(2)}`,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
      hoverRadius: 6,
    },
  },
};

export default function Chart() {
  const data = {
    labels: sampleData.map((d) => d.date),
    datasets: [
      {
        data: sampleData.map((d) => d.price),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  const timeRanges = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"];

  return (
    <div className="border border-black border-opacity-20 w-full p-4 lg:p-6 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text-xl lg:text-2xl font-bold">Chart</p>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
          <div className="flex items-center gap-1">
            <Image
              src="/images/icon/icon-psycho.png"
              alt=""
              width={100}
              height={100}
              quality={100}
              className="w-4 lg:w-5 h-4 lg:h-5 rounded-full"
            />
            <h1 className="font-semibold">Physco</h1>
          </div>
          <p className="text-sm font-semibold">· 1D · NASDAQ </p>
          <div className="flex justify-center items-center gap-1 text-xs font-semibold">
            <div className="flex justify-center items-center gap-1">
              <span className="">O</span>
              <div className="text-[#F23645]">178.88</div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="">H</span>
              <div className="text-[#F23645]">179.48</div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="">L</span>
              <div className="text-[#F23645]">177.05</div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="">C</span>
              <div className="text-[#F23645]">177.45 -2.01 (-1.12%)</div>
            </div>
          </div>
        </div>
        <div className="flex justify-start items-center gap-2 text-sm font-semibold ">
          <p className="px-2 py-1 rounded-md border border-[#F23645] text-[#F23645]">
            176.65
          </p>
          <p>0.00</p>
          <p className="px-2 py-1 rounded-md border border-[#2962FF] text-[#2962FF]">
            176.65
          </p>
        </div>
        <div className="flex justify-start items-center gap-2 text-sm font-semibold ">
          <p className="">Vol</p>
          <p className="text-[#F23645]">176.65</p>
        </div>
      </div>

      <div className="h-60 lg:h-[400px] mb-4">
        <Line options={options} data={data} />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center mt-4">
        <div className="flex gap-1 overflow-x-auto w-full lg:w-auto">
          {timeRanges.map((range) => (
            <button key={range} className="px-2 py-1 text-sm font-medium">
              {range}
            </button>
          ))}
        </div>
        <div className="text-sm font-medium">
          <p>
            17:45:00 (UTC) <span className="text-[#E0E3EB]">|</span> ADJ
          </p>
        </div>
      </div>
    </div>
  );
}
