import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

import {
    IoSearchSharp
} from "react-icons/io5";

import {
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiVideo,
    FiUser
} from "react-icons/fi";



function Search() {

    const navigate = useNavigate();



    // ===========================
    // Search Text
    // ===========================

    const [search, setSearch] = useState("");



    // ===========================
    // Search Users
    // ===========================

    const [users, setUsers] = useState([]);



    // ===========================
    // Loading
    // ===========================

    const [loading, setLoading] = useState(false);



    // ===========================
    // Search Users From Backend
    // ===========================

    useEffect(function () {

        if (!search.trim()) {

            setUsers([]);

            setLoading(false);

            return;

        }



        const timer =
            setTimeout(function () {

                setLoading(true);



                api(
                    "/search-user?username=" +
                    encodeURIComponent(
                        search.trim()
                    )
                )

                    .then(function (data) {

                        console.log(
                            "SEARCH USERS:",
                            data
                        );


                        setUsers(
                            Array.isArray(data)
                                ? data
                                : []
                        );


                        setLoading(false);

                    })

                    .catch(function (error) {

                        console.log(
                            "SEARCH USER ERROR:",
                            error
                        );


                        setUsers([]);

                        setLoading(false);

                    });

            }, 500);



        return function () {

            clearTimeout(timer);

        };

    }, [search]);



    // ===========================
    // Back
    // ===========================

    function handleBack() {

        navigate(-1);

    }



    // ===========================
    // Home
    // ===========================

    function handleHome() {

        navigate("/home");

    }



    // ===========================
    // Search
    // ===========================

    function handleSearch() {

        navigate("/search");

    }



    // ===========================
    // Create
    // ===========================

    function handleCreate() {

        navigate("/postgallery");

    }



    // ===========================
    // Reels
    // ===========================

    function handleReels() {

        navigate("/reels");

    }



    // ===========================
    // Profile
    // ===========================

    function handleProfile() {

        navigate("/profile");

    }



    // ===========================
    // Follow User
    // ===========================

    async function handleFollow(userId) {

        try {

            // =================================
            // SEND FOLLOW REQUEST
            // =================================

            const data =
                await api(
                    "/follow/" + userId,
                    {
                        method: "POST"
                    }
                );


            console.log(
                "FOLLOW RESPONSE:",
                data
            );



            // =================================
            // REQUEST SENT
            // =================================

            if (
                data.message ===
                    "Follow Request Sent" ||
                data.message ===
                    "Follow Request Already Sent"
            ) {

                setUsers(
                    function (oldUsers) {

                        return oldUsers.map(
                            function (user) {

                                if (
                                    user._id ===
                                    userId
                                ) {

                                    return {
                                        ...user,
                                        requestStatus:
                                            "pending"
                                    };

                                }


                                return user;

                            }
                        );

                    }
                );

            }



            // =================================
            // ALREADY FOLLOWING
            // =================================

            if (
                data.message ===
                "Already Following"
            ) {

                setUsers(
                    function (oldUsers) {

                        return oldUsers.map(
                            function (user) {

                                if (
                                    user._id ===
                                    userId
                                ) {

                                    return {
                                        ...user,
                                        requestStatus:
                                            "accepted"
                                    };

                                }


                                return user;

                            }
                        );

                    }
                );

            }

        }
        catch (error) {

            console.log(
                "FOLLOW ERROR:",
                error
            );

        }

    }



    return (

        <div className="search-page">



            {/* ===========================
                SEARCH HEADER
            =========================== */}

            <div className="search-header">

                <div className="search-input-wrapper">

                    <IoSearchSharp
                        className="search-icon"
                    />



                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={function (event) {

                            setSearch(
                                event.target.value
                            );

                        }}
                    />

                </div>

            </div>



            {/* ===========================
                USER SEARCH RESULTS
            =========================== */}

            {search.trim() && (

                <div className="search-user-results">

                    {loading && (

                        <p className="search-message">

                            Searching...

                        </p>

                    )}



                    {!loading &&
                    users.length === 0 && (

                        <p className="search-message">

                            No users found

                        </p>

                    )}



                    {!loading &&
                    users.map(function (user) {

                        // =================================
                        // FOLLOW STATUS
                        // =================================

                        const isPending =
                            user.requestStatus ===
                            "pending";


                        const isFollowing =
                            user.requestStatus ===
                            "accepted";



                        return (

                            <div
                                className="search-user-item"
                                key={user._id}
                                onClick={function (event) {

                                    if (
                                        event.target.closest(
                                            "button"
                                        )
                                    ) {

                                        return;

                                    }


                                    navigate(
                                        "/profile/" +
                                        user.username
                                    );

                                }}
                            >



                                {/* ===========================
                                    USER IMAGE
                                =========================== */}

                                <img
                                    src={
                                        user.profilePicture
                                            ? (
                                                user.profilePicture.startsWith("http")
                                                    ? user.profilePicture
                                                    : user.profilePicture
                                            )
                                            : "/default-avatar.jpg"
                                    }
                                    alt={
                                        user.username
                                    }
                                />



                                {/* ===========================
                                    USER INFORMATION
                                =========================== */}

                                <div className="search-user-info">

                                    <strong>

                                        {user.username}

                                    </strong>



                                    <span>

                                        {user.fullName}

                                    </span>

                                </div>



                                {/* ===========================
                                    FOLLOW BUTTON
                                =========================== */}

                                <button
                                    className={
                                        isFollowing
                                            ? "follow-button following"
                                            : isPending
                                                ? "follow-button request-sent"
                                                : "follow-button"
                                    }
                                    onClick={function (event) {

                                        event.stopPropagation();



                                        if (
                                            !isPending &&
                                            !isFollowing
                                        ) {

                                            handleFollow(
                                                user._id
                                            );

                                        }

                                    }}
                                >

                                    {
                                        isFollowing
                                            ? "Following"
                                            : isPending
                                                ? "Requested"
                                                : "Follow"
                                    }

                                </button>

                            </div>

                        );

                    })}

                </div>

            )}



            {/* ===========================
                EXPLORE GRID
            =========================== */}

            {!search.trim() && (

                <div className="search-grid">

                    <img
                        src="https://picsum.photos/300/300?random=1"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=2"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=3"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=4"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=5"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=6"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=7"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=8"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=9"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=10"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=11"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=12"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=13"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=14"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=15"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=16"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=17"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=18"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=19"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=20"
                        alt="grid-img"
                    />

                    <img
                        src="https://picsum.photos/300/300?random=21"
                        alt="grid-img"
                    />

                </div>

            )}



            {/* ===========================
                BOTTOM NAVIGATION
            =========================== */}

            <div className="search-bottom-nav">

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
                    onClick={handleProfile}
                    title="Profile"
                >

                    <FiUser />

                </button>

            </div>

        </div>

    );

}



export default Search;