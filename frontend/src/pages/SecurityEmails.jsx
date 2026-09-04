import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiMail
} from "react-icons/fi";


function SecurityEmails() {

    const navigate = useNavigate();


    const [emails, setEmails] = useState([

        {
            id: 1,
            title: "New login detected",
            description: "A login was detected from a new device.",
            date: "Today"
        },

        {
            id: 2,
            title: "Password changed",
            description: "Your password was successfully changed.",
            date: "Yesterday"
        }

    ]);


    function handleBack() {
        navigate(-1);
    }


    function removeEmail(id) {

        setEmails(function (previous) {

            return previous.filter(function (email) {

                return email.id !== id;

            });

        });

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
                    Security emails
                </h1>

            </div>


            <div className="security-detail-section">

                <h2>
                    Security emails
                </h2>


                {emails.length === 0 ? (

                    <div className="security-empty-state">

                        <FiMail />

                        <p>
                            No security emails.
                        </p>

                    </div>

                ) : (

                    emails.map(function (email) {

                        return (

                            <div
                                className="security-email-row"
                                key={email.id}
                            >

                                <div className="security-email-icon">

                                    <FiMail />

                                </div>


                                <div className="security-email-info">

                                    <strong>
                                        {email.title}
                                    </strong>

                                    <p>
                                        {email.description}
                                    </p>

                                    <small>
                                        {email.date}
                                    </small>

                                </div>


                                <button
                                    onClick={function () {

                                        removeEmail(
                                            email.id
                                        );

                                    }}
                                >

                                    ×

                                </button>

                            </div>

                        );

                    })

                )}

            </div>

        </div>

    );

}


export default SecurityEmails;