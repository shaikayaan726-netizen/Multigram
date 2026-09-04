
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { useState,useEffect } from "react";
import {
    FiX,
    FiCheck,
    FiMusic,
    FiUsers,
    FiMapPin,
    FiType
} from "react-icons/fi";


const AUDIO_STORAGE_KEY = "insta_draft_audio";
const EDIT_POST_DRAFT_PREFIX = "insta_edit_post_draft_";
const EDIT_POST_LAST_ID_KEY = "insta_edit_post_last_id";
const BACKEND_URL = "http://localhost:3000";


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

function getProfileImage(profilePicture) {
    if (!profilePicture) return "";
    if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) return profilePicture;
    if (profilePicture.startsWith("/")) return BACKEND_URL + profilePicture;
    return BACKEND_URL + "/" + profilePicture;
}

function readEditDraft(postId) {
    if (!postId) return null;
    try {
        const saved = localStorage.getItem(EDIT_POST_DRAFT_PREFIX + String(postId));
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.warn("EDIT POST DRAFT READ ERROR:", error);
        return null;
    }
}

function EditPost() {

    const navigate = useNavigate();

    const location = useLocation();

    const postId =
        location.state?.postId ||
        location.state?.post?._id ||
        location.state?.post?.id ||
        localStorage.getItem(EDIT_POST_LAST_ID_KEY) ||
        null;

    const savedDraft = readEditDraft(postId);
    const initialState = location.state || savedDraft || {};


    // ==========================================
    // CURRENT USER
    // ==========================================

    const [user, setUser] =
        useState(null);


    // ==========================================
    // AUDIO
    // ==========================================

    const [selectedAudio, setSelectedAudio] =
    useState(
        initialState.audio !== undefined
            ? initialState.audio
            : null
    );


    // ==========================================
    // TAGGED USER
    // ==========================================

    const [selectedUser, setSelectedUser] =
        useState(
            initialState.taggedUser ||
            null
        );


    // ==========================================
    // LOCATION
    // ==========================================

    const [selectedLocation, setSelectedLocation] =
        useState(
            initialState.selectedLocation ||
            null
        );


    // ==========================================
    // OTHER EDITOR DATA
    // ==========================================

    const [postImage, setPostImage] =
        useState(
            initialState.postImage ||
            null
        );

    useEffect(function () {

    if (!postId) {
        return;
    }

    api(`/posts/${postId}`)
        .then(function (response) {

            const actualPost =
                response?.post ||
                response;

            if (!actualPost) {
                return;
            }

            if (actualPost.image) {
                setPostImage(
                    actualPost.image
                );
            }

            if (
                location.state?.audio === undefined
            ) {
                setSelectedAudio(
                    actualPost.audio ||
                    null
                );
            }

            if (
                location.state?.caption === undefined
            ) {
                setCaption(
                    actualPost.caption ||
                    ""
                );
            }

            if (location.state?.taggedUser === undefined && actualPost.taggedUser) {
                setSelectedUser(actualPost.taggedUser);
            }

            if (location.state?.selectedLocation === undefined) {
                if (actualPost.selectedLocation) {
                    setSelectedLocation(actualPost.selectedLocation);
                } else if (actualPost.location) {
                    setSelectedLocation(actualPost.location);
                }
            }

        })
        .catch(function (error) {

            console.error(
                "EDIT POST LOAD ERROR:",
                error
            );

        });

}, [postId]);
    const [caption, setCaption] =
        useState(
            initialState.caption ||
            ""
        );


    const [textOverlay, setTextOverlay] =
        useState(
            initialState.textOverlay ||
            null
        );


    const [textFont, setTextFont] =
        useState(
            initialState.textFont ||
            null
        );


    const [textColor, setTextColor] =
        useState(
            initialState.textColor ||
            null
        );


    const [selectedFilter, setSelectedFilter] =
        useState(
            initialState.selectedFilter ||
            null
        );


    const [adjustments, setAdjustments] =
        useState(
            initialState.adjustments ||
            {}
        );


    // ==========================================
    // RECEIVE ROUTE DATA
    // ==========================================

    useEffect(function () {

        const state =
            location.state;


        if (!state) {

            return;

        }


        // =================================
        // AUDIO
        // =================================

        if (
    state.audio !== undefined
) {

    setSelectedAudio(
        state.audio
    );

}


        if (
            state.taggedUser !== undefined
        ) {

            setSelectedUser(
                state.taggedUser
            );

        }


        if (
            state.selectedLocation !== undefined
        ) {

            setSelectedLocation(
                state.selectedLocation
            );

        }


        if (
            state.postImage !== undefined
        ) {

            setPostImage(
                state.postImage
            );

        }


        if (
            state.caption !== undefined
        ) {

            setCaption(
                state.caption
            );

        }


        if (
            state.textOverlay !== undefined
        ) {

            setTextOverlay(
                state.textOverlay
            );

        }


        if (
            state.textFont !== undefined
        ) {

            setTextFont(
                state.textFont
            );

        }


        if (
            state.textColor !== undefined
        ) {

            setTextColor(
                state.textColor
            );

        }


        if (
            state.selectedFilter !== undefined
        ) {

            setSelectedFilter(
                state.selectedFilter
            );

        }


        if (
            state.adjustments !== undefined
        ) {

            setAdjustments(
                state.adjustments
            );

        }

    }, [location.state]);


    // ==========================================
    // PERSIST EDIT DRAFT
    // ==========================================
    useEffect(function () {
        if (!postId) return;
        try {
            localStorage.setItem(
                EDIT_POST_LAST_ID_KEY,
                String(postId)
            );

            localStorage.setItem(
                EDIT_POST_DRAFT_PREFIX + String(postId),
                JSON.stringify({
                    postId: postId,
                    postImage: postImage,
                    caption: caption,
                    textOverlay: textOverlay,
                    textFont: textFont,
                    textColor: textColor,
                    selectedFilter: selectedFilter,
                    adjustments: adjustments,
                    audio: selectedAudio,
                    taggedUser: selectedUser,
                    selectedLocation: selectedLocation
                })
            );
        } catch (error) {
            console.warn("EDIT POST DRAFT SAVE ERROR:", error);
        }
    }, [postId, postImage, caption, textOverlay, textFont, textColor, selectedFilter, adjustments, selectedAudio, selectedUser, selectedLocation]);


    // ==========================================
    // SYNC AUDIO
    // ==========================================

   

    // ==========================================
    // CURRENT STATE
    // ==========================================

    function getCurrentState() {

        return {

            returnTo:
                "/editpost",
                postId:
    location.state?.postId ||
    location.state?.post?._id ||
    location.state?.post?.id,

            postImage:
                postImage,

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

            audio:
                selectedAudio,

            taggedUser:
                selectedUser,

            selectedLocation:
                selectedLocation

        };

    }


    // ==========================================
    // USER API
    // ==========================================
useEffect(function () {

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {
        return;
    }

    api("/auth/me")

        .then(function (data) {

            console.log(
                "EDIT POST USER:",
                data
            );

            setUser(
                data.user ||
                data
            );

        })

        .catch(function (error) {

            console.log(
                "EDIT POST ERROR:",
                error
            );

        });

}, []);

    // ==========================================
    // REMOVE AUDIO
    // ==========================================

    function handleRemoveAudio() {

    setSelectedAudio(
        null
    );

}


    // ==========================================
    // REMOVE USER
    // ==========================================

    function handleRemoveTaggedUser() {

        setSelectedUser(
            null
        );

    }


    // ==========================================
    // REMOVE LOCATION
    // ==========================================

    function handleRemoveLocation() {

        setSelectedLocation(
            null
        );

    }


    // ==========================================
    // CLOSE
    // ==========================================

    function handleClose() {

        navigate(
            "/home"
        );

    }


    // ==========================================
    // DONE
    // ==========================================
function handleDone() {

    try {

       


        const postId =
            location.state?.postId ||
            location.state?.post?._id ||
            location.state?.post?.id;


        if (!postId) {

            console.error(
                "EDIT POST ERROR: Post ID missing"
            );

            alert(
                "Post ID missing"
            );

            return;

        }


       const updatedData = {
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

    audio:
        selectedAudio,

    taggedUser:
        selectedUser,

    location:
        selectedLocation
};
        console.log(
            "EDIT POST ID:",
            postId
        );


        console.log(
            "UPDATED POST DATA:",
            updatedData
        );


        api(
            `/posts/${postId}`,
            {
                method: "PUT",
                body: JSON.stringify(
                    updatedData
                )
            }
        )
        .then(function (response) {

            console.log(
                "EDIT POST RESPONSE:",
                response
            );


            try {
                localStorage.removeItem(
                    EDIT_POST_DRAFT_PREFIX + String(postId)
                );
                localStorage.removeItem(
                    EDIT_POST_LAST_ID_KEY
                );
            } catch (error) {
                console.warn("EDIT POST DRAFT CLEAR ERROR:", error);
            }

            navigate(
                "/home"
            );

        })
        .catch(function (error) {

            console.error(
                "EDIT POST ERROR:",
                error
            );


            alert(
                error.message ||
                "Failed to update post"
            );

        });

    }
    catch (error) {

        console.error(
            "EDIT POST ERROR:",
            error
        );

    }

}


    // ==========================================
    // OPEN AUDIO
    // ==========================================

    function handleAudio() {

        navigate(
            "/addaudio",
            {
                state:
                    getCurrentState()
            }
        );

    }


    // ==========================================
    // OPEN TAG PEOPLE
    // ==========================================

    function handleTagPeople() {

        navigate(
            "/tagpeople",
            {
                state:
                    getCurrentState()
            }
        );

    }


    // ==========================================
    // OPEN LOCATION
    // ==========================================

   function handleLocation() {

    navigate(
        "/addlocation",
        {
            state: {
                ...getCurrentState(),

                returnTo: "/editpost",

                postId:
                    location.state?.postId ||
                    location.state?.post?._id ||
                    location.state?.post?.id,

                postImage:
                    postImage,

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

                audio:
                    selectedAudio,

                taggedUser:
                    selectedUser,

                selectedLocation:
                    selectedLocation
            }
        }
    );

}


    return (

        <div className="edit-post-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div className="edit-post-nav">


                <button
                    className="icon-btn"
                    onClick={handleClose}
                >

                    <FiX />

                </button>


                <h1>
                    Edit info
                </h1>


                <button
                    className="icon-btn done-icon"
                    onClick={handleDone}
                >

                    <FiCheck />

                </button>


            </div>


            {/* ==========================================
                USER
            ========================================== */}

            <div className="edit-post-user">


                {getProfileImage(user?.profilePicture) ? (
                    <img
                        src={getProfileImage(user?.profilePicture)}
                        alt="profile"
                        onError={function (event) {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="edit-post-default-avatar">
                        <FiUsers />
                    </div>
                )}


                <p>

                    {user
                        ? user.username
                        : "Loading..."}

                </p>


            </div>


            {/* ==========================================
                IMAGE
            ========================================== */}

            <div className="edit-post-image">

                {postImage ? (

                    <img
                        src={postImage}
                        alt="post"
                    />

                ) : (

                    <img
                        src="https://picsum.photos/600/600"
                        alt="post"
                    />

                )}

            </div>


            {/* ==========================================
                CAPTION
            ========================================== */}

            <div className="edit-caption">

                <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={function (event) {

                        setCaption(
                            event.target.value
                        );

                    }}
                />

            </div>


            {/* ==========================================
                SELECTED AUDIO
            ========================================== */}

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
                            }
                            s

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
                            }
                            s

                        </small>

                    </div>


                    <button
                        className="icon-btn"
                        onClick={
                            handleRemoveAudio
                        }
                    >

                        <FiX />

                    </button>


                </div>

            )}


            {/* ==========================================
                TAGGED USER
            ========================================== */}

            {selectedUser && (

                <div className="selected-tag-user">


                    {getProfileImage(selectedUser.image || selectedUser.profilePicture) ? (
                        <img
                            src={getProfileImage(selectedUser.image || selectedUser.profilePicture)}
                            alt={selectedUser.username}
                            onError={function (event) {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="edit-post-default-avatar">
                            <FiUsers />
                        </div>
                    )}


                    <div>

                        <p>
                            Tagged
                        </p>


                        <strong>
                            @{selectedUser.username}
                        </strong>

                    </div>


                    <button
                        className="icon-btn"
                        onClick={
                            handleRemoveTaggedUser
                        }
                    >

                        <FiX />

                    </button>


                </div>

            )}


            {/* ==========================================
                LOCATION
            ========================================== */}

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
                        className="icon-btn"
                        onClick={
                            handleRemoveLocation
                        }
                    >

                        <FiX />

                    </button>


                </div>

            )}


            {/* ==========================================
                EDIT OPTIONS
            ========================================== */}

            <div className="edit-options">


                {/* AUDIO */}

                <div
                    className="edit-option"
                    onClick={
                        handleAudio
                    }
                >

                    <div className="edit-option-left">

                        <FiMusic />

                        <p>

                            {selectedAudio
                                ? "Change audio"
                                : "Add audio"}

                        </p>

                    </div>


                    <span>
                        &gt;
                    </span>

                </div>


                {/* TAG PEOPLE */}

                <div
                    className="edit-option"
                    onClick={
                        handleTagPeople
                    }
                >

                    <div className="edit-option-left">

                        <FiUsers />

                        <p>

                            {selectedUser
                                ? "Change tagged people"
                                : "Tag people and collaborators"}

                        </p>

                    </div>


                    <span>
                        &gt;
                    </span>

                </div>


                {/* LOCATION */}

                <div
                    className="edit-option"
                    onClick={
                        handleLocation
                    }
                >

                    <div className="edit-option-left">

                        <FiMapPin />

                        <p>

                            {selectedLocation
                                ? "Change location"
                                : "Add location"}

                        </p>

                    </div>


                    <span>
                        &gt;
                    </span>

                </div>


                {/* ALT TEXT */}

                <div className="edit-option">

                    <div className="edit-option-left">

                        <FiType />

                        <p>
                            Edit alt text
                        </p>

                    </div>


                    <span>
                        &gt;
                    </span>

                </div>


            </div>


        </div>

    );

}


export default EditPost;