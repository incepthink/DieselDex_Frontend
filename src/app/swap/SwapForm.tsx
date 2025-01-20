import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAssetImage } from "@/hooks/useAssetImage";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import { PoolId } from "disel-dex-ts";
import useInitialSwapState from "@/hooks/useInitialSwapState/useInitialSwapState";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";
import { useConnectUI, useIsConnected } from "@fuels/react";
import useBalances from "@/hooks/useBalances/useBalances";
import useCheckActiveNetwork from "@/hooks/useCheckActiveNetwork";
import { B256Address, bn, BN } from "fuels";
import useSwapPreview from "@/hooks/useSwapPreview";
import useModal from "@/hooks/useModal/useModal";
import useSwap from "@/hooks/useSwap/useSwap";
import useCheckEthBalance from "@/hooks/useCheckEthBalance/useCheckEthBalance";
import { createPoolKey, openNewTab } from "@/utils/common";
import { BackendUrl, FuelAppUrl } from "@/utils/constants";
import useExchangeRate from "@/hooks/useExchangeRate/useExchangeRate";
import useReservesPrice from "@/hooks/useReservesPrice";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import IconButton from "@/components/common/IconButton/IconButton";
import SettingsIcon from "@/components/icons/Settings/SettingsIcon";
import SettingsModalContent from "@/components/common/Swap/SettingsModalContent/SettingsModalContent";
import CurrencyBox from "@/components/common/Swap/CurrencyBox/CurrencyBox";
import ConvertIcon from "@/components/icons/Convert/ConvertIcon";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import CoinsListModal from "@/components/common/Swap/CoinsListModal/CoinsListModal";
import SwapSuccessModal from "@/components/common/Swap/SwapSuccessModal/SwapSuccessModal";
import SwapFailureModal from "@/components/common/Swap/SwapFailureModal/SwapFailureModal";
import PriceImpact from "@/components/common/Swap/PriceImpact/PriceImpact";
import ExchangeRate from "@/components/common/Swap/ExchangeRate/ExchangeRate";
import axios from "axios";
import { IoSwapVertical } from "react-icons/io5";

export type CurrencyBoxMode = "buy" | "sell";
export type CurrencyBoxState = {
  assetId: string | null;
  amount: string;
};
type InputState = {
  amount: string;
};

export type SwapState = Record<CurrencyBoxMode, CurrencyBoxState>;
type InputsState = Record<CurrencyBoxMode, InputState>;

const initialInputsState: InputsState = {
  sell: {
    amount: "",
  },
  buy: {
    amount: "",
  },
};

export type SlippageMode = "auto" | "custom";

export const DefaultSlippageValue = 100;

function SwapRouteItem({ pool }: { pool: PoolId }) {
  const firstAssetIcon = useAssetImage(pool[0].bits);
  const secondAssetIcon = useAssetImage(pool[1].bits);

  const firstAssetMetadata = useAssetMetadata(pool[0].bits);
  const secondAssetMetadata = useAssetMetadata(pool[1].bits);

  const isStablePool = pool[2];
  const poolFeePercent = isStablePool ? 0.05 : 0.3;

  return (
    <>
      <img
        className="w-6 h-6 -mr-2"
        src={firstAssetIcon || ""}
        alt={firstAssetMetadata.symbol}
      />
      <img
        className="w-6 h-6 mr-2"
        src={secondAssetIcon || ""}
        alt={secondAssetMetadata.symbol}
      />
      <p>({poolFeePercent}%)</p>
    </>
  );
}

const SwapForm: React.FC = () => {
  // const { openModal, closeModal } = useModal();

  const [SettingsModal, openSettingsModal, closeSettingsModal] = useModal();
  const [CoinsModal, openCoinsModal, closeCoinsModal] = useModal();
  const [SuccessModal, openSuccess] = useModal();
  const [FailureModal, openFailure, closeFailureModal] = useModal();

  const initialSwapState = useInitialSwapState();

  const [swapState, setSwapState] = useState<SwapState>(initialSwapState);
  const [inputsState, setInputsState] =
    useState<InputsState>(initialInputsState);
  const [activeMode, setActiveMode] = useState<CurrencyBoxMode>("sell");
  const [slippage, setSlippage] = useState<number>(DefaultSlippageValue);
  const [txCost, setTxCost] = useState<number | null>(null);
  const [slippageMode, setSlippageMode] = useState<SlippageMode>("auto");

  const [swapCoins, setSwapCoins] = useLocalStorage("swapCoins", {
    sell: initialSwapState.sell.assetId,
    buy: initialSwapState.buy.assetId,
  });

  // const [sellToken, setSellToken] = useState<Token>(tokens[0]);
  // const [buyToken, setBuyToken] = useState<Token>(tokens[1]);
  // const [sellAmount, setSellAmount] = useState<string>("0");
  // const [buyAmount, setBuyAmount] = useState<string>("0");
  // const [selectedFor, setSelectedFor] = useState<"sell" | "buy" | null>(null);

  const sellMetadata = useAssetMetadata(swapState.sell.assetId);
  const buyMetadata = useAssetMetadata(swapState.buy.assetId);

  const previousPreviewValue = useRef("");
  const swapStateForPreview = useRef(swapState);
  const modeForCoinSelector = useRef<CurrencyBoxMode>("sell");

  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnectUI();
  const { balances, balancesPending, refetchBalances } = useBalances();

  const isValidNetwork = useCheckActiveNetwork();

  useEffect(() => {
    if (!isConnected) {
      setSwapState(initialSwapState);
      setInputsState(initialInputsState);
      // setActiveMode("sell");
      // setSlippage(DefaultSlippageValue);
      // setSlippageMode("auto");
      // setTxCost(null);
      previousPreviewValue.current = "";
    }
  }, [isConnected]);

  const sellBalance = balances?.find(
    (b) => b.assetId === swapState.sell.assetId
  )?.amount;
  const sellBalanceValue = sellBalance ?? new BN(0);
  const buyBalance = balances?.find(
    (b) => b.assetId === swapState.buy.assetId
  )?.amount;
  const buyBalanceValue = buyBalance ?? new BN(0);

  const { previewData, previewLoading, previewError, refetchPreview } =
    useSwapPreview({
      swapState,
      mode: activeMode,
    });

  const anotherMode = activeMode === "sell" ? "buy" : "sell";

  const decimals =
    anotherMode === "sell" ? sellMetadata.decimals : buyMetadata.decimals;

  const previewValueString =
    previewData !== null
      ? previewData.previewAmount.eq(0)
        ? ""
        : previewData.previewAmount.formatUnits(decimals || 0)
      : previousPreviewValue.current;
  previousPreviewValue.current = previewValueString;

  useEffect(() => {
    if (previewValueString !== swapState[anotherMode].amount) {
      setSwapState((prevState) => ({
        ...prevState,
        [anotherMode]: {
          ...prevState[anotherMode],
          amount: previewValueString,
        },
      }));
    }
  }, [previewData, previewValueString]);

  useEffect(() => {
    if (previewValueString !== inputsState[anotherMode].amount) {
      setInputsState((prevState) => ({
        ...prevState,
        [anotherMode]: {
          amount: previewValueString,
        },
      }));
    }
  }, [previewData, previewValueString]);

  const sellValue = inputsState.sell.amount;
  const buyValue = inputsState.buy.amount;

  const swapAssets = useCallback(() => {
    setSwapState((prevState) => ({
      buy: {
        ...prevState.sell,
      },
      sell: {
        ...prevState.buy,
      },
    }));

    setActiveMode("sell");

    setInputsState((prevState) => ({
      buy: {
        ...prevState.sell,
      },
      sell: {
        ...prevState.buy,
      },
    }));

    setSwapCoins((prevState) => ({
      buy: prevState.sell,
      sell: prevState.buy,
    }));
  }, [setSwapCoins]);

  const selectCoin = useCallback(
    (mode: "buy" | "sell") => {
      return (assetId: B256Address | null) => {
        if (
          (mode === "buy" && swapState.sell.assetId === assetId) ||
          (mode === "sell" && swapState.buy.assetId === assetId)
        ) {
          swapAssets();
        } else {
          const amount = inputsState[mode].amount;
          setSwapState((prevState) => ({
            ...prevState,
            [mode]: {
              amount,
              assetId,
            },
          }));
          setInputsState((prevState) => ({
            ...prevState,
            [mode]: {
              amount,
            },
          }));
        }

        setSwapCoins((prevState) => ({
          ...prevState,
          [mode]: assetId,
        }));

        setActiveMode(mode);
      };
    },
    [
      inputsState,
      setSwapCoins,
      swapAssets,
      swapState.buy.assetId,
      swapState.sell.assetId,
    ]
  );

  const debouncedSetState = useDebounceCallback(setSwapState, 500);

  const setAmount = useCallback(
    (mode: "buy" | "sell") => {
      return (amount: string) => {
        if (amount === "") {
          debouncedSetState((prevState) => ({
            sell: {
              assetId: prevState.sell.assetId,
              amount: "",
            },
            buy: {
              assetId: prevState.buy.assetId,
              amount: "",
            },
          }));

          setInputsState({
            sell: {
              amount: "",
            },
            buy: {
              amount: "",
            },
          });

          previousPreviewValue.current = "";
          setActiveMode(mode);

          return;
        }

        debouncedSetState((prevState) => ({
          ...prevState,
          [mode]: {
            ...prevState[mode],
            amount,
          },
        }));
        setInputsState((prevState) => ({
          ...prevState,
          [mode]: {
            amount,
          },
        }));
        setActiveMode(mode);
      };
    },
    [debouncedSetState]
  );

  const handleCoinSelectorClick = useCallback(
    (mode: CurrencyBoxMode) => {
      openCoinsModal();
      modeForCoinSelector.current = mode;
    },
    [openCoinsModal]
  );

  const handleCoinSelection = (assetId: string | null) => {
    selectCoin(modeForCoinSelector.current)(assetId);
    closeCoinsModal();
  };

  const {
    fetchTxCost,
    txCostPending,
    txCostError,
    resetTxCost,
    triggerSwap,
    swapPending,
    swapResult,
    swapError,
    resetSwap,
  } = useSwap({
    swapState,
    mode: activeMode,
    slippage,
    pools: previewData?.pools,
  });

  const resetSwapErrors = useCallback(async () => {
    await refetchPreview();
    resetTxCost();
    resetSwap();
  }, [refetchPreview, resetSwap, resetTxCost]);

  const coinMissing =
    swapState.buy.assetId === null || swapState.sell.assetId === null;
  const amountMissing =
    swapState.buy.amount === "" || swapState.sell.amount === "";
  const sufficientEthBalance = useCheckEthBalance(swapState.sell);

  const handleSwapClick = useCallback(async () => {
    if (!sufficientEthBalance) {
      openNewTab(`${FuelAppUrl}/bridge?from=eth&to=fuel&auto_close=true&=true`);
      return;
    }

    if (amountMissing || swapPending) {
      return;
    }

    swapStateForPreview.current = swapState;
    try {
      const txCostData = await fetchTxCost();

      if (txCostData?.txCost.gasPrice) {
        setTxCost(txCostData.txCost.gasPrice.toNumber() / 10 ** 9);
      }

      if (txCostData?.tx) {
        const swapResult = await triggerSwap(txCostData.tx);
        if (swapResult) {
          openSuccess();
          await refetchBalances();

          // Execute background tasks without awaiting them
          Promise.all([
            axios.get(`${BackendUrl}/pools/`).catch((error) => {
              console.error("Background pools fetch failed:", error);
            }),
            // Add your Telegram bot notification here
            axios
              .post(`${BackendUrl}/bot/message`, { id: swapResult.id })
              .then((res) => {
                console.log(res);
              })
              .catch((error) => {
                console.error("Telegram notification failed:", error);
              }),
          ]).catch((error) => {
            // Handle any errors that might occur in Promise.all
            console.error("Background tasks error:", error);
          });
        }
      }
    } catch (e) {
      console.error(e);
      if (
        e instanceof Error &&
        !e.message.includes("User canceled sending transaction")
      ) {
        openFailure();
      }
    }
  }, [
    sufficientEthBalance,
    amountMissing,
    swapPending,
    swapState,
    fetchTxCost,
    triggerSwap,
    openSuccess,
    openFailure,
    refetchBalances,
  ]);

  let showInsufficientBalance = true;

  try {
    const insufficientSellBalance = sellBalanceValue.lt(
      bn.parseUnits(sellValue, sellMetadata.decimals || 0)
    );
    showInsufficientBalance = insufficientSellBalance && sufficientEthBalance;
  } catch (e) {
    console.log(e);
  }

  let swapButtonTitle = "Swap";
  if (!isValidNetwork) {
    swapButtonTitle = "Incorrect network";
  } else if (swapPending) {
    swapButtonTitle = "Waiting for approval in wallet";
  } else if (!sufficientEthBalance) {
    swapButtonTitle = "Bridge more ETH to pay for gas";
  } else if (showInsufficientBalance) {
    swapButtonTitle = "Insufficient balance";
  }

  const swapDisabled =
    !isValidNetwork ||
    coinMissing ||
    showInsufficientBalance ||
    Boolean(previewError) ||
    !sellValue ||
    !buyValue;

  const exchangeRate = useExchangeRate(swapState);

  const feePercent =
    previewData?.pools.reduce((percent, pool) => {
      const isStablePool = pool[2];
      const poolPercent = isStablePool ? 0.05 : 0.3;

      return percent + poolPercent;
    }, 0) ?? 0;

  const feeValue = ((feePercent / 100) * parseFloat(sellValue)).toFixed(
    sellMetadata.decimals || 0
  );

  const inputPreviewLoading = previewLoading && activeMode === "buy";
  const outputPreviewLoading = previewLoading && activeMode === "sell";

  const { reservesPrice } = useReservesPrice({
    pools: previewData?.pools,
    sellAssetId: swapState.sell.assetId,
    buyAssetId: swapState.buy.assetId,
  });

  const previewPrice = useMemo(() => {
    const sellNumericValue = parseFloat(swapState.sell.amount);
    const buyNumericValue = parseFloat(swapState.buy.amount);

    if (!isNaN(sellNumericValue) && !isNaN(buyNumericValue)) {
      return buyNumericValue / sellNumericValue;
    }

    return;
  }, [swapState.buy.amount, swapState.sell.amount]);

  const sellAssetPrice = useAssetPrice(swapState.sell.assetId);
  const buyAssetPrice = useAssetPrice(swapState.buy.assetId);

  // old
  // const [isWalletConnect, setIsWalletConnect] = useState<boolean>(true);
  // console.log(setIsWalletConnect);

  // const handleTokenSelect = (selectedToken: Token) => {
  //   if (selectedFor === "sell" && sellToken.value !== selectedToken.value) {
  //     setSellToken(selectedToken);
  //   } else if (
  //     selectedFor === "buy" &&
  //     buyToken.value !== selectedToken.value
  //   ) {
  //     setBuyToken(selectedToken);
  //   }
  //   closeModal();
  //   setSelectedFor(null);
  // };

  return (
    <>
      <div className="border border-black border-opacity-0 w-full p-4 lg:p-6 rounded-md h-full text-white">
        <div className="flex items-center justify-between">
          <p className="text-xl lg:text-xl font-semibold ">Swap</p>
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded-lgf px-4 py-2">
              <p className="text-sm font-medium text-white text-opacity-60">
                {slippage / 100}% slippage
              </p>
            </div>
            <IconButton onClick={openSettingsModal}>
              <SettingsIcon />
            </IconButton>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="rounded-xl p-1 lg:p-1 bg-black backdrop-blur-2xl">
            <CurrencyBox
              value={sellValue}
              assetId={swapState.sell.assetId}
              mode="sell"
              balance={sellBalanceValue}
              setAmount={setAmount("sell")}
              loading={inputPreviewLoading || swapPending}
              onCoinSelectorClick={handleCoinSelectorClick}
              usdRate={sellAssetPrice.price}
              previewError={
                activeMode === "buy" && !inputPreviewLoading
                  ? previewError
                  : null
              }
            />
          </div>

          <div className="flex justify-center items-center gap-4">
            <div className="h-[1px] w-full bg-[#E5E9EB]" />
            <div className="p-2 rounded-full bg-[#00EA82] text-xl text-black cursor-pointer">
              <IconButton onClick={swapAssets}>
                {/* // change icon */}
                <IoSwapVertical />
              </IconButton>
            </div>
            <div className="h-[1px] w-full bg-[#E5E9EB]" />
          </div>

          <div className="rounded-lg p-1 lg:p-1 bg-black">
            <CurrencyBox
              value={buyValue}
              assetId={swapState.buy.assetId}
              mode="buy"
              balance={buyBalanceValue}
              setAmount={setAmount("buy")}
              loading={outputPreviewLoading || swapPending}
              onCoinSelectorClick={handleCoinSelectorClick}
              usdRate={buyAssetPrice.price}
              previewError={
                activeMode === "sell" && !outputPreviewLoading
                  ? previewError
                  : null
              }
            />
          </div>

          {swapPending && (
            <div className="flex flex-col w-full gap-1 text-[#757575] text-sm lg:text-base">
              <div className="flex justify-between items-center gap-4">
                <p className="font-medium">Rate</p>
                <p className="font-semibold">{exchangeRate}</p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-medium">Order Routing</p>
                <div className="">
                  {previewData?.pools.map((pool, index) => {
                    const poolKey = createPoolKey(pool);

                    return (
                      <div
                        className="font-semibold flex justify-center items-center mb-1"
                        key={poolKey}
                      >
                        <SwapRouteItem pool={pool} />
                        {index !== previewData.pools.length - 1 && "+"}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-medium">Estimated Fees</p>
                <p className="font-semibold">
                  {feeValue} {sellMetadata.symbol}
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-medium">Network Cost</p>
                <p className="font-semibold">{txCost?.toFixed(9)} ETH</p>
              </div>
            </div>
          )}

          {!isConnected && (
            <div className="w-96 flex justify-center">
              <ActionButton
                variant="green"
                onClick={connect}
                loading={isConnecting}
              >
                Connect Wallet
              </ActionButton>
            </div>
          )}

          {isConnected && (
            <div className="sm:w-96 flex justify-center">
              <ActionButton
                variant="green"
                disabled={swapDisabled}
                onClick={handleSwapClick}
                loading={balancesPending || txCostPending}
              >
                {swapButtonTitle}
              </ActionButton>
            </div>
          )}
        </div>

        <div className="pb-2 pt-3">
          <PriceImpact
            reservesPrice={reservesPrice}
            previewPrice={previewPrice}
          />
          <ExchangeRate swapState={swapState} />
        </div>

        {/* {selectedFor && (
          <ChooseToken tokens={tokens} onSelect={handleTokenSelect} />
        )} */}
      </div>
      {/* {swapPending && <div className={styles.loadingOverlay}/>} */}
      <SettingsModal title="Settings">
        <SettingsModalContent
          slippage={slippage}
          slippageMode={slippageMode}
          setSlippage={setSlippage}
          setSlippageMode={setSlippageMode}
          closeModal={closeSettingsModal}
        />
      </SettingsModal>
      <CoinsModal title="Choose token">
        <CoinsListModal selectCoin={handleCoinSelection} balances={balances} />
      </CoinsModal>
      <SuccessModal title={<></>}>
        <SwapSuccessModal
          swapState={swapStateForPreview.current}
          transactionHash={swapResult?.id}
        />
      </SuccessModal>
      <FailureModal title={<></>} onClose={resetSwapErrors}>
        <SwapFailureModal
          error={txCostError || swapError}
          closeModal={closeFailureModal}
        />
      </FailureModal>
    </>
  );
};

export default SwapForm;
