import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";

export default function EditorDraw({ onClose }) {

  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(5);


  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const parent = canvas.parentElement;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

  }, []);


  function getPoint(event) {

    const canvas = canvasRef.current;

    const rect = canvas.getBoundingClientRect();

    const source =
      event.touches?.[0] || event;

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top
    };

  }


  function startDrawing(event) {

    event.preventDefault();

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const point = getPoint(event);

    ctx.beginPath();

    ctx.moveTo(
      point.x,
      point.y
    );

    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    setDrawing(true);

  }


  function draw(event) {

    if (!drawing) return;

    event.preventDefault();

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const point = getPoint(event);

    ctx.lineTo(
      point.x,
      point.y
    );

    ctx.stroke();

  }


  function stopDrawing() {

    setDrawing(false);

  }


  function clearDrawing() {

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }


  return (

    <div className="draw-overlay">


      {/* ============================
          TOP BAR
      ============================ */}

      <div className="draw-topbar">

        <button
          className="draw-clear-button"
          onClick={clearDrawing}
          title="Clear"
        >
          <FiTrash2 />
        </button>


        <button
          className="draw-done-button"
          onClick={onClose}
          title="Done"
        >
          <FiCheck />
        </button>

      </div>


      {/* ============================
          DRAW CANVAS
      ============================ */}

      <canvas
        ref={canvasRef}
        className="draw-canvas"

        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}

        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />


      {/* ============================
          BOTTOM TOOLBAR
      ============================ */}

      <div className="draw-toolbar">

        <input
          type="color"
          value={color}
          onChange={(event) =>
            setColor(event.target.value)
          }
        />


        <input
          type="range"
          min="1"
          max="30"
          value={size}
          onChange={(event) =>
            setSize(
              Number(event.target.value)
            )
          }
        />

      </div>

    </div>

  );

}