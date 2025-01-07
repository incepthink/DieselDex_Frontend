import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

interface ChooseTokenProps {
  show: any;
}

const Confetti: React.FC<ChooseTokenProps> = ({ show }) => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);
  console.log(show);

  return (
    show && (
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height}
        tweenDuration={1000}
      />
    )
  );
};

export default Confetti;
