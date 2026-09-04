import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiMail,
    FiPhone
} from "react-icons/fi";


function Recovery() {

    const navigate = useNavigate();


    const [email, setEmail] =
        useState("ayaan@example.com");

    const [phone, setPhone] =
        useState("+91 XXXXX XXXXX");


    const [editingEmail, setEditingEmail] =
        useState(false);

    const [editingPhone, setEditingPhone] =
        useState(false);


    function handleBack() {
        navigate(-1);
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
                    Recovery information
                </h1>

            </div>


            <div className="security-detail-section">

                <h2>
                    Account recovery
                </h2>


                <div className="security-recovery-row">

                    <div className="security-recovery-icon">

                        <FiMail />

                    </div>


                    <div className="security-recovery-info">

                        <strong>
                            Recovery email
                        </strong>


                        {editingEmail ? (

                            <input
                                value={email}
                                onChange={function (event) {

                                    setEmail(
                                        event.target.value
                                    );

                                }}
                            />

                        ) : (

                            <span>
                                {email}
                            </span>

                        )}

                    </div>


                    <button
                        className="security-edit-btn"
                        onClick={function () {

                            setEditingEmail(
                                !editingEmail
                            );

                        }}
                    >

                        {editingEmail
                            ? "Save"
                            : "Edit"}

                    </button>

                </div>


                <div className="security-recovery-row">

                    <div className="security-recovery-icon">

                        <FiPhone />

                    </div>


                    <div className="security-recovery-info">

                        <strong>
                            Recovery phone
                        </strong>


                        {editingPhone ? (

                            <input
                                value={phone}
                                onChange={function (event) {

                                    setPhone(
                                        event.target.value
                                    );

                                }}
                            />

                        ) : (

                            <span>
                                {phone}
                            </span>

                        )}

                    </div>


                    <button
                        className="security-edit-btn"
                        onClick={function () {

                            setEditingPhone(
                                !editingPhone
                            );

                        }}
                    >

                        {editingPhone
                            ? "Save"
                            : "Edit"}

                    </button>

                </div>


                <p className="security-recovery-note">

                    Keep your recovery information up to date
                    so you can regain access to your account.

                </p>

            </div>

        </div>

    );

}


export default Recovery;