import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EditorText from "../components/EditorText";
import EditorStickers from "../components/EditorStickers";
import EditorEffects from "../components/EditorEffects";
import EditorDraw from "../components/EditorDraw";
import EditorMusic from "../components/EditorMusic";

export default function MediaEditor() {

  const location = useLocation();
  const navigate = useNavigate();

  const media = location.state?.url;
  const file = location.state?.file;

  const isVideo =
    file?.type?.startsWith("video/");

  const [tool, setTool] =
    useState(null);

  const [filter, setFilter] =
    useState("none");

  const [overlays, setOverlays] =
    useState([]);

  const [music, setMusic] =
    useState("");


  /* =====================================
     LOG / CLEANUP
  ===================================== */

  useEffect(() => {

    console.log(
      "MediaEditor loaded",
      location.state
    );

    return () => {

      if (location.state?.url) {
        URL.revokeObjectURL(
          location.state.url
        );
      }

    };

  }, [location.state]);


  /* =====================================
     NO MEDIA
  ===================================== */

  if (!media) {

    return (

      <div
        className="editor-empty"
        style={{
          width: "100%",
          maxWidth: "430px",
          height: "100vh",
          margin: "0 auto",
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px"
        }}
      >

        <button
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2>
          No media selected
        </h2>

        <button
          onClick={() => navigate("/gallery")}
        >
          Open Gallery
        </button>

      </div>

    );

  }


  /* =====================================
     ADD OVERLAY
  ===================================== */

  function addOverlay(value) {

    if (!value) return;

    setOverlays((old) => [
      ...old,
      value
    ]);

  }


  /* =====================================
     CLOSE TOOL
  ===================================== */

  function closeTool() {

    setTool(null);

  }


  return (

    <div className="media-editor-page">


      {/* =================================
          HEADER
      ================================= */}

      <header className="editor-header">

        <button
          onClick={() => navigate(-1)}
          aria-label="Close editor"
        >
          ×
        </button>


        <strong>
          Edit
        </strong>


        <button
          onClick={() => {
            alert(
              "Media ready to share"
            );
          }}
        >
          Next
        </button>

      </header>


      {/* =================================
          PREVIEW
      ================================= */}

      <main className="editor-preview">

        {isVideo ? (

          <video
            src={media}
            controls
            playsInline
            style={{
              filter
            }}
          />

        ) : (

          <img
            src={media}
            alt="Selected media"
            style={{
              filter
            }}
          />

        )}


        {/* TEXT / STICKER OVERLAYS */}

        <div className="editor-overlays">

          {overlays.map(
            (item, index) => (

              <div
                className="editor-overlay-item"
                key={`${item}-${index}`}
              >
                {item}
              </div>

            )
          )}

        </div>


        {/* SELECTED MUSIC */}

        {music && (

          <div className="selected-music">

            ♫ {music}

          </div>

        )}

      </main>


      {/* =================================
          TOOL BAR
      ================================= */}

      <div className="editor-tools">

        <button
          onClick={() =>
            setTool("text")
          }
        >
          Aa
        </button>


        <button
          onClick={() =>
            setTool("stickers")
          }
        >
          Sticker
        </button>


        <button
          onClick={() =>
            setTool("effects")
          }
        >
          Effects
        </button>


        <button
          onClick={() =>
            setTool("draw")
          }
        >
          Draw
        </button>


        <button
          onClick={() =>
            setTool("music")
          }
        >
          ♫
        </button>

      </div>


      {/* =================================
          TEXT
      ================================= */}

      {tool === "text" && (

        <EditorText
          onAdd={(value) => {

            addOverlay(value);
            closeTool();

          }}
        />

      )}


      {/* =================================
          STICKERS
      ================================= */}

      {tool === "stickers" && (

        <EditorStickers
          onAdd={(value) => {

            addOverlay(value);
            closeTool();

          }}
        />

      )}


      {/* =================================
          EFFECTS
      ================================= */}

      {tool === "effects" && (

        <EditorEffects
          onSelect={(value) => {

            setFilter(value);
            closeTool();

          }}
        />

      )}


      {/* =================================
          DRAW
      ================================= */}

      {tool === "draw" && (

        <EditorDraw
          onClose={closeTool}
        />

      )}


      {/* =================================
          MUSIC
      ================================= */}

      {tool === "music" && (

        <EditorMusic
          onSelect={(value) => {

            setMusic(value);
            closeTool();

          }}
        />

      )}

    </div>

  );

}