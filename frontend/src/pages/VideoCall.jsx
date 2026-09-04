// ==========================================
// IMPORTS
// ==========================================

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
// VIDEO CALL
// ==========================================

export default function VideoCall() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const user =
        location.state?.user || null;


    const callIdRef =
        useRef(
            crypto.randomUUID()
        );


    const [status, setStatus] =
        useState("Calling...");


    // ======================================
    // START CALL
    // ======================================

    useEffect(() => {

        if (!user?.id && !user?._id) {

            console.warn(
                "VIDEO CALL: Receiver user missing"
            );

            return;

        }


        const receiverId =
            String(
                user?.id ||
                user?._id
            );


        const callerId =
            getMyUserId();


        if (!callerId) {

            console.warn(
                "VIDEO CALL: Caller ID missing"
            );

            return;

        }


        connectSocket();


        let currentUser = {};

        try {
            currentUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            ) || {};
        } catch {
            currentUser = {};
        }

        const callerUser = {
            ...currentUser,
            id: callerId
        };

        const callData = {

            callId:
                callIdRef.current,

            callerId,

            receiverId,

            type:
                "video",

            user: callerUser

        };


        // ==================================
        // WAIT FOR SOCKET
        // ==================================

        function initiateCall() {

            console.log(
                "VIDEO CALL INITIATE:",
                callData
            );


            socket.emit(
                "call:initiate",
                callData
            );

        }


        if (socket.connected) {

            initiateCall();

        }

        else {

            socket.once(
                "connect",
                initiateCall
            );

        }


        // ==================================
        // CALL ACCEPTED
        // ==================================

        function handleAccepted(data) {

            console.log(
                "VIDEO CALL ACCEPTED:",
                data
            );


            setStatus(
                "Connecting..."
            );


            navigate(
                "/video-call/active",
                {
                    replace: true,

                    state: {

                        user,

                        callId:
                            data?.callId ||
                            callIdRef.current,

                        isCaller:
                            true

                    }

                }
            );

        }


        // ==================================
        // CALL REJECTED
        // ==================================

        function handleRejected() {

            setStatus(
                "Call declined"
            );


            setTimeout(
                function() {

                    navigate(
                        "/chat",
                        {
                            replace: true,
                            state: { user }
                        }
                    );

                },
                900
            );

        }


        // ==================================
        // CALL ENDED
        // ==================================

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
            "call:accepted",
            handleAccepted
        );


        socket.on(
            "call:rejected",
            handleRejected
        );


        socket.on(
            "call:ended",
            handleEnded
        );


        // ==================================
        // CLEANUP
        // ==================================

        return function() {

            socket.off(
                "call:accepted",
                handleAccepted
            );

            socket.off(
                "call:rejected",
                handleRejected
            );

            socket.off(
                "call:ended",
                handleEnded
            );

            socket.off(
                "connect",
                initiateCall
            );

        };

    }, [user, navigate]);


    // ======================================
    // END CALL
    // ======================================

    function endCall() {

        const callerId =
            getMyUserId();


        const receiverId =
            String(
                user?.id ||
                user?._id ||
                ""
            );


        socket.emit(
            "call:end",
            {

                callId:
                    callIdRef.current,

                from:
                    callerId,

                to:
                    receiverId,

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

        <div className="call-page">

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
                {status}
            </p>


            <button
                className="call-end"
                onClick={endCall}
            >
                ☎
            </button>

        </div>

    );

}