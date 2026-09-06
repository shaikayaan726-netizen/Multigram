import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiX,
    FiCamera,
    FiCheckSquare,
    FiChevronDown,
    FiCrop,
    FiVideo
} from "react-icons/fi";


function PostGallery() {

    const navigate = useNavigate();


    // ==========================================
    // DEVICE FILE INPUT
    // ==========================================

    const fileInputRef =
        useRef(null);


    // ==========================================
    // SELECTED MEDIA
    // ==========================================

    const [selectedMedia, setSelectedMedia] =
        useState(null);


    // ==========================================
    // ALBUM
    // ==========================================

    const [album, setAlbum] =
        useState("Recents");


    // ==========================================
    // DEVICE MEDIA
    // ==========================================

    const [deviceMedia, setDeviceMedia] =
        useState([]);


    // ==========================================
    // OPEN DEVICE PICKER
    // ==========================================

    function handleOpenPicker() {

        if (
            fileInputRef.current
        ) {

            fileInputRef.current.click();

        }

    }


    // ==========================================
    // DEVICE MEDIA SELECT
    // ==========================================

    function handleDeviceMedia(event) {

        const files =
            Array.from(
                event.target.files || []
            );


        if (
            files.length === 0
        ) {

            return;

        }


        const mediaFiles =
            files.map(function (file) {

                return {

                    file:
                        file,

                    preview:
                        URL.createObjectURL(
                            file
                        ),

                    type:
                        file.type.startsWith(
                            "video/"
                        )
                            ? "video"
                            : "image"

                };

            });


        setDeviceMedia(
            mediaFiles
        );


        // First selected media
        // automatically preview hoga

        setSelectedMedia(
            mediaFiles[0]
        );


        // Same file ko dobara select
        // karne ki permission

        event.target.value = "";

    }


    // ==========================================
    // SELECT MEDIA FROM GRID
    // ==========================================

    function handleSelectMedia(media) {

        setSelectedMedia(
            media
        );

    }


    // ==========================================
    // NEXT
    // ==========================================
async function handleNext() {
    if (
        !selectedMedia ||
        !selectedMedia.file
    ) {
        return;
    }

    try {
        const file = selectedMedia.file;

        const reader = new FileReader();

        reader.onload = function () {
            navigate(
                "/posteditor",
                {
                    state: {
                        // ACTUAL DEVICE FILE
                        postFile:
                            file,

                        // PERSISTENT PREVIEW
                        postImage:
                            reader.result,

                        // MEDIA TYPE
                        mediaType:
                            selectedMedia.type
                    }
                }
            );
        };

        reader.readAsDataURL(file);
    }
    catch (error) {
        console.error(
            "POST IMAGE PREVIEW ERROR:",
            error
        );
    }
}


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // ALBUM
    // ==========================================

    function handleAlbum() {

        setAlbum(

            album === "Recents"
                ? "Albums"
                : "Recents"

        );

    }


    return (

        <div className="post-gallery-page">


            {/* =================================
                HIDDEN DEVICE FILE INPUT
            ================================= */}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={
                    handleDeviceMedia
                }
            />


            {/* =================================
                NAVBAR
            ================================= */}

            <div className="post-gallery-nav">


                <button
                    onClick={handleBack}
                    className="gallery-icon-btn"
                >

                    <FiX />

                </button>


                <h1>
                    New post
                </h1>


                <button
                    className={
                        selectedMedia
                            ? "gallery-next active"
                            : "gallery-next"
                    }
                    onClick={handleNext}
                    disabled={
                        !selectedMedia
                    }
                >

                    Next

                </button>


            </div>


            {/* =================================
                SELECTED MEDIA PREVIEW
            ================================= */}

            <div className="selected-gallery-preview">


                {selectedMedia ? (

                    selectedMedia.type === "video" ? (

                        <video
                            src={
                                selectedMedia.preview
                            }
                            controls
                            playsInline
                        />

                    ) : (

                        <img
                            src={
                                selectedMedia.preview
                            }
                            alt="Selected"
                        />

                    )

                ) : (

                    <div className="gallery-empty">

                        <FiCamera />

                    </div>

                )}


                {/* =================================
                    CROP BUTTON
                ================================= */}

                <button
                    className="crop-btn"
                    type="button"
                >

                    <FiCrop />

                </button>


            </div>


            {/* =================================
                ALBUM BAR
            ================================= */}

            <div className="gallery-heading">


                <button
                    className="album-btn"
                    onClick={
                        handleAlbum
                    }
                >

                    {album}

                    <FiChevronDown />

                </button>


                {/* =================================
                    SELECT DEVICE MEDIA
                ================================= */}

                <button
                    className="select-btn"
                    onClick={
                        handleOpenPicker
                    }
                >

                    <FiCheckSquare />

                    Select

                </button>


            </div>


            {/* =================================
                GALLERY GRID
            ================================= */}

            <div className="gallery-grid">


                {/* =================================
                    CAMERA / DEVICE PICKER
                ================================= */}

                <div
                    className="camera-tile"
                    onClick={
                        handleOpenPicker
                    }
                >

                    <FiCamera />

                </div>


                {/* =================================
                    DEVICE MEDIA
                ================================= */}

                {deviceMedia.map(
                    function (
                        media,
                        index
                    ) {


                        const isSelected =
                            selectedMedia &&
                            selectedMedia.file ===
                                media.file;


                        return (

                            <div
                                className={
                                    isSelected
                                        ? "gallery-item selected"
                                        : "gallery-item"
                                }
                                key={
                                    index
                                }
                                onClick={
                                    function () {

                                        handleSelectMedia(
                                            media
                                        );

                                    }
                                }
                            >


                                {media.type === "video" ? (

                                    <>

                                        <video
                                            src={
                                                media.preview
                                            }
                                            muted
                                            playsInline
                                        />


                                        <div
                                            className="video-indicator"
                                        >

                                            <FiVideo />

                                        </div>

                                    </>

                                ) : (

                                    <img
                                        src={
                                            media.preview
                                        }
                                        alt=""
                                    />

                                )}


                                {isSelected && (

                                    <div className="selected-check">

                                        <FiCheckSquare />

                                    </div>

                                )}


                            </div>

                        );

                    }
                )}


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {deviceMedia.length === 0 && (

                    <div
                        className="gallery-device-empty"
                        onClick={
                            handleOpenPicker
                        }
                    >

                        <FiCamera />

                        <span>
                            Select photos or videos
                        </span>

                    </div>

                )}


            </div>


            {/* =================================
                BOTTOM MODE BAR
            ================================= */}

            <div className="gallery-mode-bar">


                <span className="active">
                    POST
                </span>


                <span
                    onClick={
                        function () {

                            navigate(
                                "/createstory"
                            );

                        }
                    }
                >

                    STORY

                </span>


                <span
                    onClick={
                        function () {

                            navigate(
                                "/reelcreate"
                            );

                        }
                    }
                >

                    REEL

                </span>


                <span>
                    LIVE
                </span>


            </div>


        </div>

    );

}


export default PostGallery;