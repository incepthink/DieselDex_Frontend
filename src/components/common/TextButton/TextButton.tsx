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
        "!bg-white/15 !px-1 !rounded-sm !ml-1.5 !border-[1px] hover:!bg-green-400/30 border-transparent hover:!border-[1px] hover:!border-green-400/70 backdrop-blur-2xl transition-all hover:!drop-shadow-md hover:!drop-shadow-green-400/40",
        styles.textButton
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default memo(TextButton);
