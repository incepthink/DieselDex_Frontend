"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

interface OHLCData {
  t: string; // Timestamp (date)
  o: number; // Open price
  h: number; // High price
  l: number; // Low price
  c: number; // Close price
}

interface Dataset {
  x: string;
  o: number;
  h: number;
  l: number;
  c: number;
}

const ChartComponent: React.FC = () => {
  // Sample OHLC data (Open, High, Low, Close)
  const ohlcData: OHLCData[] = [
    { t: "2023-01-01", o: 150, h: 155, l: 145, c: 150 },
    { t: "2023-02-01", o: 155, h: 160, l: 150, c: 158 },
    { t: "2023-03-01", o: 158, h: 165, l: 155, c: 162 },
    { t: "2023-04-01", o: 162, h: 170, l: 160, c: 168 },
    { t: "2023-05-01", o: 168, h: 175, l: 165, c: 170 },
    { t: "2023-06-01", o: 170, h: 178, l: 167, c: 172 },
    { t: "2023-07-01", o: 172, h: 180, l: 170, c: 175 },
    { t: "2023-08-01", o: 175, h: 185, l: 172, c: 178 },
    { t: "2023-09-01", o: 178, h: 185, l: 175, c: 182 },
    { t: "2023-10-01", o: 182, h: 190, l: 180, c: 185 },
    { t: "2023-11-01", o: 185, h: 192, l: 180, c: 190 },
    { t: "2023-12-01", o: 190, h: 200, l: 185, c: 195 },
  ];

  const chartData = {
    labels: ohlcData.map((data) => data.t), // Label based on time
    datasets: [
      {
        label: "Candlestick",
        data: ohlcData.map((data) => ({
          x: data.t,
          o: data.o,
          h: data.h,
          l: data.l,
          c: data.c,
        })),
        borderColor: "rgba(0, 123, 255, 1)", // Candle border color
        backgroundColor: (context: {
          dataIndex: number;
          dataset: { data: Dataset[] };
        }) => {
          const { dataIndex, dataset } = context;
          const { o, c } = dataset.data[dataIndex];
          return o > c
            ? "rgba(255, 0, 0, 0.6)" // Red for down candle
            : "rgba(0, 255, 0, 0.6)"; // Green for up candle
        },
        type: "bar",
        barThickness: 5,
        yAxisID: "y1",
      },
      {
        label: "Volume",
        data: ohlcData.map((data) => data.h - data.l), // Represent the high-low range as volume
        backgroundColor: "rgba(0, 123, 255, 0.3)",
        type: "bar",
        yAxisID: "y",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
      y1: {
        position: "right",
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: { raw: Dataset }) => {
            const rawData = context.raw;
            if (rawData) {
              const { o, h, l, c } = rawData;
              return `Open: ${o}, High: ${h}, Low: ${l}, Close: ${c}`;
            }
            return "";
          },
        },
      },
    },
  };

  return (
    <div className="border border-black border-opacity-20 w-full p-6 rounded-md shadow-md">
      <div>
        <p className="text-xl font-bold">Chart</p>
      </div>

      <div
        className="chart-container"
        style={{ position: "relative", height: "400px", width: "100%" }}
      >
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartComponent;
