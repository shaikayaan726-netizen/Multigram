import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FiArrowLeft,
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiVideo,
    FiUser
} from "react-icons/fi";

import { api } from "../utils/api";


function Followers() {

    const navigate = useNavigate();

    const { userId } =
        useParams();


    // ===========================
    // SEARCH
    // ===========================

    const [search, setSearch] =
        useState("");


    // ===========================
    // USERS
    // ===========================

    const [users, setUsers] =
        useState([]);


    // ===========================
    // LOADING
    // ===========================

    const [loading, setLoading] =
        useState(true);


    // ===========================
    // PROCESSING USER
    // ===========================

    const [processingId, setProcessingId] =
        useState(null);


    // ===========================
    // LOAD FOLLOWERS
    // ===========================

    useEffect(function() {

        loadFollowers();

    }, [userId]);


    // ===========================
    // GET FOLLOWERS
    // ===========================

    async function loadFollowers() {

        try {

            setLoading(true);


            let response;


            // ==================================
            // SPECIFIC USER PROFILE
            // ==================================

            if (userId) {

                response =
                    await api(
                        "/followers/" +
                        userId
                    );

            }


            // ==================================
            // OWN PROFILE
            // ==================================

            else {

                response =
                    await api(
                        "/followers"
                    );

            }


            console.log(
                "FOLLOWERS RESPONSE:",
                response
            );


            const followers =
                Array.isArray(
                    response.followers
                )
                    ? response.followers
                    : [];


            // ==================================
            // CURRENT LOGGED-IN USER
            // ==================================

            const meResponse =
                await api(
                    "/auth/me"
                );


            const currentUser =
                meResponse.user;


            const followingIds =
                Array.isArray(
                    currentUser?.following
                )
                    ? currentUser.following
                    : [];


            // ==================================
            // FORMAT USERS
            // ==================================

            const formattedUsers =
                followers.map(
                    function(user) {

                        const targetId =
                            user._id?.toString();


                        const isFollowing =
                            followingIds.some(
                                function(id) {

                                    return (
                                        id?.toString() ===
                                        targetId
                                    );

                                }
                            );


                        return {

                            id:
                                user._id,

                            username:
                                user.username || "",

                            fullName:
                                user.fullName || "",

                            image:
                                user.profilePicture
                                    ? (
                                        user.profilePicture.startsWith("http")
                                            ? user.profilePicture
                                            : "/" +
                                              user.profilePicture.replace(
                                                  /^\/+/,
                                                  ""
                                              )
                                    )
                                    : "/default-avatar.jpg",

                            isFollowing:
                                isFollowing

                        };

                    }
                );


            setUsers(
                formattedUsers
            );

        }
        catch(error) {

            console.error(
                "LOAD FOLLOWERS ERROR:",
                error
            );


            setUsers([]);

        }
        finally {

            setLoading(false);

        }

    }


    // ===========================
    // FILTER
    // ===========================

    const filteredUsers =
        users.filter(function(user) {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            if (!searchText) {

                return true;

            }


            return (

                user.username
                    .toLowerCase()
                    .includes(searchText)

                ||

                user.fullName
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    // ===========================
    // BACK
    // ===========================

    function handleBack() {

        navigate(-1);

    }


    // ===========================
    // OPEN PROFILE
    // ===========================

    function handleProfile(user) {

        navigate(
            "/profile/" +
            user.username
        );

    }


    // ===========================
    // FOLLOW
    // ===========================

    async function handleFollow(targetUserId) {

        try {

            setProcessingId(
                targetUserId
            );


            const response =
                await api(
                    "/follow/" +
                    targetUserId,
                    {
                        method: "POST"
                    }
                );


            console.log(
                "FOLLOW RESPONSE:",
                response
            );


            if (
                response.message ===
                    "Follow Request Sent" ||

                response.message ===
                    "Follow Request Already Sent"
            ) {

                setUsers(
                    function(oldUsers) {

                        return oldUsers.map(
                            function(user) {

                                if (
                                    user.id?.toString() ===
                                    targetUserId?.toString()
                                ) {

                                    return {

                                        ...user,

                                        isFollowing:
                                            true

                                    };

                                }


                                return user;

                            }
                        );

                    }
                );

            }


            if (
                response.message ===
                "Already Following"
            ) {

                setUsers(
                    function(oldUsers) {

                        return oldUsers.map(
                            function(user) {

                                if (
                                    user.id?.toString() ===
                                    targetUserId?.toString()
                                ) {

                                    return {

                                        ...user,

                                        isFollowing:
                                            true

                                    };

                                }


                                return user;

                            }
                        );

                    }
                );

            }

        }
        catch(error) {

            console.error(
                "FOLLOW ERROR:",
                error
            );

        }
        finally {

            setProcessingId(null);

        }

    }


    // ===========================
    // UNFOLLOW
    // ===========================

    async function handleUnfollow(targetUserId) {

        try {

            setProcessingId(
                targetUserId
            );


            const response =
                await api(
                    "/unfollow/" +
                    targetUserId,
                    {
                        method: "DELETE"
                    }
                );


            console.log(
                "UNFOLLOW RESPONSE:",
                response
            );


            setUsers(
                function(oldUsers) {

                    return oldUsers.map(
                        function(user) {

                            if (
                                user.id?.toString() ===
                                targetUserId?.toString()
                            ) {

                                return {

                                    ...user,

                                    isFollowing:
                                        false

                                };

                            }


                            return user;

                        }
                    );

                }
            );

        }
        catch(error) {

            console.error(
                "UNFOLLOW ERROR:",
                error
            );

        }
        finally {

            setProcessingId(null);

        }

    }


    // ===========================
    // HOME
    // ===========================

    function handleHome() {

        navigate("/home");

    }


    // ===========================
    // SEARCH
    // ===========================

    function handleSearch() {

        navigate("/search");

    }


    // ===========================
    // CREATE
    // ===========================

    function handleCreate() {

        navigate("/createpost");

    }


    // ===========================
    // REELS
    // ===========================

    function handleReels() {

        navigate("/reels");

    }


    // ===========================
    // MY PROFILE
    // ===========================

    function handleMyProfile() {

        navigate("/profile");

    }


    // ===========================
    // LOADING
    // ===========================

    if (loading) {

        return (

            <div className="Followers-page">

                <div className="follow-requests-loading">

                    Loading...

                </div>

            </div>

        );

    }


    // ===========================
    // MAIN UI
    // ===========================

    return (

        <div className="Followers-page">


            {/* ===========================
                NAVBAR
            =========================== */}

            <div className="followers-nav">

                <button
                    className="followers-back-btn"
                    onClick={handleBack}
                    title="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Followers
                </h1>


                <div className="followers-nav-space">
                </div>

            </div>


            {/* ===========================
                SEARCH
            =========================== */}

            <div className="followers-search">

                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={function(event) {

                        setSearch(
                            event.target.value
                        );

                    }}
                />

            </div>


            {/* ===========================
                USER LIST
            =========================== */}

            <div className="followers-list">

                {filteredUsers.map(
                    function(user) {

                        const isProcessing =
                            processingId?.toString() ===
                            user.id?.toString();


                        return (

                            <div
                                className="followers-profile"
                                key={user.id}
                            >

                                {/* PROFILE */}

                                <div
                                    className="followers-profile-dp"
                                    onClick={function() {

                                        handleProfile(
                                            user
                                        );

                                    }}
                                >

                                    <img
                                        src={user.image}
                                        alt={user.username}
                                    />


                                    <div className="followers-info">

                                        <h3>
                                            {user.username}
                                        </h3>


                                        <p>
                                            {user.fullName}
                                        </p>

                                    </div>

                                </div>


                                {/* BUTTON */}

                                <button
                                    className={
                                        user.isFollowing
                                            ? "followers-profile-btn following-btn"
                                            : "followers-profile-btn follow-btn"
                                    }
                                    disabled={
                                        isProcessing
                                    }
                                    onClick={function() {

                                        if (
                                            user.isFollowing
                                        ) {

                                            handleUnfollow(
                                                user.id
                                            );

                                        }
                                        else {

                                            handleFollow(
                                                user.id
                                            );

                                        }

                                    }}
                                >

                                    {
                                        isProcessing
                                            ? "..."
                                            : user.isFollowing
                                                ? "Following"
                                                : "Follow"
                                    }

                                </button>

                            </div>

                        );

                    }
                )}


                {/* NO USERS */}

                {filteredUsers.length === 0 && (

                    <p className="followers-no-users">

                        No followers found

                    </p>

                )}

            </div>


            {/* ===========================
                BOTTOM NAV
            =========================== */}

            <div className="bottom-nav">

                <button
                    className="icon-btn"
                    onClick={handleHome}
                    title="Home"
                >

                    <FiHome />

                </button>


                <button
                    className="icon-btn"
                    onClick={handleSearch}
                    title="Search"
                >

                    <FiSearch />

                </button>


                <button
                    className="icon-btn"
                    onClick={handleCreate}
                    title="Create"
                >

                    <FiPlusSquare />

                </button>


                <button
                    className="icon-btn"
                    onClick={handleReels}
                    title="Reels"
                >

                    <FiVideo />

                </button>


                <button
                    className="icon-btn"
                    onClick={handleMyProfile}
                    title="Profile"
                >

                    <FiUser />

                </button>

            </div>

        </div>

    );

}


export default Followers;