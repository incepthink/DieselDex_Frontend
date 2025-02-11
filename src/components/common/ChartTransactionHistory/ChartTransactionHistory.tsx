import { ChartData } from "@/app/swap/page";
import { SwapEvent } from "../chart/Chart";
import { WiTime3 } from "react-icons/wi";
import { CiWallet } from "react-icons/ci";
import { LuType } from "react-icons/lu";
import { IoPricetagOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";

type Props = {
  trades: SwapEvent[];
  chartData: ChartData;
};

function getTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const diff = now - timestamp;

  // Handle future dates
  if (diff < 0) return "in the future";

  // Time intervals in seconds
  const intervals = {
    yr: 31536000,
    month: 2592000,
    d: 86400,
    hr: 3600,
    min: 60,
    s: 1,
  };

  // Find the appropriate interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const value = Math.floor(diff / secondsInUnit);
    if (value >= 1) {
      // Handle plural/singular
      const unitLabel = value === 1 ? unit : unit;
      return `${value}${unitLabel} ago`;
    }
  }

  return "just now";
}

function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

function formatNumber(value: string): string {
  const num = Number(value) / 1e18;
  return num.toExponential(4);
}

function formatTokenNumber(
  inValue: string,
  outValue: string,
  isBuy: boolean
): string {
  const value = isBuy ? Number(outValue) / 1e9 : -(Number(inValue) / 1e9);

  let maxDigits = 2;
  // Handle very small numbers
  if (Math.abs(value) < 0.000001) {
    maxDigits = 16;
    //return value.toExponential(6);
  } else {
  }

  // Handle regular numbers
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
    useGrouping: true,
  }).format(value);
}

const ChartTransactionHistory = ({ trades, chartData }: Props) => {
  return (
    <table className="w-full">
      <thead className=" bg-white/20 *:text-center *:font-semibold">
        <tr className=" w-full">
          <th className="px-[16px] py-[12px]  text-[#d1d4dc] ">
            <div className="flex items-center justify-center gap-1">
              {" "}
              <p className="xl:text-xl text-sm">TIME</p>{" "}
              {/* <WiTime3 className="xl:text-2xl text-base" /> */}
            </div>
          </th>
          <th className="px-[16px] py-[12px]  text-[#d1d4dc] sm:block hidden">
            {" "}
            <div className="flex items-center justify-center gap-1">
              <p className="xl:text-xl text-sm">Wallet</p>{" "}
              {/* <CiWallet className="xl:text-2xl text-base" /> */}
            </div>
          </th>
          <th className="px-[16px] py-[12px]  text-[#d1d4dc]">
            {" "}
            <div className="flex items-center justify-center gap-1">
              <p className="xl:text-xl text-sm">TYPE</p>{" "}
              {/* <LuType className="xl:text-2xl text-base" /> */}
            </div>
          </th>
          <th className="px-[16px] py-[12px]  text-[#d1d4dc]">
            {" "}
            <div className="flex items-center justify-center gap-1">
              <p className="xl:text-xl text-sm">PRICE</p>{" "}
              {/* <IoPricetagOutline className="xl:text-2xl text-base" /> */}
            </div>
          </th>
          <th className="px-4 py-2  text-[#d1d4dc] xl:text-xl text-sm">
            QUANTITY
          </th>
          <th className="px-4 py-2  text-[#d1d4dc]"></th>
        </tr>
      </thead>
      <tbody className="sm:text-sm text-xs">
        {trades.map((trade, i) => {
          return (
            <tr key={i}>
              <td>
                <div className="text-center py-[2px]">
                  {" "}
                  {getTimeAgo(trade.time)}
                </div>
              </td>
              <td className=" sm:block hidden">
                <div className="text-center py-[2px]">
                  {" "}
                  <a
                    href={`https://app.fuel.network/account/${trade.recipient}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#26a69a] hover:text-[#2196f3]"
                  >
                    {trade.recipient?.slice(0, 8)}...
                  </a>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="text-center py-[2px]">
                  <span>
                    {trade.is_buy ? (
                      <span className="bg-[#26a69a] p-0.5 px-1.5 rounded-sm">
                        B
                      </span>
                    ) : (
                      <span className="bg-[#ef5350] p-0.5 px-1.5 rounded-sm">
                        S
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 text-[#d1d4dc]">
                <div className="text-center py-[2px]">
                  <span>{formatNumber(trade.exchange_rate)}</span>
                  {/* {#if index < visibleData.length - 1}
                                <span class={getPriceDirectionColor(event.exchange_rate, visibleData[index + 1].exchange_rate)}>
                                    {getPriceDirection(evaent.exchange_rate, visibleData[index + 1].exchange_rate)}a
                                </span>
                            {/if} */}
                </div>
              </td>
              {trade.is_buy ? (
                <td className="px-4 py-2 text-[#d1d4dc]">
                  <div className="text-center py-[2px]">
                    {formatTokenNumber(
                      trade.asset_0_in,
                      trade.asset_0_out,
                      true
                    )}
                  </div>
                </td>
              ) : (
                <td className="px-4 py-2 text-[#d1d4dc]">
                  <div className="text-center py-[2px]">
                    {formatTokenNumber(
                      trade.asset_0_in,
                      trade.asset_0_out,
                      false
                    )}
                  </div>
                </td>
              )}
              <td className="px-4 py-2">
                <div className="text-center py-[2px]">
                  <a
                    href={`https://app.fuel.network/tx/${trade.transaction_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#26a69a] hover:text-[#2196f3]"
                  >
                    <FiExternalLink size={18} />
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ChartTransactionHistory;
