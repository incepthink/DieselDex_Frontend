import styles from "./Loader.module.css";
import { clsx } from "clsx";

type Props = {
  variant?:
    | "primary"
    | "secondary"
    | "outlined"
    | "highlight"
    | "green"
    | "outlined-white";
};

const Loader = ({ variant }: Props) => {
  return (
    <div
      className={clsx(styles.loader, variant === "outlined" && styles.outlined)}
    />
  );
};

export default Loader;
