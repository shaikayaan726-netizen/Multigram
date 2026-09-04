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
    // LOGGED-IN USER
    // ==========================================

    const [currentUser, setCurrentUser] =
        useState(null);


    // ==========================================
    // SEARCH
    // ==========================================

    const [search, setSearch] =
        useState("");


    // ==========================================
    // CONVERSATIONS
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
    // GET USER ID
    // ==========================================

    function getUserId(user) {

        return (

            user?._id ||

            user?.id ||

            ""

        );

    }


    // ==========================================
    // GET USERNAME
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
    // GET PROFILE IMAGE
    // ==========================================

   function getAvatar(user) {

    return (
        user?.profilePicture ||
        user?.avatar ||
        user?.image ||
        ""
    );

}


    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

async function loadCurrentUser() {

    try {

        const data =
            await api("/auth/me");

        console.log(
            "MESSAGE /ME RESPONSE:",
            data
        );

        const user =
            data?.user ||
            data;

        console.log(
            "MESSAGE CURRENT USER:",
            user
        );

        setCurrentUser(user);

    }
    catch (error) {

        console.error(
            "LOAD CURRENT USER ERROR:",
            error
        );

    }

}
    // ==========================================
    // LOAD CONVERSATIONS
    // ==========================================

    async function loadMessages() {

        try {

            setLoading(true);

            setError("");


            const data =
                await api(
                    "/messages"
                );


            const list =

                Array.isArray(
                    data?.conversations
                )

                    ? data.conversations

                    : [];


            setConversations(
                list
            );

        }

        catch (error) {

            console.error(

                "LOAD MESSAGE LIST ERROR:",

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
    // INITIAL LOAD
    // ==========================================

    useEffect(

        function() {

            loadCurrentUser();

            loadMessages();

        },

        []

    );


    // ==========================================
    // SEARCH REAL USERS
    // ==========================================

    useEffect(

        function() {

            const query =
                search.trim();


            if (!query) {

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
                                        query
                                    ),

                                    {

                                        headers: {

                                            Authorization:

                                                "Bearer " +

                                                (
                                                    localStorage.getItem(
                                                        "token"
                                                    ) || ""
                                                )

                                        }

                                    }

                                );


                            if (
                                !response.ok
                            ) {

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


                            let users = [];


                            if (
                                Array.isArray(
                                    data
                                )
                            ) {

                                users =
                                    data;

                            }

                            else if (
                                Array.isArray(
                                    data?.users
                                )
                            ) {

                                users =
                                    data.users;

                            }

                            else if (
                                data?.user
                            ) {

                                users = [

                                    data.user

                                ];

                            }


                            setSearchUsers(
                                users
                            );

                        }

                        catch (error) {

                            if (
                                cancelled
                            ) {

                                return;

                            }


                            console.error(

                                "SEARCH USERS ERROR:",

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

                    300

                );


            return function() {

                cancelled = true;

                clearTimeout(
                    timer
                );

            };

        },

        [search]

    );


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate("/home");

    }


    // ==========================================
    // FORMAT TIME
    // ==========================================

    function formatTime(
        dateValue
    ) {

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


        if (
            seconds < 60
        ) {

            return "now";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (
            minutes < 60
        ) {

            return (
                minutes +
                "m"
            );

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (
            hours < 24
        ) {

            return (
                hours +
                "h"
            );

        }


        const days =
            Math.floor(
                hours / 24
            );


        if (
            days < 7
        ) {

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


        if (
            count <= 0
        ) {

            return "";

        }


        if (
            count >= 4
        ) {

            return "4+ new messages";

        }


        if (
            count === 1
        ) {

            return "1 new message";

        }


        return (

            count +

            " new messages"

        );

    }


    // ==========================================
    // LAST MESSAGE PREVIEW
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
    // MARK CHAT READ
    // ==========================================

    async function markChatRead(
        userId
    ) {

        if (!userId) {

            return;

        }


        try {

            await api(

                `/messages/${userId}/read`,

                {

                    method:
                        "POST"

                }

            );


        }

        catch (error) {

            console.error(

                "MARK CHAT READ ERROR:",

                error

            );

        }

    }


    // ==========================================
    // OPEN CHAT
    // ==========================================

    async function openChat(
        user
    ) {

        if (!user) {

            return;

        }


        const userId =
            getUserId(
                user
            );


        if (!userId) {

            console.error(

                "CHAT USER ID NOT FOUND:",

                user

            );

            return;

        }


        // ======================================
        // CLEAR UNREAD BEFORE OPENING
        // ======================================

        await markChatRead(
            userId
        );


        // ======================================
        // CREATE CHAT USER
        // ======================================

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


        // ======================================
        // UPDATE LOCAL LIST
        // ======================================

        setConversations(

            function(
                oldConversations
            ) {

                return oldConversations.map(

                    function(
                        conversation
                    ) {

                        const conversationUserId =

                            getUserId(
                                conversation?.user
                            );


                        if (

                            String(
                                conversationUserId
                            ) ===

                            String(
                                userId
                            )

                        ) {

                            return {

                                ...conversation,

                                unreadCount:
                                    0

                            };

                        }


                        return conversation;

                    }

                );

            }

        );


        // ======================================
        // NAVIGATE
        // ======================================

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
    // SEARCH RESULT
    // ==========================================

    const visibleSearchUsers =

        searchUsers.filter(

            function(user) {

                const currentId =
                    getUserId(
                        currentUser
                    );


                const userId =
                    getUserId(
                        user
                    );


                // Don't show yourself

                if (
                    currentId &&
                    userId &&
                    String(
                        currentId
                    ) ===
                    String(
                        userId
                    )
                ) {

                    return false;

                }


                return true;

            }

        );


    // ==========================================
    // NORMAL CONVERSATIONS
    // ==========================================

    const visibleConversations =

        conversations.filter(

            function(
                conversation
            ) {

                return (
                    conversation?.user
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
        onClick={handleBack}
        title="Back"
    >
        <FiArrowLeft />
    </button>


    <h1>
        {
            currentUser?.username ||
            "Loading..."
        }
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

                    {search && (

                        <button

                            type="button"

                            onClick={

                                function() {

                                    setSearch("");

                                }

                            }

                            style={{

                                border: "none",

                                background:
                                    "transparent",

                                cursor:
                                    "pointer"

                            }}

                        >

                            ×

                        </button>

                    )}

                </div>

            </div>


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

                        visibleSearchUsers.length === 0 && (

                        <div
                            className="message-no-result"
                        >

                            No users found

                        </div>

                    )}


                    {!searchLoading &&

                        visibleSearchUsers.map(

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

                                          {getAvatar(user) ? (

    <img
        src={getAvatar(user)}
        alt={getUsername(user)}
    />

) : (

    <div className="message-default-avatar">
        {getUsername(user).charAt(0).toUpperCase()}
    </div>

)}

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
                NORMAL MESSAGE AREA
            ================================== */}

            {!isSearching && (

                <>

                    {/* HEADER */}

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


                    {/* LIST */}

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


                        {/* CONVERSATIONS */}

                        {!loading &&
                            !error &&

                            visibleConversations.map(

                                function(
                                    conversation
                                ) {

                                    const user =
                                        conversation.user;


                                    const userId =
                                        getUserId(
                                            user
                                        );


                                    const username =
                                        getUsername(
                                            user
                                        );


                                    const avatar =
                                        getAvatar(
                                            user
                                        );


                                    const unreadCount =

                                        Number(
                                            conversation.unreadCount
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

                                      {avatar ? (

    <img
        src={avatar}
        alt={username}
    />

) : (

    <div className="message-default-avatar">
        {username.charAt(0).toUpperCase()}
    </div>

)}

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

                                                        {
                                                            formatTime(
                                                                lastMessageTime
                                                            )
                                                        }

                                                    </span>

                                                ) : (

                                                    <span>

                                                        {
                                                            lastMessage
                                                        }

                                                        {
                                                            lastMessage &&
                                                            lastMessageTime
                                                                ? " · "
                                                                : ""
                                                        }

                                                        {
                                                            formatTime(
                                                                lastMessageTime
                                                            )
                                                        }

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }

                            )}


                        {/* NO CONVERSATIONS */}

                        {!loading &&
                            !error &&
                            visibleConversations.length === 0 && (

                            <div
                                className="message-no-result"
                            >

                                No messages yet

                            </div>

                        )}

                    </div>

                </>

            )}

        </div>

    );

}


export default Message;