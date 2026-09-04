import React from "react";

const stickers = ["❤️", "🔥", "😂", "😍", "✨", "🎉", "😎", "💯"];

export default function EditorStickers({ onAdd }) {
  return (
    <div className="sticker-panel">
      {stickers.map((sticker) => (
        <button key={sticker} onClick={() => onAdd?.(sticker)} className="sticker-button">
          {sticker}
        </button>
      ))}
    </div>
  );
}
