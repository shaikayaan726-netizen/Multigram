import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiEye,
    FiEyeOff
} from "react-icons/fi";

import { api } from "../utils/api";


// ==========================================
// PASSWORD INPUT COMPONENT
// ==========================================

function PasswordInput({
    value,
    setValue,
    placeholder,
    show,
    setShow
}) {

    return (

        <div className="security-password-input">

            <input
                type={
                    show
                        ? "text"
                        : "password"
                }
                value={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={function (event) {

                    setValue(
                        event.target.value
                    );

                }}
            />


            <button
                type="button"

                // Eye click par input focus lose
                // nahi hoga.
                onMouseDown={function (event) {

                    event.preventDefault();

                }}

                onClick={function () {

                    setShow(
                        function (oldValue) {

                            return !oldValue;

                        }
                    );

                }}

                aria-label={
                    show
                        ? "Hide password"
                        : "Show password"
                }
            >

                {
                    show
                        ? <FiEyeOff />
                        : <FiEye />
                }

            </button>

        </div>

    );

}


// ==========================================
// CHANGE PASSWORD PAGE
// ==========================================

function ChangePassword() {

    const navigate = useNavigate();


    // ==========================================
    // PASSWORD STATES
    // ==========================================

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // ==========================================
    // SHOW / HIDE STATES
    // ==========================================

    const [showCurrent, setShowCurrent] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);


    // ==========================================
    // MESSAGE
    // ==========================================

    const [message, setMessage] =
        useState("");


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    async function handleChangePassword() {

        // Clear previous message

        setMessage("");


        // ==========================================
        // REQUIRED FIELDS
        // ==========================================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setMessage(
                "Please fill in all fields."
            );

            return;

        }


        // ==========================================
        // NEW PASSWORD LENGTH
        // ==========================================

        if (
            newPassword.length < 6
        ) {

            setMessage(
                "New password must be at least 6 characters."
            );

            return;

        }


        // ==========================================
        // CONFIRM PASSWORD
        // ==========================================

        if (
            newPassword !==
            confirmPassword
        ) {

            setMessage(
                "New passwords do not match."
            );

            return;

        }


        // ==========================================
        // SAME PASSWORD
        // ==========================================

        if (
            currentPassword ===
            newPassword
        ) {

            setMessage(
                "New password must be different from current password."
            );

            return;

        }


        try {

            setLoading(true);


            // ==========================================
            // BACKEND REQUEST
            // ==========================================

            const response =
                await api(
                    "/auth/change-password",
                    {

                        method:
                            "PUT",

                        body:
                            JSON.stringify({

                                currentPassword:
                                    currentPassword,

                                newPassword:
                                    newPassword

                            })

                    }
                );


            console.log(
                "CHANGE PASSWORD RESPONSE:",
                response
            );


            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            setMessage(
                response.message ||
                "Password changed successfully."
            );


            // ==========================================
            // CLEAR PASSWORD FIELDS
            // ==========================================

            setCurrentPassword("");

            setNewPassword("");

            setConfirmPassword("");


            // ==========================================
            // CLEAR OLD SESSION
            // ==========================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            // ==========================================
            // GO TO LOGIN
            // ==========================================

            setTimeout(
                function () {

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                },
                1000
            );

        }
        catch (error) {

            console.error(
                "CHANGE PASSWORD ERROR:",
                error
            );


            // ==========================================
            // ERROR MESSAGE
            // ==========================================

            setMessage(
                error.message ||
                "Failed to change password."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="security-detail-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div className="security-detail-nav">

                <button
                    type="button"
                    className="security-detail-back-btn"
                    onClick={handleBack}
                    aria-label="Back"
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Change password
                </h1>

            </div>


            {/* ==========================================
                PASSWORD SECTION
            ========================================== */}

            <div className="security-detail-section">

                <h2>
                    Change your password
                </h2>


                {/* ==========================================
                    CURRENT PASSWORD
                ========================================== */}

                <PasswordInput
                    value={
                        currentPassword
                    }
                    setValue={
                        setCurrentPassword
                    }
                    placeholder="Current password"
                    show={
                        showCurrent
                    }
                    setShow={
                        setShowCurrent
                    }
                />


                {/* ==========================================
                    NEW PASSWORD
                ========================================== */}

                <PasswordInput
                    value={
                        newPassword
                    }
                    setValue={
                        setNewPassword
                    }
                    placeholder="New password"
                    show={
                        showNew
                    }
                    setShow={
                        setShowNew
                    }
                />


                {/* ==========================================
                    CONFIRM PASSWORD
                ========================================== */}

                <PasswordInput
                    value={
                        confirmPassword
                    }
                    setValue={
                        setConfirmPassword
                    }
                    placeholder="Confirm new password"
                    show={
                        showConfirm
                    }
                    setShow={
                        setShowConfirm
                    }
                />


                {/* ==========================================
                    MESSAGE
                ========================================== */}

                {message && (

                    <p
                        className="security-message"
                        role="alert"
                    >

                        {message}

                    </p>

                )}


                {/* ==========================================
                    CHANGE PASSWORD BUTTON
                ========================================== */}

                <button
                    type="button"
                    className="security-primary-btn"
                    onClick={
                        handleChangePassword
                    }
                    disabled={loading}
                >

                    {
                        loading
                            ? "Changing password..."
                            : "Change password"
                    }

                </button>

            </div>

        </div>

    );

}


export default ChangePassword;