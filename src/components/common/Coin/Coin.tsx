import styles from "./Coin.module.css";
import { clsx } from "clsx";
import ChevronDownIcon from "@/components/icons/ChevronDown/ChevronDownIcon";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import { useAssetImage } from "@/hooks/useAssetImage";

type Props = {
  assetId: string | null;
  symbol?: string;
  name?: string;
  icon?: string;
  className?: string;
  onClick?: VoidFunction;
};

const Coin = ({ assetId, symbol, name, icon, className, onClick }: Props) => {
  const metadata = useAssetMetadata(assetId);
  const fallbackIcon = useAssetImage(assetId); // ✅ dedicated icon hook
  const finalIcon = icon ?? fallbackIcon;
  const finalSymbol = symbol;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const newPool = Boolean(onClick);

  return (
    <div
      className={clsx(styles.coin, newPool && styles.clickable)}
      onClick={handleClick}
    >
      {finalIcon && (
        <img src={finalIcon} alt={`${finalSymbol || "asset"} icon`} />
      )}
      <p className={clsx(styles.name, className)}>
        {finalSymbol ?? "Choose Asset"}
      </p>
      {newPool && <ChevronDownIcon />}
    </div>
  );
};

export default Coin;
