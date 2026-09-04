import { useRef, useState } from "react";

import {
    FiArrowLeft,
    FiCamera
} from "react-icons/fi";


function StoryGallery({
    onMediaSelected,
    onOpenCamera,
    onBack
}) {

    const inputRef = useRef(null);

    const [preview, setPreview] = useState(null);


    // ==========================================
    // OPEN FILE GALLERY
    // ==========================================

    function openGallery() {

        if (inputRef.current) {

            inputRef.current.click();

        }

    }


    // ==========================================
    // FILE SELECT
    // ==========================================

    function handleFileChange(event) {

        const file =
            event.target.files &&
            event.target.files[0];


        if (!file) {

            return;

        }


        const url =
            URL.createObjectURL(file);


        const selectedMedia = {

            file: file,

            url: url,

            type:
                file.type.startsWith("video/")
                    ? "video"
                    : "image"

        };


        setPreview(selectedMedia);

        onMediaSelected(selectedMedia);

    }


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        if (onBack) {

            onBack();

            return;

        }

        window.history.back();

    }


    return (

        <div className="story-gallery-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="story-gallery-header">


                <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    New story
                </h1>


                {/* CAMERA */}

                <button
                    type="button"
                    onClick={onOpenCamera}
                    aria-label="Camera"
                >

                    <FiCamera />

                </button>

            </div>


            {/* ==================================
                TITLE
            ================================== */}

            <div className="story-gallery-title">

                <strong>
                    Recent
                </strong>

                <span>
                    Select a photo or video
                </span>

            </div>


            {/* ==================================
                GALLERY
            ================================== */}

            <div className="story-gallery-grid">


                {preview && (

                    <button
                        type="button"
                        className="story-gallery-item"
                        onClick={openGallery}
                    >

                        {preview.type === "image" ? (

                            <img
                                src={preview.url}
                                alt="Selected"
                            />

                        ) : (

                            <video
                                src={preview.url}
                                muted
                                playsInline
                            />

                        )}

                    </button>

                )}


                {!preview && (

                    <button
                        type="button"
                        className="story-gallery-empty"
                        onClick={openGallery}
                    >

                        <FiCamera />

                        <span>
                            Open Gallery
                        </span>

                    </button>

                )}

            </div>


            {/* ==================================
                FILE INPUT
            ================================== */}

            <input
                ref={inputRef}
                className="story-gallery-input"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
            />

        </div>

    );

}


export default StoryGallery;