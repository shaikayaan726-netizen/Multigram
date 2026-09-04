import React, {
    useEffect,
    useState
} from "react";

import {
    FiArrowLeft,
    FiSearch,
    FiEdit
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";

import {
    api
} from "../utils/api";


function Message() {

    const navigate =
        useNavigate();


    // ==========================================
    // SEARCH
    // ==========================================

    const [search, setSearch] =
        useState("");


    // ==========================================
    // REAL CONVERSATIONS
    // ==========================================

    const [conversations, setConversations] =
        useState([]);


    // ==========================================
    // SEARCH USERS
    // ==========================================

    const [searchUsers, setSearchUsers] =
        useState([]);


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(true);


    const [searchLoading, setSearchLoading] =
        useState(false);


    // ==========================================
    // ERROR
    // ==========================================

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD REAL MESSAGE LIST
    // ==========================================

    async function loadMessages() {

        try {

            setLoading(true);

            setError("");


            const data =
                await api(
                    "/messages"
                );


            setConversations(

                Array.isArray(
                    data?.conversations
                )

                    ? data.conversations

                    : []

            );

        }

        catch (error) {

            console.error(
                "MESSAGE LIST ERROR:",
                error
            );


            setError(

                error.message ||
                "Failed to load messages"

            );


            setConversations([]);

        }

        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // FIRST LOAD
    // ==========================================

    useEffect(

        function() {

            loadMessages();

        },

        []

    );


    // ==========================================
    // SEARCH ALL USERS
    // ==========================================

    useEffect(

        function() {

            if (!search.trim()) {

                setSearchUsers([]);

                setSearchLoading(false);

                return;

            }


            let cancelled = false;


            const timer =

                setTimeout(

                    async function() {

                        try {

                            setSearchLoading(
                                true
                            );


                            const response =

                                await fetch(

                                    "/api/search-user?username=" +

                                    encodeURIComponent(
                                        search.trim()
                                    )

                                );


                            if (!response.ok) {

                                throw new Error(
                                    "User search failed"
                                );

                            }


                            const data =

                                await response.json();


                            if (
                                cancelled
                            ) {

                                return;

                            }


                            setSearchUsers(

                                Array.isArray(
                                    data
                                )

                                    ? data

                                    : []

                            );

                        }

                        catch (error) {

                            if (
                                cancelled
                            ) {

                                return;

                            }


                            console.error(

                                "USER SEARCH ERROR:",

                                error

                            );


                            setSearchUsers([]);

                        }

                        finally {

                            if (
                                !cancelled
                            ) {

                                setSearchLoading(
                                    false
                                );

                            }

                        }

                    },

                    400

                );


            return function() {

                cancelled = true;

                clearTimeout(timer);

            };

        },

        [search]

    );


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // USER ID
    // ==========================================

    function getUserId(user) {

        return (

            user?._id ||

            user?.id ||

            ""

        );

    }


    // ==========================================
    // USERNAME
    // ==========================================

    function getUsername(user) {

        return (

            user?.username ||

            user?.name ||

            user?.fullName ||

            "User"

        );

    }


    // ==========================================
    // AVATAR
    // ==========================================

    function getAvatar(user) {

        return (

            user?.avatar ||

            user?.image ||

            user?.profilePicture ||

            (

                "https://i.pravatar.cc/150?u=" +

                getUserId(user)

            )

        );

    }


    // ==========================================
    // TIME
    // ==========================================

    function formatTime(dateValue) {

        if (!dateValue) {

            return "";

        }


        const date =
            new Date(
                dateValue
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        const now =
            new Date();


        const difference =
            now.getTime() -
            date.getTime();


        const seconds =
            Math.floor(
                difference / 1000
            );


        if (seconds < 60) {

            return "now";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (minutes < 60) {

            return (
                minutes +
                "m"
            );

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {

            return (
                hours +
                "h"
            );

        }


        const days =
            Math.floor(
                hours / 24
            );


        if (days < 7) {

            return (
                days +
                "d"
            );

        }


        return date.toLocaleDateString();

    }


    // ==========================================
    // UNREAD TEXT
    // ==========================================

    function getUnreadText(
        unreadCount
    ) {

        const count =
            Number(
                unreadCount
            ) || 0;


        if (count <= 0) {

            return "";

        }


        if (count >= 4) {

            return "4+ new messages";

        }


        if (count === 1) {

            return "1 new message";

        }


        return (
            count +
            " new messages"
        );

    }


    // ==========================================
    // LAST MESSAGE
    // ==========================================

    function getLastMessageText(
        conversation
    ) {

        const lastMessage =
            conversation?.lastMessage;


        if (!lastMessage) {

            return "";

        }


        if (
            lastMessage.type ===
            "image"
        ) {

            return "📷 Photo";

        }


        if (
            lastMessage.type ===
            "video"
        ) {

            return "🎥 Video";

        }


        if (
            lastMessage.type ===
            "audio"
        ) {

            return "🎤 Audio";

        }


        return (
            lastMessage.text ||
            ""
        );

    }


    // ==========================================
    // OPEN CHAT
    // ==========================================

    function openChat(user) {

        if (!user) {

            return;

        }


        const userId =
            getUserId(
                user
            );


        if (!userId) {

            console.error(
                "USER ID NOT FOUND:",
                user
            );

            return;

        }


        const chatUser = {

            ...user,

            id:
                userId,

            name:
                getUsername(
                    user
                ),

            username:
                user.username,

            avatar:
                getAvatar(
                    user
                )

        };


        navigate(

            "/chat",

            {

                state: {

                    user:
                        chatUser

                }

            }

        );

    }


    // ==========================================
    // OPEN EXISTING CONVERSATION
    // ==========================================

    function openConversation(
        conversation
    ) {

        if (
            !conversation?.user
        ) {

            return;

        }


        openChat(
            conversation.user
        );

    }


    // ==========================================
    // FOLLOW REQUESTS
    // ==========================================

    function openFollowRequests() {

        navigate(
            "/follow-requests"
        );

    }


    // ==========================================
    // SEARCH MODE
    // ==========================================

    const isSearching =
        search.trim().length > 0;


    // ==========================================
    // NORMAL MESSAGE LIST SEARCH
    // ==========================================

    const filteredConversations =

        conversations.filter(

            function(
                conversation
            ) {

                const user =
                    conversation?.user;


                if (!user) {

                    return false;

                }


                const username =
                    getUsername(
                        user
                    );


                const lastMessage =
                    getLastMessageText(
                        conversation
                    );


                const query =
                    search
                        .toLowerCase()
                        .trim();


                return (

                    username
                        .toLowerCase()
                        .includes(
                            query
                        )

                    ||

                    lastMessage
                        .toLowerCase()
                        .includes(
                            query
                        )

                );

            }

        );


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="message-page">


            {/* ==================================
                NAVBAR
            ================================== */}

            <div className="message-nav">


                <button

                    type="button"

                    className="message-back-btn"

                    onClick={
                        handleBack
                    }

                    title="Back"

                >

                    <FiArrowLeft />

                </button>


                <h1>
                    itsmeayaan021
                </h1>


                <button

                    type="button"

                    className="message-edit"

                    aria-label="New message"

                >

                    <FiEdit />

                </button>

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="message-search">

                <div className="message-search-box">

                    <FiSearch />


                    <input

                        type="text"

                        value={
                            search
                        }

                        placeholder="Search"

                        onChange={

                            function(
                                event
                            ) {

                                setSearch(
                                    event.target.value
                                );

                            }

                        }

                    />

                </div>

            </div>


            {/* ==================================
                HEADER
            ================================== */}

            {!isSearching && (

                <div className="message-request">

                    <h3>
                        Messages
                    </h3>


                    <span
                        onClick={
                            openFollowRequests
                        }
                    >

                        Requests

                    </span>

                </div>

            )}


            {/* ==================================
                SEARCH RESULTS
            ================================== */}

            {isSearching && (

                <div className="message-list">


                    {searchLoading && (

                        <div
                            className="message-no-result"
                        >

                            Searching...

                        </div>

                    )}


                    {!searchLoading &&

                        searchUsers.length === 0 && (

                        <div
                            className="message-no-result"
                        >

                            No users found

                        </div>

                    )}


                    {!searchLoading &&

                        searchUsers.map(

                            function(user) {

                                const userId =
                                    getUserId(
                                        user
                                    );


                                return (

                                    <div

                                        key={
                                            userId
                                        }

                                        className="message-dm"

                                        onClick={

                                            function() {

                                                openChat(
                                                    user
                                                );

                                            }

                                        }

                                    >


                                        {/* PROFILE */}

                                        <div
                                            className="message-profile"
                                        >

                                            <img

                                                src={
                                                    getAvatar(
                                                        user
                                                    )
                                                }

                                                alt={
                                                    getUsername(
                                                        user
                                                    )
                                                }

                                            />

                                        </div>


                                        {/* USER */}

                                        <div
                                            className="message-user"
                                        >

                                            <p>

                                                {
                                                    getUsername(
                                                        user
                                                    )
                                                }

                                            </p>


                                            <span>

                                                {
                                                    user.fullName ||
                                                    ""
                                                }

                                            </span>

                                        </div>

                                    </div>

                                );

                            }

                        )}

                </div>

            )}


            {/* ==================================
                NORMAL MESSAGE LIST
            ================================== */}

            {!isSearching && (

                <div className="message-list">


                    {/* LOADING */}

                    {loading && (

                        <div
                            className="message-no-result"
                        >

                            Loading messages...

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading &&
                        error && (

                        <div
                            className="message-no-result"
                        >

                            {error}

                        </div>

                    )}


                    {/* ==================================
                        CONVERSATIONS
                    ================================== */}

                    {!loading &&
                        !error &&

                        filteredConversations.map(

                            function(
                                conversation
                            ) {

                                const user =
                                    conversation?.user;


                                if (!user) {

                                    return null;

                                }


                                const userId =
                                    getUserId(
                                        user
                                    );


                                const username =
                                    getUsername(
                                        user
                                    );


                                const unreadCount =

                                    Number(
                                        conversation?.unreadCount
                                    ) || 0;


                                const unreadText =
                                    getUnreadText(
                                        unreadCount
                                    );


                                const lastMessage =
                                    getLastMessageText(
                                        conversation
                                    );


                                const lastMessageTime =

                                    conversation
                                        ?.lastMessage
                                        ?.createdAt;


                                return (

                                    <div

                                        key={
                                            userId
                                        }

                                        className={

                                            unreadCount > 0

                                                ? "message-dm message-unread"

                                                : "message-dm"

                                        }

                                        onClick={

                                            function() {

                                                openConversation(
                                                    conversation
                                                );

                                            }

                                        }

                                    >


                                        {/* PROFILE */}

                                        <div
                                            className="message-profile"
                                        >

                                            <img

                                                src={
                                                    getAvatar(
                                                        user
                                                    )
                                                }

                                                alt={
                                                    username
                                                }

                                            />

                                        </div>


                                        {/* USER INFO */}

                                        <div
                                            className="message-user"
                                        >

                                            <p>
                                                {username}
                                            </p>


                                            {unreadText ? (

                                                <span
                                                    className="message-unread-text"
                                                >

                                                    {unreadText}

                                                    {" · "}

                                                    {formatTime(
                                                        lastMessageTime
                                                    )}

                                                </span>

                                            ) : (

                                                <span>

                                                    {lastMessage}

                                                    {lastMessage &&
                                                        lastMessageTime
                                                        ? " · "
                                                        : ""}

                                                    {formatTime(
                                                        lastMessageTime
                                                    )}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                );

                            }

                        )}


                    {/* ==================================
                        NO CONVERSATIONS
                    ================================== */}

                    {!loading &&
                        !error &&
                        filteredConversations.length === 0 && (

                        <div
                            className="message-no-result"
                        >

                            No messages yet

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}


export default Message;