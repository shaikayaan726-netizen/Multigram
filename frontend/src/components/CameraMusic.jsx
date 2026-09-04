import React from "react";

export default function CameraMusic({ onSelect }) {
  const tracks = ["Add audio", "Original", "Trending", "Chill"];
  return (
    <div className="camera-music-panel">
      {tracks.map((track) => (
        <button key={track} onClick={() => onSelect?.(track)}>
          ♫ {track}
        </button>
      ))}
    </div>
  );
}
