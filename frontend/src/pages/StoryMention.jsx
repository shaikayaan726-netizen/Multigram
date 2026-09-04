

import { useEffect, useState } from "react";
function StoryMention({
    value,
    onChange,
    onClose
}) {

    // ==========================================
    // SEARCH TEXT
    // ==========================================

    const [username, setUsername] =
        useState(
            typeof value === "string"
                ? value.replace(/^@/, "")
                : ""
        );


    // ==========================================
    // SEARCH RESULTS
    // ==========================================

    const [users, setUsers] =
        useState([]);


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // ERROR
    // ==========================================

    const [error, setError] =
        useState("");


    // ==========================================
    // SEARCH REAL USERS
    // ==========================================

    useEffect(function () {

        const query =
            username.trim();


        if (!query) {

            setUsers([]);

            setLoading(false);

            setError("");

            return;

        }


        let cancelled = false;


        const timer =
            setTimeout(
                async function () {

                    try {

                        setLoading(true);

                        setError("");


                        const token =
                            localStorage.getItem(
                                "token"
                            ) || "";


                        const response =
                            await fetch(
                                "/api/search-user?username=" +
                                encodeURIComponent(
                                    query
                                ),
                                {

                                    headers: {

                                        Authorization:
                                            "Bearer " +
                                            token

                                    }

                                }
                            );


                        if (!response.ok) {

                            throw new Error(
                                "User search failed"
                            );

                        }


                        const data =
                            await response.json();


                        if (cancelled) {

                            return;

                        }


                        let result = [];


                        if (
                            Array.isArray(data)
                        ) {

                            result = data;

                        }
                        else if (
                            Array.isArray(
                                data?.users
                            )
                        ) {

                            result =
                                data.users;

                        }
                        else if (
                            data?.user
                        ) {

                            result = [
                                data.user
                            ];

                        }


                        setUsers(
                            result
                        );

                    }
                    catch (searchError) {

                        if (cancelled) {

                            return;

                        }


                        console.error(
                            "STORY MENTION SEARCH ERROR:",
                            searchError
                        );


                        setUsers([]);

                        setError(
                            "User search failed"
                        );

                    }
                    finally {

                        if (!cancelled) {

                            setLoading(false);

                        }

                    }

                },
                300
            );


        return function () {

            cancelled = true;

            clearTimeout(timer);

        };

    }, [username]);


    // ==========================================
    // NORMALIZE PROFILE PICTURE
    // ==========================================

    function getProfilePicture(user) {

        const picture =
            user?.profilePicture ||
            user?.avatar ||
            user?.image ||
            "";


        if (!picture) {

            return "/default-avatar.jpg";

        }


        if (
            picture.startsWith("http://") ||
            picture.startsWith("https://") ||
            picture.startsWith("blob:") ||
            picture.startsWith("data:")
        ) {

            return picture;

        }


        if (
            picture.startsWith("/")
        ) {

            return picture;

        }


        return "/" + picture;

    }


    // ==========================================
    // ADD REAL USER
    // ==========================================

    function handleAddUser(user) {

        if (!user) {

            return;

        }


        const realUserId =
            user._id ||
            user.id ||
            "";


        if (!realUserId) {

            console.error(
                "STORY MENTION: User ID missing",
                user
            );

            return;

        }


        const mentionData = {

            type: "mention",

            // REAL MONGODB USER ID

            userId:
                realUserId,

            _id:
                realUserId,

            // REAL USER DATA

            username:
                user.username ||
                "",

            fullName:
                user.fullName ||
                "",

            profilePicture:
                getProfilePicture(user),

            value:
                user.username
                    ? "@" +
                      user.username
                    : ""

        };


        console.log(
            "STORY REAL MENTION SELECTED:",
            mentionData
        );


        // StoryEditor will create a new
        // independent element from this object.

        onChange(
            mentionData
        );

    }


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    function handleChange(event) {

        const text =
            event.target.value;


        setUsername(text);

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="story-mention-panel"
        >


            {/* ==================================
                HEADER
            ================================== */}

            <div
                className="story-mention-header"
            >

                <strong>
                    Mention
                </strong>


                <button
                    onClick={onClose}
                >

                    Done

                </button>

            </div>


            {/* ==================================
                SEARCH INPUT
            ================================== */}

            <div
                className="story-mention-input"
            >

                <span>
                    @
                </span>


                <input
                    value={username}
                    placeholder="Username"
                    onChange={
                        handleChange
                    }
                    autoFocus
                />

            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div
                    className="story-mention-status"
                >

                    Searching...

                </div>

            )}


            {/* ==================================
                ERROR
            ================================== */}

            {!loading &&
                error && (

                <div
                    className="story-mention-status"
                >

                    {error}

                </div>

            )}


            {/* ==================================
                SEARCH RESULTS
            ================================== */}

            {!loading &&
                !error &&
                users.length > 0 && (

                <div
                    className="story-mention-results"
                >

                    {users.map(
                        function (
                            user,
                            index
                        ) {

                            const userId =
                                user._id ||
                                user.id ||
                                (
                                    user.username +
                                    "-" +
                                    index
                                );


                            const picture =
                                getProfilePicture(
                                    user
                                );


                            return (

                                <div
                                    className="story-mention-user"
                                    key={
                                        userId
                                    }
                                >

                                    {/* PROFILE IMAGE */}

                                    <img
                                        src={
                                            picture
                                        }

                                        alt={
                                            user.username ||
                                            "User"
                                        }

                                        className="story-mention-avatar"

                                        onError={
                                            function (
                                                event
                                            ) {

                                                if (
                                                    event.currentTarget.src.endsWith(
                                                        "/default-avatar.jpg"
                                                    )
                                                ) {

                                                    return;

                                                }


                                                event.currentTarget.src =
                                                    "/default-avatar.jpg";

                                            }
                                        }
                                    />


                                    {/* USER INFO */}

                                    <div>

                                        <strong>

                                            @
                                            {
                                                user.username ||
                                                ""
                                            }

                                        </strong>


                                        <span>

                                            {
                                                user.fullName ||
                                                ""
                                            }

                                        </span>

                                    </div>


                                    {/* ADD */}

                                    <button
                                        onClick={
                                            function () {

                                                handleAddUser(
                                                    user
                                                );

                                            }
                                        }
                                    >

                                        Add

                                    </button>

                                </div>

                            );

                        }
                    )}

                </div>

            )}


            {/* ==================================
                NO USER
            ================================== */}

            {!loading &&
                !error &&
                username.trim() &&
                users.length === 0 && (

                <div
                    className="story-mention-status"
                >

                    No user found

                </div>

            )}


            {/* ==================================
                EMPTY STATE
            ================================== */}

            {!username.trim() && (

                <div
                    className="story-mention-status"
                >

                    Search a username to mention

                </div>

            )}

        </div>

    );

}


export default StoryMention;
