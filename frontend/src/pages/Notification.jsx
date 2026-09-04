import React from "react";

import {
    FiArrowLeft,
    FiSliders
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";


function Notification() {

    const navigate = useNavigate();


    // ===========================
    // BACK
    // ===========================

    function handleBack() {

        navigate(-1);

    }


    // ===========================
    // OPEN POST
    // ===========================

    function openPost(notification) {

        navigate("/home", {

            state: {
                openPostId: notification.postId,
                openComments: notification.type === "comment"
            }

        });

    }


    // ===========================
    // NOTIFICATIONS
    // ===========================

    const notifications = [

        {
            id: 1,
            username: "hazel_girl",
            avatar: "https://getphotohub.com/wp-content/uploads/2024/07/Girl-Cap-DP-1024x1024.webp",
            type: "like",
            text: "liked your post",
            time: "2min ago",
            postId: 1
        },

        {
            id: 2,
            username: "hazel_girl",
            avatar: "https://getphotohub.com/wp-content/uploads/2024/07/Girl-Cap-DP-1024x1024.webp",
            type: "comment",
            text: "commented on your post",
            time: "2min ago",
            postId: 2
        },

        {
            id: 3,
            username: "hazel_girl",
            avatar: "https://getphotohub.com/wp-content/uploads/2024/07/Girl-Cap-DP-1024x1024.webp",
            type: "like",
            text: "liked your post",
            time: "2min ago",
            postId: 3
        },

        {
            id: 4,
            username: "hazel_girl",
            avatar: "https://getphotohub.com/wp-content/uploads/2024/07/Girl-Cap-DP-1024x1024.webp",
            type: "comment",
            text: "commented on your post",
            time: "2min ago",
            postId: 4
        },

        {
            id: 5,
            username: "hazel_girl",
            avatar: "https://getphotohub.com/wp-content/uploads/2024/07/Girl-Cap-DP-1024x1024.webp",
            type: "like",
            text: "liked your post",
            time: "2min ago",
            postId: 5
        }

    ];


    return (

        <div className="notification-page">


            {/* ===========================
                NAVBAR
            =========================== */}

            <div className="notification-nav">

                <button
                    type="button"
                    className="notification-back"
                    onClick={handleBack}
                    aria-label="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Activity
                </h1>


                <button
                    type="button"
                    className="notification-filter"
                >

                    <FiSliders />

                    <span>
                        Filter
                    </span>

                </button>

            </div>


            {/* ===========================
                NOTIFICATION LIST
            =========================== */}

            {notifications.map((notification) => (

                <div
                    key={notification.id}
                    className="notification-info"
                    onClick={() =>
                        openPost(notification)
                    }
                >

                    <img
                        src={notification.avatar}
                        alt={notification.username}
                    />


                    <div className="notification-text">

                        <p>

                            <strong>
                                {notification.username}
                            </strong>

                        </p>


                        <p>

                            {notification.text}
                            {" "}
                            {notification.time}

                        </p>

                    </div>

                </div>

            ))}


        </div>

    );

}


export default Notification;