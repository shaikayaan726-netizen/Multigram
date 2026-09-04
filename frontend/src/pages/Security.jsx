import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronRight
} from "react-icons/fi";

import {
    api
} from "../utils/api";


function Security() {

    const navigate =
        useNavigate();


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // SAVING SETTING
    // ==========================================

    const [savingSetting, setSavingSetting] =
        useState(null);


    // ==========================================
    // SECURITY STATES
    // ==========================================

    const [loginAlerts, setLoginAlerts] =
        useState(true);


    const [savedLogin, setSavedLogin] =
        useState(true);


    const [twoFactor, setTwoFactor] =
        useState(false);


    // ==========================================
    // LOAD SECURITY SETTINGS
    // ==========================================

    useEffect(function () {

        loadSecuritySettings();

    }, []);


    // ==========================================
    // GET SETTINGS FROM BACKEND
    // ==========================================

    async function loadSecuritySettings() {

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
            // LOAD MONGODB VALUES
            // ==================================

            setLoginAlerts(
                user.loginAlerts !== false
            );


            setSavedLogin(
                user.savedLoginInformation !== false
            );


            setTwoFactor(
                user.twoFactorEnabled === true
            );

        }
        catch (error) {

            console.error(
                "LOAD SECURITY SETTINGS ERROR:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // UPDATE SECURITY SETTING
    // ==========================================

    async function updateSetting(
        settingName,
        value
    ) {

        try {

            setSavingSetting(
                settingName
            );


            const response =
                await api(
                    "/auth/security",
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
                "SECURITY SETTING UPDATED:",
                response
            );

        }
        catch (error) {

            console.error(
                "UPDATE SECURITY SETTING ERROR:",
                error
            );


            // ==================================
            // BACKEND SAVE FAIL
            // ==================================

            await loadSecuritySettings();

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
                        ? "security-toggle active"
                        : "security-toggle"
                }
                onClick={function () {

                    if (isSaving) {

                        return;

                    }


                    const newValue =
                        !value;


                    // ==================================
                    // IMMEDIATE UI UPDATE
                    // ==================================

                    onChange(
                        newValue
                    );


                    // ==================================
                    // SAVE TO MONGODB
                    // ==================================

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

            <div className="security-page">

                <div className="security-nav">

                    <button
                        className="security-back-btn"
                        onClick={handleBack}
                        aria-label="Back"
                    >

                        <FiArrowLeft />

                    </button>


                    <h1>
                        Security
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

        <div className="security-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div className="security-nav">

                <button
                    className="security-back-btn"
                    onClick={handleBack}
                    aria-label="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Security
                </h1>

            </div>


            {/* ==========================================
                LOGIN SECURITY
            ========================================== */}

            <div className="security-section">

                <h2>
                    Login security
                </h2>


                {/* ==================================
                    PASSWORD
                ================================== */}

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/password"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Password
                        </strong>

                        <p>
                            Change your password and keep your account secure.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>


                {/* ==================================
                    TWO FACTOR
                ================================== */}

                <div className="security-switch-row">

                    <div>

                        <strong>
                            Two-factor authentication
                        </strong>

                        <p>
                            Add an extra layer of security to your account.
                        </p>

                    </div>


                    <Toggle
                        value={twoFactor}
                        onChange={setTwoFactor}
                        label="Two-factor authentication"
                        settingName="twoFactorEnabled"
                    />

                </div>


                {/* ==================================
                    TWO FACTOR SETTINGS
                ================================== */}

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/twofactor"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Two-factor authentication settings
                        </strong>

                        <p>
                            Set up authentication methods and backup codes.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                LOGIN ACTIVITY
            ========================================== */}

            <div className="security-section">

                <h2>
                    Login activity
                </h2>


                {/* ==================================
                    WHERE LOGGED IN
                ================================== */}

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/loginactivity"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Where you're logged in
                        </strong>

                        <p>
                            Review devices where your account is currently logged in.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>


                {/* ==================================
                    RECENT ACTIVITY
                ================================== */}

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/recentactivity"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Recent security activity
                        </strong>

                        <p>
                            Review recent login and security changes.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                SECURITY ALERTS
            ========================================== */}

            <div className="security-section">

                <h2>
                    Security alerts
                </h2>


                {/* ==================================
                    LOGIN ALERTS
                ================================== */}

                <div className="security-switch-row">

                    <div>

                        <strong>
                            Login alerts
                        </strong>

                        <p>
                            Get alerts when someone logs into your account.
                        </p>

                    </div>


                    <Toggle
                        value={loginAlerts}
                        onChange={setLoginAlerts}
                        label="Login alerts"
                        settingName="loginAlerts"
                    />

                </div>


                {/* ==================================
                    SECURITY EMAILS
                ================================== */}

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/securityemails"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Security emails
                        </strong>

                        <p>
                            View important security emails sent to you.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                LOGIN INFORMATION
            ========================================== */}

            <div className="security-section">

                <h2>
                    Login information
                </h2>


                {/* ==================================
                    SAVED LOGIN
                ================================== */}

                <div className="security-switch-row">

                    <div>

                        <strong>
                            Saved login information
                        </strong>

                        <p>
                            Save login information on this device.
                        </p>

                    </div>


                    <Toggle
                        value={savedLogin}
                        onChange={setSavedLogin}
                        label="Saved login information"
                        settingName="savedLoginInformation"
                    />

                </div>


                {/* ==================================
                    DEVICES
                ================================== */}

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/devices"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Devices
                        </strong>

                        <p>
                            Manage trusted devices connected to your account.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                ACCOUNT RECOVERY
            ========================================== */}

            <div className="security-section">

                <h2>
                    Account recovery
                </h2>


                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/recovery"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Recovery information
                        </strong>

                        <p>
                            Manage your recovery email and phone number.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                SECURITY CHECKUP
            ========================================== */}

            <div className="security-section">

                <div
                    className="security-row"
                    onClick={function () {

                        openPage(
                            "/security/checkup"
                        );

                    }}
                >

                    <div>

                        <strong>
                            Security checkup
                        </strong>

                        <p>
                            Review your account security settings.
                        </p>

                    </div>


                    <FiChevronRight />

                </div>

            </div>


        </div>

    );

}


export default Security;