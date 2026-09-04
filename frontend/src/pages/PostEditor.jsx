import { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FiArrowLeft,
    FiMusic,
    FiType,
    FiImage,
    FiSliders,
    FiCheck,
    FiX
} from "react-icons/fi";


function PostEditor() {

    const navigate = useNavigate();

    const location = useLocation();


    // ==========================================
    // PREVIOUS PAGE DATA
    // ==========================================

    // ==========================================
// PREVIOUS / SAVED EDITOR DATA
// ==========================================

// ==========================================
// PREVIOUS / SAVED EDITOR DATA
// ==========================================

// ==========================================
// LOAD SAVED EDITOR DRAFT
// ==========================================

const savedDraft = (() => {

    try {

        const saved =
            localStorage.getItem(
                "postEditorDraft"
            );

        if (!saved) {

            return null;

        }

        return JSON.parse(saved);

    }
    catch (error) {

        console.error(
            "POST EDITOR DRAFT READ ERROR:",
            error
        );

        return null;

    }

})();


// ==========================================
// CURRENT ROUTE DATA
// ==========================================

const routeState =
    location.state || {};


// ==========================================
// COMBINE DATA
// ==========================================
//
// Route data available hai toh usko priority.
// Refresh par route data empty/limited hoga,
// toh saved draft se data milega.
//

const previousState = {

    ...(savedDraft || {}),

    ...routeState

};

// ==========================================
// IMAGE
// ==========================================

const postImage =
    previousState.postImage ||
    null;


const previousCaption =
    previousState.caption ||
    "";


const previousTaggedUser =
    previousState.taggedUser ||
    null;


const previousLocation =
    previousState.selectedLocation ||
    null;


const postFile =
    previousState.postFile ||
    null;


const mediaType =
    previousState.mediaType ||
    "image";
    // ==========================================
    // ACTIVE TOOL
    // ==========================================

    const [activeTool, setActiveTool] =
        useState(null);


    // ==========================================
    // TEXT
    // ==========================================

    const [text, setText] =
        useState(
            previousState.textOverlay || ""
        );


    const [textFont, setTextFont] =
        useState(
            previousState.textFont || "Editor"
        );


    const [textColor, setTextColor] =
        useState(
            previousState.textColor || "#ffffff"
        );

const [textApplied, setTextApplied] =
    useState(
        previousState.textOverlay !== null &&
        previousState.textOverlay !== undefined &&
        previousState.textOverlay !== ""
    );


    // ==========================================
    // MUSIC
    // ==========================================
    // AddAudio se jo audio aayega
    // wahi yahan preserve hoga.

    const [selectedAudio, setSelectedAudio] =
        useState(
            previousState.audio || null
        );


    // ==========================================
    // FILTER
    // ==========================================

    const [selectedFilter, setSelectedFilter] =
        useState(
            previousState.selectedFilter ||
            "Normal"
        );


    // ==========================================
    // EDIT VALUES
    // ==========================================

    const previousAdjustments =
        previousState.adjustments || {};


    const [adjust, setAdjust] =
        useState(
            previousAdjustments.adjust ?? 0
        );


    const [lux, setLux] =
        useState(
            previousAdjustments.lux ?? 0
        );


    const [brightness, setBrightness] =
        useState(
            previousAdjustments.brightness ?? 100
        );


    const [contrast, setContrast] =
        useState(
            previousAdjustments.contrast ?? 100
        );


    const [saturation, setSaturation] =
        useState(
            previousAdjustments.saturation ?? 100
        );

        // ==========================================
// SAVE EDITOR DRAFT
// ==========================================

// ==========================================
// SAVE EDITOR DRAFT
// ==========================================

useEffect(function () {

    const draft = {

        postImage:
            postImage,

        caption:
            previousCaption,

        taggedUser:
            previousTaggedUser,

        selectedLocation:
            previousLocation,

        postFile:
            postFile,

        mediaType:
            mediaType,

        audio:
            selectedAudio,

        textOverlay:
            textApplied
                ? text
                : null,

        textFont:
            textApplied
                ? textFont
                : null,

        textColor:
            textApplied
                ? textColor
                : null,

        selectedFilter:
            selectedFilter,

        adjustments: {

            adjust:
                adjust,

            lux:
                lux,

            brightness:
                brightness,

            contrast:
                contrast,

            saturation:
                saturation

        }

    };


    localStorage.setItem(
        "postEditorDraft",
        JSON.stringify(draft)
    );


}, [

    postImage,

    previousCaption,

    previousTaggedUser,

    previousLocation,

    postFile,

    mediaType,

    selectedAudio,

    text,

    textFont,

    textColor,

    textApplied,

    selectedFilter,

    adjust,

    lux,

    brightness,

    contrast,

    saturation

]);
    // ==========================================
    // FONTS
    // ==========================================

    const fonts = [

        {
            name: "Classic",
            className: "font-classic"
        },

        {
            name: "Signature",
            className: "font-signature"
        },

        {
            name: "Editor",
            className: "font-editor"
        },

        {
            name: "Poster",
            className: "font-poster"
        },

        {
            name: "Bubble",
            className: "font-bubble"
        },

        {
            name: "Typewriter",
            className: "font-typewriter"
        }

    ];


    // ==========================================
    // FILTERS
    // ==========================================

    const filters = [

        {
            name: "Normal",
            value: "none"
        },

        {
            name: "Vivid",
            value: "saturate(1.5) contrast(1.08)"
        },

        {
            name: "Warm",
            value: "sepia(.25) saturate(1.25)"
        },

        {
            name: "Cool",
            value: "saturate(.9) brightness(1.05)"
        },

        {
            name: "Fade",
            value:
                "contrast(.85) brightness(1.08) saturate(.75)"
        },

        {
            name: "Mono",
            value: "grayscale(1)"
        },

        {
            name: "Drama",
            value:
                "contrast(1.35) saturate(.85)"
        },

        {
            name: "Vintage",
            value:
                "sepia(.4) contrast(.9) saturate(.8)"
        }

    ];


    // ==========================================
    // GET FILTER
    // ==========================================

    function getFilterValue() {

        const filter =
            filters.find(function (item) {

                return (
                    item.name ===
                    selectedFilter
                );

            });


        return filter
            ? filter.value
            : "none";

    }


    // ==========================================
    // IMAGE STYLE
    // ==========================================

    function getImageStyle() {

        return {

            filter:
                `${getFilterValue()}
                brightness(${brightness}%)
                contrast(${contrast}%)
                saturate(${saturation}%)`,

            transform:
                `rotate(${adjust}deg)`

        };

    }


    // ==========================================
    // TEXT CLASS
    // ==========================================

    function getTextClass() {

        const font =
            fonts.find(function (item) {

                return (
                    item.name ===
                    textFont
                );

            });


        return font
            ? font.className
            : "font-editor";

    }


    // ==========================================
    // APPLY TEXT
    // ==========================================

    function handleTextApply() {

        if (!text.trim()) {

            setTextApplied(false);

            setActiveTool(null);

            return;

        }


        setTextApplied(true);

        setActiveTool(null);

    }


    // ==========================================
    // OPEN MUSIC
    // ==========================================

    function handleMusic() {

        navigate(
    "/addaudio",
    {
        state: {
            returnTo:
                "/posteditor",

            returnState: {
                postImage:
                    postImage,

                caption:
                    previousCaption,

                taggedUser:
                    previousTaggedUser,

                audio:
                    selectedAudio,

                postFile:
                    postFile,

                mediaType:
                    mediaType,

                selectedLocation:
                    previousLocation,

                textOverlay:
                    textApplied
                        ? text
                        : null,

                textFont:
                    textApplied
                        ? textFont
                        : null,

                textColor:
                    textApplied
                        ? textColor
                        : null,

                selectedFilter:
                    selectedFilter,

                adjustments: {
                    adjust:
                        adjust,

                    lux:
                        lux,

                    brightness:
                        brightness,

                    contrast:
                        contrast,

                    saturation:
                        saturation
                }
            }
        }
    }
);
    }


    // ==========================================
    // APPLY MUSIC
    // ==========================================

    function handleMusicApply() {

        setActiveTool(null);

    }


    // ==========================================
    // SELECT FILTER
    // ==========================================

    function handleFilter(filterName) {

        setSelectedFilter(
            filterName
        );

    }


    // ==========================================
    // APPLY FILTER
    // ==========================================

    function handleFilterApply() {

        setActiveTool(null);

    }


    // ==========================================
    // OPEN EDIT
    // ==========================================

    function handleEdit() {

        setActiveTool("edit");

    }


    // ==========================================
    // APPLY EDIT
    // ==========================================

    function handleEditDone() {

        setActiveTool(null);

    }


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // NEXT
    // ==========================================

    function handleNext() {

        const editorData = {

            postImage:
                postImage,
                postFile:
    postFile,

mediaType:
    mediaType,

            caption:
                previousCaption,

            taggedUser:
                previousTaggedUser,

            selectedLocation:
                previousLocation,

            // ==================================
            // SAME AUDIO OBJECT
            // ==================================

            audio:
                selectedAudio,

            textOverlay:
                textApplied
                    ? text
                    : null,

            textFont:
                textApplied
                    ? textFont
                    : null,

            textColor:
                textApplied
                    ? textColor
                    : null,

            selectedFilter:
                selectedFilter,

            adjustments: {

                adjust:
                    adjust,

                lux:
                    lux,

                brightness:
                    brightness,

                contrast:
                    contrast,

                saturation:
                    saturation

            }

        };


        console.log(
            "EDITOR DATA:",
            editorData
        );


        navigate(
            "/createpost",
            {
                state:
                    editorData
            }
        );

    }


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="post-editor-page">


            {/* =====================================
                NAVBAR
            ===================================== */}

            <div className="post-editor-nav">


                <button
                    className="editor-icon-btn"
                    onClick={handleBack}
                    title="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Edit
                </h1>


                <button
                    className="editor-next-btn"
                    onClick={handleNext}
                >

                    Next

                </button>


            </div>


            {/* =====================================
                IMAGE
            ===================================== */}

            <div className="editor-image-area">


                {postImage ? (

                    <img
                        src={postImage}
                        alt="Post"
                        className="editor-main-image"
                        style={getImageStyle()}
                    />

                ) : (

                    <div className="editor-no-image">

                        No image selected

                    </div>

                )}


                {/* =================================
                    TEXT OVERLAY
                ================================= */}

                {textApplied &&
                text && (

                    <div
                        className={
                            `editor-text-overlay ${getTextClass()}`
                        }
                        style={{
                            color: textColor
                        }}
                    >

                        {text}

                    </div>

                )}


            </div>


            {/* =====================================
                SELECTED AUDIO
            ===================================== */}

            {selectedAudio && (

                <div className="editor-selected-audio">

                    <FiMusic />


                    <div>

                        <strong>
                            {selectedAudio.title}
                        </strong>


                        <span>
                            {selectedAudio.channel}
                        </span>


                        <small>

                            {
                                selectedAudio.startTime ||
                                0
                            }
                            s
                            {" - "}
                            {
                                (
                                    selectedAudio.startTime ||
                                    0
                                ) +
                                (
                                    selectedAudio.duration ||
                                    30
                                )
                            }
                            s

                        </small>

                    </div>


                    <button
                        onClick={function () {

                            setSelectedAudio(null);

                        }}
                    >

                        <FiX />

                    </button>

                </div>

            )}


            {/* =====================================
                MAIN TOOLS
            ===================================== */}

            {activeTool === null && (

                <div className="editor-tools">


                    {/* MUSIC */}

                    <button
                        onClick={handleMusic}
                    >

                        <FiMusic />

                        <span>

                            {selectedAudio
                                ? "Change music"
                                : "Music"}

                        </span>

                    </button>


                    {/* TEXT */}

                    <button
                        onClick={function () {

                            setActiveTool(
                                "text"
                            );

                        }}
                    >

                        <FiType />

                        <span>
                            Text
                        </span>

                    </button>


                    {/* FILTER */}

                    <button
                        onClick={function () {

                            setActiveTool(
                                "filter"
                            );

                        }}
                    >

                        <FiImage />

                        <span>
                            Filter
                        </span>

                    </button>


                    {/* EDIT */}

                    <button
                        onClick={handleEdit}
                    >

                        <FiSliders />

                        <span>
                            Edit
                        </span>

                    </button>


                </div>

            )}


            {/* =====================================
                TEXT PANEL
            ===================================== */}

            {activeTool === "text" && (

                <div className="editor-bottom-panel">


                    <div className="panel-header">


                        <button
                            onClick={function () {

                                setActiveTool(null);

                            }}
                        >

                            <FiArrowLeft />

                        </button>


                        <strong>
                            Text
                        </strong>


                        <button
                            onClick={
                                handleTextApply
                            }
                        >

                            <FiCheck />

                        </button>


                    </div>


                    <input
                        className="text-input"
                        type="text"
                        placeholder="Type something..."
                        value={text}
                        onChange={function (event) {

                            setText(
                                event.target.value
                            );

                        }}
                    />


                    <div className="font-selector">

                        {fonts.map(function (font) {

                            return (

                                <button
                                    key={font.name}
                                    className={
                                        textFont ===
                                        font.name
                                            ? "font-option active"
                                            : "font-option"
                                    }
                                    onClick={function () {

                                        setTextFont(
                                            font.name
                                        );

                                    }}
                                >

                                    <span
                                        className={
                                            font.className
                                        }
                                    >

                                        {font.name}

                                    </span>

                                </button>

                            );

                        })}

                    </div>


                    <div className="text-colors">

                        {[
                            "#ffffff",
                            "#000000",
                            "#ff3040",
                            "#ff9500",
                            "#ffd60a",
                            "#30d158",
                            "#0a84ff",
                            "#bf5af2"
                        ].map(function (color) {

                            return (

                                <button
                                    key={color}
                                    className={
                                        textColor ===
                                        color
                                            ? "color-circle active"
                                            : "color-circle"
                                    }
                                    style={{
                                        backgroundColor:
                                            color
                                    }}
                                    onClick={function () {

                                        setTextColor(
                                            color
                                        );

                                    }}
                                />

                            );

                        })}

                    </div>


                </div>

            )}


            {/* =====================================
                FILTER PANEL
            ===================================== */}

            {activeTool === "filter" && (

                <div className="editor-bottom-panel">


                    <div className="panel-header">


                        <button
                            onClick={function () {

                                setActiveTool(null);

                            }}
                        >

                            <FiArrowLeft />

                        </button>


                        <strong>
                            Filter
                        </strong>


                        <button
                            onClick={
                                handleFilterApply
                            }
                        >

                            <FiCheck />

                        </button>


                    </div>


                    <div className="filter-grid">

                        {filters.map(function (filter) {

                            return (

                                <button
                                    key={filter.name}
                                    className={
                                        selectedFilter ===
                                        filter.name
                                            ? "filter-item active"
                                            : "filter-item"
                                    }
                                    onClick={function () {

                                        handleFilter(
                                            filter.name
                                        );

                                    }}
                                >

                                    {postImage ? (

                                        <img
                                            src={postImage}
                                            alt=""
                                            style={{
                                                filter:
                                                    filter.value
                                            }}
                                        />

                                    ) : (

                                        <div
                                            className="filter-preview-empty"
                                        >
                                            -
                                        </div>

                                    )}


                                    <span>
                                        {filter.name}
                                    </span>


                                </button>

                            );

                        })}

                    </div>


                </div>

            )}


            {/* =====================================
                EDIT PANEL
            ===================================== */}

            {activeTool === "edit" && (

                <div className="editor-bottom-panel">


                    <div className="panel-header">


                        <button
                            onClick={function () {

                                setActiveTool(null);

                            }}
                        >

                            <FiX />

                        </button>


                        <strong>
                            Edit
                        </strong>


                        <button
                            onClick={
                                handleEditDone
                            }
                        >

                            <FiCheck />

                        </button>


                    </div>


                    <div className="edit-options">


                        {/* ADJUST */}

                        <div className="edit-control">

                            <div className="edit-label">

                                <span>
                                    Adjust
                                </span>

                                <b>
                                    {adjust}
                                </b>

                            </div>


                            <input
                                type="range"
                                min="-20"
                                max="20"
                                value={adjust}
                                onChange={function (event) {

                                    setAdjust(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                }}
                            />

                        </div>


                        {/* LUX */}

                        <div className="edit-control">

                            <div className="edit-label">

                                <span>
                                    Lux
                                </span>

                                <b>
                                    {lux}
                                </b>

                            </div>


                            <input
                                type="range"
                                min="-100"
                                max="100"
                                value={lux}
                                onChange={function (event) {

                                    setLux(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                }}
                            />

                        </div>


                        {/* BRIGHTNESS */}

                        <div className="edit-control">

                            <div className="edit-label">

                                <span>
                                    Brightness
                                </span>

                                <b>
                                    {brightness}
                                </b>

                            </div>


                            <input
                                type="range"
                                min="50"
                                max="150"
                                value={brightness}
                                onChange={function (event) {

                                    setBrightness(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                }}
                            />

                        </div>


                        {/* CONTRAST */}

                        <div className="edit-control">

                            <div className="edit-label">

                                <span>
                                    Contrast
                                </span>

                                <b>
                                    {contrast}
                                </b>

                            </div>


                            <input
                                type="range"
                                min="50"
                                max="150"
                                value={contrast}
                                onChange={function (event) {

                                    setContrast(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                }}
                            />

                        </div>


                        {/* SATURATION */}

                        <div className="edit-control">

                            <div className="edit-label">

                                <span>
                                    Saturation
                                </span>

                                <b>
                                    {saturation}
                                </b>

                            </div>


                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={saturation}
                                onChange={function (event) {

                                    setSaturation(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                }}
                            />

                        </div>


                    </div>


                    <button
                        className="edit-done-button"
                        onClick={handleEditDone}
                    >

                        Apply

                    </button>


                </div>

            )}


        </div>

    );

}


export default PostEditor;