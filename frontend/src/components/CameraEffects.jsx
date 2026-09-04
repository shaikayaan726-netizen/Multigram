import React from "react";

const effects = [
  ["Normal", "none"],
  ["Warm", "sepia(.2) saturate(1.2)"],
  ["Cool", "hue-rotate(20deg) saturate(.9)"],
  ["Mono", "grayscale(1)"],
  ["Bright", "brightness(1.2)"],
];

export default function CameraEffects({ value, onChange }) {
  return (
    <div className="camera-effects-panel">
      {effects.map(([name, filter]) => (
        <button
          key={name}
          className={value === filter ? "camera-effect active" : "camera-effect"}
          onClick={() => onChange?.(filter)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
