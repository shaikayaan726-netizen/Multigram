import React from "react";

const tracks = ["Original audio", "Summer", "Night drive", "Chill", "Trending"];

export default function EditorMusic({ onSelect }) {
  return (
    <div className="music-panel">
      {tracks.map((track) => (
        <button key={track} onClick={() => onSelect?.(track)} className="music-row">
          <span>♫</span>
          <span>{track}</span>
        </button>
      ))}
    </div>
  );
}
