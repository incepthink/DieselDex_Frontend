"use client";

import BackLink from "@/components/common/BackLink/BackLink";

import styles from "./PositionView.module.css";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import PositionLabel from "@/components/pages/liquidity-page/Positions/PositionLabel/PositionLabel";
import CoinWithAmount from "@/components/common/CoinWithAmount/CoinWithAmount";
import { clsx } from "clsx";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import useModal from "@/hooks/useModal/useModal";
import RemoveLiquidityModalContent from "@/components/pages/view-position-page/components/RemoveLiquidityModalContent/RemoveLiquidityModalContent";
import usePositionData from "@/hooks/usePositionData";
import { floorToTwoSignificantDigits } from "@/utils/common";
import { useCallback, useRef, useState } from "react";
import useRemoveLiquidity from "@/hooks/useRemoveLiquidity";
import { useRouter } from "next/navigation";
import RemoveLiquiditySuccessModal from "@/components/pages/view-position-page/components/RemoveLiquiditySuccessModal/RemoveLiquiditySuccessModal";
import IconButton from "@/components/common/IconButton/IconButton";
import { getLPAssetId, PoolId } from "disel-dex-ts";
import {
  BackendUrl,
  DEFAULT_AMM_CONTRACT_ID,
  DefaultLocale,
} from "@/utils/constants";
import useFormattedAddress from "@/hooks/useFormattedAddress/useFormattedAddress";
import LogoIcon from "@/components/icons/Logo/LogoIcon";
import useCheckActiveNetwork from "@/hooks/useCheckActiveNetwork";
import usePoolAPR from "@/hooks/usePoolAPR";
import TransactionFailureModal from "@/components/common/TransactionFailureModal/TransactionFailureModal";
import { CopyIcon } from "@/components/icons/Copy/CopyIcon";
import { bn, formatUnits } from "fuels";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

type Props = {
  pool: PoolId;
};

const formatDisplayAmount = (amount: string) => {
  const asDecimal = parseFloat(amount);
  if (asDecimal < 0.00001) {
    return "<0.00001";
  }

  return asDecimal.toLocaleString(DefaultLocale, { minimumFractionDigits: 5 });
};

const PositionView = ({ pool }: Props) => {
  const [
    RemoveLiquidityModal,
    openRemoveLiquidityModal,
    closeRemoveLiquidityModal,
  ] = useModal();
  const [SuccessModal, openSuccessModal] = useModal();
  const [FailureModal, openFailureModal, closeFailureModal] = useModal();

  const router = useRouter();
  const assetAMetadata = useAssetMetadata(pool[0].bits);
  const assetBMetadata = useAssetMetadata(pool[1].bits);

  const isStablePool = pool[2];

  const { assets, lpTokenBalance } = usePositionData({ pool });
  console.log(assets, lpTokenBalance, "Hiiiii");

  const { apr } = usePoolAPR(pool);
  const aprValue = apr
    ? `${apr.toLocaleString(DefaultLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`
    : null;

  const [removeLiquidityPercentage, setRemoveLiquidityPercentage] =
    useState(50);

  const [assetA, assetB] = assets || [
    [pool[0], bn(0)],
    [pool[1], bn(0)],
  ];

  const coinAAmount = formatUnits(assetA[1], assetAMetadata.decimals);

  const coinAAmountToWithdraw = assetA[1]
    .mul(bn(removeLiquidityPercentage))
    .div(bn(100));
  const coinAAmountToWithdrawStr = formatUnits(
    coinAAmountToWithdraw,
    assetAMetadata.decimals
  );

  const coinBAmount = formatUnits(assetB[1], assetBMetadata.decimals);

  const coinBAmountToWithdraw = assetB[1]
    .mul(bn(removeLiquidityPercentage))
    .div(bn(100));
  const coinBAmountToWithdrawStr = formatUnits(
    coinBAmountToWithdraw,
    assetBMetadata.decimals
  );

  const confirmationModalAssetsAmounts = useRef({
    firstAsset: coinAAmountToWithdrawStr,
    secondAsset: coinBAmountToWithdrawStr,
  });

  const {
    data,
    removeLiquidity,
    error: removeLiquidityError,
  } = useRemoveLiquidity({
    pool,
    liquidityPercentage: removeLiquidityPercentage,
    lpTokenBalance,
    coinAAmountToWithdraw,
    coinBAmountToWithdraw,
  });

  const handleWithdrawLiquidity = useCallback(() => {
    openRemoveLiquidityModal();
  }, [openRemoveLiquidityModal]);

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      const result = await removeLiquidity();
      if (result) {
        confirmationModalAssetsAmounts.current = {
          firstAsset: coinAAmountToWithdrawStr,
          secondAsset: coinBAmountToWithdrawStr,
        };
        closeRemoveLiquidityModal();
        openSuccessModal();
        Promise.all([
          axios.get(`${BackendUrl}/pools/`).catch((error) => {
            console.error("Background pools fetch failed:", error);
          }),
        ]).catch((error) => {
          // Handle any errors that might occur in Promise.all
          console.error("Background tasks error:", error);
        });
      }
    } catch (e) {
      console.error(e);
      closeRemoveLiquidityModal();
      openFailureModal();
    }
  }, [removeLiquidity, closeRemoveLiquidityModal, openSuccessModal]);

  const redirectToLiquidity = useCallback(() => {
    router.push("/liquidity");
  }, [router]);

  const rate = parseFloat(coinAAmount) / parseFloat(coinBAmount);
  const flooredRate =
    rate < 0.01
      ? floorToTwoSignificantDigits(rate).toLocaleString()
      : rate.toLocaleString(DefaultLocale, { minimumFractionDigits: 2 });
  const makeRateFontSmaller = flooredRate.length > 10;

  const lpTokenAssetId = getLPAssetId(DEFAULT_AMM_CONTRACT_ID, pool);
  const formattedLpTokenAssetId = useFormattedAddress(lpTokenAssetId.bits);

  const isValidNetwork = useCheckActiveNetwork();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(lpTokenAssetId.bits);
  }, [lpTokenAssetId.bits]);

  const lpTokenDisplayValue = formatUnits(lpTokenBalance || "0", 9);

  return (
    <>
      <BackLink showOnDesktop href="/liquidity" title="Back to Pool" />
      <section className={clsx(styles.contentSection, "mobileOnly")}>
        <div className={styles.coinPairAndLabel}>
          <CoinPair
            firstCoin={pool[0].bits}
            secondCoin={pool[1].bits}
            withFeeBelow
            isStablePool={isStablePool}
          />
          <PositionLabel />
        </div>
        <div className={styles.infoBlock}>
          <p>Liquidity</p>
          <p>
            APR &nbsp;
            <span className={clsx(styles.pending, !aprValue && "blurredText")}>
              {aprValue ?? "33.33%"}
            </span>
          </p>
          <div className={styles.coinsData}>
            <CoinWithAmount
              assetId={pool[0].bits}
              amount={formatDisplayAmount(coinAAmount)}
            />
            <CoinWithAmount
              assetId={pool[1].bits}
              amount={formatDisplayAmount(coinBAmount)}
            />
          </div>
        </div>
        <div
          style={{
            boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
          }}
          className={clsx(
            "bg-green-400/30 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
            styles.miraBlock
          )}
        >
          <div className={styles.miraLogo}>
            <p className="text-3xl font-semibold -mt-4 text-[#00EA82]">
              DIESEL
            </p>
          </div>
          <p className={styles.tokenDisplayValue}>
            {lpTokenDisplayValue} DSL-LP tokens
          </p>
          <p className={styles.numberAndCopy}>
            Asset ID: {formattedLpTokenAssetId}
            <IconButton onClick={handleCopy}>
              <CopyIcon />
            </IconButton>
          </p>
        </div>
        <div className={styles.priceBlocks}>
          <p>Selected Price</p>
          <div
            style={{
              boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
            }}
            className={clsx(
              "bg-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
              styles.priceBlock,
              styles.priceBlockTop
            )}
          >
            <p className={styles.priceBlockTitle}>Current Price</p>
            <p
              className={clsx(
                styles.priceBlockValue,
                makeRateFontSmaller && styles.priceBlockValueSmall
              )}
            >
              {flooredRate}
            </p>
            <p className={styles.priceBlockDescription}>
              {assetAMetadata.symbol} per {assetBMetadata.symbol}
            </p>
          </div>
          <div className={styles.bottomPriceBlocks}>
            <div
              style={{
                boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
              }}
              className={clsx(
                "bg-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
                styles.priceBlock
              )}
            >
              <p className={styles.priceBlockTitle}>Low price</p>
              <p className={styles.priceBlockValue}>0</p>
              <p className={styles.priceBlockDescription}>
                ${assetAMetadata.symbol} per {assetBMetadata.symbol}
              </p>
            </div>
            <div
              style={{
                boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
              }}
              className={clsx(
                "bg-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
                styles.priceBlock
              )}
            >
              <p className={styles.priceBlockTitle}>High Price</p>
              <p className={styles.priceBlockValue}>∞</p>
              <p className={styles.priceBlockDescription}>
                {assetAMetadata.symbol} per {assetBMetadata.symbol}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.sticky}>
          <ActionButton onClick={handleWithdrawLiquidity} fullWidth>
            Remove Liquidity
          </ActionButton>
        </div>
      </section>

      <section className={clsx(styles.contentSection, "desktopOnly")}>
        <div className={styles.positionHeading}>
          <div className={styles.coinPairAndLabel}>
            <CoinPair
              firstCoin={pool[0].bits}
              secondCoin={pool[1].bits}
              withFeeBelow
              isStablePool={isStablePool}
            />
            <PositionLabel className={styles.smallLabel} />
          </div>
          <ActionButton
            className={styles.withdrawButton}
            onClick={handleWithdrawLiquidity}
          >
            Remove Liquidity
          </ActionButton>
        </div>
        <div className={styles.topRow}>
          <div
            style={{
              boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
            }}
            className={clsx(
              "bg-green-400/30 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
              styles.miraBlock
            )}
          >
            <div className={styles.miraLogo}>
              {/* <LogoIcon /> */}
              <p className="text-3xl font-bold text-[#00EA82]">DIESEL</p>
            </div>
            <p className={styles.tokenDisplayValue}>
              {lpTokenDisplayValue} DSL-LP tokens
            </p>
            <p className={styles.numberAndCopy}>
              Asset ID: {formattedLpTokenAssetId}
              <IconButton onClick={handleCopy}>
                <CopyIcon />
              </IconButton>
            </p>
          </div>
          <div
            style={{
              boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
            }}
            className={clsx(
              "bg-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
              styles.infoBlocks
            )}
          >
            <div className={styles.infoBlock}>
              <p>Liquidity</p>
              <p>
                APR &nbsp;
                <span
                  className={clsx(styles.pending, !aprValue && "blurredText")}
                >
                  {aprValue ?? "33.33%"}
                </span>
              </p>
              <div className={styles.coinsData}>
                <CoinWithAmount
                  assetId={pool[0].bits}
                  amount={formatDisplayAmount(coinAAmount)}
                />
                <CoinWithAmount
                  assetId={pool[1].bits}
                  amount={formatDisplayAmount(coinBAmount)}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
          }}
          className={clsx(
            "bg-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
            styles.priceBlockLargeDesktop
          )}
        >
          <p className="font-bold">Selected Price</p>
          <div className={styles.priceBlocksDesktop}>
            <div className={styles.priceBlockDesktop}>
              <p className={styles.priceBlockTitle}>Low price</p>
              <p className={styles.priceBlockValue}>0</p>
              <p className={styles.priceBlockDescription}>
                {assetAMetadata.symbol} per {assetBMetadata.symbol}
              </p>
            </div>
            <div className={styles.priceBlockDesktop}>
              <p className={styles.priceBlockTitle}>Current Price</p>
              <p
                className={clsx(
                  styles.priceBlockValue,
                  makeRateFontSmaller && styles.priceBlockValueSmall
                )}
              >
                {flooredRate}
              </p>
              <p className={styles.priceBlockDescription}>
                {assetAMetadata.symbol} per {assetBMetadata.symbol}
              </p>
            </div>
            <div className={styles.priceBlockDesktop}>
              <p className={styles.priceBlockTitle}>High Price</p>
              <p className={styles.priceBlockValue}>∞</p>
              <p className={styles.priceBlockDescription}>
                {assetAMetadata.symbol} per {assetBMetadata.symbol}
              </p>
            </div>
          </div>
        </div>
      </section>
      <RemoveLiquidityModal
        title="Remove Liquidity"
        titleClassName={styles.withdrawLiquidityTitle}
      >
        <RemoveLiquidityModalContent
          coinA={pool[0].bits}
          coinB={pool[1].bits}
          isStablePool={isStablePool}
          currentCoinAValue={coinAAmount}
          currentCoinBValue={coinBAmount}
          coinAValueToWithdraw={coinAAmountToWithdrawStr}
          coinBValueToWithdraw={coinBAmountToWithdrawStr}
          closeModal={closeRemoveLiquidityModal}
          liquidityValue={removeLiquidityPercentage}
          setLiquidityValue={setRemoveLiquidityPercentage}
          handleRemoveLiquidity={handleRemoveLiquidity}
          isValidNetwork={isValidNetwork}
        />
      </RemoveLiquidityModal>
      <SuccessModal title={<></>} onClose={redirectToLiquidity}>
        <RemoveLiquiditySuccessModal
          coinA={assetAMetadata.symbol || ""}
          coinB={assetBMetadata.symbol || ""}
          firstCoinAmount={confirmationModalAssetsAmounts.current.firstAsset}
          secondCoinAmount={confirmationModalAssetsAmounts.current.secondAsset}
          transactionHash={data?.id}
        />
      </SuccessModal>
      <FailureModal title={<></>}>
        <TransactionFailureModal
          error={removeLiquidityError}
          closeModal={closeFailureModal}
        />
      </FailureModal>
    </>
  );
};

export default PositionView;
