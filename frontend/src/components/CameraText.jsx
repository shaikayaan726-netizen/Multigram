import React, { useState } from "react";

export default function CameraText({ onAdd }) {
  const [text, setText] = useState("");

  return (
    <div className="camera-text-panel">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add text"
      />
      <button
        onClick={() => {
          if (text.trim()) onAdd?.(text.trim());
          setText("");
        }}
      >
        Add
      </button>
    </div>
  );
}
