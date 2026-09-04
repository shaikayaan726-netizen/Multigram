import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

import {
    FiArrowLeft,
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiVideo,
    FiUser
} from "react-icons/fi";


function FollowRequests() {

    const navigate = useNavigate();


    // ===========================
    // FOLLOW REQUESTS
    // ===========================

    const [requests, setRequests] =
        useState([]);


    // ===========================
    // LOADING
    // ===========================

    const [loading, setLoading] =
        useState(true);


    // ===========================
    // PROCESSING REQUEST
    // ===========================

    const [processingId, setProcessingId] =
        useState(null);


    // ===========================
    // LOAD REQUESTS
    // ===========================

    useEffect(function () {

        loadRequests();

    }, []);


    // ===========================
    // GET FOLLOW REQUESTS
    // ===========================

    async function loadRequests() {

        try {

            setLoading(true);


            const response =
                await api(
                    "/follow-requests"
                );


            console.log(
                "FOLLOW REQUESTS RESPONSE:",
                response
            );


            /*
             * Backend may return:
             *
             * [
             *   request1,
             *   request2
             * ]
             *
             * OR
             *
             * {
             *   requests: [...]
             * }
             */

            let requestList = [];


            if (Array.isArray(response)) {

                requestList =
                    response;

            }
            else if (
                Array.isArray(
                    response.requests
                )
            ) {

                requestList =
                    response.requests;

            }


            setRequests(
                requestList
            );

        }
        catch (error) {

            console.error(
                "FOLLOW REQUESTS ERROR:",
                error
            );


            setRequests([]);

        }
        finally {

            setLoading(false);

        }

    }


    // ===========================
    // ACCEPT REQUEST
    // ===========================

    async function handleAccept(requestId) {

        if (processingId) {

            return;

        }


        try {

            setProcessingId(
                requestId
            );


            console.log(
                "ACCEPTING REQUEST:",
                requestId
            );


            const response =
                await api(
                    "/follow-requests/" +
                    requestId +
                    "/accept",
                    {
                        method: "POST"
                    }
                );


            console.log(
                "ACCEPT REQUEST RESPONSE:",
                response
            );


            /*
             * IMPORTANT:
             *
             * Backend should now:
             *
             * 1. Accept request
             * 2. Add sender to current user's followers
             * 3. Add current user to sender's following
             * 4. Remove/delete the follow request
             */


            // Remove accepted request from UI

            setRequests(
                function (oldRequests) {

                    return oldRequests.filter(
                        function (request) {

                            return (
                                request._id !==
                                requestId
                            );

                        }
                    );

                }
            );


        }
        catch (error) {

            console.error(
                "ACCEPT REQUEST ERROR:",
                error
            );

        }
        finally {

            setProcessingId(
                null
            );

        }

    }


    // ===========================
    // DELETE / REJECT REQUEST
    // ===========================

    async function handleReject(requestId) {

        if (processingId) {

            return;

        }


        try {

            setProcessingId(
                requestId
            );


            console.log(
                "DELETING REQUEST:",
                requestId
            );


            const response =
                await api(
                    "/follow-requests/" +
                    requestId +
                    "/reject",
                    {
                        method: "POST"
                    }
                );


            console.log(
                "DELETE REQUEST RESPONSE:",
                response
            );


            /*
             * Delete means:
             *
             * Request is removed/rejected.
             *
             * Sender does NOT become
             * a follower.
             */


            // Remove deleted request from UI

            setRequests(
                function (oldRequests) {

                    return oldRequests.filter(
                        function (request) {

                            return (
                                request._id !==
                                requestId
                            );

                        }
                    );

                }
            );


        }
        catch (error) {

            console.error(
                "DELETE REQUEST ERROR:",
                error
            );

        }
        finally {

            setProcessingId(
                null
            );

        }

    }


    // ===========================
    // OPEN PROFILE
    // ===========================

    function handleProfile(username) {

        navigate(
            "/profile/" +
            username
        );

    }


    // ===========================
    // BACK
    // ===========================

    function handleBack() {

        navigate(-1);

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

            <div className="FollowRequests-page">


                {/* NAVBAR */}

                <div className="follow-requests-nav">

                    <button
                        type="button"
                        className="follow-requests-back-btn"
                        onClick={handleBack}
                        title="Back"
                    >

                        <FiArrowLeft />

                    </button>


                    <h1>
                        Follow requests
                    </h1>


                    <div className="follow-requests-nav-space">
                    </div>

                </div>


                {/* LOADING */}

                <div className="follow-requests-loading">

                    Loading...

                </div>


                {/* BOTTOM NAV */}

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


    // ===========================
    // MAIN UI
    // ===========================

    return (

        <div className="FollowRequests-page">


            {/* ===========================
                NAVBAR
            =========================== */}

            <div className="follow-requests-nav">


                {/* BACK */}

                <button
                    type="button"
                    className="follow-requests-back-btn"
                    onClick={handleBack}
                    title="Back"
                >

                    <FiArrowLeft />

                </button>


                {/* TITLE */}

                <h1>
                    Follow requests
                </h1>


                {/* RIGHT SPACE */}

                <div className="follow-requests-nav-space">
                </div>


            </div>


            {/* ===========================
                REQUEST LIST
            =========================== */}

            <div className="follow-requests-list">


                {/* EMPTY */}

                {requests.length === 0 && (

                    <div className="follow-requests-empty">

                        <h2>
                            No follow requests
                        </h2>

                        <p>
                            When someone sends you
                            a follow request, it will
                            appear here.
                        </p>

                    </div>

                )}


                {/* REQUESTS */}

                {requests.map(
                    function (request) {


                        const sender =
                            request.sender;


                        /*
                         * If backend returned
                         * an invalid request,
                         * don't render it.
                         */

                        if (!sender) {

                            return null;

                        }


                        const isProcessing =
                            processingId ===
                            request._id;


                        return (

                            <div
                                className="follow-request-item"
                                key={request._id}
                            >


                                {/* ===========================
                                    PROFILE
                                =========================== */}

                                <div
                                    className="follow-request-profile"
                                    onClick={function () {

                                        if (!isProcessing) {

                                            handleProfile(
                                                sender.username
                                            );

                                        }

                                    }}
                                >


                                    {/* IMAGE */}

                                    <div className="follow-request-image">

                                        <img
                                            src={
                                                sender.profilePicture
                                                    ? sender.profilePicture
                                                    : "/default-avatar.jpg"
                                            }
                                            alt={
                                                sender.username
                                            }
                                        />

                                    </div>


                                    {/* INFO */}

                                    <div className="follow-request-info">

                                        <h3>
                                            {sender.username}
                                        </h3>


                                        <p>
                                            {sender.fullName || ""}
                                        </p>


                                        <span>
                                            wants to follow you
                                        </span>

                                    </div>


                                </div>


                                {/* ===========================
                                    ACTION BUTTONS
                                =========================== */}

                                <div className="follow-request-actions">


                                    {/* CONFIRM */}

                                    <button
                                        type="button"
                                        className="follow-request-confirm-btn"
                                        disabled={
                                            isProcessing
                                        }
                                        onClick={function (event) {

                                            event.stopPropagation();


                                            handleAccept(
                                                request._id
                                            );

                                        }}
                                    >

                                        {
                                            isProcessing
                                                ? "..."
                                                : "Confirm"
                                        }

                                    </button>


                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        className="follow-request-delete-btn"
                                        disabled={
                                            isProcessing
                                        }
                                        onClick={function (event) {

                                            event.stopPropagation();


                                            handleReject(
                                                request._id
                                            );

                                        }}
                                    >

                                        {
                                            isProcessing
                                                ? "..."
                                                : "Delete"
                                        }

                                    </button>


                                </div>


                            </div>

                        );

                    }
                )}


            </div>


            {/* ===========================
                BOTTOM NAVIGATION
            =========================== */}

            <div className="bottom-nav">


                {/* HOME */}

                <button
                    className="icon-btn"
                    onClick={handleHome}
                    title="Home"
                >

                    <FiHome />

                </button>


                {/* SEARCH */}

                <button
                    className="icon-btn"
                    onClick={handleSearch}
                    title="Search"
                >

                    <FiSearch />

                </button>


                {/* CREATE */}

                <button
                    className="icon-btn"
                    onClick={handleCreate}
                    title="Create"
                >

                    <FiPlusSquare />

                </button>


                {/* REELS */}

                <button
                    className="icon-btn"
                    onClick={handleReels}
                    title="Reels"
                >

                    <FiVideo />

                </button>


                {/* PROFILE */}

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


export default FollowRequests;