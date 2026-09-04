import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronRight
} from "react-icons/fi";


function NotificationSettings() {

    const navigate = useNavigate();


    // ==========================================
    // SWITCH STATES
    // ==========================================

    const [pauseAll, setPauseAll] = useState(false);

    const [messagesOnly, setMessagesOnly] = useState(false);


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // OPEN POSTS / STORIES / COMMENTS
    // ==========================================

    function handlePostsStoriesComments() {

        navigate("/postsstoriescomments");

    }


    // ==========================================
    // OPEN FOLLOWING / FOLLOWERS
    // ==========================================

    function handleFollowingFollowers() {

        navigate("/followingfollowers");

    }


    // ==========================================
    // OPEN MESSAGES
    // ==========================================

    function handleMessages() {

        navigate("/messagenotifications");

    }


    // ==========================================
    // OPEN CALLS
    // ==========================================

    function handleCalls() {

        navigate("/callnotifications");

    }


    return (

        <div className="notification-settings-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div className="notification-settings-nav">

                <button
                    className="notification-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Notifications
                </h1>

            </div>


            {/* ==========================================
                PUSH NOTIFICATIONS
            ========================================== */}

            <div className="notification-section">


                <h2>
                    Push notifications
                </h2>


                {/* ==================================
                    PAUSE ALL
                ================================== */}

                <div className="notification-switch-row">

                    <div className="notification-row-content">

                        <span className="notification-title">
                            Pause all
                        </span>

                        <span className="notification-description">
                            Temporarily pause notifications
                        </span>

                    </div>


                    <button
                        type="button"
                        className={
                            pauseAll
                                ? "notification-switch active"
                                : "notification-switch"
                        }
                        onClick={function () {

                            setPauseAll(!pauseAll);

                        }}
                        aria-label="Pause all notifications"
                    >

                        <span></span>

                    </button>

                </div>


                {/* ==================================
                    SLEEP MODE
                ================================== */}

                <div
                    className="notification-simple-row"
                    onClick={function () {

                        // Sleep mode baad mein separate page
                        // bana sakte hain.

                    }}
                >

                    <div>

                        <span className="notification-title">
                            Sleep mode
                        </span>

                        <span className="notification-description">
                            Automatically mute notifications at night or whenever you need to focus.
                        </span>

                    </div>

                </div>


                {/* ==================================
                    MESSAGES ONLY
                ================================== */}

                <div className="notification-switch-row">

                    <div className="notification-row-content">

                        <span className="notification-title">
                            Messages only
                        </span>

                        <span className="notification-description">
                            Only receive notifications about new messages and other message notifications, such as requests and reminders
                        </span>

                    </div>


                    <button
                        type="button"
                        className={
                            messagesOnly
                                ? "notification-switch active"
                                : "notification-switch"
                        }
                        onClick={function () {

                            setMessagesOnly(!messagesOnly);

                        }}
                        aria-label="Messages only"
                    >

                        <span></span>

                    </button>

                </div>

            </div>


            {/* ==========================================
                NOTIFICATION CATEGORIES
            ========================================== */}

            <div className="notification-category-list">


                {/* ==================================
                    POSTS, STORIES AND COMMENTS
                ================================== */}

                <button
                    type="button"
                    className="notification-category"
                    onClick={handlePostsStoriesComments}
                >

                    <span>
                        Posts, stories and comments
                    </span>

                    <FiChevronRight />

                </button>


                {/* ==================================
                    FOLLOWING AND FOLLOWERS
                ================================== */}

                <button
                    type="button"
                    className="notification-category"
                    onClick={handleFollowingFollowers}
                >

                    <span>
                        Following and followers
                    </span>

                    <FiChevronRight />

                </button>


                {/* ==================================
                    MESSAGES
                ================================== */}

                <button
                    type="button"
                    className="notification-category"
                    onClick={handleMessages}
                >

                    <span>
                        Messages
                    </span>

                    <FiChevronRight />

                </button>


                {/* ==================================
                    CALLS
                ================================== */}

                <button
                    type="button"
                    className="notification-category"
                    onClick={handleCalls}
                >

                    <span>
                        Calls
                    </span>

                    <FiChevronRight />

                </button>


            </div>

        </div>

    );

}


export default NotificationSettings;