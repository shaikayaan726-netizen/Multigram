
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StoryGallery from "./StoryGallery";
import StoryCamera from "./StoryCamera";
import StoryEditor from "./StoryEditor";
import StoryShare from "./StoryShare";

import { api } from "../utils/api";


function CreateStory() {

  const navigate = useNavigate();
  const location = useLocation();


  // ==========================================
  // SOURCE
  // ==========================================

  const [source, setSource] =
    useState("gallery");


  // ==========================================
  // SELECTED MEDIA
  // ==========================================

  const [media, setMedia] =
    useState(null);


  // ==========================================
  // EDITOR DATA
  // ==========================================

  const [storyData, setStoryData] =
    useState(null);


  // ==========================================
  // SHARE MODAL
  // ==========================================

  const [showShare, setShowShare] =
    useState(false);


  // ==========================================
  // DRAFT STORAGE
  // ==========================================

  const DRAFT_KEY = "instagram_story_draft_v1";
  const EDITOR_DRAFT_KEY = "instagram_story_editor_draft_v1";
  const MEDIA_DB_NAME = "instagram_story_media_v1";
  const MEDIA_STORE_NAME = "media";


  function openMediaDB() {

    return new Promise(function (resolve, reject) {

      const request = indexedDB.open(MEDIA_DB_NAME, 1);

      request.onupgradeneeded = function () {

        const db = request.result;

        if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
          db.createObjectStore(MEDIA_STORE_NAME);
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


  async function saveDraftMedia(selectedMedia) {

    if (!selectedMedia?.file) {
      return;
    }

    try {

      const db = await openMediaDB();

      const transaction = db.transaction(
        MEDIA_STORE_NAME,
        "readwrite"
      );

      transaction.objectStore(MEDIA_STORE_NAME).put(
        selectedMedia.file,
        "current"
      );

      await new Promise(function (resolve, reject) {
        transaction.oncomplete = resolve;
        transaction.onerror = function () {
          reject(transaction.error);
        };
      });

      db.close();

    } catch (error) {
      console.error("STORY MEDIA DRAFT SAVE ERROR:", error);
    }

  }


  async function loadDraftMedia() {

    try {

      const db = await openMediaDB();

      const transaction = db.transaction(
        MEDIA_STORE_NAME,
        "readonly"
      );

      const request = transaction
        .objectStore(MEDIA_STORE_NAME)
        .get("current");

      const file = await new Promise(function (resolve, reject) {
        request.onsuccess = function () {
          resolve(request.result || null);
        };
        request.onerror = function () {
          reject(request.error);
        };
      });

      db.close();

      if (!file) {
        return null;
      }

      return {
        file: file,
        url: URL.createObjectURL(file),
        type: file.type?.startsWith("video/") ? "video" : "image"
      };

    } catch (error) {
      console.error("STORY MEDIA DRAFT LOAD ERROR:", error);
      return null;
    }

  }


  // Restore the editor draft and the real media file after refresh
  useEffect(function () {

    let active = true;

    async function restoreDraft() {

      try {

        const savedDraft =
          localStorage.getItem(DRAFT_KEY);

        const editorDraft =
          localStorage.getItem(EDITOR_DRAFT_KEY);

        const routeState = location.state || {};

        const savedData = savedDraft
          ? JSON.parse(savedDraft)
          : null;

        const editorData = editorDraft
          ? JSON.parse(editorDraft)
          : null;

        const incomingData = {
          ...(savedData || {}),
          ...(editorData || {}),
          ...(routeState.storyData || {}),
          ...(routeState.audio
            ? { music: routeState.audio }
            : {})
        };

        const restoredMedia =
          await loadDraftMedia();

        if (!active) {
          return;
        }

        if (restoredMedia) {
          setMedia(restoredMedia);
        }

        if (Object.keys(incomingData).length > 0) {
          setStoryData(incomingData);
        }

        if (routeState.media) {
          setMedia(routeState.media);
        }

        if (routeState.storyData || routeState.audio) {
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(incomingData)
          );
        }

      } catch (error) {
        console.error("STORY DRAFT RESTORE ERROR:", error);
      }

    }

    restoreDraft();

    return function () {
      active = false;
    };

  }, [location.state]);


  // ==========================================
  // MEDIA SELECTED
  // ==========================================

  function handleMediaSelected(selectedMedia) {

    console.log(
      "STORY MEDIA SELECTED:",
      selectedMedia
    );


    if (!selectedMedia) {

      return;

    }


    setMedia(selectedMedia);

    saveDraftMedia(selectedMedia);

  }


  // ==========================================
  // OPEN CAMERA
  // ==========================================

  function handleOpenCamera() {

    setSource("camera");

  }


  // ==========================================
  // OPEN GALLERY
  // ==========================================

  function handleOpenGallery() {

    setSource("gallery");

  }


  // ==========================================
  // BACK FROM SOURCE
  // ==========================================

  function handleSourceBack() {

    navigate(-1);

  }


  // ==========================================
  // BACK FROM EDITOR
  // ==========================================

  function handleEditorBack() {

    setMedia(null);

    setStoryData(null);

    setShowShare(false);

    setSource("gallery");

  }


  // ==========================================
  // EDITOR DONE
  // ==========================================

  function handleEditorDone(data) {

    console.log(
      "STORY EDITOR DATA:",
      data
    );


    setStoryData(data);

    setShowShare(true);

  }


  // ==========================================
  // SHARE STORY
  // ==========================================

  async function handleShare(shareData) {

    try {

      // --------------------------------------
      // CHECK MEDIA
      // --------------------------------------

      if (
        !media ||
        !media.file
      ) {

        alert(
          "Story media not found"
        );

        return;

      }


      // --------------------------------------
      // CHECK LOGIN
      // --------------------------------------

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        navigate("/login");

        return;

      }


      // --------------------------------------
      // FORM DATA
      // --------------------------------------

      const formData =
        new FormData();


      // --------------------------------------
      // ACTUAL FILE
      // --------------------------------------
      //
      // IMPORTANT:
      //
      // media.file = actual device File/Blob
      //
      // media.url = temporary browser blob URL
      //
      // We DO NOT send media.url.
      //
      // --------------------------------------

      const fileName =
        media.file.name ||
        (
          media.type === "video"
            ? "story.mp4"
            : "story.jpg"
        );


      formData.append(
        "media",
        media.file,
        fileName
      );


      // --------------------------------------
      // MEDIA TYPE
      // --------------------------------------

      formData.append(
        "mediaType",
        media.type
      );


      // ======================================
      // STORY ELEMENTS
      // ======================================

      const elements =
        Array.isArray(storyData?.elements)
          ? storyData.elements.map(function (element) {
              return {
                ...element,
                userId:
                  element.userId ||
                  element._id ||
                  null
              };
            })
          : [];


      // Backward compatibility for any old single-field draft
      if (elements.length === 0 && storyData) {

        if (storyData.text?.trim()) {
          elements.push({
            type: "text",
            value: storyData.text,
            font: storyData.font || "Arial",
            color: storyData.color || "#ffffff",
            x: storyData.textX ?? 50,
            y: storyData.textY ?? 50,
            scale: storyData.textScale ?? 1,
            rotation: storyData.textRotation ?? 0
          });
        }

      }

      formData.append(
        "elements",
        JSON.stringify(elements)
      );


      // --------------------------------------
      // MUSIC
      // --------------------------------------

      formData.append(
        "music",
        JSON.stringify(
          storyData?.music ||
          null
        )
      );


      // --------------------------------------
      // EFFECT
      // --------------------------------------

      formData.append(
        "effect",
        storyData?.effect ||
        "None"
      );


      // --------------------------------------
      // SETTINGS
      // --------------------------------------

      formData.append(

        "settings",

        JSON.stringify(

          storyData?.settings ||

          {
            replies: true,
            sharing: true
          }

        )

      );


      // --------------------------------------
      // DESTINATION
      // --------------------------------------

      formData.append(

        "destination",

        shareData?.destination ||
        "story"

      );


      // ======================================
      // DEBUG
      // ======================================

      console.log(
        "UPLOADING STORY FILE:",
        media.file
      );


      console.log(
        "STORY FORM DATA:"
      );


      for (
        const [key, value]
        of formData.entries()
      ) {

        console.log(
          key,
          value
        );

      }


      // ======================================
      // UPLOAD TO BACKEND
      // ======================================

      const data =
        await api(

          "/stories",

          {

            method: "POST",

            body: formData

          }

        );


      // ======================================
      // BACKEND RESPONSE
      // ======================================

      console.log(
        "CREATE STORY RESPONSE:",
        data
      );


      // ======================================
      // IMPORTANT FIX
      // ======================================
      //
      // OLD CODE:
      //
      // if (!response.ok)
      //
      // WRONG because `response` does not exist.
      //
      // api() is already returning the parsed
      // backend response.
      //
      // ======================================

      if (
        !data
      ) {

        throw new Error(
          "Failed to create story"
        );

      }


      // ======================================
      // SUCCESS
      // ======================================

      setShowShare(false);

      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(EDITOR_DRAFT_KEY);

      try {
        const db = await openMediaDB();
        const transaction = db.transaction(
          MEDIA_STORE_NAME,
          "readwrite"
        );
        transaction.objectStore(MEDIA_STORE_NAME).delete("current");
        transaction.oncomplete = function () {
          db.close();
        };
      } catch (cleanupError) {
        console.error("STORY DRAFT CLEANUP ERROR:", cleanupError);
      }

      setStoryData(null);

      setMedia(null);


      // ======================================
      // GO HOME
      // ======================================

      navigate("/home");

    }

    catch (error) {

      console.error(
        "CREATE STORY ERROR:",
        error
      );


      alert(
        error.message ||
        "Failed to create story"
      );

    }

  }


  // ==========================================
  // EDITOR SCREEN
  // ==========================================

  if (media) {

    return (

      <div className="create-story-page">

        <StoryEditor

          media={media}

          initialData={storyData}

          onBack={
            handleEditorBack
          }

          onDone={
            handleEditorDone
          }

        />


        {/* ==================================
            SHARE STORY
        ================================== */}

        {showShare && (

          <StoryShare

            onClose={
              function () {

                setShowShare(false);

              }
            }

            onShare={
              handleShare
            }

          />

        )}

      </div>

    );

  }


  // ==========================================
  // CAMERA
  // ==========================================

  if (
    source === "camera"
  ) {

    return (

      <div className="create-story-page">

        <StoryCamera

          onMediaCaptured={
            handleMediaSelected
          }

          onBack={
            handleOpenGallery
          }

        />

      </div>

    );

  }


  // ==========================================
  // GALLERY
  // ==========================================

  return (

    <div className="create-story-page">

      <StoryGallery

        onMediaSelected={
          handleMediaSelected
        }

        onOpenCamera={
          handleOpenCamera
        }

        onBack={
          handleSourceBack
        }

      />

    </div>

  );

}


export default CreateStory;