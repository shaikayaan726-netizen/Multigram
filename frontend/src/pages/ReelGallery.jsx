import {
  useRef,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiCamera,
  FiCheckSquare,
} from "react-icons/fi";


function ReelGallery({
  onClose,
  onCamera,
  onSelect,
}) {

  const ref = useRef(null);

  const [selectMode, setSelectMode] =
    useState(false);

  const [selected, setSelected] =
    useState([]);


  const demo = Array.from(
    { length: 15 },
    (_, index) => ({
      id: index,

      url:
        `https://picsum.photos/500/700?random=${90 + index}`,

      type: "image",
    })
  );


  function selectDemo(media) {

    if (!selectMode) {

      onSelect(media);

      return;

    }


    setSelected((old) => {

      const exists =
        old.some(
          (item) =>
            item.id === media.id
        );


      if (exists) {

        return old.filter(
          (item) =>
            item.id !== media.id
        );

      }


      return [
        ...old,
        media,
      ];

    });

  }


  function selectFile(event) {

    const files =
      Array.from(
        event.target.files || []
      );


    if (!files.length) return;


    if (files.length === 1) {

      const file = files[0];


      onSelect({
        file,

        url:
          URL.createObjectURL(file),

        type:
          file.type.startsWith(
            "video/"
          )
            ? "video"
            : "image",
      });

      return;

    }


    const first = files[0];


    onSelect({
      file: first,

      files,

      url:
        URL.createObjectURL(first),

      type:
        first.type.startsWith(
          "video/"
        )
          ? "video"
          : "image",
    });

  }


  return (
    <div className="reel-gallery-page">

      {/* HEADER */}

      <header>

        <button
          type="button"
          onClick={onClose}
        >
          <FiArrowLeft />
        </button>


        <h1>
          New reel
        </h1>


        <span />

      </header>


      {/* SHORTCUTS */}

      <div className="reel-gallery-shortcuts">

        <button type="button">
          Drafts · 2
        </button>

        <button type="button">
          Templates
        </button>

      </div>


      {/* RECENTS */}

      <div className="reel-gallery-row">

        <h2>
          Recents⌄
        </h2>


        <button
          type="button"
          onClick={() =>
            setSelectMode(
              (value) => !value
            )
          }
        >

          <FiCheckSquare />

          {selectMode
            ? "Done"
            : "Select"}

        </button>

      </div>


      {/* DEVICE INPUT */}

      <input
        ref={ref}
        hidden
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={selectFile}
      />


      {/* GRID */}

      <div className="reel-gallery-grid">

        <button
          type="button"
          className="camera-tile"
          onClick={onCamera}
        >
          <FiCamera />
        </button>


        {demo.map((item) => (

          <button
            type="button"
            key={item.id}

            className={
              selected.some(
                (x) =>
                  x.id === item.id
              )
                ? "selected"
                : ""
            }

            onClick={() =>
              selectDemo(item)
            }
          >

            <img
              src={item.url}
              alt="recent"
            />

          </button>

        ))}

      </div>


      {/* DEVICE BUTTON */}

      <button
        type="button"
        className="reel-gallery-upload"
        onClick={() =>
          ref.current?.click()
        }
      >
        Choose from device
      </button>


      {/* MULTI SELECT */}

      {selectMode &&
        selected.length > 0 && (

          <div className="reel-selection-bar">

            <span>
              {selected.length}
              {" "}
              selected
            </span>


            <button
              type="button"
              onClick={() =>
                onSelect(
                  selected[0]
                )
              }
            >
              Next
            </button>

          </div>

        )}

    </div>
  );
}


export default ReelGallery;