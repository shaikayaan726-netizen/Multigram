import { useEffect, useRef, useState } from "react";

import {
    FiX,
    FiRotateCcw,
    FiImage
} from "react-icons/fi";




function StoryCamera({ onMediaCaptured }) {

    const videoRef = useRef(null);

    const streamRef = useRef(null);

    const inputRef = useRef(null);


    const [cameraFacing, setCameraFacing] =
        useState("environment");

    const [cameraReady, setCameraReady] =
        useState(false);


    // ==========================================
    // START CAMERA
    // ==========================================

    useEffect(function () {

        startCamera();


        return function () {

            stopCamera();

        };

    }, [cameraFacing]);


    async function startCamera() {

        try {

            stopCamera();


            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                return;

            }


            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: cameraFacing
                    },

                    audio: false

                });


            streamRef.current = stream;


            if (videoRef.current) {

                videoRef.current.srcObject =
                    stream;

            }


            setCameraReady(true);

        }
        catch (error) {

            console.log("Camera error:", error);

            setCameraReady(false);

        }

    }


    function stopCamera() {

        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach(function (track) {

                    track.stop();

                });

            streamRef.current = null;

        }

    }


    // ==========================================
    // CAPTURE
    // ==========================================

    function capturePhoto() {

        if (!videoRef.current) {

            return;

        }


        const video =
            videoRef.current;


        if (
            !video.videoWidth ||
            !video.videoHeight
        ) {

            return;

        }


        const canvas =
            document.createElement("canvas");


        canvas.width =
            video.videoWidth;


        canvas.height =
            video.videoHeight;


        const context =
            canvas.getContext("2d");


        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.toBlob(function (blob) {

            if (!blob) {

                return;

            }


            const url =
                URL.createObjectURL(blob);


            onMediaCaptured({

                file: blob,

                url: url,

                type: "image"

            });

        }, "image/jpeg");

    }


    // ==========================================
    // SWITCH CAMERA
    // ==========================================

    function switchCamera() {

        setCameraFacing(function (current) {

            return current === "environment"
                ? "user"
                : "environment";

        });

    }


    // ==========================================
    // GALLERY
    // ==========================================

    function openGallery() {

        if (inputRef.current) {

            inputRef.current.click();

        }

    }


    function handleGallery(event) {

        const file =
            event.target.files &&
            event.target.files[0];


        if (!file) {

            return;

        }


        const url =
            URL.createObjectURL(file);


        onMediaCaptured({

            file: file,

            url: url,

            type:
                file.type.startsWith("video/")
                    ? "video"
                    : "image"

        });

    }


    return (

        <div className="story-camera-page">


            {!cameraReady && (

                <div className="story-camera-error">

                    <strong>
                        Camera unavailable
                    </strong>

                    <button
                        onClick={openGallery}
                    >
                        Choose from gallery
                    </button>

                </div>

            )}


            <video
                ref={videoRef}
                className="story-camera-video"
                autoPlay
                muted
                playsInline
            />


            {/* ==================================
                TOP
            ================================== */}

            <div className="story-camera-top">

                <button
                    onClick={function () {

                        window.history.back();

                    }}
                >

                    <FiX />

                </button>

            </div>


            {/* ==================================
                BOTTOM
            ================================== */}

            <div className="story-camera-bottom">

                <button
                    className="story-camera-gallery"
                    onClick={openGallery}
                >

                    <FiImage />

                </button>


                <button
                    className="story-camera-capture"
                    onClick={capturePhoto}
                >

                    <span></span>

                </button>


                <button
                    className="story-camera-switch"
                    onClick={switchCamera}
                >

                    <FiRotateCcw />

                </button>

            </div>


            <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="story-camera-input"
                onChange={handleGallery}
            />

        </div>

    );

}


export default StoryCamera;