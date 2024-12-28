import React, { useState, useEffect } from "react";

const TOOLTIP_DELAY = 500;

export default function Tooltip ({ children, content, delay = TOOLTIP_DELAY }) {
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

  return (
    <div
      style={{ display: "inline-block", position: "relative" }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "-10%", // Position above the target element
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "black",
            color: "white",
            padding: "5px",
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
