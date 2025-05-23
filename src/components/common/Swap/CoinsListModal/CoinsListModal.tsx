import SearchIcon from "@/components/icons/Search/SearchIcon";
import CoinListItem from "@/components/common/Swap/CoinListItem/CoinListItem";
import { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CoinsListModal.module.css";
import { BN, CoinQuantity } from "fuels";
import { useAssetList } from "@/hooks/useAssetList";
import UnknownCoinListItem from "../UnknownCoinListItem";
import clsx from "clsx";

type Props = {
  selectCoin: (assetId: string | null) => void;
  balances: CoinQuantity[] | undefined;
  verifiedAssetsOnly?: boolean;
};

const priorityOrder: string[] = ["ETH", "USDC", "USDT", "PSYCHO"];
const lowPriorityOrder: string[] = [""];

const assetIdRegex = /^0x[0-9a-fA-F]{64}$/;

const CoinsListModal = ({
  selectCoin,
  balances,
  verifiedAssetsOnly,
}: Props) => {
  const { assets } = useAssetList();
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const filteredCoinsList = useMemo(() => {
    return (assets || []).filter((coin) => {
      if (verifiedAssetsOnly && !coin.isVerified) {
        return false;
      }

      return (
        coin.name?.toLowerCase().includes(value.toLowerCase()) ||
        coin.symbol?.toLowerCase().includes(value.toLowerCase()) ||
        coin.assetId?.toLowerCase() === value.toLowerCase()
      );
    });
  }, [verifiedAssetsOnly, value, assets]);

  const sortedCoinsList = useMemo(() => {
    return filteredCoinsList.toSorted((firstAsset, secondAsset) => {
      const firstAssetPriority = priorityOrder.indexOf(firstAsset.name!);
      const secondAssetPriority = priorityOrder.indexOf(secondAsset.name!);
      const bothAssetsHavePriority =
        firstAssetPriority !== -1 && secondAssetPriority !== -1;
      const eitherAssetHasPriority =
        firstAssetPriority !== -1 || secondAssetPriority !== -1;

      if (bothAssetsHavePriority) {
        return firstAssetPriority - secondAssetPriority;
      } else if (eitherAssetHasPriority) {
        return firstAssetPriority !== -1 ? -1 : 1;
      }

      const firstAssetLowPriority = lowPriorityOrder.indexOf(firstAsset.name!);
      const secondAssetLowPriority = lowPriorityOrder.indexOf(
        secondAsset.name!
      );
      const bothAssetsHaveLowPriority =
        firstAssetLowPriority !== -1 && secondAssetLowPriority !== -1;
      const eitherAssetHasLowPriority =
        firstAssetLowPriority !== -1 || secondAssetLowPriority !== -1;

      if (bothAssetsHaveLowPriority) {
        return firstAssetLowPriority - secondAssetLowPriority;
      } else if (eitherAssetHasLowPriority) {
        return firstAssetLowPriority !== -1 ? 1 : -1;
      }

      if (balances) {
        const firstAssetBalance =
          balances.find((b) => b.assetId === firstAsset.assetId)?.amount ??
          new BN(0);
        const secondAssetBalance =
          balances.find((b) => b.assetId === secondAsset.assetId)?.amount ??
          new BN(0);
        const firstAssetDivisor = new BN(10).pow(firstAsset.decimals);
        const secondAssetDivisor = new BN(10).pow(secondAsset.decimals);
        const firstAssetBalanceMultiplied =
          firstAssetBalance.mul(secondAssetDivisor);
        const secondAssetBalanceMultiplied =
          secondAssetBalance.mul(firstAssetDivisor);

        if (!firstAssetBalanceMultiplied.eq(secondAssetBalanceMultiplied)) {
          return firstAssetBalanceMultiplied.gt(secondAssetBalanceMultiplied)
            ? -1
            : 1;
        }
      }

      if (firstAsset.name && secondAsset.name) {
        return firstAsset.name.localeCompare(secondAsset.name);
      }

      return 0;
    });
  }, [filteredCoinsList, balances]);

  return (
    <>
      <div
        className={clsx("bg-white/10 backdrop-blur-2xl", styles.tokenSearch)}
      >
        <SearchIcon />
        <input
          className={styles.tokenSearchInput}
          type="text"
          placeholder="Search by token or paste address"
          onChange={handleChange}
          ref={inputRef}
          value={value}
        />
      </div>
      <div className={styles.tokenList}>
        {assetIdRegex.test(value) && sortedCoinsList.length === 0 && (
          <UnknownCoinListItem
            assetId={value}
            balance={balances?.find((b) => b.assetId === value)}
            onClick={() => selectCoin(value)}
          />
        )}
        {sortedCoinsList.map((asset) => (
          <div
            className={styles.tokenListItem}
            onClick={() => selectCoin(asset.assetId)}
            key={asset.assetId}
          >
            <CoinListItem
              assetId={asset.assetId}
              name={asset.name}
              symbol={asset.symbol}
              decimals={asset.decimals}
              balance={balances?.find((b) => b.assetId === asset.assetId)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(CoinsListModal);
