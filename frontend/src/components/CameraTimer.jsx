import React from "react";

export default function CameraTimer({ value, onChange }) {
  return (
    <div className="camera-timer-panel">
      {[0, 3, 5, 10, 15].map((seconds) => (
        <button
          key={seconds}
          className={value === seconds ? "timer-option active" : "timer-option"}
          onClick={() => onChange?.(seconds)}
        >
          {seconds === 0 ? "Off" : `${seconds}s`}
        </button>
      ))}
    </div>
  );
}
