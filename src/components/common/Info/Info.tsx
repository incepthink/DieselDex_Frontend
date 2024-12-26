import { memo, MouseEvent, useEffect, useRef } from "react";

import styles from "./Info.module.css";
import InfoIcon from "@/components/icons/Info/InfoIcon";

type Props = {
  tooltipText: string;
  tooltipKey: string;
};

const Info = ({ tooltipText, tooltipKey }: Props) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const buttonRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const buttonId = `${tooltipKey}-button`;
  const tooltipId = `${tooltipKey}-tooltip`;

  useEffect(() => {
    const button = buttonRef.current;
    const tooltip = tooltipRef.current;

    if (button && tooltip) {
      button.style.setProperty("anchor-name", `--${buttonId}`);
      tooltip.style.setProperty("position-anchor", `--${buttonId}`);
    }
  }, []);

  return (
    <div
      className='group relative inline-block w-4 h-4'
      ref={buttonRef}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !buttonRef.current) return;
        const { left } = buttonRef.current.getBoundingClientRect();
        tooltipRef.current.style.left = clientX - left - 128 + "px";
      }}
    >
      <div
        className='invisible group-hover:visible opacity-0 group-hover:opacity-100 w-32 leading-tight text-left transition bg-orange-600 text-white p-1 text-xs rounded absolute bottom-full mt-2'
        id={tooltipId}
        ref={tooltipRef}
      >
        {tooltipText}
      </div>
      <InfoIcon />
    </div>
  );
};

export default memo(Info);
