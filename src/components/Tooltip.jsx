import React, { useState, useEffect } from "react";

const TOOLTIP_DELAY = 500;

export default function Tooltip ({ 
    children, content, delay = TOOLTIP_DELAY, position 
  }) {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState(null);

  const showTooltip = () => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    setTimer(timeout);
  };

  const hideTooltip = () => {
    clearTimeout(timer); // Clear the timer if the user leaves early
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, [timer]);

  // Set the position of the tooltip based on the position prop
  let pBottom, pLeft, pMargin;

  switch (position) {
    case "top":
      pBottom = "100%";
      pLeft = "50%";
      pMargin = "0px 0px 4px 0px";
      break;
    case "right":
      pBottom = "0%";
      pLeft = "100%";
      pMargin = "0px 0px 0px 4px";
      break;
    case "bottom":
      pBottom = "-10%";
      pLeft = "50%";
      pMargin = "4px 0px 0px 0px";
      break;
    case "left":
      pBottom = "0%";
      pLeft = "-100%";
      pMargin = "0px 4px 0px 0px";
      break;
    case "center":
      pBottom = "50%";
      pLeft = "50%";
      pMargin = 0;
      break;
    default:
      // Default to bottom
      pBottom = "-10%";
      pLeft = "50%";
      pMargin = "4px 0px 0px 0px";

  }

  return (
    <div
      style={{ display: "inline-block", position: "relative", alignContent: "center" }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: pBottom, // Position above the target element
            left: pLeft,
            backgroundColor: "black",
            color: "white",
            padding: "5px",
            margin: pMargin,
            borderRadius: "4px",
            whiteSpace: "nowrap",
            zIndex: 1000,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
