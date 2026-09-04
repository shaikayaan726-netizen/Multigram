// ==========================================
// IMPORTS
// ==========================================

import React, {
    useEffect,
    useRef
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    socket,
    connectSocket
} from "../utils/socket";


// ==========================================
// HELPERS
// ==========================================

function getMyUserId() {

    return (
        localStorage.getItem("userId") ||
        JSON.parse(
            localStorage.getItem("user") || "{}"
        )?.id ||
        JSON.parse(
            localStorage.getItem("user") || "{}"
        )?._id ||
        ""
    );

}


function getUserName(user) {

    return (
        user?.username ||
        user?.name ||
        user?.fullName ||
        "User"
    );

}


function getUserAvatar(user) {

    return (
        user?.profilePicture ||
        user?.avatar ||
        user?.image ||
        ""
    );

}


// ==========================================
// INCOMING VIDEO CALL
// ==========================================

export default function IncomingVideoCall() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const user =
        location.state?.user || null;


    const callId =
        location.state?.callId || "";


    const socketRef =
        useRef(socket);


    // ======================================
    // SOCKET
    // ======================================

    useEffect(() => {

        connectSocket();


        function handleEnded() {

            navigate(
                "/chat",
                {
                    replace: true,
                    state: { user }
                }
            );

        }


        socket.on(
            "call:ended",
            handleEnded
        );


        return function() {

            socket.off(
                "call:ended",
                handleEnded
            );

        };

    }, [navigate, user]);


    // ======================================
    // ACCEPT
    // ======================================

    function accept() {

        const receiverId =
            getMyUserId();


        const callerId =
            String(
                user?.id ||
                user?._id ||
                ""
            );


        if (!receiverId) {

            console.warn(
                "VIDEO CALL ACCEPT: Receiver ID missing"
            );

            return;

        }


        if (!callerId) {

            console.warn(
                "VIDEO CALL ACCEPT: Caller ID missing"
            );

            return;

        }


        const acceptData = {

            callId,

            from:
                receiverId,

            to:
                callerId,

            type:
                "video"

        };


        console.log(
            "VIDEO CALL ACCEPT:",
            acceptData
        );


        socketRef.current.emit(
            "call:accept",
            acceptData
        );


        // ==================================
        // OPEN ACTIVE CALL
        // ==================================

        navigate(
            "/video-call/active",
            {
                replace: true,

                state: {

                    user,

                    callId,

                    isCaller:
                        false

                }

            }
        );

    }


    // ======================================
    // REJECT
    // ======================================

    function reject() {

        const receiverId =
            getMyUserId();


        const callerId =
            String(
                user?.id ||
                user?._id ||
                ""
            );


        socketRef.current.emit(
            "call:reject",
            {

                callId,

                from:
                    receiverId,

                to:
                    callerId,

                type:
                    "video"

            }
        );


        navigate(
            "/chat",
            {
                replace: true,
                state: { user }
            }
        );

    }


    // ======================================
    // DATA
    // ======================================

    const name =
        getUserName(user);


    const avatar =
        getUserAvatar(user);


    // ======================================
    // UI
    // ======================================

    return (

        <div className="call-page incoming-call-page">

            <div className="call-avatar">

                {avatar ? (

                    <img
                        src={avatar}
                        alt={name}
                    />

                ) : (

                    <div className="chat-default-avatar">

                        {name
                            .charAt(0)
                            .toUpperCase()
                        }

                    </div>

                )}

            </div>


            <h1>
                {name}
            </h1>


            <p>
                Incoming video call
            </p>


            <div className="call-actions">

                <button
                    className="call-reject"
                    onClick={reject}
                >
                    ✕
                </button>


                <button
                    className="call-accept"
                    onClick={accept}
                >
                    📹
                </button>

            </div>

        </div>

    );

}