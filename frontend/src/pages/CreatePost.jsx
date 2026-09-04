import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import {
    FiArrowLeft,
    FiUsers,
    FiMapPin,
    FiMusic,
    FiX
} from "react-icons/fi";


const AUDIO_STORAGE_KEY = "insta_draft_audio";


function readStoredAudio() {

    try {

        const savedAudio =
            sessionStorage.getItem(
                AUDIO_STORAGE_KEY
            );

        if (!savedAudio) {

            return null;

        }

        return JSON.parse(
            savedAudio
        );

    } catch (error) {

        console.log(
            "READ AUDIO ERROR:",
            error
        );

        return null;

    }

}


function saveStoredAudio(audio) {

    try {

        if (audio) {

            sessionStorage.setItem(
                AUDIO_STORAGE_KEY,
                JSON.stringify(audio)
            );

        } else {

            sessionStorage.removeItem(
                AUDIO_STORAGE_KEY
            );

        }

    } catch (error) {

        console.log(
            "SAVE AUDIO ERROR:",
            error
        );

    }

}


function CreatePost() {

    const navigate = useNavigate();

    const location = useLocation();


    // =================================
    // EDITOR DATA
    // =================================

    const [postImage, setPostImage] = useState(
        location.state?.postImage || null
    );

    const [postFile, setPostFile] = useState(
    location.state?.postFile || null
);

const [mediaType, setMediaType] = useState(
    location.state?.mediaType || "image"
);

    const [caption, setCaption] = useState(
        location.state?.caption || ""
    );


    const [textOverlay, setTextOverlay] = useState(
        location.state?.textOverlay || null
    );


    const [textFont, setTextFont] = useState(
        location.state?.textFont || null
    );


    const [textColor, setTextColor] = useState(
        location.state?.textColor || null
    );


    const [selectedFilter, setSelectedFilter] = useState(
        location.state?.selectedFilter || null
    );


    const [adjustments, setAdjustments] = useState(
        location.state?.adjustments || {}
    );


    // =================================
    // TAGGED USER
    // =================================

    const [selectedUser, setSelectedUser] = useState(
        location.state?.taggedUser || null
    );


    // =================================
    // AUDIO
    // =================================

    const [selectedAudio, setSelectedAudio] = useState(
        location.state?.audio !== undefined
            ? location.state.audio
            : readStoredAudio()
    );


    // =================================
    // LOCATION
    // =================================

    const [selectedLocation, setSelectedLocation] = useState(
        location.state?.selectedLocation || null
    );


    // =================================
    // RECEIVE ROUTE DATA
    // =================================

    useEffect(function () {

        const state = location.state;


        if (!state) {

            return;

        }


        if (state.postImage !== undefined) {

            setPostImage(
                state.postImage
            );

        }
        if (state.postFile !== undefined) {

    setPostFile(
        state.postFile
    );

}

if (state.mediaType !== undefined) {

    setMediaType(
        state.mediaType
    );

}

        if (state.caption !== undefined) {

            setCaption(
                state.caption
            );

        }


        if (state.textOverlay !== undefined) {

            setTextOverlay(
                state.textOverlay
            );

        }


        if (state.textFont !== undefined) {

            setTextFont(
                state.textFont
            );

        }


        if (state.textColor !== undefined) {

            setTextColor(
                state.textColor
            );

        }


        if (state.selectedFilter !== undefined) {

            setSelectedFilter(
                state.selectedFilter
            );

        }


        if (state.adjustments !== undefined) {

            setAdjustments(
                state.adjustments
            );

        }


        if (state.taggedUser !== undefined) {

            setSelectedUser(
                state.taggedUser
            );

        }


        // =================================
        // AUDIO
        // =================================

        if (state.audio !== undefined) {

            setSelectedAudio(
                state.audio
            );

            saveStoredAudio(
                state.audio
            );

        }


        if (state.selectedLocation !== undefined) {

            setSelectedLocation(
                state.selectedLocation
            );

        }

    }, [location.state]);


    // =================================
    // SYNC AUDIO FROM STORAGE
    // =================================

    useEffect(function () {

        function syncAudio() {

            const latestAudio =
                readStoredAudio();

            setSelectedAudio(
                latestAudio
            );

        }


        window.addEventListener(
            "storage",
            syncAudio
        );


        return function () {

            window.removeEventListener(
                "storage",
                syncAudio
            );

        };

    }, []);


    // =================================
    // COMMON STATE
    // =================================

    function getCurrentState() {

        return {

            returnTo:
                "/createpost",

            postImage:
    postImage,

postFile:
    postFile,

mediaType:
    mediaType,

caption:
    caption,

            textOverlay:
                textOverlay,

            textFont:
                textFont,

            textColor:
                textColor,

            selectedFilter:
                selectedFilter,

            adjustments:
                adjustments,

            taggedUser:
                selectedUser,

            audio:
                selectedAudio,

            selectedLocation:
                selectedLocation

        };

    }


    // =================================
    // TAG PEOPLE
    // =================================

    function handleTagPeople() {

        navigate(
            "/tagpeople",
            {
                state:
                    getCurrentState()
            }
        );

    }


    // =================================
    // AUDIO
    // =================================

    function handleAudio() {

        navigate(
            "/addaudio",
            {
                state:
                    getCurrentState()
            }
        );

    }


    // =================================
    // LOCATION
    // =================================

    function handleLocation() {

        navigate(
            "/addlocation",
            {
                state:
                    getCurrentState()
            }
        );

    }


    // =================================
    // REMOVE TAG
    // =================================

    function handleRemoveTaggedUser() {

        setSelectedUser(
            null
        );

    }


    // =================================
    // REMOVE AUDIO
    // =================================

    function handleRemoveAudio() {

        setSelectedAudio(
            null
        );

        saveStoredAudio(
            null
        );

    }


    // =================================
    // REMOVE LOCATION
    // =================================

    function handleRemoveLocation() {

        setSelectedLocation(
            null
        );

    }


    // =================================
    // BACK
    // =================================

    function handleBack() {

        navigate(-1);

    }


    // =================================
    // DONE
    // =================================
// =================================
// DONE / CREATE POST IN DATABASE
// =================================

async function handleDone() {

    try {

        // =================================
        // IMAGE FILE CHECK
        // =================================

        let uploadFile =
    postFile;

if (!uploadFile && postImage) {
    try {
        const imageResponse =
            await fetch(postImage);

        const imageBlob =
            await imageResponse.blob();

        uploadFile =
            new File(
                [imageBlob],
                "post-image.jpg",
                {
                    type:
                        imageBlob.type ||
                        "image/jpeg"
                }
            );

        console.log(
            "POST FILE RECOVERED:",
            uploadFile
        );
    }
    catch (error) {
        console.error(
            "POST FILE RECOVERY ERROR:",
            error
        );

        alert(
            "Post image file is missing. Please select the image again."
        );

        return;
    }
}

if (!uploadFile) {
    console.error(
        "POST FILE AND POST IMAGE BOTH MISSING"
    );

    alert(
        "Post image is missing. Please select the image again."
    );

    return;
}


        // =================================
        // FORM DATA
        // =================================

        const formData =
            new FormData();


        // Actual device file
        formData.append(
    "image",
    uploadFile
);

        // Caption
        formData.append(
            "caption",
            caption || ""
        );


        // Text overlay
        formData.append(
            "textOverlay",
            textOverlay || ""
        );


        // Text font
        formData.append(
            "textFont",
            textFont || ""
        );


        // Text color
        formData.append(
            "textColor",
            textColor || ""
        );


        // Filter
        formData.append(
            "filter",
            selectedFilter || ""
        );


        // =================================
        // ADJUSTMENTS
        // =================================

        formData.append(
            "adjustments",
            JSON.stringify(
                adjustments || {}
            )
        );


        // =================================
        // TAGGED USER
        // =================================

        if (
            selectedUser
        ) {

            const taggedUserId =
                selectedUser._id ||
                selectedUser.id ||
                null;


            if (
                taggedUserId
            ) {

                formData.append(
                    "taggedUser",
                    taggedUserId
                );

            }

        }


        // =================================
        // LOCATION
        // =================================

        if (
            selectedLocation
        ) {

            formData.append(
                "location",
                JSON.stringify(
                    selectedLocation
                )
            );

        }


        // =================================
        // AUDIO
        // =================================

        if (
            selectedAudio
        ) {

            const audioForBackend = {

                title:
                    selectedAudio.title ||
                    "",

                channel:
                    selectedAudio.channel ||
                    selectedAudio.artist ||
                    "",

                image:
                    selectedAudio.image ||
                    selectedAudio.thumbnail ||
                    "",

                audioUrl:
                    selectedAudio.audioUrl ||
                    "",

                startTime:
                    Number(
                        selectedAudio.startTime ??
                        0
                    ),

                duration:
                    Math.min(
                        Number(
                            selectedAudio.duration ??
                            30
                        ),
                        30
                    )

            };


            formData.append(
                "audio",
                JSON.stringify(
                    audioForBackend
                )
            );

        }


        // =================================
        // DEBUG
        // =================================

        console.log(
            "CREATING POST..."
        );


        // =================================
        // CREATE POST API
        // POST /api/posts
        // =================================

        const response =
            await api(
                "/posts",
                {
                    method:
                        "POST",

                    body:
                        formData
                }
            );


        console.log(
            "CREATE POST RESPONSE:",
            response
        );


        // =================================
        // SUCCESS CHECK
        // =================================

        if (
            !response ||
            !response.post
        ) {

            throw new Error(
                "Post was not created"
            );

        }


        // =================================
        // POST SUCCESSFUL
        // =================================

        const createdPost =
            response.post;


        console.log(
            "MONGODB POST:",
            createdPost
        );


        // =================================
        // CLEAR TEMP AUDIO
        // =================================

        saveStoredAudio(
            null
        );


        // PostEditor draft bhi ab
        // successfully publish ho gaya.
        localStorage.removeItem(
            "postEditorDraft"
        );


        // =================================
        // GO TO PROFILE
        // =================================

      navigate(
    "/home",
    {
        replace: true,

        state: {

            createdPost:
                createdPost

        }

    }
);

    }
    catch (error) {

        console.error(
            "CREATE POST ERROR:",
            error
        );


        alert(
            error.message ||
            "Failed to create post"
        );

    }

}


    return (

        <div className="create-post-page">


            {/* =================================
                NAVBAR
            ================================= */}

            <div className="create-post-nav">


                <button
                    className="icon-btn"
                    onClick={handleBack}
                    title="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    New post
                </h1>


                <button
                    className="done-btn"
                    onClick={handleDone}
                >

                    Done

                </button>


            </div>


            {/* =================================
                POST PREVIEW
            ================================= */}

            <div className="upload-post">


                {postImage ? (

                    <div className="post-image-wrapper">

                        <img
                            src={postImage}
                            alt="Selected post"
                        />


                        {textOverlay && (

                            <span
                                className="post-text-overlay"
                                style={{
                                    color:
                                        textColor ||
                                        "#ffffff"
                                }}
                            >

                                {textOverlay}

                            </span>

                        )}

                    </div>

                ) : (

                    <div className="empty-post-image">

                        No image

                    </div>

                )}


                <textarea
                    value={caption}
                    onChange={function (event) {

                        setCaption(
                            event.target.value
                        );

                    }}
                    placeholder="Write a caption..."
                />


            </div>


            {/* =================================
                SELECTED AUDIO
            ================================= */}

            {selectedAudio && (

                <div className="selected-audio-info">


                    <FiMusic />


                    <div>

                        <p>
                            {selectedAudio.title}
                        </p>


                        <span>
                            {
                                selectedAudio.channel ||
                                selectedAudio.artist ||
                                ""
                            }
                        </span>


                        <small>

                            {
                                selectedAudio.startTime ??
                                0
                            }s

                            {" - "}

                            {
                                (
                                    selectedAudio.startTime ??
                                    0
                                ) +
                                (
                                    selectedAudio.duration ??
                                    30
                                )
                            }s

                        </small>

                    </div>


                    <button
                        className="small-remove-btn"
                        onClick={
                            handleRemoveAudio
                        }
                    >

                        <FiX />

                    </button>


                </div>

            )}


            {/* =================================
                TAGGED USER
            ================================= */}

            {selectedUser && (

                <div className="selected-tag-user">


                    <img
                        src={
                            selectedUser.image ||
                            selectedUser.profilePicture ||
                            ""
                        }
                        alt={
                            selectedUser.username
                        }
                    />


                    <div>

                        <p>
                            Tagged
                        </p>


                        <strong>
                            @{selectedUser.username}
                        </strong>

                    </div>


                    <button
                        className="small-remove-btn"
                        onClick={
                            handleRemoveTaggedUser
                        }
                    >

                        <FiX />

                    </button>


                </div>

            )}


            {/* =================================
                LOCATION
            ================================= */}

            {selectedLocation && (

                <div className="selected-location-info">


                    <FiMapPin />


                    <div>

                        <p>
                            Location
                        </p>


                        <strong>
                            {selectedLocation.name}
                        </strong>


                        {selectedLocation.subtitle && (

                            <small>
                                {
                                    selectedLocation.subtitle
                                }
                            </small>

                        )}

                    </div>


                    <button
                        className="small-remove-btn"
                        onClick={
                            handleRemoveLocation
                        }
                    >

                        <FiX />

                    </button>


                </div>

            )}


            {/* =================================
                POST OPTIONS
            ================================= */}

            <div className="post-content">


                <div
                    className="post-media"
                    onClick={handleTagPeople}
                >

                    <p>

                        {selectedUser
                            ? "Change tagged people"
                            : "Tag people"}

                    </p>


                    <button
                        className="option-icon"
                    >

                        <FiUsers />

                    </button>


                </div>


                <div
                    className="post-media"
                    onClick={handleAudio}
                >

                    <p>

                        {selectedAudio
                            ? "Change audio"
                            : "Add audio"}

                    </p>


                    <button
                        className="option-icon"
                    >

                        <FiMusic />

                    </button>


                </div>


                <div
                    className="post-media"
                    onClick={handleLocation}
                >

                    <p>

                        {selectedLocation
                            ? "Change location"
                            : "Add location"}

                    </p>


                    <button
                        className="option-icon"
                    >

                        <FiMapPin />

                    </button>


                </div>


            </div>


            {/* =================================
                ALSO POST TO
            ================================= */}

            <div className="send-post-media">


                <p className="also-post-title">
                    Also post to
                </p>


                <div className="post-media">

                    <p>
                        Facebook
                    </p>

                    <span>
                        Next
                    </span>

                </div>


                <div className="post-media">

                    <p>
                        Twitter
                    </p>

                    <span>
                        Next
                    </span>

                </div>


                <div className="post-media">

                    <p>
                        Tumblr
                    </p>

                    <span>
                        Next
                    </span>

                </div>


            </div>


        </div>

    );

}


export default CreatePost;