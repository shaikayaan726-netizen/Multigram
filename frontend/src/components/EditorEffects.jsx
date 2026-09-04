import React from "react";

const effects = [
  { name: "Normal", filter: "none" },
  { name: "Warm", filter: "sepia(.25) saturate(1.25)" },
  { name: "Cool", filter: "saturate(.8) hue-rotate(15deg)" },
  { name: "B&W", filter: "grayscale(1)" },
  { name: "Bright", filter: "brightness(1.18) contrast(1.05)" },
];

export default function EditorEffects({ onSelect }) {
  return (
    <div className="effect-panel">
      {effects.map((effect) => (
        <button
          key={effect.name}
          className="effect-button"
          onClick={() => onSelect?.(effect.filter)}
        >
          {effect.name}
        </button>
      ))}
    </div>
  );
}
