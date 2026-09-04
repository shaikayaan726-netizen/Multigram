
import { useNavigate } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import {
    FiArrowLeft,
    FiType,
    FiSmile,
    FiMusic,
    FiAtSign,
    FiSliders,
    FiSettings,
    FiCheck,
    FiPlay,
    FiPause
} from "react-icons/fi";

import StoryText from "./StoryText";
import StoryStickers from "./StoryStickers";
import StoryMusic from "./StoryMusic";
import StoryMention from "./StoryMention";
import StoryEffects from "./StoryEffects";
import StorySettings from "./StorySettings";


function StoryEditor({
    media,
    initialData,
    onBack,
    onDone
}) {

    const navigate = useNavigate();

    const [activePanel, setActivePanel] =
        useState(null);

const [selectedElementIndex, setSelectedElementIndex] =
    useState(null);

    const STORY_DRAFT_KEY = "instagram_story_editor_draft_v1";

    function getInitialStoryData() {

        const fallback = {
            text: "",
            font: "Arial",
            color: "#ffffff",
            sticker: null,
            music: null,
            mention: "",
            effect: "None",
            settings: {
                replies: true,
                sharing: true
            },
            elements: []
        };

        if (initialData) {
            return {
                ...fallback,
                ...initialData,
                elements: Array.isArray(initialData.elements)
                    ? initialData.elements
                    : []
            };
        }

        try {
            const saved = localStorage.getItem(STORY_DRAFT_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...fallback,
                    ...parsed,
                    elements: Array.isArray(parsed.elements)
                        ? parsed.elements
                        : []
                };
            }
        } catch (error) {
            console.error("STORY EDITOR DRAFT READ ERROR:", error);
        }

        return fallback;
    }

    const [storyData, setStoryData] =
        useState(getInitialStoryData);


    // Persist every editor change immediately.
    // This keeps text, stickers, emojis, mentions, positions,
    // scale, rotation and selected music after a browser refresh.
    useEffect(function () {

        try {
            localStorage.setItem(
                STORY_DRAFT_KEY,
                JSON.stringify(storyData)
            );
        } catch (error) {
            console.error("STORY EDITOR DRAFT SAVE ERROR:", error);
        }

    }, [storyData]);


    // ==========================================
    // ELEMENT POINTER / PINCH DATA
    // ==========================================

    const pointerMapRef = useRef(
        new Map()
    );


    const dragRef = useRef({

        index: null,

        offsetX: 0,

        offsetY: 0

    });


    const pinchRef = useRef({

        index: null,

        startDistance: 0,

        startScale: 1

    });


    // ==========================================
    // STORY MUSIC PLAYER
    // ==========================================

    const audioRef = useRef(null);

    const [isMusicPlaying, setIsMusicPlaying] =
        useState(false);


    useEffect(function () {

        const audio = audioRef.current;
        const music = storyData?.music;

        if (!audio || !music?.audioUrl) {
            setIsMusicPlaying(false);
            return;
        }

        audio.src = music.audioUrl;
        audio.load();

        function startAudio() {
            const start = Number(music.startTime || 0);
            const clipDuration = Number(music.duration || 0);

            try {
                audio.currentTime = Math.max(0, start);
            } catch (error) {
                console.error("STORY MUSIC SEEK ERROR:", error);
            }

            const promise = audio.play();

            if (promise && typeof promise.catch === "function") {
                promise.then(function () {
                    setIsMusicPlaying(true);
                }).catch(function () {
                    // Browser autoplay may require one tap.
                    setIsMusicPlaying(false);
                });
            } else {
                setIsMusicPlaying(true);
            }

            audio._storyStartTime = start;
            audio._storyEndTime = clipDuration > 0
                ? start + clipDuration
                : 0;
        }

        audio.addEventListener("loadedmetadata", startAudio, { once: true });

        if (audio.readyState >= 1) {
            startAudio();
        }

        return function () {
            audio.removeEventListener("loadedmetadata", startAudio);
            audio.pause();
        };

    }, [storyData?.music?.audioUrl, storyData?.music?.startTime, storyData?.music?.duration]);


    function handleMusicTimeUpdate() {

        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        const endTime =
            Number(audio._storyEndTime || 0);

        const startTime =
            Number(audio._storyStartTime || 0);

        if (endTime > startTime && audio.currentTime >= endTime) {
            audio.currentTime = startTime;
        }

    }


    function toggleMusicPlayback() {

        const audio = audioRef.current;

        if (!audio || !storyData?.music?.audioUrl) {
            return;
        }

        if (audio.paused) {
            audio.play().then(function () {
                setIsMusicPlaying(true);
            }).catch(function (error) {
                console.error("STORY MUSIC PLAY ERROR:", error);
            });
        } else {
            audio.pause();
            setIsMusicPlaying(false);
        }

    }


    // ==========================================
    // PANEL
    // ==========================================

    function openPanel(panel) {

        setActivePanel(function (current) {

            return current === panel
                ? null
                : panel;

        });

    }


    // ==========================================
    // DISTANCE BETWEEN TWO FINGERS
    // ==========================================

    function getPointerDistance(
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
    // ELEMENT POINTER DOWN
    // ==========================================

    function handleElementPointerDown(
        event,
        index
    ) {

        event.preventDefault();

       const element =
    storyData.elements?.[index];

if (!element) {

    return;

}

// This element is now selected.
// The size slider will control this element.
setSelectedElementIndex(index);


        const canvas =
            event.currentTarget.parentElement;

        if (!canvas) {

            return;

        }


        pointerMapRef.current.set(
            event.pointerId,
            {

                x: event.clientX,

                y: event.clientY,

                index: index

            }
        );


        event.currentTarget.setPointerCapture(
            event.pointerId
        );


        const sameElementPointers =
            Array.from(
                pointerMapRef.current.values()
            ).filter(function (pointer) {

                return pointer.index === index;

            });


        // ======================================
        // TWO FINGER PINCH START
        // ======================================

        if (
            sameElementPointers.length >= 2
        ) {

            const first =
                sameElementPointers[0];

            const second =
                sameElementPointers[1];


            const distance =
                getPointerDistance(
                    first,
                    second
                );


            pinchRef.current = {

                index: index,

                startDistance:
                    distance,

                startScale:
                    element.scale || 1

            };


            dragRef.current.index =
                null;


            return;

        }


        // ======================================
        // NORMAL DRAG START
        // ======================================

        const rect =
            canvas.getBoundingClientRect();


        const currentX =
            element.x ?? 50;


        const currentY =
            element.y ?? 50;


        const currentPixelX =
            rect.left +
            (rect.width * currentX) /
            100;


        const currentPixelY =
            rect.top +
            (rect.height * currentY) /
            100;


        dragRef.current = {

            index: index,

            offsetX:
                event.clientX -
                currentPixelX,

            offsetY:
                event.clientY -
                currentPixelY

        };

    }


    // ==========================================
    // ELEMENT POINTER MOVE
    // ==========================================

    function handleElementPointerMove(
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
            storyData.elements?.[index];


        if (!element) {

            return;

        }


        // ======================================
        // PINCH ZOOM
        // ======================================

        if (
            pinchRef.current.index ===
            index
        ) {

            const sameElementPointers =
                Array.from(
                    pointerMapRef.current.values()
                ).filter(function (item) {

                    return item.index === index;

                });


            if (
                sameElementPointers.length >= 2
            ) {

                const first =
                    sameElementPointers[0];

                const second =
                    sameElementPointers[1];


                const currentDistance =
                    getPointerDistance(
                        first,
                        second
                    );


                const startDistance =
                    pinchRef.current
                        .startDistance;


                if (
                    startDistance > 0
                ) {

                    let newScale =
                        pinchRef.current
                            .startScale *
                        (
                            currentDistance /
                            startDistance
                        );


                    // Allow element to become
                    // much bigger or smaller

                    newScale =
                        Math.max(
                            0.5,
                            Math.min(
                                5,
                                newScale
                            )
                        );


                    updateStoryElement(
                        index,
                        {

                            scale:
                                newScale

                        }
                    );

                }

                return;

            }

        }


        // ======================================
        // NORMAL DRAG
        // ======================================

        if (
            dragRef.current.index !==
            index
        ) {

            return;

        }


        const canvas =
            event.currentTarget.parentElement;

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


        // ======================================
        // KEEP ELEMENT INSIDE STORY
        // ======================================

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


        updateStoryElement(
            index,
            {

                x: x,

                y: y

            }
        );

    }


    // ==========================================
    // ELEMENT POINTER UP
    // ==========================================

    function handleElementPointerUp(
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


        const remainingPointers =
            Array.from(
                pointerMapRef.current.values()
            );


        // ======================================
        // PINCH END
        // ======================================

        if (
            pinchRef.current.index !==
            null
        ) {

            const pinchIndex =
                pinchRef.current.index;


            const stillPinching =
                remainingPointers.some(
                    function (pointer) {

                        return (
                            pointer.index ===
                            pinchIndex
                        );

                    }
                );


            if (!stillPinching) {

                pinchRef.current = {

                    index: null,

                    startDistance: 0,

                    startScale: 1

                };

            }

        }


        // ======================================
        // DRAG END
        // ======================================

        if (
            dragRef.current.index !==
            null
        ) {

            const stillDragging =
                remainingPointers.some(
                    function (pointer) {

                        return (
                            pointer.index ===
                            dragRef.current.index
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
// VERTICAL SIZE SLIDER
// ==========================================

function handleSizeSliderPointerDown(event) {

    event.preventDefault();

    event.currentTarget.setPointerCapture(
        event.pointerId
    );

    updateSizeFromPointer(event);
}


function handleSizeSliderPointerMove(event) {

    if (
        !event.currentTarget.hasPointerCapture(
            event.pointerId
        )
    ) {
        return;
    }

    updateSizeFromPointer(event);
}


function handleSizeSliderPointerUp(event) {

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


function updateSizeFromPointer(event) {

    if (
        selectedElementIndex === null
    ) {

        return;

    }


    const slider =
        event.currentTarget;


    const rect =
        slider.getBoundingClientRect();


    // Top = biggest
    // Bottom = smallest

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


    // Reverse:
    // top = 5
    // bottom = 0.5

    let scale =
        5 -
        (
            percentage * 4.5
        );


    scale =
        Math.max(
            0.5,
            Math.min(
                5,
                scale
            )
        );


    updateStoryElement(
        selectedElementIndex,
        {
            scale: scale
        }
    );

}
    // ==========================================
    // ADD STORY ELEMENT
    // ==========================================

    function addStoryElement(
        element
    ) {

        setStoryData(function (current) {

            return {

                ...current,

                elements: [

                    ...(current.elements || []),

                    {

                        type:
                            element.type,

                        value:
                            element.value,

                        // Mention data
                        // will also be preserved

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
                            current.font ||
                            "Arial",

                        color:
                            element.color ||
                            current.color ||
                            "#ffffff"

                    }

                ]

            };

        });

    }


    // ==========================================
    // UPDATE STORY ELEMENT
    // ==========================================

    function updateStoryElement(
        index,
        changes
    ) {

        setStoryData(function (current) {

            const elements =
                [
                    ...(current.elements || [])
                ];


            if (!elements[index]) {

                return current;

            }


            elements[index] = {

                ...elements[index],

                ...changes

            };


            return {

                ...current,

                elements: elements

            };

        });

    }


    // ==========================================
    // UPDATE DATA
    // ==========================================

    function updateData(data) {

        setStoryData(function (current) {

            return {

                ...current,

                ...data

            };

        });

    }


    // ==========================================
    // UPDATE SETTINGS
    // ==========================================

    function updateSettings(
        settings
    ) {

        setStoryData(function (current) {

            return {

                ...current,

                settings: {

                    ...current.settings,

                    ...settings

                }

            };

        });

    }


    // ==========================================
    // DONE
    // ==========================================

    function handleDone() {

        onDone(storyData);

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="story-editor-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div
                className="story-editor-header"
            >

                <button
                    onClick={onBack}
                >

                    <FiArrowLeft />

                </button>


                <div
                    className="story-editor-tools"
                >

                    <button
                        onClick={function () {

                            openPanel("text");

                        }}
                    >

                        <FiType />

                        <span>
                            Text
                        </span>

                    </button>


                    <button
                        onClick={function () {

                            openPanel("stickers");

                        }}
                    >

                        <FiSmile />

                        <span>
                            Stickers
                        </span>

                    </button>


                    <button
                        onClick={function () {

                            navigate("/addaudio", {
                                state: {
                                    returnTo: "/createstory",
                                    returnState: {
                                        media: media,
                                        storyData: storyData
                                    }
                                }
                            });

                        }}
                    >

                        <FiMusic />

                        <span>
                            Music
                        </span>

                    </button>


                    <button
                        onClick={function () {

                            openPanel("mention");

                        }}
                    >

                        <FiAtSign />

                        <span>
                            Mention
                        </span>

                    </button>


                    <button
                        onClick={function () {

                            openPanel("effects");

                        }}
                    >

                        <FiSliders />

                        <span>
                            Effects
                        </span>

                    </button>


                    <button
                        onClick={function () {

                            openPanel("settings");

                        }}
                    >

                        <FiSettings />

                        <span>
                            Settings
                        </span>

                    </button>

                </div>


                <button
                    className="story-editor-done"
                    onClick={handleDone}
                >

                    <FiCheck />

                </button>

            </div>


            {/* ==================================
                STORY MEDIA / CANVAS
            ================================== */}

            <div
                className="story-editor-media"
            >

               {media.type === "image" && (

    <img
        src={media.url}
        alt="Story"
        className="story-editor-image"
        style={{
            filter:
                storyData.effect === "Vivid"
                    ? "saturate(1.5)"
                    : storyData.effect === "Warm"
                    ? "sepia(.3) saturate(1.3)"
                    : storyData.effect === "Cool"
                    ? "hue-rotate(15deg)"
                    : storyData.effect === "Fade"
                    ? "contrast(.8) brightness(1.1)"
                    : storyData.effect === "Mono"
                    ? "grayscale(1)"
                    : storyData.effect === "Drama"
                    ? "contrast(1.4)"
                    : storyData.effect === "Vintage"
                    ? "sepia(.45)"
                    : "none"
        }}
    />

)}


                {media.type === "video" && (

    <video
        src={media.url}
        className="story-editor-image"
        autoPlay
        loop
        muted
        playsInline
        style={{
            filter:
                storyData.effect === "Vivid"
                    ? "saturate(1.5)"
                    : storyData.effect === "Warm"
                    ? "sepia(.3) saturate(1.3)"
                    : storyData.effect === "Cool"
                    ? "hue-rotate(15deg)"
                    : storyData.effect === "Fade"
                    ? "contrast(.8) brightness(1.1)"
                    : storyData.effect === "Mono"
                    ? "grayscale(1)"
                    : storyData.effect === "Drama"
                    ? "contrast(1.4)"
                    : storyData.effect === "Vintage"
                    ? "sepia(.45)"
                    : "none"
        }}
    />

)}


                {/* ==================================
                    VERTICAL SIZE SLIDER
                    Selected text / sticker / mention
                ================================== */}

                {selectedElementIndex !== null &&
                    storyData.elements?.[selectedElementIndex] && (

                    <div
                        className="story-element-size-slider"
                        onPointerDown={handleSizeSliderPointerDown}
                        onPointerMove={handleSizeSliderPointerMove}
                        onPointerUp={handleSizeSliderPointerUp}
                        onPointerCancel={handleSizeSliderPointerUp}
                        style={{
                            position: "absolute",
                            left: "18px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "28px",
                            height: "230px",
                            zIndex: 100,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            touchAction: "none",
                            cursor: "pointer"
                        }}
                    >

                        <div
                            style={{
                                position: "absolute",
                                top: "10px",
                                width: "3px",
                                height: "210px",
                                background: "rgba(255,255,255,0.85)",
                                borderRadius: "10px"
                            }}
                        />

                        <div
                            style={{
                                position: "absolute",
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "#ffffff",
                                border: "2px solid rgba(0,0,0,0.25)",
                                boxShadow: "0 1px 5px rgba(0,0,0,0.5)",
                                left: "50%",
                                transform: "translateX(-50%)",
                                top: `${
                                    10 +
                                    (
                                        (5 -
                                            (storyData.elements?.[selectedElementIndex]?.scale || 1)) /
                                        4.5
                                    ) *
                                    210 -
                                    8
                                }px`
                            }}
                        />

                    </div>

                )}


                {/* ==================================
                    MULTIPLE ELEMENTS
                ================================== */}

                {(storyData.elements || []).map(
                    function (
                        element,
                        index
                    ) {


                        // ==================================
                        // TEXT
                        // ==================================

                        if (
                            element.type ===
                            "text"
                        ) {

                            return (

                                <div
                                    key={
                                        "story-text-" +
                                        index
                                    }

                                    className="story-preview-text"

                                    onPointerDown={
                                        function (
                                            event
                                        ) {

                                            handleElementPointerDown(
                                                event,
                                                index
                                            );

                                        }
                                    }

                                    onPointerMove={
                                        handleElementPointerMove
                                    }

                                    onPointerUp={
                                        handleElementPointerUp
                                    }

                                    onPointerCancel={
                                        handleElementPointerUp
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

                                        background:
                                            "transparent",

                                        border:
                                            "none",

                                        padding:
                                            0,

                                        margin:
                                            0,

                                        touchAction:
                                            "none",

                                        userSelect:
                                            "none",

                                        cursor:
                                            "grab",

                                        zIndex:
                                            10

                                    }}
                                >

                                    {
                                        element.value
                                    }

                                </div>

                            );

                        }


                        // ==================================
                        // STICKER / EMOJI
                        // ==================================

                        if (
                            element.type ===
                            "sticker"
                        ) {

                            return (

                                <div
                                    key={
                                        "story-sticker-" +
                                        index
                                    }

                                    className="story-preview-sticker"

                                    onPointerDown={
                                        function (
                                            event
                                        ) {

                                            handleElementPointerDown(
                                                event,
                                                index
                                            );

                                        }
                                    }

                                    onPointerMove={
                                        handleElementPointerMove
                                    }

                                    onPointerUp={
                                        handleElementPointerUp
                                    }

                                    onPointerCancel={
                                        handleElementPointerUp
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

                                        background:
                                            "transparent",

                                        border:
                                            "none",

                                        padding:
                                            0,

                                        margin:
                                            0,

                                        touchAction:
                                            "none",

                                        userSelect:
                                            "none",

                                        cursor:
                                            "grab",

                                        zIndex:
                                            11

                                    }}
                                >

                                    {
                                        element.value
                                    }

                                </div>

                            );

                        }


                        // ==================================
                        // MENTION
                        // ==================================

                        if (
                            element.type ===
                            "mention"
                        ) {

                            return (

                                <div
                                    key={
                                        "story-mention-" +
                                        index
                                    }

                                    className="story-preview-mention"

                                    onPointerDown={
                                        function (
                                            event
                                        ) {

                                            handleElementPointerDown(
                                                event,
                                                index
                                            );

                                        }
                                    }

                                    onPointerMove={
                                        handleElementPointerMove
                                    }

                                    onPointerUp={
                                        handleElementPointerUp
                                    }

                                    onPointerCancel={
                                        handleElementPointerUp
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

                                        background:
                                            "transparent",

                                        backgroundColor:
                                            "transparent",

                                        border:
                                            "none",

                                        boxShadow:
                                            "none",

                                        padding:
                                            0,

                                        margin:
                                            0,

                                        color:
                                            "#ffffff",

                                        touchAction:
                                            "none",

                                        userSelect:
                                            "none",

                                        cursor:
                                            "grab",

                                        display:
                                            "inline-flex",

                                        alignItems:
                                            "center",

                                        zIndex:
                                            12

                                    }}
                                >

                                    <span>

                                        {
                                            element.username ||
                                            element.value ||
                                            ""
                                        }

                                    </span>

                                </div>

                            );

                        }


                        return null;

                    }
                )}


                {/* ==================================
                    MUSIC
                ================================== */}

                {storyData.music && (

                    <>

                        <audio
                            ref={audioRef}
                            onTimeUpdate={handleMusicTimeUpdate}
                            onPlay={function () {
                                setIsMusicPlaying(true);
                            }}
                            onPause={function () {
                                setIsMusicPlaying(false);
                            }}
                            preload="auto"
                        />

                        <div
                            className="story-preview-music"
                        >

                            <FiMusic />

                            <span>
                                {
                                    storyData.music
                                        .title
                                }
                            </span>

                            <button
                                type="button"
                                onClick={toggleMusicPlayback}
                                aria-label={
                                    isMusicPlaying
                                        ? "Pause music"
                                        : "Play music"
                                }
                            >

                                {isMusicPlaying ? (
                                    <FiPause />
                                ) : (
                                    <FiPlay />
                                )}

                            </button>

                        </div>

                    </>

                )}

            </div>


            {/* ==================================
                TEXT PANEL
            ================================== */}

            {activePanel === "text" && (

                <StoryText

                    value={
                        storyData.text
                    }

                    font={
                        storyData.font
                    }

                    color={
                        storyData.color
                    }

                    onChange={
                        updateData
                    }

                    onClose={
                        function () {

                            if (
                                storyData.text &&
                                storyData.text.trim()
                            ) {

                                addStoryElement({

                                    type:
                                        "text",

                                    value:
                                        storyData.text,

                                    font:
                                        storyData.font,

                                    color:
                                        storyData.color,

                                    x:
                                        50,

                                    y:
                                        50,

                                    scale:
                                        1,

                                    rotation:
                                        0

                                });

                            }


                            setStoryData(
                                function (
                                    current
                                ) {

                                    return {

                                        ...current,

                                        text:
                                            ""

                                    };

                                }
                            );


                            setActivePanel(
                                null
                            );

                        }
                    }

                />

            )}


            {/* ==================================
                STICKERS PANEL
            ================================== */}

            {activePanel === "stickers" && (

                <StoryStickers

                    selected={
                        storyData.sticker
                    }

                    onSelect={
                        function (
                            sticker
                        ) {

                            addStoryElement({

                                type:
                                    "sticker",

                                value:
                                    sticker,

                                x:
                                    50,

                                y:
                                    50,

                                scale:
                                    1,

                                rotation:
                                    0

                            });


                            setActivePanel(
                                null
                            );

                        }
                    }

                    onClose={
                        function () {

                            setActivePanel(
                                null
                            );

                        }
                    }

                />

            )}


            {/* ==================================
                MUSIC PANEL
            ================================== */}

            {activePanel === "music" && (

                <StoryMusic

                    selected={
                        storyData.music
                    }

                    onSelect={
                        function (
                            music
                        ) {

                            updateData({

                                music:
                                    music

                            });


                            setActivePanel(
                                null
                            );

                        }
                    }

                    onClose={
                        function () {

                            setActivePanel(
                                null
                            );

                        }
                    }

                />

            )}


            {/* ==================================
                MENTION PANEL
            ================================== */}

            {activePanel === "mention" && (

                <StoryMention

                    value={
                        storyData.mention
                    }

                    onChange={
                        function (
                            mention
                        ) {

                            updateData({

                                mention:
                                    mention

                            });


                            /*
                             * Real mention object
                             * StoryMention se aayega.
                             *
                             * String aaya toh abhi
                             * element nahi banayenge.
                             */

                            if (
                                mention &&
                                typeof mention ===
                                    "object"
                            ) {

                                addStoryElement({

                                    type:
                                        "mention",

                                    value:
                                        mention.username
                                            ? "@" +
                                              mention.username
                                            : mention.value,

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
                                        0

                                });

                            }

                        }
                    }

                    onClose={
                        function () {

                            setActivePanel(
                                null
                            );

                        }
                    }

                />

            )}


            {/* ==================================
                EFFECTS PANEL
            ================================== */}

            {activePanel === "effects" && (

                <StoryEffects

                    selected={
                        storyData.effect
                    }

                    onSelect={
                        function (
                            effect
                        ) {

                            updateData({

                                effect:
                                    effect

                            });

                        }
                    }

                    onClose={
                        function () {

                            setActivePanel(
                                null
                            );

                        }
                    }

                />

            )}


            {/* ==================================
                SETTINGS PANEL
            ================================== */}

            {activePanel === "settings" && (

                <StorySettings

                    settings={
                        storyData.settings
                    }

                    onChange={
                        updateSettings
                    }

                    onClose={
                        function () {

                            setActivePanel(
                                null
                            );

                        }
                    }

                />

            )}


            {/* ==================================
                BOTTOM
            ================================== */}

            <div
                className="story-editor-bottom"
            >

                <button
                    onClick={handleDone}
                >

                    <span>
                        Next
                    </span>

                    <FiCheck />

                </button>

            </div>

        </div>

    );

}


export default StoryEditor;