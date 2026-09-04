import { useState } from "react";

import {
    FiArrowLeft,
    FiCheck
} from "react-icons/fi";


function ReelShare({
    media,
    text,
    elements,
    music,
    effects,
    stickers,
    audio,
    settings,
    onBack,
    onPublished
}) {

    const [caption, setCaption] =
        useState("");

    const [feed, setFeed] =
        useState(true);

    const [comments, setComments] =
        useState(true);

    const [busy, setBusy] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // PUBLISH REEL
    // ==========================================

    async function publish() {

        // ======================================
        // CHECK VIDEO
        // ======================================

        if (
            !media ||
            media.type !== "video" ||
            !media.file
        ) {

            setError(
                "Please select or record a video"
            );

            return;

        }


        try {

            setBusy(true);

            setError("");


            // ======================================
            // TOKEN
            // ======================================

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                setError(
                    "Please login to publish a reel"
                );

                setBusy(false);

                return;

            }


            // ======================================
            // FORM DATA
            // ======================================

            const formData =
                new FormData();


            // ======================================
            // VIDEO
            // ======================================

            const fileName =
                media.file.name ||
                "reel-video.webm";


            formData.append(
                "video",
                media.file,
                fileName
            );


            // ======================================
            // CAPTION
            // ======================================

            formData.append(
                "caption",
                caption || ""
            );


            // ======================================
            // DURATION
            // ======================================

            formData.append(
                "duration",
                String(
                    settings?.duration || 0
                )
            );


            // ======================================
            // TEXT
            // ======================================

            formData.append(
                "text",
                text || ""
            );


            // ======================================
            // REEL ELEMENTS
            // ======================================

            formData.append(
                "elements",
                JSON.stringify(
                    Array.isArray(elements)
                        ? elements
                        : []
                )
            );


            // ======================================
            // MUSIC
            // ======================================

            formData.append(
                "music",
                JSON.stringify(
                    music || {}
                )
            );


            // ======================================
            // EFFECTS
            // ======================================

            formData.append(
                "effects",
                JSON.stringify(
                    effects || []
                )
            );


            // ======================================
            // STICKERS
            // ======================================

            formData.append(
                "stickers",
                JSON.stringify(
                    stickers || []
                )
            );


            // ======================================
            // AUDIO
            // ======================================

            const audioPayload = {

                ...(audio || {}),

                volume:
                    audio?.volume ??
                    (
                        settings?.muted
                            ? 0
                            : 100
                    ),

                voiceover:
                    audio?.voiceover ??
                    false

            };


            formData.append(
                "audio",
                JSON.stringify(
                    audioPayload
                )
            );


            // ======================================
            // SHARE TO FEED
            // ======================================

            formData.append(
                "shareToFeed",
                String(feed)
            );


            // ======================================
            // ALLOW COMMENTS
            // ======================================

            formData.append(
                "allowComments",
                String(comments)
            );


            // ======================================
            // DEBUG
            // ======================================

            console.log(
                "PUBLISHING REEL..."
            );


            console.log(
                "REEL FILE:",
                media.file
            );


            console.log(
                "REEL ELEMENTS:",
                elements
            );


            // ======================================
            // UPLOAD
            // ======================================

            const response =
                await fetch(
                    "/api/reels",
                    {

                        method:
                            "POST",

                        headers: {

                            Authorization:
                                "Bearer " +
                                token

                        },

                        body:
                            formData

                    }
                );


            // ======================================
            // RESPONSE
            // ======================================

            let data = {};

            try {

                data =
                    await response.json();

            }

            catch (jsonError) {

                console.error(
                    "REEL RESPONSE JSON ERROR:",
                    jsonError
                );

            }


            // ======================================
            // ERROR
            // ======================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to publish reel"
                );

            }


            // ======================================
            // CHECK CREATED REEL
            // ======================================

            if (!data.reel) {

                throw new Error(
                    "Reel was uploaded but server did not return the reel"
                );

            }


            // ======================================
            // SUCCESS
            // ======================================

            console.log(
                "REEL PUBLISHED SUCCESSFULLY:",
                data.reel
            );


            // ======================================
            // SEND CREATED REEL TO PARENT
            // ======================================

            if (onPublished) {

                onPublished(
                    data.reel
                );

            }

        }

        catch (err) {

            console.error(
                "PUBLISH REEL ERROR:",
                err
            );


            setError(
                err.message ||
                "Failed to publish reel"
            );

        }

        finally {

            setBusy(false);

        }

    }


    // ==========================================
    // AUDIO DATA
    // ==========================================

    function audioData(currentSettings) {

        return {

            volume:
                currentSettings?.muted
                    ? 0
                    : 100,

            voiceover:
                false

        };

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="reel-share-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header>

                <button
                    onClick={onBack}
                    disabled={busy}
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    New reel
                </h1>


                <button
                    onClick={publish}
                    disabled={busy}
                >

                    <FiCheck />

                </button>

            </header>


            {/* ==================================
                PREVIEW
            ================================== */}

            <div className="share-preview">

                {
                    media?.type === "video"

                        ? (

                            <video
                                src={media.url}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />

                        )

                        : (

                            <div className="share-no-video">

                                Select a video

                            </div>

                        )
                }

            </div>


            {/* ==================================
                FORM
            ================================== */}

            <div className="share-form">


                <textarea
                    value={caption}
                    onChange={
                        function (e) {

                            setCaption(
                                e.target.value
                            );

                        }
                    }
                    placeholder="Write a caption..."
                    maxLength={2200}
                    disabled={busy}
                />


                {/* ==================================
                    ERROR
                ================================== */}

                {
                    error && (

                        <div className="share-error">

                            {error}

                        </div>

                    )
                }


                {/* ==================================
                    SHARE TO FEED
                ================================== */}

                <div className="share-row">

                    <span>

                        <b>
                            Share to feed
                        </b>

                        <small>
                            Show this reel on your profile feed.
                        </small>

                    </span>


                    <button
                        className={
                            feed
                                ? "switch active"
                                : "switch"
                        }
                        onClick={
                            function () {

                                setFeed(
                                    !feed
                                );

                            }
                        }
                        disabled={busy}
                    >

                        <i />

                    </button>

                </div>


                {/* ==================================
                    COMMENTS
                ================================== */}

                <div className="share-row">

                    <span>

                        <b>
                            Allow comments
                        </b>

                        <small>
                            People can comment on this reel.
                        </small>

                    </span>


                    <button
                        className={
                            comments
                                ? "switch active"
                                : "switch"
                        }
                        onClick={
                            function () {

                                setComments(
                                    !comments
                                );

                            }
                        }
                        disabled={busy}
                    >

                        <i />

                    </button>

                </div>


                {/* ==================================
                    SHARE BUTTON
                ================================== */}

                <button
                    className="share-button"
                    onClick={publish}
                    disabled={
                        busy ||
                        !media ||
                        media.type !== "video"
                    }
                >

                    {
                        busy
                            ? "Sharing..."
                            : "Share reel"
                    }

                </button>


            </div>

        </div>

    );

}


export default ReelShare;