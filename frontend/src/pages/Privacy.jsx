import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronRight
} from "react-icons/fi";

import { api } from "../utils/api";


// ==========================================
// PRIVACY PAGE
// ==========================================

function Privacy() {

    const navigate = useNavigate();


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // SAVING
    // ==========================================

    const [savingSetting, setSavingSetting] =
        useState(null);


    // ==========================================
    // PRIVACY STATES
    // ==========================================

    const [privateAccount, setPrivateAccount] =
        useState(false);


    const [activityStatus, setActivityStatus] =
        useState(true);


    const [showStoryActivity, setShowStoryActivity] =
        useState(true);


    const [storySharing, setStorySharing] =
        useState(true);


    const [messageSharing, setMessageSharing] =
        useState(true);


    const [hideLikeCounts, setHideLikeCounts] =
        useState(false);


    const [allowRemix, setAllowRemix] =
        useState(true);


    const [shareReelsToStory, setShareReelsToStory] =
        useState(true);


    const [readReceipts, setReadReceipts] =
        useState(true);


    const [manualTagApproval, setManualTagApproval] =
        useState(false);


    const [hideOffensiveComments, setHideOffensiveComments] =
        useState(true);


    // ==========================================
    // LOAD PRIVACY SETTINGS
    // ==========================================

    useEffect(function () {

        loadPrivacySettings();

    }, []);


    // ==========================================
    // GET SETTINGS FROM BACKEND
    // ==========================================

    async function loadPrivacySettings() {

        try {

            setLoading(true);


            const response =
                await api(
                    "/auth/me"
                );


            const user =
                response.user;


            if (!user) {

                return;

            }


            // ==================================
            // LOAD VALUES
            // ==================================

            setPrivateAccount(
                user.isPrivate === true
            );


            setActivityStatus(
                user.showActivityStatus !== false
            );


            setShowStoryActivity(
                user.showStoryActivity !== false
            );


            setStorySharing(
                user.allowStorySharing !== false
            );


            setMessageSharing(
                user.allowStoryMessageSharing !== false
            );


            setHideLikeCounts(
                user.hideLikeCounts === true
            );


            setAllowRemix(
                user.allowRemix !== false
            );


            setShareReelsToStory(
                user.allowReelsToStory !== false
            );


            setReadReceipts(
                user.readReceipts !== false
            );


            setManualTagApproval(
                user.manualTagApproval === true
            );


            setHideOffensiveComments(
                user.hideOffensiveComments !== false
            );

        }
        catch (error) {

            console.error(
                "LOAD PRIVACY SETTINGS ERROR:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // UPDATE ONE SETTING
    // ==========================================

    async function updateSetting(
        settingName,
        value
    ) {

        try {

            setSavingSetting(
                settingName
            );


            await api(
                "/auth/privacy",
                {
                    method: "PUT",

                    body: JSON.stringify({

                        [settingName]:
                            value

                    })

                }
            );


            console.log(
                "PRIVACY SETTING UPDATED:",
                settingName,
                value
            );

        }
        catch (error) {

            console.error(
                "UPDATE PRIVACY SETTING ERROR:",
                error
            );


            /*
                Backend save fail hone par
                latest MongoDB value dobara load
                kar dete hain.
            */

            await loadPrivacySettings();

        }
        finally {

            setSavingSetting(
                null
            );

        }

    }


    // ==========================================
    // TOGGLE COMPONENT
    // ==========================================

    function Toggle({
        value,
        onChange,
        label,
        settingName
    }) {

        const isSaving =
            savingSetting ===
            settingName;


        return (

            <button
                type="button"
                className={
                    value
                        ? "privacy-toggle active"
                        : "privacy-toggle"
                }
                onClick={function () {

                    if (isSaving) {

                        return;

                    }


                    const newValue =
                        !value;


                    onChange(
                        newValue
                    );


                    updateSetting(
                        settingName,
                        newValue
                    );

                }}
                disabled={isSaving}
                aria-label={label}
                aria-pressed={value}
            >

                <span></span>

            </button>

        );

    }


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // OPEN PAGE
    // ==========================================

    function openPage(path) {

        navigate(path);

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="privacy-page">

                <div className="privacy-nav">

                    <button
                        className="privacy-back-btn"
                        onClick={handleBack}
                    >

                        <FiArrowLeft />

                    </button>


                    <h1>
                        Privacy
                    </h1>

                </div>


                <div
                    style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#777"
                    }}
                >

                    Loading...

                </div>

            </div>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="privacy-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div className="privacy-nav">

                <button
                    className="privacy-back-btn"
                    onClick={handleBack}
                    aria-label="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Privacy
                </h1>

            </div>


            {/* ==========================================
                ACCOUNT PRIVACY
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Account privacy
                </h2>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Private account
                        </strong>

                        <p>
                            Only approved followers can see your posts.
                        </p>

                    </div>


                    <Toggle
                        value={privateAccount}
                        onChange={setPrivateAccount}
                        label="Private account"
                        settingName="isPrivate"
                    />

                </div>

            </div>


            {/* ==========================================
                ACTIVITY
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Activity status
                </h2>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Show activity status
                        </strong>

                        <p>
                            Let people see when you are active.
                        </p>

                    </div>


                    <Toggle
                        value={activityStatus}
                        onChange={setActivityStatus}
                        label="Activity status"
                        settingName="showActivityStatus"
                    />

                </div>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/activity"
                        );

                    }}
                >

                    <span>
                        Activity status settings
                    </span>

                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                STORY
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Story
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/story"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Story privacy
                        </strong>

                        <p>
                            Control who can see your stories.
                        </p>

                    </div>

                    <FiChevronRight />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Show story activity
                        </strong>

                        <p>
                            Allow people to see that you viewed their story.
                        </p>

                    </div>


                    <Toggle
                        value={showStoryActivity}
                        onChange={setShowStoryActivity}
                        label="Show story activity"
                        settingName="showStoryActivity"
                    />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Allow story sharing
                        </strong>

                        <p>
                            Allow others to share your stories.
                        </p>

                    </div>


                    <Toggle
                        value={storySharing}
                        onChange={setStorySharing}
                        label="Story sharing"
                        settingName="allowStorySharing"
                    />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Allow sharing to messages
                        </strong>

                        <p>
                            Allow your stories to be shared in messages.
                        </p>

                    </div>


                    <Toggle
                        value={messageSharing}
                        onChange={setMessageSharing}
                        label="Message sharing"
                        settingName="allowStoryMessageSharing"
                    />

                </div>

            </div>


            {/* ==========================================
                COMMENTS
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Comments
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/comments"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Comments
                        </strong>

                        <p>
                            Control who can comment on your posts.
                        </p>

                    </div>

                    <FiChevronRight />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Hide offensive comments
                        </strong>

                        <p>
                            Automatically hide potentially offensive comments.
                        </p>

                    </div>


                    <Toggle
                        value={hideOffensiveComments}
                        onChange={setHideOffensiveComments}
                        label="Hide offensive comments"
                        settingName="hideOffensiveComments"
                    />

                </div>

            </div>


            {/* ==========================================
                MENTIONS
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Mentions
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/mentions"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Allow mentions
                        </strong>

                        <p>
                            Choose who can mention you.
                        </p>

                    </div>

                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                TAGS
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Tags
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/tags"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Allow tags
                        </strong>

                        <p>
                            Choose who can tag you.
                        </p>

                    </div>

                    <FiChevronRight />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Manually approve tags
                        </strong>

                        <p>
                            Review tags before they appear on your profile.
                        </p>

                    </div>


                    <Toggle
                        value={manualTagApproval}
                        onChange={setManualTagApproval}
                        label="Manual tag approval"
                        settingName="manualTagApproval"
                    />

                </div>

            </div>


            {/* ==========================================
                POSTS / REELS
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Posts and reels
                </h2>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Hide like and share counts
                        </strong>

                        <p>
                            Hide the number of likes and shares on your posts.
                        </p>

                    </div>


                    <Toggle
                        value={hideLikeCounts}
                        onChange={setHideLikeCounts}
                        label="Hide like and share counts"
                        settingName="hideLikeCounts"
                    />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Allow remixing
                        </strong>

                        <p>
                            Allow others to remix your reels.
                        </p>

                    </div>


                    <Toggle
                        value={allowRemix}
                        onChange={setAllowRemix}
                        label="Allow remixing"
                        settingName="allowRemix"
                    />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Allow sharing to stories
                        </strong>

                        <p>
                            Allow your posts and reels to be shared to stories.
                        </p>

                    </div>


                    <Toggle
                        value={shareReelsToStory}
                        onChange={setShareReelsToStory}
                        label="Share reels to stories"
                        settingName="allowReelsToStory"
                    />

                </div>

            </div>


            {/* ==========================================
                MESSAGES
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Messages
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/messages"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Message privacy
                        </strong>

                        <p>
                            Control message requests and conversations.
                        </p>

                    </div>

                    <FiChevronRight />

                </div>


                <div className="privacy-switch-row">

                    <div>

                        <strong>
                            Read receipts
                        </strong>

                        <p>
                            Let people know when you have read their messages.
                        </p>

                    </div>


                    <Toggle
                        value={readReceipts}
                        onChange={setReadReceipts}
                        label="Read receipts"
                        settingName="readReceipts"
                    />

                </div>

            </div>


            {/* ==========================================
                PRIVACY MANAGEMENT
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Privacy management
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/restricted"
                        );

                    }}
                >

                    <span>
                        Restricted accounts
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/blocked"
                        );

                    }}
                >

                    <span>
                        Blocked accounts
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/privacy/hiddenwords"
                        );

                    }}
                >

                    <span>
                        Hidden Words
                    </span>

                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                ACCOUNT OWNERSHIP
            ========================================== */}

            <div className="privacy-section">

                <h2>
                    Account ownership and control
                </h2>


                <div
                    className="privacy-row"
                    onClick={function () {

                        openPage(
                            "/accountownership"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Account ownership and control
                        </strong>

                        <p>
                            Deactivation, deletion and account information.
                        </p>

                    </div>

                    <FiChevronRight />

                </div>

            </div>


        </div>

    );

}


export default Privacy;