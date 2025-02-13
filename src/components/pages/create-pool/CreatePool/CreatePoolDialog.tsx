import styles from "./AddLiquidity.module.css";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import CoinInput from "@/components/pages/add-liquidity/CoinInput/CoinInput";
import { clsx } from "clsx";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import useBalances from "@/hooks/useBalances/useBalances";
import useAssetBalance from "@/hooks/useAssetBalance";
import { useConnectUI, useIsConnected } from "@fuels/react";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import useCheckEthBalance from "@/hooks/useCheckEthBalance/useCheckEthBalance";
import useFaucetLink from "@/hooks/useFaucetLink";
import { createPoolKey, openNewTab } from "@/utils/common";
import useCheckActiveNetwork from "@/hooks/useCheckActiveNetwork";
import Info from "@/components/common/Info/Info";
import { CreatePoolPreviewData } from "./PreviewCreatePoolDialog";
import { buildPoolId } from "disel-dex-ts";
import { StablePoolTooltip, VolatilePoolTooltip } from "./CreatePoolTooltips";
import usePoolsMetadata from "@/hooks/usePoolsMetadata";
import useModal from "@/hooks/useModal/useModal";
import CoinsListModal from "@/components/common/Swap/CoinsListModal/CoinsListModal";
import { B256Address, bn } from "fuels";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import SparkleIcon from "@/components/icons/Sparkle/SparkleIcon";
import Link from "next/link";
import useExchangeRateV2 from "@/hooks/useExchangeRate/useExchangeRateV2";
import ExchangeIcon from "@/components/icons/Exchange/ExchangeIcon";
import { FuelAppUrl } from "@/utils/constants";

type Props = {
  setPreviewData: Dispatch<SetStateAction<CreatePoolPreviewData | null>>;
};

const CreatePoolDialog = ({ setPreviewData }: Props) => {
  const [AssetsListModal, openAssetsListModal, closeAssetsListModal] =
    useModal();

  const { isConnected, isPending: isConnecting } = useIsConnected();
  const { connect } = useConnectUI();
  const { balances } = useBalances();

  const [firstAssetId, setFirstAssetId] = useState<string | null>(null);
  const [secondAssetId, setSecondAssetId] = useState<string | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const firstAssetBalanceValue = useAssetBalance(balances, firstAssetId);
  const secondAssetBalanceValue = useAssetBalance(balances, secondAssetId);

  const [firstAmount, setFirstAmount] = useState("");
  const [firstAmountInput, setFirstAmountInput] = useState("");
  const [secondAmount, setSecondAmount] = useState("");
  const [secondAmountInput, setSecondAmountInput] = useState("");
  const [isStablePool, setIsStablePool] = useState(false);

  const activeAssetForAssetSelector = useRef<string | null>(null);

  const firstAssetMetadata = useAssetMetadata(firstAssetId);
  const secondAssetMetadata = useAssetMetadata(secondAssetId);

  const pools =
    firstAssetId && secondAssetId
      ? [buildPoolId(firstAssetId, secondAssetId, isStablePool)]
      : undefined;
  const { poolsMetadata } = usePoolsMetadata(pools);
  const poolExists = Boolean(poolsMetadata && poolsMetadata?.[0]);
  let existingPoolKey = "";
  if (poolExists) {
    existingPoolKey = createPoolKey(
      (poolsMetadata?.[0]?.poolId ?? poolsMetadata?.[1]?.poolId)!
    );
  }

  const debouncedSetFirstAmount = useDebounceCallback(setFirstAmount, 500);
  const debouncedSetSecondAmount = useDebounceCallback(setSecondAmount, 500);

  const handleStabilityChange = (isStable: boolean) =>
    setIsStablePool(isStable);

  const setAmount = useCallback(
    (coin: B256Address | null) => {
      if (!coin) {
        return () => void 0;
      }

      return (value: string) => {
        if (coin === firstAssetId) {
          debouncedSetFirstAmount(value);
          setFirstAmountInput(value);
        } else {
          debouncedSetSecondAmount(value);
          setSecondAmountInput(value);
        }
      };
    },
    [debouncedSetFirstAmount, debouncedSetSecondAmount, firstAssetId]
  );

  const sufficientEthBalanceForFirstCoin = useCheckEthBalance({
    assetId: firstAssetId,
    amount: firstAmount,
  });
  const sufficientEthBalanceForSecondCoin = useCheckEthBalance({
    assetId: secondAssetId,
    amount: secondAmount,
  });
  const sufficientEthBalance =
    sufficientEthBalanceForFirstCoin && sufficientEthBalanceForSecondCoin;
  const handleButtonClick = useCallback(() => {
    if (!sufficientEthBalance) {
      openNewTab(`${FuelAppUrl}/bridge?from=eth&to=fuel&auto_close=true&=true`);
      return;
    }

    setPreviewData(
      firstAssetId && secondAssetId
        ? {
            assets: [
              {
                assetId: firstAssetId,
                amount: firstAmount,
              },
              {
                assetId: secondAssetId,
                amount: secondAmount,
              },
            ],
            isStablePool,
          }
        : null
    );
  }, [
    sufficientEthBalance,
    setPreviewData,
    firstAssetId,
    firstAmount,
    secondAssetId,
    secondAmount,
    isStablePool,
  ]);

  const isValidNetwork = useCheckActiveNetwork();

  const insufficientFirstBalance = bn
    .parseUnits(firstAmount, firstAssetMetadata.decimals)
    .gt(firstAssetBalanceValue);
  const insufficientSecondBalance = bn
    .parseUnits(secondAmount, secondAssetMetadata.decimals)
    .gt(secondAssetBalanceValue);
  const insufficientBalance =
    insufficientFirstBalance || insufficientSecondBalance;
  const oneOfAssetsIsNotSelected =
    firstAssetId === null || secondAssetId === null;
  const oneOfAmountsIsEmpty =
    !firstAmount ||
    !secondAmount ||
    firstAmount === "0" ||
    secondAmount === "0";

  let buttonTitle = "Preview creation";
  if (!isValidNetwork) {
    buttonTitle = "Incorrect network";
  } else if (oneOfAssetsIsNotSelected) {
    buttonTitle = "Choose assets";
  } else if (insufficientBalance) {
    buttonTitle = "Insufficient balance";
  } else if (oneOfAmountsIsEmpty) {
    buttonTitle = "Enter asset amounts";
  } else if (!sufficientEthBalance) {
    buttonTitle = "Bridge more ETH to pay for gas";
  }
  const buttonDisabled =
    !isValidNetwork ||
    poolExists ||
    oneOfAssetsIsNotSelected ||
    oneOfAmountsIsEmpty ||
    insufficientBalance;

  const handleAssetClick = useCallback(
    (assetId: string | null) => {
      return () => {
        openAssetsListModal();
        activeAssetForAssetSelector.current = assetId;
      };
    },
    [openAssetsListModal]
  );

  const handleAssetSelection = useCallback(
    (selectedAssetId: B256Address | null) => {
      if (activeAssetForAssetSelector.current === firstAssetId) {
        if (selectedAssetId === secondAssetId) {
          setSecondAssetId(firstAssetId);
        }
        setFirstAssetId(selectedAssetId);
      } else {
        if (selectedAssetId === firstAssetId) {
          setFirstAssetId(secondAssetId);
        }
        setSecondAssetId(selectedAssetId);
      }

      closeAssetsListModal();
    },
    [firstAssetId, secondAssetId, closeAssetsListModal]
  );

  const firstAssetPrice = useAssetPrice(firstAssetId);
  const secondAssetPrice = useAssetPrice(secondAssetId);

  const exchangeRate = useExchangeRateV2({
    firstAssetId,
    secondAssetId,
    firstAssetAmount: firstAmount,
    secondAssetAmount: secondAmount,
    baseAssetId: activeAssetId,
  });

  const handleExchangeRateSwap = () => {
    setActiveAssetId((prevActiveAssetId) =>
      prevActiveAssetId === firstAssetId ? secondAssetId : firstAssetId
    );
  };

  return (
    <>
      <div className={styles.section}>
        <p>Selected pair</p>
        <div className={styles.sectionContent}>
          <div className={styles.coinPair}>
            {!oneOfAssetsIsNotSelected && (
              <CoinPair
                firstCoin={firstAssetId}
                secondCoin={secondAssetId}
                isStablePool={isStablePool}
              />
            )}
          </div>
          <div className={styles.poolStability}>
            <div
              // style={{
              //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
              // }}
              //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
              className={clsx(
                "bg-white/10 text-white backdrop-blur-2xl ",
                styles.poolStabilityButton,
                !isStablePool && styles.poolStabilityButtonActive
              )}
              onClick={() => handleStabilityChange(false)}
              role="button"
            >
              <div className={styles.poolStabilityButtonTitle}>
                <p>Volatile pool</p>
                <Info
                  tooltipText={VolatilePoolTooltip}
                  tooltipKey="volatilePool"
                />
              </div>
              <p>0.30% fee tier</p>
            </div>
            <button
              // style={{
              //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
              // }}
              //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
              className={clsx(
                "bg-white/10 text-white backdrop-blur-2xl ",
                styles.poolStabilityButton,
                isStablePool && styles.poolStabilityButtonActive
              )}
              onClick={() => handleStabilityChange(true)}
              role="button"
            >
              <div className={styles.poolStabilityButtonTitle}>
                <p>Stable pool</p>
                <Info tooltipText={StablePoolTooltip} tooltipKey="stablePool" />
              </div>
              <p>0.05% fee tier</p>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <p>Deposit amount</p>
        <div className={styles.sectionContent}>
          <CoinInput
            assetId={firstAssetId}
            value={firstAmountInput}
            loading={poolExists}
            setAmount={setAmount(firstAssetId)}
            balance={firstAssetBalanceValue}
            usdRate={firstAssetPrice.price ?? undefined}
            onAssetClick={handleAssetClick(firstAssetId)}
          />
          <CoinInput
            assetId={secondAssetId}
            value={secondAmountInput}
            loading={poolExists}
            setAmount={setAmount(secondAssetId)}
            balance={secondAssetBalanceValue}
            usdRate={secondAssetPrice.price ?? undefined}
            onAssetClick={handleAssetClick(secondAssetId)}
          />
        </div>
      </div>
      {poolExists && (
        <div className={styles.existingPoolBlock}>
          <div className={styles.sparkleIcon}>
            <SparkleIcon />
          </div>
          <p className={styles.existingPoolText}>This pool already exists</p>
          <Link
            href={`/liquidity/add/?pool=${existingPoolKey}`}
            className={styles.addLiquidityLink}
          >
            Add liquidity →
          </Link>
        </div>
      )}
      {!poolExists && !oneOfAssetsIsNotSelected && !oneOfAmountsIsEmpty && (
        <div className={styles.section}>
          <p>Starting price</p>
          <div className={styles.priceBlock} onClick={handleExchangeRateSwap}>
            <p>{exchangeRate}</p>
            <ExchangeIcon />
          </div>
          <p className={styles.priceWarning}>
            This is the price of the pool on inception. Always double check
            before deploying a pool.
          </p>
        </div>
      )}
      {!isConnected ? (
        <ActionButton variant="green" onClick={connect} loading={isConnecting}>
          Connect Wallet
        </ActionButton>
      ) : (
        <ActionButton
          disabled={buttonDisabled}
          onClick={handleButtonClick}
          variant="green"
        >
          {buttonTitle}
        </ActionButton>
      )}
      <AssetsListModal title="Choose token">
        <CoinsListModal selectCoin={handleAssetSelection} balances={balances} />
      </AssetsListModal>
    </>
  );
};

export default CreatePoolDialog;
