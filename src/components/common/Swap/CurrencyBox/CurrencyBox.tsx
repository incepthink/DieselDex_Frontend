import { ChangeEvent, memo, useCallback } from "react";
import { clsx } from "clsx";

import Coin from "@/components/common/Coin/Coin";
import ChevronDownIcon from "@/components/icons/ChevronDown/ChevronDownIcon";
import { CurrencyBoxMode } from "@/app/swap/SwapForm";
import styles from "./CurrencyBox.module.css";
import TextButton from "@/components/common/TextButton/TextButton";
import { DefaultLocale, MinEthValueBN } from "@/utils/constants";
import { InsufficientReservesError } from "disel-dex-ts/dist/sdk/errors";
import { NoRouteFoundError } from "@/hooks/useSwapPreview";
import { B256Address, BN } from "fuels";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import { FaChevronDown } from "react-icons/fa6";

type Props = {
  value: string;
  assetId: B256Address | null;
  mode: CurrencyBoxMode;
  balance: BN;
  setAmount: (amount: string) => void;
  loading: boolean;
  onCoinSelectorClick: (mode: CurrencyBoxMode) => void;
  usdRate: number | null;
  previewError?: Error | null;
  swapPending: boolean;
};

const CurrencyBox = ({
  value,
  assetId,
  mode,
  balance,
  setAmount,
  loading,
  onCoinSelectorClick,
  usdRate,
  previewError,
  swapPending,
}: Props) => {
  const metadata = useAssetMetadata(assetId);
  const balanceValue = balance.formatUnits(metadata.decimals || 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(",", ".");
    const re = new RegExp(`^[0-9]*[.]?[0-9]{0,${metadata.decimals || 0}}$`);

    if (re.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  const handleCoinSelectorClick = () => {
    if (!loading) {
      onCoinSelectorClick(mode);
    }
  };

  const handleMaxClick = useCallback(() => {
    let amountStringToSet;
    // TODO ETH AssetId
    if (metadata.symbol === "ETH" && mode === "sell") {
      const amountWithoutGasFee = balance.sub(MinEthValueBN);
      amountStringToSet = amountWithoutGasFee.gt(0)
        ? amountWithoutGasFee.formatUnits(metadata.decimals || 0)
        : balanceValue;
    } else {
      amountStringToSet = balanceValue;
    }

    setAmount(amountStringToSet);
  }, [assetId, mode, balance, setAmount, metadata]);

  const coinNotSelected = assetId === null;

  const numericValue = parseFloat(value);
  const usdValue =
    !isNaN(numericValue) && Boolean(usdRate)
      ? (numericValue * usdRate!).toLocaleString(DefaultLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  let errorMessage = null;
  if (previewError) {
    errorMessage = "This swap is currently unavailable";
    if (previewError instanceof InsufficientReservesError) {
      errorMessage = "Insufficient reserves in pool";
    } else if (previewError instanceof NoRouteFoundError) {
      errorMessage = "No pool found for this swap";
    }
  }

  return (
    <div className={styles.currencyBox}>
      <p className="text-lg opacity-80">{mode === "buy" ? "Buy" : "Sell"}</p>
      <div className={styles.content}>
        {errorMessage ? (
          <div className={styles.warningBox}>
            <p className={styles.warningLabel}>{errorMessage}</p>
          </div>
        ) : (
          <>
            <input
              style={{ opacity: `${swapPending && "1"}` }}
              className={clsx(
                swapPending && "!opacity-1",
                loading && "opacity-0",
                styles.input
              )}
              type="text"
              inputMode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0"
              minLength={1}
              value={value}
              disabled={coinNotSelected || loading}
              onChange={handleChange}
            ></input>
            <div
              className={`absolute w-8 h-8 ${
                (!loading || swapPending) && "hidden"
              } ${mode === "sell" ? "left-4" : "left-4"}`}
            >
              <img
                src="/images/loading.gif"
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
          </>
        )}

        <button
          className={clsx(
            "!bg-white/15  !py-2 !px-3 hover:!bg-green-400/40 backdrop-blur-2xl transition-all hover:!drop-shadow-md hover:!drop-shadow-green-400/40",
            styles.selector,
            coinNotSelected && styles.selectorHighlighted
          )}
          onClick={handleCoinSelectorClick}
          disabled={loading}
        >
          {coinNotSelected ? (
            <p className={styles.chooseCoin}>Choose coin</p>
          ) : (
            <Coin assetId={assetId} />
          )}
          <FaChevronDown style={{ height: "12px", opacity: "0.5" }} />
        </button>
      </div>
      <div className={styles.estimateAndBalance}>
        <p className={styles.estimate}>{usdValue !== null && `$${usdValue}`}</p>
        {balance.gt(0) && (
          <span className={clsx("", styles.balance)}>
            Balance: {balanceValue}
            &nbsp;
            <TextButton onClick={handleMaxClick}>Max</TextButton>
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(CurrencyBox);
