import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronRight,
    FiUser,
    FiBell,
    FiBookmark,
    FiLock,
    FiShield,
    FiInfo,
    FiLogOut,
    FiUsers,
    FiTrash2,
    FiPauseCircle
} from "react-icons/fi";

import { api, logout } from "../utils/api";


function Settings() {

    const navigate = useNavigate();


    // ==========================================
    // SEARCH
    // ==========================================

    const [searchText, setSearchText] =
        useState("");


    // ==========================================
    // ACCOUNT CONTROL
    // ==========================================

    const [showAccountControl, setShowAccountControl] =
        useState(false);


    // ==========================================
    // SETTINGS LOADING
    // ==========================================

    const [loadingSettings, setLoadingSettings] =
        useState(true);


    // ==========================================
    // SAVING SETTING
    // ==========================================

    const [savingSetting, setSavingSetting] =
        useState(null);


    // ==========================================
    // PRIVACY QUICK STATES
    // ==========================================

    const [privateAccount, setPrivateAccount] =
        useState(false);


    const [activityStatus, setActivityStatus] =
        useState(true);


    // ==========================================
    // LOAD SETTINGS
    // ==========================================

    useEffect(function () {

        loadSettings();

    }, []);


    // ==========================================
    // GET CURRENT USER
    // ==========================================

    async function loadSettings() {

        try {

            setLoadingSettings(true);


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
            // MONGODB VALUES
            // ==================================

            setPrivateAccount(
                user.isPrivate === true
            );


            setActivityStatus(
                user.showActivityStatus !== false
            );

        }
        catch (error) {

            console.error(
                "LOAD SETTINGS ERROR:",
                error
            );

        }
        finally {

            setLoadingSettings(false);

        }

    }


    // ==========================================
    // UPDATE PRIVACY SETTING
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

                    method:
                        "PUT",

                    body:
                        JSON.stringify({

                            [settingName]:
                                value

                        })

                }
            );


            console.log(
                "SETTING UPDATED:",
                settingName,
                value
            );

        }
        catch (error) {

            console.error(
                "SETTING UPDATE ERROR:",
                error
            );


            // Backend save fail hua toh
            // MongoDB ki latest value dobara load karo.

            await loadSettings();

        }
        finally {

            setSavingSetting(null);

        }

    }


    // ==========================================
    // PRIVATE ACCOUNT
    // ==========================================

    async function handlePrivateAccount() {

        if (
            savingSetting ===
            "isPrivate"
        ) {

            return;

        }


        const newValue =
            !privateAccount;


        // Immediately UI update

        setPrivateAccount(
            newValue
        );


        // Backend / MongoDB

        await updateSetting(
            "isPrivate",
            newValue
        );

    }


    // ==========================================
    // ACTIVITY STATUS
    // ==========================================

    async function handleActivityStatus() {

        if (
            savingSetting ===
            "showActivityStatus"
        ) {

            return;

        }


        const newValue =
            !activityStatus;


        setActivityStatus(
            newValue
        );


        await updateSetting(
            "showActivityStatus",
            newValue
        );

    }


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // LOG OUT
    // ==========================================

    function handleLogout() {

        const confirmLogout =
            window.confirm(
                "Are you sure you want to log out?"
            );


        if (!confirmLogout) {

            return;

        }


        logout();

    }


    // ==========================================
    // LOG OUT ALL ACCOUNTS
    // ==========================================

    function handleLogoutAll() {

        const confirmLogout =
            window.confirm(
                "Log out of all accounts?"
            );


        if (!confirmLogout) {

            return;

        }


        localStorage.clear();


        navigate(
            "/login",
            {
                replace: true
            }
        );

    }


    // ==========================================
    // ADD / SWITCH ACCOUNT
    // ==========================================

    function handleSwitchAccount() {

        navigate("/");

    }


    // ==========================================
    // TEMPORARILY DEACTIVATE
    // ==========================================

    function handleDeactivate() {

        const confirmDeactivate =
            window.confirm(
                "Temporarily deactivate your account?"
            );


        if (!confirmDeactivate) {

            return;

        }


        /*
            Actual account deactivation backend
            mein baad mein implement karenge.
        */

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "authToken"
        );


        navigate(
            "/login",
            {
                replace: true
            }
        );

    }


    // ==========================================
    // PERMANENT DELETE
    // ==========================================

    function handleDeleteAccount() {

        const confirmDelete =
            window.confirm(
                "This will permanently delete your account. Continue?"
            );


        if (!confirmDelete) {

            return;

        }


        const finalConfirm =
            window.confirm(
                "This action cannot be undone. Delete account permanently?"
            );


        if (!finalConfirm) {

            return;

        }


        /*
            Actual account deletion backend
            mein baad mein implement karenge.
        */

        localStorage.clear();


        navigate(
            "/",
            {
                replace: true
            }
        );

    }


    // ==========================================
    // SETTINGS ITEMS
    // ==========================================

    const settingsItems = [

        {
            title:
                "Profile",

            icon:
                <FiUser />,

            action:
                function () {

                    navigate(
                        "/editprofile"
                    );

                }

        },

        {
            title:
                "Notification",

            icon:
                <FiBell />,

            action:
                function () {

                    navigate(
                        "/notificationsettings"
                    );

                }

        },

        {
            title:
                "Saved",

            icon:
                <FiBookmark />,

            action:
                function () {

                    navigate(
                        "/saved"
                    );

                }

        },

        {
            title:
                "Privacy",

            icon:
                <FiLock />,

            action:
                function () {

                    navigate(
                        "/privacy"
                    );

                }

        },

        {
            title:
                "Security",

            icon:
                <FiShield />,

            action:
                function () {

                    navigate(
                        "/security"
                    );

                }

        },

        {
            title:
                "About",

            icon:
                <FiInfo />,

            action:
                function () {

                    navigate(
                        "/about"
                    );

                }

        }

    ];


    // ==========================================
    // SEARCH FILTER
    // ==========================================

    const filteredItems =
        settingsItems.filter(
            function (item) {

                return item.title
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    );

            }
        );


    // ==========================================
    // LOADING
    // ==========================================

    if (loadingSettings) {

        return (

            <div className="settings-page">

                <div className="settings-nav">

                    <button
                        className="back-btn"
                        onClick={handleBack}
                    >

                        <FiArrowLeft />

                    </button>


                    <h1>
                        Settings
                    </h1>


                    <div className="nav-space" />

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

        <div className="settings-page">


            {/* ==================================
                NAVBAR
            ================================== */}

            <div className="settings-nav">

                <button
                    className="back-btn"
                    onClick={handleBack}
                    aria-label="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Settings
                </h1>


                <div className="nav-space" />

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="search">

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={function (event) {

                        setSearchText(
                            event.target.value
                        );

                    }}
                />

            </div>


            {/* ==================================
                SETTINGS ACTIONS
            ================================== */}

            <div className="setting-actions">

                {filteredItems.map(
                    function (item) {

                        return (

                            <button
                                className="setting-item"
                                key={item.title}
                                onClick={
                                    item.action
                                }
                            >

                                <div className="setting-left">

                                    <span className="setting-icon">

                                        {item.icon}

                                    </span>


                                    <span>
                                        {item.title}
                                    </span>

                                </div>


                                <span className="arrow">

                                    <FiChevronRight />

                                </span>

                            </button>

                        );

                    }
                )}

            </div>


            {/* ==================================
                PRIVACY QUICK SETTINGS
            ================================== */}

            <div className="settings-section">

                <h3>
                    Privacy shortcuts
                </h3>


                {/* ==================================
                    PRIVATE ACCOUNT
                ================================== */}

                <div className="toggle-item">

                    <div>

                        <strong>
                            Private account
                        </strong>


                        <p>
                            Only approved followers can see your posts.
                        </p>

                    </div>


                    <button
                        type="button"
                        className={
                            privateAccount
                                ? "toggle active"
                                : "toggle"
                        }
                        disabled={
                            savingSetting ===
                            "isPrivate"
                        }
                        onClick={
                            handlePrivateAccount
                        }
                        aria-label="Private account"
                        aria-pressed={
                            privateAccount
                        }
                    >

                        <span />

                    </button>

                </div>


                {/* ==================================
                    ACTIVITY STATUS
                ================================== */}

                <div className="toggle-item">

                    <div>

                        <strong>
                            Activity status
                        </strong>


                        <p>
                            Show when you're active.
                        </p>

                    </div>


                    <button
                        type="button"
                        className={
                            activityStatus
                                ? "toggle active"
                                : "toggle"
                        }
                        disabled={
                            savingSetting ===
                            "showActivityStatus"
                        }
                        onClick={
                            handleActivityStatus
                        }
                        aria-label="Activity status"
                        aria-pressed={
                            activityStatus
                        }
                    >

                        <span />

                    </button>

                </div>

            </div>


            {/* ==================================
                ACCOUNT OWNERSHIP
            ================================== */}

            <div className="settings-section">

                <button
                    className="account-control-header"
                    onClick={function () {

                        setShowAccountControl(
                            !showAccountControl
                        );

                    }}
                >

                    <div className="setting-left">

                        <span className="setting-icon">

                            <FiUsers />

                        </span>


                        <div>

                            <strong>
                                Account ownership and control
                            </strong>


                            <p>
                                Deactivation and deletion
                            </p>

                        </div>

                    </div>


                    <FiChevronRight
                        className={
                            showAccountControl
                                ? "rotate-arrow"
                                : ""
                        }
                    />

                </button>


                {showAccountControl && (

                    <div className="account-control-panel">


                        {/* TEMPORARY */}

                        <button
                            className="danger-row"
                            onClick={
                                handleDeactivate
                            }
                        >

                            <FiPauseCircle />


                            <div>

                                <strong>
                                    Temporarily deactivate account
                                </strong>


                                <span>
                                    Hide your account temporarily.
                                </span>

                            </div>

                        </button>


                        {/* PERMANENT */}

                        <button
                            className="danger-row delete-row"
                            onClick={
                                handleDeleteAccount
                            }
                        >

                            <FiTrash2 />


                            <div>

                                <strong>
                                    Permanently delete account
                                </strong>


                                <span>
                                    Permanently remove your account.
                                </span>

                            </div>

                        </button>

                    </div>

                )}

            </div>


            {/* ==================================
                LOGINS
            ================================== */}

            <div className="settings-login-card">

                <h3>
                    Logins
                </h3>


                <button
                    className="login-action"
                    onClick={
                        handleSwitchAccount
                    }
                >

                    Add or switch accounts

                </button>


                <button
                    className="login-action"
                    onClick={
                        handleLogout
                    }
                >

                    <FiLogOut />

                    Log out

                </button>


                <button
                    className="login-action"
                    onClick={
                        handleLogoutAll
                    }
                >

                    <FiLogOut />

                    Log out all accounts

                </button>

            </div>


        </div>

    );

}


export default Settings;