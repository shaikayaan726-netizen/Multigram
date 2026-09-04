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


function Following() {

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
    // LOAD FOLLOWING
    // ===========================

    useEffect(function() {

        loadFollowing();

    }, [userId]);


    // ===========================
    // GET FOLLOWING
    // ===========================

    async function loadFollowing() {

        try {

            setLoading(true);


            let response;


            // ==================================
            // SPECIFIC USER PROFILE
            // ==================================

            if (userId) {

                response =
                    await api(
                        "/following/" +
                        userId
                    );

            }


            // ==================================
            // OWN PROFILE
            // ==================================

            else {

                response =
                    await api(
                        "/following"
                    );

            }


            console.log(
                "FOLLOWING RESPONSE:",
                response
            );


            const following =
                Array.isArray(
                    response.following
                )
                    ? response.following
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
                following.map(
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
                "LOAD FOLLOWING ERROR:",
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
    // PROFILE
    // ===========================

    function handleProfile(user) {

        navigate(
            "/profile/" +
            user.username
        );

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

                    return oldUsers.filter(
                        function(user) {

                            return (
                                user.id?.toString() !==
                                targetUserId?.toString()
                            );

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

            <div className="Following-page">

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

        <div className="Following-page">


            {/* ===========================
                NAVBAR
            =========================== */}

            <div className="following-nav">

                <button
                    className="following-back-btn"
                    onClick={handleBack}
                    title="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Following
                </h1>


                <div className="following-nav-space">
                </div>

            </div>


            {/* ===========================
                SEARCH
            =========================== */}

            <div className="following-search">

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

            <div className="following-list">

                {filteredUsers.map(
                    function(user) {

                        const isProcessing =
                            processingId?.toString() ===
                            user.id?.toString();


                        return (

                            <div
                                className="following-profile"
                                key={user.id}
                            >

                                {/* PROFILE */}

                                <div
                                    className="following-profile-dp"
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


                                    <div className="following-info">

                                        <h3>
                                            {user.username}
                                        </h3>


                                        <p>
                                            {user.fullName}
                                        </p>

                                    </div>

                                </div>


                                {/* UNFOLLOW */}

                                <button
                                    className="following-profile-btn following-btn"
                                    disabled={
                                        isProcessing
                                    }
                                    onClick={function() {

                                        handleUnfollow(
                                            user.id
                                        );

                                    }}
                                >

                                    {
                                        isProcessing
                                            ? "..."
                                            : "Following"
                                    }

                                </button>

                            </div>

                        );

                    }
                )}


                {/* NO USERS */}

                {filteredUsers.length === 0 && (

                    <p className="following-no-users">

                        You are not following anyone

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


export default Following;