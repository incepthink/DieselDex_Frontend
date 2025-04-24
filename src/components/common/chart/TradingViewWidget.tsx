// TradingViewWidget.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ColorType,
  UTCTimestamp,
} from "lightweight-charts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineArrowDropDown } from "react-icons/md";

interface Trade {
  price: number;
  quantity: number;
  time: string;
  timestamp: number;
  type?: "buy" | "sell";
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

interface UserTrade extends Trade {
  type: "buy" | "sell";
  timestamp: number;
}

interface TradingViewWidgetProps {
  trades: Trade[];
  userTrades?: UserTrade[];
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

type TimeframeOption = {
  label: string;
  minutes: number;
};

const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { label: "1s", minutes: 1 / 60 }, // 5 seconds
  { label: "5m", minutes: 5 },
  { label: "15m", minutes: 15 },
  { label: "2h", minutes: 7200 / 60 },
  { label: "4h", minutes: 14400 / 60 },
  { label: "6h", minutes: 21600 / 60 },
  { label: "12h", minutes: 43200 / 60 },
];

const TIMEFRAME_OPTIONS_SHORT: TimeframeOption[] = [
  { label: "1m", minutes: 1 }, // 1 minute
  { label: "30m", minutes: 1800 / 60 },
  { label: "1h", minutes: 3600 / 60 },
  { label: "24h", minutes: 86400 / 60 },
];

// Helper function to convert trades to candlestick data
const convertToOHLC = (data: Trade[], timeFrame: number = 5) => {
  if (!data.length) return [];

  const sortedData = [...data].sort((a, b) => Number(a.time) - Number(b.time));
  // Group data by time intervals
  const groupedData: { [key: number]: any[] } = {};

  sortedData.forEach((event) => {
    // Round down to nearest interval
    const periodStart = Math.floor(Number(event.time) / timeFrame) * timeFrame;

    if (!groupedData[periodStart]) {
      groupedData[periodStart] = [];
    }
    groupedData[periodStart].push(event);
  });

  // const tokenPrice

  // let reducer = 1;
  //       if($selectedCounterPartyToken?.priceUSD == 1){
  //           reducer = 1000;
  //       }

  // Convert to candlesticks
  return Object.entries(groupedData)
    .map(([time, events]) => {
      const rates = events.map((e) => {
        return Number(e.exchange_rate) / 1e18;
      });
      const volume = events.reduce(
        (sum, e) => sum + Number(e.exchange_rate) / 1e18,
        0
      );

      return {
        time: parseInt(time),
        open: rates[0],
        high: Math.max(...rates),
        low: Math.min(...rates),
        close: rates[rates.length - 1],
        volume,
      };
    })
    .sort((a, b) => a.time - b.time);
};

function TradingViewWidget({
  trades,
  userTrades = [],
  selectedTimeframe,
  onTimeframeChange,
}: TradingViewWidgetProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);

  // Initialize chart
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#111111" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#1e222d",
        // fixLeftEdge: true,
        // fixRightEdge: true,
        // rightOffset: 12,
        barSpacing: 6,
        minBarSpacing: 2,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
        borderVisible: true,
        borderColor: "#2B2B43",
        textColor: "#d1d4dc",
        autoScale: true,
        alignLabels: true,
        mode: 0,
        visible: true,
        entireTextOnly: false,
        ticksVisible: true,
        // formatPrice: (price: number) => {
        //   if (price < 0.000001) {
        //     return price.toExponential(6);
        //   }
        //   return price.toLocaleString("en-US", {
        //     minimumFractionDigits: 0,
        //     maximumFractionDigits: 9,
        //     useGrouping: false,
        //   });
        // },
      },
      //@ts-ignore
      grid: {
        vertLines: {
          color: "#2B2B43",
          style: 1,
          visible: true,
        },
        horzLines: {
          color: "#2B2B43",
          style: 1,
          visible: true,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#758696",
          width: 1,
          style: 1,
          labelBackgroundColor: "#131722",
          labelVisible: true,
        },
        horzLine: {
          color: "#758696",
          width: 1,
          style: 1,
          labelBackgroundColor: "#131722",
          labelVisible: true,
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      borderColor: "#378658",
      wickVisible: true,
      priceFormat: {
        type: "price",
        precision: 9,
        minMove: 0.000000001,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Configure the volume price scale
    chart.priceScale("right").applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
      visible: true,
      autoScale: true,
    });

    window.addEventListener("resize", handleResize);

    setTimeout(() => {
      if (chartRef.current) {
        const timeScale = chartRef.current.timeScale();
        timeScale.fitContent();

        const visibleRange = timeScale.getVisibleRange();
        if (visibleRange) {
          const newRange = {
            from: (visibleRange.from as number) - 24 * 60 * 60,
            to: (visibleRange.to as number) + 24 * 60 * 60,
          };
          //@ts-ignore
          timeScale.setVisibleRange(newRange);
        }
      }
    }, 50);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Update data when trades or timeframe changes
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return;

    try {
      const candleData = convertToOHLC(trades, selectedTimeframe.minutes);
      // const data = calculatePriceStats(candleData);
      console.log(candleData);

      // console.log(data);

      if (candleData.length === 0) return;

      // Update the candlestick series
      candlestickSeriesRef.current.setData(candleData);

      // Update volume series
      const volumeData = candleData.map((candle) => ({
        time: candle.time,
        value: candle.volume || 0,
        color:
          candle.close >= candle.open
            ? "rgba(38, 166, 154, 0.5)" // Green for bullish
            : "rgba(239, 83, 80, 0.5)", // Red for bearish
      }));

      // Format volume numbers
      chartRef.current.priceScale("right").applyOptions({
        // formatPrice: (price: number) => {
        //   if (price >= 1000000) {
        //     return (price / 1000000).toFixed(2) + "M";
        //   } else if (price >= 1000) {
        //     return (price / 1000).toFixed(2) + "K";
        //   }
        //   return price.toFixed(0);
        // },
        visible: true,
      });

      // Adjust the visible range based on timeframe
      const timeScale = chartRef.current.timeScale();
      const lastTime = candleData[candleData.length - 1].time as number;

      // Calculate how many bars to show based on timeframe
      const barsToShow =
        selectedTimeframe.minutes < 1
          ? 100 // Show more bars for smaller timeframes
          : selectedTimeframe.minutes < 60
          ? 50 // Show fewer bars for larger timeframes
          : 24; // Show even fewer for daily

      const timeToShow = barsToShow * selectedTimeframe.minutes * 60; // Convert to seconds

      const visibleRange = {
        from: lastTime - timeToShow,
        to: lastTime + selectedTimeframe.minutes * 60, // Add one candle worth of space
      };

      // Update chart options for the new timeframe
      timeScale.applyOptions({
        timeVisible: selectedTimeframe.minutes <= 60, // Show time for intraday
        secondsVisible: selectedTimeframe.minutes < 1, // Show seconds for sub-minute
        barSpacing: Math.min(12, Math.max(6, timeToShow / barsToShow / 10)),
      });

      // timeScale.setVisibleRange(visibleRange);
    } catch (error) {
      console.error("Error updating chart data:", error);
    }
  }, [trades, selectedTimeframe]);

  // Update markers
  useEffect(() => {
    if (!candlestickSeriesRef.current || !userTrades.length) return;

    const markers = userTrades.map((trade) => ({
      time: Math.floor(trade.timestamp / 1000) as UTCTimestamp,
      position: trade.type === "buy" ? "belowBar" : "aboveBar",
      color: trade.type === "buy" ? "#26a69a" : "#ef5350",
      shape: trade.type === "buy" ? "arrowUp" : "arrowDown",
      text: `${trade.type.toUpperCase()} @ ${trade.price.toFixed(2)}`,
      size: 1,
    }));

    candlestickSeriesRef.current.setMarkers(markers);
  }, [userTrades]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-fuel-dark-800 border-fuel-dark-600 items-center">
        {TIMEFRAME_OPTIONS_SHORT.map((timeframe) => (
          <button
            key={timeframe.label}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              selectedTimeframe.label === timeframe.label
                ? "bg-fuel-green text-[#00EA82]"
                : "bg-fuel-dark-700 text-gray-400 hover:bg-fuel-dark-600"
            }`}
            onClick={() => onTimeframeChange(timeframe)}
          >
            {timeframe.label}
          </button>
        ))}
        <div className="px-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white/20 p-0.5 rounded-sm">
              <MdOutlineArrowDropDown size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/20 border-none backdrop-blur-2xl">
              {TIMEFRAME_OPTIONS.map((timeframe) => (
                <DropdownMenuItem
                  className={`hover:bg-white/10 ${
                    selectedTimeframe.label === timeframe.label
                      ? "bg-fuel-green text-[#00EA82]"
                      : "bg-fuel-dark-700 text-gray-400"
                  }`}
                  onClick={() => onTimeframeChange(timeframe)}
                >
                  {timeframe.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}

export default TradingViewWidget;
