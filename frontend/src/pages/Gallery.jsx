import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import { api } from "../utils/api";

const GALLERY_DB_NAME = "instagramGalleryDB";
const GALLERY_STORE_NAME = "selectedMedia";

function openGalleryDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      GALLERY_DB_NAME,
      1
    );

    request.onupgradeneeded = function () {
      const db = request.result;

      if (
        !db.objectStoreNames.contains(
          GALLERY_STORE_NAME
        )
      ) {
        db.createObjectStore(
          GALLERY_STORE_NAME,
          { keyPath: "id" }
        );
      }
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function saveGalleryFiles(files) {
  try {
    const db = await openGalleryDB();

    const transaction =
      db.transaction(
        GALLERY_STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(
        GALLERY_STORE_NAME
      );

    store.put({
      id: "selected",
      files: files
    });
  }
  catch (error) {
    console.error(
      "GALLERY SAVE ERROR:",
      error
    );
  }
}


async function clearGalleryFiles() {
  try {
    const db = await openGalleryDB();

    const transaction =
      db.transaction(
        GALLERY_STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(
        GALLERY_STORE_NAME
      );

    store.delete("selected");
  }
  catch (error) {
    console.error(
      "GALLERY CLEAR ERROR:",
      error
    );
  }
}


async function loadGalleryFiles() {
  try {
    const db = await openGalleryDB();

    return await new Promise(
      (resolve, reject) => {
        const transaction =
          db.transaction(
            GALLERY_STORE_NAME,
            "readonly"
          );

        const store =
          transaction.objectStore(
            GALLERY_STORE_NAME
          );

        const request =
          store.get("selected");

        request.onsuccess = function () {
          resolve(
            request.result?.files || []
          );
        };

        request.onerror = function () {
          reject(request.error);
        };
      }
    );
  }
  catch (error) {
    console.error(
      "GALLERY LOAD ERROR:",
      error
    );

    return [];
  }
}


export default function Gallery() {

  const inputRef = useRef(null);

const navigate = useNavigate();
const location = useLocation();

const fromChat =
  location.state?.fromChat ||
  new URLSearchParams(location.search).get("fromChat") === "true";

const chatUser =
  location.state?.chatUser;

 const [selected, setSelected] =
  useState([]);


// ==========================================
// RESTORE SELECTED MEDIA AFTER REFRESH
// ==========================================

useEffect(() => {
  let active = true;

  async function restoreSelectedFiles() {
    const files =
      await loadGalleryFiles();

    if (
      active &&
      Array.isArray(files) &&
      files.length > 0
    ) {
      setSelected(files);
    }
  }

  restoreSelectedFiles();

  return () => {
    active = false;
  };
}, []);


 function chooseFiles(event) {

  const files = Array.from(
    event.target.files || []
  );

  setSelected(files);

  saveGalleryFiles(files);

}
async function openEditor() {
  if (!selected.length) {
    return;
  }

  if (fromChat) {
    if (!chatUser?.id) {
      alert("Chat user information not found");
      return;
    }

    try {
      for (const file of selected) {
        const formData = new FormData();

        formData.append(
          "image",
          file
        );

        formData.append(
          "receiver",
          chatUser.id
        );

        const data = await api(
          "/messages/image",
          {
            method: "POST",
            body: formData
          }
        );

        if (!data?.message) {
          throw new Error(
            "Image message was not created"
          );
        }
      }

      setSelected([]);

      navigate("/chat", {
        state: {
          user: chatUser
        }
      });
    }
    catch (error) {
      console.error(
        "SEND CHAT IMAGES ERROR:",
        error
      );

      alert(
        "Failed to send photos"
      );
    }

    return;
  }

  const first = selected[0];
  const url =
    URL.createObjectURL(first);

  navigate("/media-editor", {
    state: {
      file: first,
      url,
      files: selected
    }
  });
}


  return (

    <div className="gallery-page">

      <header className="gallery-header">

        <button
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1>New post</h1>

        <button
          onClick={() => inputRef.current?.click()}
        >
          Select
        </button>

      </header>


      <div className="gallery-tabs">

        <button className="active">
          Recents⌄
        </button>

        <button>
          Albums
        </button>

      </div>


      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={chooseFiles}
      />


      <div className="gallery-grid">

        <button
          className="gallery-camera-tile"
          onClick={() => navigate("/camera")}
        >

          <span>📷</span>

          <small>Camera</small>

        </button>


        {selected.map((file, index) => {

          const preview =
            URL.createObjectURL(file);

          return (

            <button
              key={`${file.name}-${index}`}
              className="gallery-preview-tile"
              onClick={openEditor}
            >

              {file.type.startsWith("video/")
                ? (
                  <video
                    src={preview}
                    muted
                  />
                )
                : (
                  <img
                    src={preview}
                    alt={file.name}
                  />
                )
              }

            </button>

          );

        })}


        {!selected.length &&

          Array.from({
            length: 12
          }).map((_, index) => (

            <div
              className="gallery-placeholder"
              key={index}
            >
              <span>Recent</span>
            </div>

          ))

        }

      </div>

{selected.length > 0 && (

  <div className="gallery-bottom">

    <div>
      {selected.length} selected
    </div>

    <button onClick={openEditor}>
      {fromChat ? "Done" : "Edit"}
    </button>

  </div>

)}
    </div>

  );

}