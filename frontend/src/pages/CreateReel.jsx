import {
  useEffect,
  useState,
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import ReelGallery from "./ReelGallery";
import ReelCamera from "./ReelCamera";
import ReelEditor from "./ReelEditor";
import ReelSettings from "./ReelSettings";
import ReelShare from "./ReelShare";


const REEL_DRAFT_KEY =
  "instagram_reel_draft_v1";

const REEL_MEDIA_DB =
  "instagram_reel_media_v1";

const REEL_MEDIA_STORE =
  "media";


function openReelMediaDB() {

  return new Promise(function (
    resolve,
    reject
  ) {

    const request =
      indexedDB.open(
        REEL_MEDIA_DB,
        1
      );


    request.onupgradeneeded =
      function () {

        const db =
          request.result;

        if (
          !db.objectStoreNames.contains(
            REEL_MEDIA_STORE
          )
        ) {

          db.createObjectStore(
            REEL_MEDIA_STORE
          );

        }

      };


    request.onsuccess =
      function () {

        resolve(
          request.result
        );

      };


    request.onerror =
      function () {

        reject(
          request.error
        );

      };

  });

}


async function saveReelMedia(
  selectedMedia
) {

  if (!selectedMedia?.file) {
    return;
  }


  try {

    const db =
      await openReelMediaDB();


    const transaction =
      db.transaction(
        REEL_MEDIA_STORE,
        "readwrite"
      );


    transaction
      .objectStore(
        REEL_MEDIA_STORE
      )
      .put(
        selectedMedia.file,
        "current"
      );


    await new Promise(
      function (
        resolve,
        reject
      ) {

        transaction.oncomplete =
          resolve;

        transaction.onerror =
          function () {

            reject(
              transaction.error
            );

          };

      }
    );


    db.close();

  } catch (error) {

    console.error(
      "REEL MEDIA DRAFT SAVE ERROR:",
      error
    );

  }

}


async function loadReelMedia() {

  try {

    const db =
      await openReelMediaDB();


    const transaction =
      db.transaction(
        REEL_MEDIA_STORE,
        "readonly"
      );


    const request =
      transaction
        .objectStore(
          REEL_MEDIA_STORE
        )
        .get("current");


    const file =
      await new Promise(
        function (
          resolve,
          reject
        ) {

          request.onsuccess =
            function () {

              resolve(
                request.result ||
                null
              );

            };


          request.onerror =
            function () {

              reject(
                request.error
              );

            };

        }
      );


    db.close();


    if (!file) {
      return null;
    }


    return {

      file,

      url:
        URL.createObjectURL(
          file
        ),

      type:
        file.type?.startsWith(
          "video/"
        )
          ? "video"
          : "image",

    };

  } catch (error) {

    console.error(
      "REEL MEDIA DRAFT LOAD ERROR:",
      error
    );

    return null;

  }

}


async function clearReelMedia() {

  try {

    const db =
      await openReelMediaDB();


    const transaction =
      db.transaction(
        REEL_MEDIA_STORE,
        "readwrite"
      );


    transaction
      .objectStore(
        REEL_MEDIA_STORE
      )
      .delete("current");


    transaction.oncomplete =
      function () {

        db.close();

      };

  } catch (error) {

    console.error(
      "REEL MEDIA DRAFT CLEAR ERROR:",
      error
    );

  }

}


function CreateReel() {

  const navigate =
    useNavigate();

const location =
    useLocation();
  const [
    screen,
    setScreen,
  ] = useState("gallery");


  const [
    media,
    setMedia,
  ] = useState(null);


  const [
    settings,
    setSettings,
  ] = useState({

    duration: 90,

    timer: 0,

    muted: false,

  });


  const [
    data,
    setData,
  ] = useState({

    text: "",

    music: null,

    effects: [],

    stickers: [],

    audio: null,

    elements: [],

  });


  // ==========================================
  // RESTORE REEL DRAFT
  // ==========================================

  useEffect(function () {

    let active = true;


    async function restoreDraft() {

      try {

        const saved =
          localStorage.getItem(
            REEL_DRAFT_KEY
          );


        const parsed =
          saved
            ? JSON.parse(saved)
            : null;


        const restoredMedia =
          await loadReelMedia();


        if (!active) {
          return;
        }


        if (parsed) {

          setData(
            function (old) {

              return {

                ...old,

                ...parsed,

                elements:
                  Array.isArray(
                    parsed.elements
                  )
                    ? parsed.elements
                    : [],

              };

            }
          );


          if (parsed.settings) {

            setSettings(
              function (old) {

                return {

                  ...old,

                  ...parsed.settings,

                };

              }
            );

          }

        }


        if (restoredMedia) {

          setMedia(
            restoredMedia
          );

          setScreen(
            "editor"
          );

        }

      } catch (error) {

        console.error(
          "REEL DRAFT RESTORE ERROR:",
          error
        );

      }

    }


    restoreDraft();


    return function () {

      active = false;

    };

  }, []);

useEffect(function () {

    const state =
        location.state;

    if (
        !state ||
        !state.music
    ) {
        return;
    }


    /*
     * AddAudio se selected
     * music receive hua.
     */

    setData(function (old) {

        return {
            ...old,

            music:
                state.music
        };

    });


    /*
     * React Router state ko
     * consume kar do taaki
     * refresh/navigation par
     * same music dobara apply
     * na ho.
     */

    navigate(
        location.pathname,
        {
            replace: true,
            state: {
                ...state,
                music: undefined
            }
        }
    );

}, [
    location,
    navigate
]);
  // ==========================================
  // SAVE REEL DRAFT
  // ==========================================

  useEffect(function () {

    try {

      localStorage.setItem(

        REEL_DRAFT_KEY,

        JSON.stringify({

          ...data,

          settings,

        })

      );

    } catch (error) {

      console.error(
        "REEL DRAFT SAVE ERROR:",
        error
      );

    }

  }, [data, settings]);


  function close() {

    navigate(-1);

  }


  function update(
    key,
    value
  ) {

    setData(function (old) {

      return {

        ...old,

        [key]: value,

      };

    });

  }


  function handleMediaSelected(
    selectedMedia
  ) {

    if (!selectedMedia) {
      return;
    }


    setMedia(
      selectedMedia
    );


    saveReelMedia(
      selectedMedia
    );


    setScreen(
      "editor"
    );

  }


  // ===============================
  // GALLERY
  // ===============================

  if (
    screen === "gallery"
  ) {

    return (

      <ReelGallery

        onClose={close}

        onCamera={function () {

          setScreen("camera");

        }}

        onSelect={
          handleMediaSelected
        }

      />

    );

  }


  // ===============================
  // CAMERA
  // ===============================

  if (
    screen === "camera"
  ) {

    return (

      <ReelCamera

        {...settings}

        onClose={close}

        onGallery={function () {

          setScreen("gallery");

        }}
onMusic={function () {
  navigate(
    "/addaudio",
    {
      state: {
        returnTo: "/reelcreate",

        returnState: {
          media: media,
          reelData: data,
          settings: settings,
        },
      },
    }
  );
}}
        onSettings={function () {

          setScreen("settings");

        }}

        onMusic={function () {

    navigate(
        "/addaudio",
        {
            state: {
                returnTo:
                    "/reelcreate",

                returnState: {
                    media: media,

                    reelData: data,

                    settings:
                        settings
                }
            }
        }
    );

}}

        onEffects={function () {

          setScreen(
            "editor"
          );

        }}

        onCapture={
          handleMediaSelected
        }

      />

    );

  }


  // ===============================
  // SETTINGS
  // ===============================

  if (
    screen === "settings"
  ) {

    return (

      <ReelSettings

        value={settings}

        onBack={function () {

          setScreen(
            media
              ? "editor"
              : "camera"
          );

        }}

        onSave={function (
          value
        ) {

          setSettings(
            value
          );

          setScreen(
            media
              ? "editor"
              : "camera"
          );

        }}

      />

    );

  }


  // ===============================
  // SHARE
  // ===============================

  if (
    screen === "share"
  ) {

    return (

      <ReelShare

        media={media}

        {...data}

        settings={settings}

        onBack={function () {

          setScreen(
            "editor"
          );

        }}

        onPublished={async function () {

          localStorage.removeItem(
            REEL_DRAFT_KEY
          );

          await clearReelMedia();

          setData({

            text: "",

            music: null,

            effects: [],

            stickers: [],

            audio: null,

            elements: [],

          });

          setMedia(null);

          navigate(
            "/reels"
          );

        }}

      />

    );

  }


  // ===============================
  // EDITOR
  // ===============================

  return (

    <ReelEditor

      media={media}

      {...data}

      setText={function (
        value
      ) {

        update(
          "text",
          value
        );

      }}

      setMusic={function (
        value
      ) {

        update(
          "music",
          value
        );

      }}
onMusic={function () {
  navigate(
    "/addaudio",
    {
      state: {
        returnTo: "/reelcreate",
        returnState: {
          media: media,
          reelData: data,
          settings: settings
        }
      }
    }
  );
}}
      setEffects={function (
        value
      ) {

        update(
          "effects",
          value
        );

      }}

      setStickers={function (
        value
      ) {

        update(
          "stickers",
          value
        );

      }}

      setAudio={function (
        value
      ) {

        update(
          "audio",
          value
        );

      }}

      setElements={function (
  value
) {
  setData(function (old) {
    const currentElements =
      Array.isArray(old.elements)
        ? old.elements
        : [];

    const nextElements =
      typeof value === "function"
        ? value(currentElements)
        : value;

    return {
      ...old,
      elements:
        Array.isArray(nextElements)
          ? nextElements
          : currentElements
    };
  });
}}

      onBack={function () {

        setScreen(
          "gallery"
        );

      }}

      onSettings={function () {

        setScreen(
          "settings"
        );

      }}

      onShare={function () {

        setScreen(
          "share"
        );

      }}

    />

  );

}


export default CreateReel;