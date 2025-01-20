import React, { forwardRef } from "react";
import styles from "./DropDownMenu.module.css";
import clsx from "clsx";
import useWindowSize from "@/hooks/useWindowSize";

type DropDownMenuProps = {
  buttons: {
    icon: React.FC;
    text: string;
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
  }[];
  children?: React.ReactNode;
  windowSize: { width: number | undefined; height: number | undefined };
};

const DropDownMenu = forwardRef<HTMLUListElement, DropDownMenuProps>(
  function DropDownMenu({ buttons, children, windowSize }, ref) {
    return (
      <>
        inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring
        inset-ring-white/100
        <ul
          className={clsx("bg-white/10 backdrop-blur-2xl ", styles.menuList)}
          style={{
            transform: `${
              windowSize.width! > 1020
                ? "translateY(20px) translateX(-10px)"
                : ""
            }`,
            // boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
          }}
          ref={ref}
        >
          {buttons.map((button) => (
            <li key={button.text}>
              <button
                className={clsx(
                  button.disabled
                    ? styles.menuButtonDisabled
                    : styles.menuButton
                )}
                onClick={button.onClick}
              >
                {/* <button.icon /> */}
                <span>{button.text}</span>
                {button.disabled && button.tooltip && (
                  <div className={styles.tooltip}>{button.tooltip}</div>
                )}
              </button>
            </li>
          ))}
          {children && <div>{children}</div>}
        </ul>
      </>
    );
  }
);

export default DropDownMenu;
