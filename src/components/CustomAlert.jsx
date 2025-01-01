import React, { useState, useEffect } from "react";

export default function CustomAlert() {
  // replaces the window.alert and window.confirm functions
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);

  const showAlert = (msg) => {
    setMessage(msg);
    setIsConfirm(false);
    setIsVisible(true);
  };

  const showConfirm = (msg) => {
    return new Promise((resolve) => {
      setMessage(msg);
      setIsConfirm(true);
      setIsVisible(true);
      setResolvePromise(() => resolve); // Save the resolve function
    });
  };

  const handleConfirm = (result) => {
    setIsVisible(false); // Hide the alert
    if (resolvePromise) {
      resolvePromise(result); // Resolve the Promise with the result
      setResolvePromise(null); // Clean up after resolving
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (resolvePromise) {
      resolvePromise(false); // If closing an alert, resolve with "false"
      setResolvePromise(null);
    }
  };

  useEffect(() => {
    window.alert = showAlert; // Override global alert
    window.confirm = showConfirm; // Override global confirm
  }, []);

  return (
    isVisible && (
      <div className="custom-alert-overlay">
        <div className="custom-alert-box">
          <p className="custom-alert-message">{message}</p>
          <div className="custom-alert-buttons">
            {isConfirm ? (
              <>
                <button
                  className="custom-alert-btn confirm"
                  onClick={() => handleConfirm(true)}
                >
                  Yes
                </button>
                <button
                  className="custom-alert-btn cancel"
                  onClick={() => handleConfirm(false)}
                >
                  No
                </button>
              </>
            ) : (
              <button
                className="custom-alert-btn ok"
                onClick={handleClose}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};
