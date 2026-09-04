import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function TwoFactor() {

    const navigate = useNavigate();

    const [enabled, setEnabled] = useState(false);

    const [method, setMethod] = useState("authenticator");

    const [phone, setPhone] = useState("");

    const [showBackupCodes, setShowBackupCodes] =
        useState(false);


    function handleBack() {
        navigate(-1);
    }


    function Toggle() {

        return (

            <button
                className={
                    enabled
                        ? "security-detail-toggle active"
                        : "security-detail-toggle"
                }
                onClick={function () {

                    setEnabled(!enabled);

                }}
            >

                <span></span>

            </button>

        );

    }


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
                    Two-factor authentication
                </h1>

            </div>


            <div className="security-detail-section">

                <div className="security-detail-switch-row">

                    <div>

                        <strong>
                            Two-factor authentication
                        </strong>

                        <p>
                            Add an extra layer of protection when you log in.
                        </p>

                    </div>


                    <Toggle />

                </div>


                <h2>
                    Authentication method
                </h2>


                <label className="security-radio-row">

                    <div>

                        <strong>
                            Authentication app
                        </strong>

                        <p>
                            Use an authenticator app to generate login codes.
                        </p>

                    </div>


                    <input
                        type="radio"
                        checked={
                            method === "authenticator"
                        }
                        onChange={function () {

                            setMethod("authenticator");

                        }}
                    />

                </label>


                <label className="security-radio-row">

                    <div>

                        <strong>
                            SMS
                        </strong>

                        <p>
                            Receive security codes by phone.
                        </p>

                    </div>


                    <input
                        type="radio"
                        checked={
                            method === "sms"
                        }
                        onChange={function () {

                            setMethod("sms");

                        }}
                    />

                </label>


                {method === "sms" && (

                    <input
                        className="security-text-input"
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={function (event) {

                            setPhone(event.target.value);

                        }}
                    />

                )}


                <button
                    className="security-secondary-btn"
                    onClick={function () {

                        setShowBackupCodes(
                            !showBackupCodes
                        );

                    }}
                >

                    Backup codes

                </button>


                {showBackupCodes && (

                    <div className="security-info-box">

                        <strong>
                            Backup codes
                        </strong>

                        <p>
                            Use a backup code if you cannot access
                            your authentication method.
                        </p>

                        <p>
                            4821-7365
                        </p>

                        <p>
                            9147-2058
                        </p>

                        <p>
                            6382-4917
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}


export default TwoFactor;