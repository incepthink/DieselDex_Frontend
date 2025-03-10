import styles from "./AddLiquidity.module.css";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import CoinInput from "../CoinInput/CoinInput";
import { clsx } from "clsx";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import useBalances from "@/hooks/useBalances/useBalances";
import useAssetBalance from "@/hooks/useAssetBalance";
import { useConnectUI, useIsConnected } from "@fuels/react";
import usePreviewAddLiquidity from "@/hooks/usePreviewAddLiquidity";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDebounceCallback } from "usehooks-ts";
import useCheckEthBalance from "@/hooks/useCheckEthBalance/useCheckEthBalance";
import useFaucetLink from "@/hooks/useFaucetLink";
import { openNewTab } from "@/utils/common";
import useCheckActiveNetwork from "@/hooks/useCheckActiveNetwork";
import usePoolAPR from "@/hooks/usePoolAPR";
import { DefaultLocale, FuelAppUrl } from "@/utils/constants";
import Info from "@/components/common/Info/Info";
import { AddLiquidityPreviewData } from "./PreviewAddLiquidityDialog";
import { PoolId } from "disel-dex-ts";
import {
  APRTooltip,
  StablePoolTooltip,
  VolatilePoolTooltip,
} from "./addLiquidityTooltips";
import useModal from "@/hooks/useModal/useModal";
import TransactionFailureModal from "@/components/common/TransactionFailureModal/TransactionFailureModal";
import { BN, bn } from "fuels";
import usePoolsMetadata from "@/hooks/usePoolsMetadata";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import { useAssetPrice } from "@/hooks/useAssetPrice";

type Props = {
  poolId: PoolId;
  setPreviewData: Dispatch<SetStateAction<AddLiquidityPreviewData | null>>;
};

const AddLiquidityDialog = ({ poolId, setPreviewData }: Props) => {
  const [FailureModal, openFailureModal, closeFailureModal] = useModal();

  const { isConnected, isPending: isConnecting } = useIsConnected();
  const { connect } = useConnectUI();
  const { balances } = useBalances();
  console.log(balances, "balance");

  const firstAssetId = poolId[0].bits;
  const secondAssetId = poolId[1].bits;

  const firstAssetBalance = useAssetBalance(balances, firstAssetId);
  const secondAssetBalance = useAssetBalance(balances, secondAssetId);

  const [firstAmount, setFirstAmount] = useState(new BN(0));
  const [firstAmountInput, setFirstAmountInput] = useState("");
  const [secondAmount, setSecondAmount] = useState(new BN(0));
  const [secondAmountInput, setSecondAmountInput] = useState("");
  const [activeAsset, setActiveAsset] = useState<string | null>(null);
  const isStablePool = poolId[2];

  const asset0Metadata = useAssetMetadata(poolId[0].bits);
  const asset1Metadata = useAssetMetadata(poolId[1].bits);

  const isFirstToken = activeAsset === poolId[0].bits;

  const { poolsMetadata } = usePoolsMetadata([poolId]);
  const emptyPool = Boolean(
    poolsMetadata?.[0]?.reserve0.eq(0) && poolsMetadata?.[0].reserve1.eq(0)
  );

  const {
    data,
    isFetching,
    error: previewError,
  } = usePreviewAddLiquidity({
    firstAssetId,
    secondAssetId,
    amount: isFirstToken ? firstAmount : secondAmount,
    isFirstToken,
    isStablePool,
    fetchCondition: !emptyPool,
  });

  useEffect(() => {
    if (previewError) {
      openFailureModal();
    }
  }, [previewError]);

  const { apr } = usePoolAPR(poolId);
  const aprValue =
    apr !== undefined
      ? apr.toLocaleString(DefaultLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  const debouncedSetFirstAmount = useDebounceCallback(setFirstAmount, 500);
  const debouncedSetSecondAmount = useDebounceCallback(setSecondAmount, 500);

  useEffect(() => {
    if (data) {
      const anotherTokenDecimals = isFirstToken
        ? asset1Metadata.decimals
        : asset0Metadata.decimals;
      const anotherTokenValue = data[1];
      const anotherTokenValueString = data[1].formatUnits(anotherTokenDecimals);

      if (isFirstToken) {
        setSecondAmount(anotherTokenValue);
        setSecondAmountInput(anotherTokenValueString);
      } else {
        setFirstAmount(anotherTokenValue);
        setFirstAmountInput(anotherTokenValueString);
      }
    }
  }, [data]);

  const setAmount = useCallback(
    (coin: string) => {
      return (value: string) => {
        if (value === "") {
          debouncedSetFirstAmount(new BN(0));
          debouncedSetSecondAmount(new BN(0));
          setFirstAmountInput("");
          setSecondAmountInput("");
          setActiveAsset(coin);
          return;
        }

        if (coin === poolId[0].bits) {
          debouncedSetFirstAmount(
            bn.parseUnits(value, asset0Metadata.decimals)
          );
          setFirstAmountInput(value);
        } else {
          debouncedSetSecondAmount(
            bn.parseUnits(value, asset1Metadata.decimals)
          );
          setSecondAmountInput(value);
        }
        setActiveAsset(coin);
      };
    },
    [
      debouncedSetFirstAmount,
      debouncedSetSecondAmount,
      poolId,
      asset0Metadata,
      asset1Metadata,
    ]
  );

  const sufficientEthBalanceForFirstCoin = useCheckEthBalance({
    assetId: poolId[0].bits,
    amount: firstAmount.formatUnits(asset0Metadata.decimals),
  });
  const sufficientEthBalanceForSecondCoin = useCheckEthBalance({
    assetId: poolId[1].bits,
    amount: secondAmount.formatUnits(asset1Metadata.decimals),
  });
  const sufficientEthBalance =
    sufficientEthBalanceForFirstCoin && sufficientEthBalanceForSecondCoin;

  const faucetLink = useFaucetLink();
  const handleButtonClick = useCallback(() => {
    if (!sufficientEthBalance) {
      openNewTab(`${FuelAppUrl}/bridge?from=eth&to=fuel&auto_close=true&=true`);
      return;
    }

    setPreviewData({
      assets: [
        {
          amount: firstAmount,
          assetId: poolId[0].bits,
        },
        {
          amount: secondAmount,
          assetId: poolId[1].bits,
        },
      ],
      isStablePool,
    });
  }, [
    sufficientEthBalance,
    setPreviewData,
    firstAmount,
    secondAmount,
    isStablePool,
    faucetLink,
  ]);

  const isValidNetwork = useCheckActiveNetwork();

  const insufficientFirstBalance = firstAmount.gt(firstAssetBalance);
  const insufficientSecondBalance = secondAmount.gt(secondAssetBalance);
  const insufficientBalance =
    insufficientFirstBalance || insufficientSecondBalance;

  let buttonTitle = "Preview";
  if (!isValidNetwork) {
    buttonTitle = "Incorrect network";
  } else if (insufficientBalance) {
    buttonTitle = "Insufficient balance";
  } else if (!sufficientEthBalance) {
    buttonTitle = "Bridge more ETH to pay for gas";
  }

  const oneOfAmountsIsEmpty = firstAmount.eq(0) || secondAmount.eq(0);

  const buttonDisabled =
    !isValidNetwork || oneOfAmountsIsEmpty || insufficientBalance;

  const { price: asset0Price } = useAssetPrice(poolId[0].bits);
  const { price: asset1Price } = useAssetPrice(poolId[1].bits);

  return (
    <>
      <div className={styles.section}>
        <p>Selected pair</p>
        <div className={styles.sectionContent}>
          <div className={styles.coinPair}>
            <CoinPair
              firstCoin={firstAssetId}
              secondCoin={secondAssetId}
              isStablePool={isStablePool}
            />
            <div className={styles.APR}>
              Estimated APR
              <Info tooltipText={APRTooltip} tooltipKey="apr" />
              <span
                className={clsx(
                  aprValue && styles.highlight,
                  !aprValue && styles.pending
                )}
              >
                {aprValue ? `${aprValue}%` : "Awaiting data"}
              </span>
            </div>
          </div>
          <div className={styles.poolStability}>
            <div
              // style={{
              //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
              // }}
              //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
              className={clsx(
                "bg-white/10 rounded-2xl backdrop-blur-2xl ",
                styles.poolStabilityButton,
                !isStablePool && styles.poolStabilityButtonActive,
                styles.poolStabilityButtonDisabled
              )}
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

            <div
              // style={{
              //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
              // }}
              //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
              className={clsx(
                "bg-white/10 rounded-2xl backdrop-blur-2xl ",
                styles.poolStabilityButton,
                isStablePool && styles.poolStabilityButtonActive,
                styles.poolStabilityButtonDisabled
              )}
              role="button"
            >
              <div className={styles.poolStabilityButtonTitle}>
                <p>Stable pool</p>
                <Info tooltipText={StablePoolTooltip} tooltipKey="stablePool" />
              </div>
              <p>0.05% fee tier</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <p>Deposit amount</p>
        <div className={styles.sectionContent}>
          <CoinInput
            assetId={firstAssetId}
            value={firstAmountInput}
            loading={!isFirstToken && isFetching}
            setAmount={setAmount(poolId[0].bits)}
            balance={firstAssetBalance}
            usdRate={asset0Price || undefined}
          />
          <CoinInput
            assetId={secondAssetId}
            value={secondAmountInput}
            loading={isFirstToken && isFetching}
            setAmount={setAmount(poolId[1].bits)}
            balance={secondAssetBalance}
            usdRate={asset1Price || undefined}
          />
        </div>
      </div>
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
      <FailureModal title={<></>}>
        <TransactionFailureModal
          error={previewError}
          closeModal={closeFailureModal}
        />
      </FailureModal>
    </>
  );
};

export default AddLiquidityDialog;
