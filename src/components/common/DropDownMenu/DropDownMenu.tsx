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
        <ul
          className={styles.menuList}
          style={{
            transform: `${
              windowSize.width! > 1020
                ? "translateX(-200px) translateY(20px)"
                : ""
            }`,
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
