import {
  useEffect,
  useRef,
  useState,
} from "react";
import StoryMention from "./StoryMention";
import {
  FiArrowLeft,
  FiSettings,
  FiMusic,
  FiType,
  FiSmile,
  FiZap,
  FiVolume2,
  FiPlay,
  FiPause,
} from "react-icons/fi";

import ReelMusic from "./ReelMusic";
import ReelEffects from "./ReelEffects";
import ReelText from "./ReelText";
import ReelStickers from "./ReelStickers";
import ReelAudio from "./ReelAudio";


const REEL_EDITOR_DRAFT_KEY =
  "instagram_reel_editor_draft_v1";

function ReelEditor({

    media,

    text = "",

    music = null,

    effects = [],

    stickers = [],

    audio = null,

    elements = [],

    setText,

    setMusic,

    setEffects,

    setStickers,

    setAudio,

    setElements,

    onBack,

    onSettings,

    onMusic,

    onShare

}) {


  const [
    panel,
    setPanel,
  ] = useState(null);


  const [
    selectedElementIndex,
    setSelectedElementIndex,
  ] = useState(null);


  const [textStyle, setTextStyle] = useState({
    font: "Arial",
    color: "#ffffff",
  });


  const pointerMapRef =
    useRef(new Map());


  const dragRef =
    useRef({

      index: null,

      offsetX: 0,

      offsetY: 0,

    });


  const pinchRef =
    useRef({

      index: null,

      startDistance: 0,

      startScale: 1,

    });


  const musicRef =
    useRef(null);


  const [
    musicPlaying,
    setMusicPlaying,
  ] = useState(false);


  // ==========================================
  // DRAFT
  // ==========================================

  useEffect(function () {

    try {

      localStorage.setItem(

        REEL_EDITOR_DRAFT_KEY,

        JSON.stringify({

          text,

          music,

          effects,

          stickers,

          audio,

          elements,

        })

      );

    } catch (error) {

      console.error(
        "REEL EDITOR DRAFT SAVE ERROR:",
        error
      );

    }

  }, [
    text,
    music,
    effects,
    stickers,
    audio,
    elements,
  ]);


  // ==========================================
  // ELEMENT UPDATE
  // ==========================================

  function updateElement(
    index,
    changes
  ) {

    setElements(
      function (current) {

        const next = [
          ...(current || []),
        ];


        if (!next[index]) {

          return current;

        }


        next[index] = {

          ...next[index],

          ...changes,

        };


        return next;

      }
    );

  }


  // ==========================================
  // ADD ELEMENT
  // ==========================================

  function addElement(
    element
  ) {

    setElements(
      function (current) {

        return [

          ...(current || []),

          {

            type:
              element.type,

            value:
              element.value,

            x:
              element.x ??
              50,

            y:
              element.y ??
              50,

            scale:
              element.scale ??
              1,

            rotation:
              element.rotation ??
              0,

            font:
              element.font ||
              "Arial",

            color:
              element.color ||
              "#ffffff",

            userId:
              element.userId ||
              null,

            username:
              element.username ||
              "",

            fullName:
              element.fullName ||
              "",

            profilePicture:
              element.profilePicture ||
              "",

          },

        ];

      }
    );

  }


  // ==========================================
  // POINTER DISTANCE
  // ==========================================

  function pointerDistance(
    first,
    second
  ) {

    const dx =
      first.x -
      second.x;


    const dy =
      first.y -
      second.y;


    return Math.sqrt(
      dx * dx +
      dy * dy
    );

  }


  // ==========================================
  // POINTER DOWN
  // ==========================================

  function handlePointerDown(
    event,
    index
  ) {

    event.preventDefault();


    const element =
      elements?.[index];


    if (!element) {

      return;

    }


    setSelectedElementIndex(
      index
    );


    const canvas =
      event.currentTarget
        .parentElement;


    if (!canvas) {

      return;

    }


    pointerMapRef.current.set(

      event.pointerId,

      {

        x:
          event.clientX,

        y:
          event.clientY,

        index,

      }

    );


    event.currentTarget.setPointerCapture(
      event.pointerId
    );


    const samePointers =
      Array.from(
        pointerMapRef.current.values()
      ).filter(function (
        pointer
      ) {

        return (
          pointer.index ===
          index
        );

      });


    // ========================================
    // PINCH START
    // ========================================

    if (
      samePointers.length >= 2
    ) {

      const first =
        samePointers[0];

      const second =
        samePointers[1];


      pinchRef.current = {

        index,

        startDistance:
          pointerDistance(
            first,
            second
          ),

        startScale:
          element.scale ||
          1,

      };


      dragRef.current.index =
        null;


      return;

    }


    // ========================================
    // DRAG START
    // ========================================

    const rect =
      canvas.getBoundingClientRect();


    const currentX =
      element.x ??
      50;


    const currentY =
      element.y ??
      50;


    const pixelX =
      rect.left +
      rect.width *
      currentX /
      100;


    const pixelY =
      rect.top +
      rect.height *
      currentY /
      100;


    dragRef.current = {

      index,

      offsetX:
        event.clientX -
        pixelX,

      offsetY:
        event.clientY -
        pixelY,

    };

  }


  // ==========================================
  // POINTER MOVE
  // ==========================================

  function handlePointerMove(
    event
  ) {

    const pointer =
      pointerMapRef.current.get(
        event.pointerId
      );


    if (!pointer) {

      return;

    }


    pointer.x =
      event.clientX;

    pointer.y =
      event.clientY;


    pointerMapRef.current.set(
      event.pointerId,
      pointer
    );


    const index =
      pointer.index;


    const element =
      elements?.[index];


    if (!element) {

      return;

    }


    // ========================================
    // PINCH
    // ========================================

    if (
      pinchRef.current.index ===
      index
    ) {

      const samePointers =
        Array.from(
          pointerMapRef.current.values()
        ).filter(function (
          item
        ) {

          return (
            item.index ===
            index
          );

        });


      if (
        samePointers.length >= 2
      ) {

        const distance =
          pointerDistance(
            samePointers[0],
            samePointers[1]
          );


        const startDistance =
          pinchRef.current
            .startDistance;


        if (
          startDistance > 0
        ) {

          let scale =
            pinchRef.current
              .startScale *
            (
              distance /
              startDistance
            );


          scale =
            Math.max(
              0.5,
              Math.min(
                5,
                scale
              )
            );


          updateElement(
            index,
            {
              scale,
            }
          );

        }

      }


      return;

    }


    // ========================================
    // DRAG
    // ========================================

    if (
      dragRef.current.index !==
      index
    ) {

      return;

    }


    const canvas =
      event.currentTarget
        .parentElement;


    if (!canvas) {

      return;

    }


    const rect =
      canvas.getBoundingClientRect();


    let x =
      (
        (
          event.clientX -
          dragRef.current.offsetX -
          rect.left
        ) /
        rect.width
      ) *
      100;


    let y =
      (
        (
          event.clientY -
          dragRef.current.offsetY -
          rect.top
        ) /
        rect.height
      ) *
      100;


    x =
      Math.max(
        2,
        Math.min(
          98,
          x
        )
      );


    y =
      Math.max(
        2,
        Math.min(
          98,
          y
        )
      );


    updateElement(
      index,
      {
        x,
        y,
      }
    );

  }


  // ==========================================
  // POINTER UP
  // ==========================================

  function handlePointerUp(
    event
  ) {

    pointerMapRef.current.delete(
      event.pointerId
    );


    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {

      event.currentTarget.releasePointerCapture(
        event.pointerId
      );

    }


    const remaining =
      Array.from(
        pointerMapRef.current.values()
      );


    if (
      pinchRef.current.index !==
      null
    ) {

      const index =
        pinchRef.current.index;


      const stillPinching =
        remaining.some(
          function (
            pointer
          ) {

            return (
              pointer.index ===
              index
            );

          }
        );


      if (!stillPinching) {

        pinchRef.current = {

          index: null,

          startDistance: 0,

          startScale: 1,

        };

      }

    }


    if (
      dragRef.current.index !==
      null
    ) {

      const index =
        dragRef.current.index;


      const stillDragging =
        remaining.some(
          function (
            pointer
          ) {

            return (
              pointer.index ===
              index
            );

          }
        );


      if (!stillDragging) {

        dragRef.current.index =
          null;

      }

    }

  }


  // ==========================================
  // SIZE SLIDER
  // ==========================================

  function updateSizeFromPointer(
    event
  ) {

    if (
      selectedElementIndex ===
      null
    ) {

      return;

    }


    const slider =
      event.currentTarget;


    const rect =
      slider.getBoundingClientRect();


    let percentage =
      (
        event.clientY -
        rect.top
      ) /
      rect.height;


    percentage =
      Math.max(
        0,
        Math.min(
          1,
          percentage
        )
      );


    let scale =
      5 -
      percentage *
      4.5;


    scale =
      Math.max(
        0.5,
        Math.min(
          5,
          scale
        )
      );


    updateElement(
      selectedElementIndex,
      {
        scale,
      }
    );

  }


  function handleSizeDown(
    event
  ) {

    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId
    );


    updateSizeFromPointer(
      event
    );

  }


  function handleSizeMove(
    event
  ) {

    if (
      !event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {

      return;

    }


    updateSizeFromPointer(
      event
    );

  }


  function handleSizeUp(
    event
  ) {

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {

      event.currentTarget.releasePointerCapture(
        event.pointerId
      );

    }

  }


  // ==========================================
  // MUSIC
  // ==========================================

 useEffect(function () {

  const audio =
    musicRef.current;

  if (
    !audio ||
    !music?.audioUrl
  ) {

    setMusicPlaying(false);
    return;

  }

  try {

    audio.pause();

    audio.src =
      music.audioUrl;

    audio.load();

    function handleLoadedMetadata() {

      const start =
        Number.isFinite(
          Number(music.startTime)
        )
          ? Number(music.startTime)
          : 0;

      try {

        audio.currentTime =
          Math.max(0, start);

      } catch (error) {

        console.warn(
          "REEL MUSIC SEEK ERROR:",
          error
        );

      }

    }

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    return function () {

      audio.pause();

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

    };

  } catch (error) {

    console.error(
      "REEL MUSIC LOAD ERROR:",
      error
    );

    setMusicPlaying(false);

  }

}, [
  music?.audioUrl,
  music?.startTime,
]);

 async function toggleMusic() {

  const audio =
    musicRef.current;

  if (
    !audio ||
    !music?.audioUrl
  ) {

    console.warn(
      "REEL MUSIC: audio not ready"
    );

    return;

  }

  try {

    if (!audio.paused) {

      audio.pause();

      setMusicPlaying(false);

      return;

    }

    const start =
      Number.isFinite(
        Number(music.startTime)
      )
        ? Number(music.startTime)
        : 0;

    const clipDuration =
      Number.isFinite(
        Number(music.duration)
      )
        ? Number(music.duration)
        : 30;

    const clipEnd =
      start + clipDuration;

    /*
     * Agar audio selected clip ke bahar hai
     * toh selected start se play karo.
     */
    if (
      !Number.isFinite(audio.currentTime) ||
      audio.currentTime < start ||
      audio.currentTime >= clipEnd
    ) {

      if (audio.readyState >= 1) {

        audio.currentTime =
          start;

      }

    }

    const playPromise =
      audio.play();

    if (
      playPromise &&
      typeof playPromise.then === "function"
    ) {

      await playPromise;

    }

    setMusicPlaying(true);

  } catch (error) {

    console.error(
      "REEL MUSIC PLAY ERROR:",
      error
    );

    setMusicPlaying(false);

  }

}


  // ==========================================
  // EFFECT FILTER
  // ==========================================

  function getEffectFilter() {

    const active =
      Array.isArray(effects)
        ? effects
        : [];


    if (!active.length) {

      return "none";

    }


    const filters = [];


    active.forEach(
      function (
        effect
      ) {

        if (
          effect ===
          "Vintage"
        ) {

          filters.push(
            "sepia(.45)"
          );

        }


        if (
          effect ===
          "Warm"
        ) {

          filters.push(
            "sepia(.25) saturate(1.25)"
          );

        }


        if (
          effect ===
          "Cool"
        ) {

          filters.push(
            "hue-rotate(15deg)"
          );

        }


        if (
          effect ===
          "B&W"
        ) {

          filters.push(
            "grayscale(1)"
          );

        }


        if (
          effect ===
          "Dream"
        ) {

          filters.push(
            "brightness(1.1) saturate(1.15)"
          );

        }


        if (
          effect ===
          "Glow"
        ) {

          filters.push(
            "brightness(1.08) contrast(1.05)"
          );

        }

      }
    );


    return filters.length
      ? filters.join(" ")
      : "none";

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="reel-editor-page">


      {/* HEADER */}

      <header>

        <button
          type="button"
          onClick={onBack}
        >
          <FiArrowLeft />
        </button>


        <nav>

          <button
            type="button"
            onClick={function () {

              setPanel("text");

            }}
          >
            <FiType />
            Text
          </button>


          <button
            type="button"
            onClick={function () {

              setPanel("stickers");

            }}
          >
            <FiSmile />
            Stickers
          </button>


          <button
            type="button"
            onClick={function () {

    if (onMusic) {
        onMusic();
    }

}}
          >
            <FiMusic />
            Music
          </button>


          <button
            type="button"
            onClick={function () {

              setPanel("effects");

            }}
          >
            <FiZap />
            Effects
          </button>


          <button
            type="button"
            onClick={function () {

              setPanel("audio");

            }}
          >
            <FiVolume2 />
            Audio
          </button>


          <button
            type="button"
            onClick={function () {

              setPanel("mention");

            }}
          >
            @
            Mention
          </button>

        </nav>


        <button
          type="button"
          onClick={onSettings}
        >
          <FiSettings />
        </button>

      </header>


      {/* PREVIEW */}

      <main
        className="reel-editor-preview"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >


        {media?.type ===
        "video" ? (

          <video
  src={media.url}
  autoPlay
  loop
  playsInline
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: getEffectFilter(),
  }}
/>

        ) : media?.url ? (

          <img
            src={media.url}
            alt="Reel preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter:
                getEffectFilter(),
            }}
          />

        ) : (

          <div>
            No media selected
          </div>

        )}


        {/* =====================================
            SIZE SLIDER
        ===================================== */}

        {selectedElementIndex !==
          null &&
          elements?.[
            selectedElementIndex
          ] && (

          <div
            className="reel-element-size-slider"

            onPointerDown={
              handleSizeDown
            }

            onPointerMove={
              handleSizeMove
            }

            onPointerUp={
              handleSizeUp
            }

            onPointerCancel={
              handleSizeUp
            }

            style={{
              position:
                "absolute",

              left:
                "18px",

              top:
                "50%",

              transform:
                "translateY(-50%)",

              width:
                "28px",

              height:
                "230px",

              zIndex:
                100,

              display:
                "flex",

              justifyContent:
                "center",

              touchAction:
                "none",

            }}
          >

            <div
              style={{
                position:
                  "absolute",

                top:
                  "10px",

                width:
                  "3px",

                height:
                  "210px",

                background:
                  "rgba(255,255,255,.85)",

                borderRadius:
                  "10px",

              }}
            />


            <div
              style={{
                position:
                  "absolute",

                width:
                  "16px",

                height:
                  "16px",

                borderRadius:
                  "50%",

                background:
                  "#fff",

                border:
                  "2px solid rgba(0,0,0,.25)",

                left:
                  "50%",

                transform:
                  "translateX(-50%)",

                top:
                  `${
                    10 +
                    (
                      (
                        5 -
                        (
                          elements[
                            selectedElementIndex
                          ]?.scale ||
                          1
                        )
                      ) /
                      4.5
                    ) *
                    210 -
                    8
                  }px`,

              }}
            />

          </div>

        )}


        {/* =====================================
            ELEMENTS
        ===================================== */}

        {(
          elements || []
        ).map(
          function (
            element,
            index
          ) {

            if (
              element.type !==
                "text" &&
              element.type !==
                "sticker" &&
              element.type !==
                "mention"
            ) {

              return null;

            }


            return (

              <div

                key={
                  "reel-element-" +
                  index
                }

                className={
                  element.type ===
                  "text"
                    ? "reel-preview-text"
                    : element.type ===
                      "mention"
                        ? "reel-preview-mention"
                        : "reel-preview-sticker"
                }

                onPointerDown={
                  function (
                    event
                  ) {

                    handlePointerDown(
                      event,
                      index
                    );

                  }
                }

                onPointerMove={
                  handlePointerMove
                }

                onPointerUp={
                  handlePointerUp
                }

                onPointerCancel={
                  handlePointerUp
                }

                style={{

                  position:
                    "absolute",

                  left:
                    `${
                      element.x ??
                      50
                    }%`,

                  top:
                    `${
                      element.y ??
                      50
                    }%`,

                  transform:
                    `translate(-50%, -50%) scale(${
                      element.scale ||
                      1
                    }) rotate(${
                      element.rotation ||
                      0
                    }deg)`,

                  fontFamily:
                    element.font ||
                    "Arial",

                  color:
                    element.color ||
                    "#ffffff",

                  touchAction:
                    "none",

                  userSelect:
                    "none",

                  cursor:
                    "grab",

                  zIndex:
                    20 +
                    index,

                  whiteSpace:
                    "pre-wrap",

                }}
              >

                {element.value}

              </div>

            );

          }
        )}


        {/* =====================================
            MUSIC
        ===================================== */}

        {music && (

          <>

   <audio
  ref={musicRef}
  src={music?.audioUrl || ""}
  preload="auto"
  onPlay={function () {
    setMusicPlaying(true);
  }}
  onPause={function () {
    setMusicPlaying(false);
  }}
  onEnded={function () {
    setMusicPlaying(false);
  }}
  onError={function (event) {
    console.error(
      "REEL MUSIC AUDIO ERROR:",
      event.currentTarget.error,
      music?.audioUrl
    );
  }}
/>

            <div
              className="reel-preview-music"
            >

              <FiMusic />

              <span>

                {music.title ||
                  "Music"}

              </span>


              <button
                type="button"
                onClick={
                  toggleMusic
                }
              >

                {musicPlaying ? (
                  <FiPause />
                ) : (
                  <FiPlay />
                )}

              </button>

            </div>

          </>

        )}

      </main>


      {/* FOOTER */}

      <footer>

        <button
          type="button"
          onClick={onShare}
        >
          Next
        </button>

      </footer>


      {/* =====================================
          TEXT
      ===================================== */}

      {panel === "text" && (

        <ReelText

          value={text}

          onChange={function (value) {

            setText(
              value?.value || ""
            );

            setTextStyle({

              font:
                value?.font ||
                "Arial",

              color:
                value?.color ||
                "#ffffff",

            });

          }}

          onClose={function () {

            if (
              text &&
              text.trim()
            ) {

              addElement({

                type:
                  "text",

                value:
                  text,

                font:
                  textStyle.font,

                color:
                  textStyle.color,

                x:
                  50,

                y:
                  50,

                scale:
                  1,

                rotation:
                  0,

              });

            }


            setText("");


            setTextStyle({

              font:
                "Arial",

              color:
                "#ffffff",

            });


            setPanel(null);

          }}

        />

      )}


      {/* =====================================
          STICKERS
      ===================================== */}

      {panel ===
        "stickers" && (

        <ReelStickers

          selected={
            stickers
          }

          onSelect={function (
    value
) {

    const nextStickers =
        Array.isArray(value)
            ? value
            : [
                ...(stickers || []),
                value
            ];


    const newSticker =
        Array.isArray(value)
            ? value[
                value.length - 1
            ]
            : value;


    const stickerValue =
        typeof newSticker === "string"
            ? newSticker
            : newSticker?.value ||
              newSticker?.emoji ||
              "";


    if (!stickerValue) {
        return;
    }


    /*
     * IMPORTANT:
     * Every sticker becomes
     * an independent element.
     */

    addElement({
        type: "sticker",

        value: stickerValue,

        x: 50,

        y: 50,

        scale: 1,

        rotation: 0
    });


    /*
     * Keep legacy stickers
     * array also.
     */

    setStickers(
        nextStickers
    );


    setPanel(
        null
    );

}}

          onClose={function () {

            setPanel(null);

          }}

        />

      )}


      {/* =====================================
          MUSIC
      ===================================== */}

      {panel ===
        "music" && (

        <ReelMusic

          selected={
            music
          }

          onSelect={function (
            value
          ) {

            setMusic(
              value
            );


            setPanel(null);

          }}

          onClose={function () {

            setPanel(null);

          }}

        />

      )}


      {/* =====================================
          MENTION
      ===================================== */}

      {panel ===
        "mention" && (

        <StoryMention

          value={
            null
          }

          onChange={function (
            mention
          ) {

            if (
              mention &&
              typeof mention ===
                "object"
            ) {

              addElement({

                type:
                  "mention",

                value:
                  mention.username
                    ? "@" +
                      mention.username
                    : mention.value ||
                      "",

                userId:
                  mention.userId ||
                  mention._id ||
                  null,

                username:
                  mention.username ||
                  "",

                fullName:
                  mention.fullName ||
                  "",

                profilePicture:
                  mention.profilePicture ||
                  "",

                x:
                  50,

                y:
                  50,

                scale:
                  1,

                rotation:
                  0,

                font:
                  "Arial",

                color:
                  "#ffffff",

              });

            }

          }}

          onClose={function () {

            setPanel(null);

          }}

        />

      )}


      {/* =====================================
          EFFECTS
      ===================================== */}

      {panel ===
        "effects" && (

        <ReelEffects

          selected={
            effects
          }

          onSelect={function (
            value
          ) {

            setEffects(
              value
            );

          }}

          onClose={function () {

            setPanel(null);

          }}

        />

      )}


      {/* =====================================
          AUDIO
      ===================================== */}

      {panel ===
        "audio" && (

        <ReelAudio

          value={
            audio
          }

          onChange={function (
            value
          ) {

            setAudio(
              value
            );

          }}

          onClose={function () {

            setPanel(null);

          }}

        />

      )}

    </div>

  );

}


export default ReelEditor;