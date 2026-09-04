import React, { useState } from "react";

export default function EditorText({ onAdd }) {
  const [text, setText] = useState("");

  function addText() {
    const value = text.trim();
    if (!value) return;
    onAdd?.(value);
    setText("");
  }

  return (
    <div className="editor-tool-panel">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something..."
        className="editor-tool-input"
      />
      <button onClick={addText} className="editor-tool-button">Add text</button>
    </div>
  );
}
