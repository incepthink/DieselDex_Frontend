import { ChartData } from "@/app/swap/page";
import { SwapEvent } from "../chart/Chart";
import { WiTime3 } from "react-icons/wi";
import { CiWallet } from "react-icons/ci";
import { LuType } from "react-icons/lu";
import { IoPricetagOutline } from "react-icons/io5";

type Props = {
  trades: SwapEvent[];
  chartData: ChartData;
};

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
              <p className="text-xl">TIME</p> <WiTime3 size={24} />
            </div>
          </th>
          <th className="px-[16px] py-[12px]  text-[#d1d4dc]">
            {" "}
            <div className="flex items-center justify-center gap-1">
              <p className="text-xl">Wallet</p> <CiWallet size={24} />
            </div>
          </th>
          <th className="px-[16px] py-[12px]  text-[#d1d4dc]">
            {" "}
            <div className="flex items-center justify-center gap-1">
              <p className="text-xl">TYPE</p> <LuType size={20} />
            </div>
          </th>
          <th className="px-[16px] py-[12px]  text-[#d1d4dc]">
            {" "}
            <div className="flex items-center justify-center gap-1">
              <p className="text-xl">PRICE</p> <IoPricetagOutline size={20} />
            </div>
          </th>
          <th className="px-4 py-2  text-[#d1d4dc]">QUANTITY</th>
          <th className="px-4 py-2  text-[#d1d4dc]">TRANSACTION</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade, i) => {
          return (
            <tr key={i}>
              <td>
                <div className="text-center py-[2px]">
                  {" "}
                  {formatTime(trade.time)}
                </div>
              </td>
              <td>
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
                  <span
                    className={
                      trade.is_buy ? "text-[#26a69a]" : "text-[#ef5350]"
                    }
                  >
                    {trade.is_buy ? "BUY" : "SELL"}
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
                    {trade.transaction_id.slice(0, 8)}...
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
