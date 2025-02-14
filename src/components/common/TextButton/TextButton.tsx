import { memo, ReactNode } from "react";

import styles from "./TextButton.module.css";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  onClick: VoidFunction;
};

const TextButton = ({ children, onClick }: Props) => {
  return (
    <button
      className={clsx(
        "!bg-white/15 !px-1 !rounded-sm !ml-1.5 hover:bg-white/20",
        styles.textButton
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default memo(TextButton);
