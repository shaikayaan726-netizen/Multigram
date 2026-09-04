import { useEffect, useState, useRef } from "react";

import {
    FiX,
    FiHeart,
    FiMessageCircle,
    FiSend,
    FiChevronLeft,
    FiChevronRight,
    FiMoreVertical,
    FiTrash2
} from "react-icons/fi";
import { getMediaUrl } from "../utils/mediaUtils";
import { api } from "../utils/api";
import "./StoryViewer.css";


function StoryViewer({
    stories = [],
    storyIndex,
    currentUserImage,
    currentUsername,
    currentUserId,
    onClose,
    onPrevious,
    onNext
}) {

    // ==========================================
    // DELETE MENU
    // ==========================================

    const [showStoryMenu, setShowStoryMenu] =
        useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] =
        useState(false);

    const [deletingStory, setDeletingStory] =
        useState(false);


    // ==========================================
    // CURRENT STORY
    // ==========================================

  const currentStory =
    storyIndex !== null &&
    stories[storyIndex]
        ? stories[storyIndex]
        : null;


// ==========================================
// STORY MUSIC PLAYER
// ==========================================

const musicAudioRef = useRef(null);

useEffect(function () {

    const audio =
        musicAudioRef.current;

    const music =
        currentStory?.music;

    if (
        !audio ||
        !music ||
        !music.audioUrl
    ) {
        if (audio) {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
        }

        return;
    }

    const audioUrl =
        getMediaUrl(
            music.audioUrl
        );

    if (!audioUrl) {
        return;
    }

    audio.src = audioUrl;
    audio.load();

    const startTime =
        Number(music.startTime || 0);

    const duration =
        Number(music.duration || 0);

    function startMusic() {

        try {
            audio.currentTime =
                Math.max(0, startTime);
        }
        catch (error) {
            console.warn(
                "STORY MUSIC SEEK ERROR:",
                error
            );
        }

        const playPromise =
            audio.play();

        if (
            playPromise &&
            typeof playPromise.catch ===
                "function"
        ) {
            playPromise.catch(
                function (error) {

                    console.warn(
                        "STORY MUSIC AUTOPLAY BLOCKED:",
                        error
                    );

                }
            );
        }
    }

    function handleTimeUpdate() {

        if (
            duration > 0 &&
            audio.currentTime >=
                startTime + duration
        ) {

            audio.currentTime =
                startTime;

            startMusic();
        }
    }

    audio.addEventListener(
        "loadedmetadata",
        startMusic,
        { once: true }
    );

    audio.addEventListener(
        "timeupdate",
        handleTimeUpdate
    );

    if (audio.readyState >= 1) {
        startMusic();
    }

    return function () {

        audio.pause();

        audio.removeEventListener(
            "loadedmetadata",
            startMusic
        );

        audio.removeEventListener(
            "timeupdate",
            handleTimeUpdate
        );

    };

}, [
    currentStory?.id,
    currentStory?.music?.audioUrl,
    currentStory?.music?.startTime,
    currentStory?.music?.duration
]);

    // ==========================================
    // MARK STORY VIEWED
    // ==========================================

    useEffect(function () {

        if (!currentStory?.id) {
            return;
        }


        async function markViewed() {

            try {

                const response =
                    await api(
                        "/stories/" +
                        currentStory.id +
                        "/view",
                        {
                            method: "POST"
                        }
                    );


                console.log(
                    "STORY VIEW RESPONSE:",
                    response
                );

            }
            catch (error) {

                console.error(
                    "STORY VIEW ERROR:",
                    error
                );

            }

        }


        markViewed();

    }, [currentStory?.id]);


    // ==========================================
    // STORY MEDIA URL
    // ==========================================

    function getStoryMediaUrl(story) {

        if (!story) {
            return "";
        }


        const rawUrl =
            story.mediaUrl ||
            story.media ||
            story.fileUrl ||
            story.url ||
            "";


        if (!rawUrl) {
            return "";
        }


        if (
            rawUrl.startsWith("http://") ||
            rawUrl.startsWith("https://") ||
            rawUrl.startsWith("blob:") ||
            rawUrl.startsWith("data:")
        ) {

            return rawUrl;

        }


       if (rawUrl.startsWith("/")) {
    return getMediaUrl(rawUrl);
}

       return getMediaUrl(rawUrl);
    }


    const mediaUrl =
        getStoryMediaUrl(currentStory);


    // ==========================================
    // TIME
    // ==========================================

    function getStoryTime(story) {

        if (!story || !story.createdAt) {
            return "";
        }


        const created =
            new Date(story.createdAt);

        const now =
            new Date();

        const diff =
            Math.floor(
                (now - created) / 1000
            );


        if (diff < 60) {
            return "now";
        }


        if (diff < 3600) {

            return (
                Math.floor(diff / 60) +
                "m"
            );

        }


        if (diff < 86400) {

            return (
                Math.floor(diff / 3600) +
                "h"
            );

        }


        return (
            Math.floor(diff / 86400) +
            "d"
        );

    }


    // ==========================================
    // DELETE STORY
    // ==========================================

    async function handleDeleteStory() {

        if (!currentStory?.id) {
            return;
        }


        try {

            setDeletingStory(true);


            const response =
                await api(
                    "/stories/" +
                    currentStory.id,
                    {
                        method: "DELETE"
                    }
                );


            console.log(
                "STORY DELETE RESPONSE:",
                response
            );


            setShowDeleteConfirm(false);
            setShowStoryMenu(false);


            // ==================================
            // CLOSE STORY
            // ==================================

            onClose();


            // ==================================
            // REFRESH HOME
            // ==================================

            window.location.reload();

        }
        catch (error) {

            console.error(
                "STORY DELETE ERROR:",
                error
            );


            alert(
                error?.message ||
                "Failed to delete story"
            );

        }
        finally {

            setDeletingStory(false);

        }

    }


    // ==========================================
    // RENDER STORY ELEMENTS
    // ==========================================

    function renderElements() {

        if (!currentStory) {
            return null;
        }


        return (
            currentStory.elements || []
        ).map(function (
            element,
            index
        ) {

            const style = {

                left:
                    (element.x ?? 50) +
                    "%",

                top:
                    (element.y ?? 50) +
                    "%",

                transform:
                    "translate(-50%, -50%) " +
                    "scale(" +
                    (element.scale ?? 1) +
                    ") rotate(" +
                    (element.rotation ?? 0) +
                    "deg)",

                color:
                    element.color ||
                    "#ffffff",

                fontFamily:
                    element.font ||
                    "Arial"

            };


            // ==================================
            // TEXT
            // ==================================

            if (
                element.type === "text"
            ) {

                return (

                    <div
                        key={index}
                        className="story-viewer-text"
                        style={style}
                    >

                        {element.value}

                    </div>

                );

            }


            // ==================================
            // STICKER
            // ==================================

            if (
                element.type === "sticker"
            ) {

                return (

                    <div
                        key={index}
                        className="story-viewer-sticker"
                        style={style}
                    >

                        {element.value}

                    </div>

                );

            }


            // ==================================
            // MENTION
            // ==================================

            if (
                element.type === "mention"
            ) {

                return (

                    <div
                        key={index}
                        className="story-viewer-mention"
                        style={style}
                    >

                        {element.value}

                    </div>

                );

            }


            // ==================================
            // MUSIC
            // ==================================

            if (
                element.type === "music"
            ) {

                return (

                    <div
                        key={index}
                        className="story-viewer-music"
                        style={style}
                    >

                        🎵 {element.value}

                    </div>

                );

            }


            // ==================================
            // EFFECT
            // ==================================

            if (
                element.type === "effect"
            ) {

                return null;

            }


            return null;

        });

    }


    // ==========================================
    // PROGRESS LINES
    // ==========================================

    function renderProgressBars() {

        return (

            <div className="story-viewer-progress">

                {stories.map(
                    function (
                        story,
                        index
                    ) {

                        return (

                            <div
                                key={
                                    story.id ||
                                    index
                                }
                                className="story-progress-track"
                            >

                                <div
                                    className={
                                        "story-progress-fill " +

                                        (
                                            index <
                                            storyIndex

                                                ? "completed"

                                                : index ===
                                                  storyIndex

                                                    ? "active"

                                                    : ""
                                        )
                                    }
                                />

                            </div>

                        );

                    }
                )}

            </div>

        );

    }


    // ==========================================
    // PREVIOUS
    // ==========================================

    function handlePrevious() {

        if (
            storyIndex === null ||
            storyIndex <= 0
        ) {

            return;

        }


        onPrevious();

    }


    // ==========================================
    // NEXT
    // ==========================================

    function handleNext() {

        if (
            storyIndex === null
        ) {

            return;

        }


        if (
            storyIndex >=
            stories.length - 1
        ) {

            onClose();

            return;

        }


        onNext();

    }


    // ==========================================
    // CLOSE
    // ==========================================

    function handleClose() {

        setShowStoryMenu(false);

        setShowDeleteConfirm(false);

        onClose();

    }


    // ==========================================
    // NOTHING OPEN
    // ==========================================

    if (
        storyIndex === null ||
        !currentStory
    ) {

        return null;

    }


    // ==========================================
    // USER DETAILS
    // ==========================================

    const storyUsername =
        currentStory.username ||
        currentUsername ||
        "";


    const storyImage =
        currentStory.image ||
        currentUserImage ||
        "";


    const storyTime =
        getStoryTime(currentStory);


    // ==========================================
    // MUSIC
    // ==========================================

    const music =
        currentStory.music;


    // ==========================================
    // VIEW COUNT
    // ==========================================

    const viewerCount =
        Array.isArray(
            currentStory.viewers
        )
            ? currentStory.viewers.length
            : 0;


    // ==========================================
    // CHECK OWN STORY
    // ==========================================

    const isOwnStory =
        currentStory.userId &&
        currentUserId &&
        String(currentStory.userId) ===
        String(currentUserId);


    return (

        <div className="story-viewer-overlay">


            {/* ======================================
                PROGRESS
            ====================================== */}
<audio
    ref={musicAudioRef}
    preload="auto"
/>
            {renderProgressBars()}


            {/* ======================================
                HEADER
            ====================================== */}

            <div className="story-viewer-header">


                <div className="story-viewer-user">

                    <img
                        src={storyImage}
                        alt={storyUsername}
                    />


                    <div className="story-viewer-user-info">

                        <strong>
                            {storyUsername}
                        </strong>


                        <span>
                            {storyTime}
                        </span>

                    </div>


                    {music && (

                        <span className="story-viewer-music-info">

                            🎵{" "}
                            {
                                typeof music === "string"
                                    ? music
                                    : music.title ||
                                      music.name ||
                                      "Music"
                            }

                        </span>

                    )}

                </div>


                                   {/* ==================================
                        RIGHT TOP ACTIONS
                    ================================== */}

                    <div className="story-viewer-header-actions">

                        {/* THREE DOTS */}

                        {isOwnStory && (

                            <button
                                type="button"
                                onClick={function () {

                                    setShowStoryMenu(
                                        function (oldValue) {
                                            return !oldValue;
                                        }
                                    );

                                }}
                                aria-label="Story options"
                            >

                                <FiMoreVertical />

                            </button>

                        )}


                        {/* DELETE MENU */}

                        {isOwnStory &&
                        showStoryMenu && (

                            <div className="story-viewer-delete-menu">

                                <button
                                    type="button"
                                    onClick={function () {

                                        setShowStoryMenu(false);

                                        setShowDeleteConfirm(true);

                                    }}
                                >

                                    <FiTrash2 />

                                    <span>
                                        Delete story
                                    </span>

                                </button>

                            </div>

                        )}


                        {/* CLOSE */}

                        <button
                            type="button"
                            className="story-viewer-close"
                            onClick={handleClose}
                            aria-label="Close"
                        >

                            <FiX />

                        </button>

                    </div>

                </div>


            {/* ======================================
                STORY CONTENT
            ====================================== */}

            <div className="story-viewer-content">


                {/* ==================================
                    MEDIA
                ================================== */}

                {currentStory.mediaType ===
                "video" ? (

                    <video
                        className="story-viewer-media"
                        src={mediaUrl}
                        autoPlay
                        controls={false}
                        playsInline
                        onError={function () {

                            console.error(
                                "STORY VIDEO LOAD ERROR:",
                                mediaUrl,
                                currentStory
                            );

                        }}
                    />

                ) : (

                    <img
                        className="story-viewer-media"
                        src={mediaUrl}
                        alt="Story"
                        onError={function () {

                            console.error(
                                "STORY IMAGE LOAD ERROR:",
                                mediaUrl,
                                currentStory
                            );

                        }}
                    />

                )}


                {/* ==================================
                    TEXT / STICKER / MENTION / MUSIC
                ================================== */}

                {renderElements()}


                {/* ==================================
                    LEFT TAP
                ================================== */}

                <button
                    type="button"
                    className="story-viewer-left story-viewer-tap-zone"
                    onClick={handlePrevious}
                    aria-label="Previous story"
                >

                    <FiChevronLeft />

                </button>


                {/* ==================================
                    RIGHT TAP
                ================================== */}

                <button
                    type="button"
                    className="story-viewer-right story-viewer-tap-zone"
                    onClick={handleNext}
                    aria-label="Next story"
                >

                    <FiChevronRight />

                </button>

            </div>


            {/* ======================================
                OWN STORY VIEWS
            ====================================== */}

            {isOwnStory && (

                <div className="story-viewer-views">

                    👁{" "}
                    {viewerCount}
                    {" "}
                    views

                </div>

            )}


            {/* ======================================
                BOTTOM ACTIONS
            ====================================== */}

            <div className="story-viewer-actions">


                <div className="story-message-box">

                    Send message

                </div>


                <button
                    type="button"
                    aria-label="Like"
                >

                    <FiHeart />

                </button>


                <button
                    type="button"
                    aria-label="Comment"
                >

                    <FiMessageCircle />

                </button>


                <button
                    type="button"
                    aria-label="Share"
                >

                    <FiSend />

                </button>

            </div>


            {/* ======================================
                DELETE CONFIRMATION
            ====================================== */}

            {showDeleteConfirm && (

                <div
                    style={{
                        position: "absolute",
                        inset: "0",
                        background:
                            "rgba(0,0,0,0.60)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3000
                    }}
                >

                    <div
                        style={{
                            width: "320px",
                            maxWidth:
                                "calc(100% - 35px)",
                            background: "#ffffff",
                            color: "#262626",
                            borderRadius: "14px",
                            overflow: "hidden",
                            textAlign: "center"
                        }}
                    >

                        <h3
                            style={{
                                margin:
                                    "22px 20px 8px",
                                fontSize: "18px",
                                fontWeight: "600"
                            }}
                        >

                            Delete story?

                        </h3>


                        <p
                            style={{
                                margin:
                                    "0 20px 20px",
                                color: "#737373",
                                fontSize: "13px",
                                lineHeight: "1.4"
                            }}
                        >

                            Are you sure you want to
                            delete this story?

                        </p>


                        {/* DELETE */}

                        <button
                            type="button"
                            onClick={handleDeleteStory}
                            disabled={deletingStory}
                            style={{
                                width: "100%",
                                height: "48px",
                                border: "none",
                                borderTop:
                                    "1px solid #eeeeee",
                                background: "#ffffff",
                                color: "#ed4956",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor:
                                    deletingStory
                                        ? "default"
                                        : "pointer"
                            }}
                        >

                            {deletingStory
                                ? "Deleting..."
                                : "Delete"
                            }

                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={function () {

                                if (!deletingStory) {

                                    setShowDeleteConfirm(
                                        false
                                    );

                                }

                            }}
                            disabled={deletingStory}
                            style={{
                                width: "100%",
                                height: "48px",
                                border: "none",
                                borderTop:
                                    "1px solid #eeeeee",
                                background: "#ffffff",
                                color: "#262626",
                                fontSize: "14px",
                                cursor:
                                    deletingStory
                                        ? "default"
                                        : "pointer"
                            }}
                        >

                            Cancel

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}


export default StoryViewer;