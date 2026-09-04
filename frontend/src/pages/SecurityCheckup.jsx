import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiAlertCircle
} from "react-icons/fi";


function SecurityCheckup() {

    const navigate = useNavigate();


    const [completed, setCompleted] =
        useState({

            password: true,

            twoFactor: false,

            loginAlerts: true,

            recovery: true

        });


    function handleBack() {
        navigate(-1);
    }


    function toggleCheck(key) {

        setCompleted(function (previous) {

            return {

                ...previous,

                [key]: !previous[key]

            };

        });

    }


    const checks = [

        {
            key: "password",
            title: "Strong password",
            description: "Your password is set up."
        },

        {
            key: "twoFactor",
            title: "Two-factor authentication",
            description: "Add another layer of protection."
        },

        {
            key: "loginAlerts",
            title: "Login alerts",
            description: "Get notified about new logins."
        },

        {
            key: "recovery",
            title: "Recovery information",
            description: "Your recovery information is available."
        }

    ];


    return (

        <div className="security-detail-page">

            <div className="security-detail-nav">

                <button
                    className="security-detail-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Security checkup
                </h1>

            </div>


            <div className="security-checkup-intro">

                <h2>
                    Secure your account
                </h2>

                <p>
                    Review these security settings and make sure
                    your account is protected.
                </p>

            </div>


            <div className="security-detail-section">

                {checks.map(function (check) {

                    const isComplete =
                        completed[check.key];


                    return (

                        <div
                            className="security-check-row"
                            key={check.key}
                            onClick={function () {

                                toggleCheck(
                                    check.key
                                );

                            }}
                        >

                            <div className="security-check-icon">

                                {isComplete
                                    ? <FiCheckCircle />
                                    : <FiAlertCircle />
                                }

                            </div>


                            <div className="security-check-info">

                                <strong>
                                    {check.title}
                                </strong>

                                <p>
                                    {check.description}
                                </p>

                            </div>


                            <span
                                className={
                                    isComplete
                                        ? "security-check-status complete"
                                        : "security-check-status"
                                }
                            >

                                {isComplete
                                    ? "Complete"
                                    : "Review"}

                            </span>

                        </div>

                    );

                })}

            </div>


            <div className="security-checkup-summary">

                <strong>
                    Security checkup
                </strong>

                <p>

                    {
                        Object.values(completed)
                            .filter(Boolean)
                            .length
                    }

                    {" "}of{" "}

                    {checks.length}

                    {" "}security checks complete.

                </p>

            </div>

        </div>

    );

}


export default SecurityCheckup;