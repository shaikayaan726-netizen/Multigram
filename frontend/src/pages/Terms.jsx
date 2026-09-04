import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function Terms() {

    const navigate = useNavigate();


    function handleBack() {
        navigate(-1);
    }


    return (

        <div className="about-detail-page">

            <div className="about-detail-nav">

                <button
                    className="about-detail-back-btn"
                    onClick={handleBack}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Terms of Service
                </h1>

            </div>


            <div className="legal-content">

                <h2>
                    Terms of Service
                </h2>

                <p>
                    Last updated: August 2026
                </p>


                <h3>
                    Using the app
                </h3>

                <p>
                    By using this application, you agree to use
                    the service responsibly and follow applicable
                    laws and these terms.
                </p>


                <h3>
                    Your account
                </h3>

                <p>
                    You are responsible for keeping your account
                    information secure and for activity performed
                    through your account.
                </p>


                <h3>
                    Content
                </h3>

                <p>
                    You are responsible for the content you upload,
                    share, post or send through the application.
                </p>


                <h3>
                    Prohibited use
                </h3>

                <p>
                    Do not use the application to abuse, harass,
                    impersonate, scam or otherwise harm other users.
                </p>


                <h3>
                    Changes
                </h3>

                <p>
                    These terms may be updated as the application
                    develops.
                </p>

            </div>

        </div>

    );

}


export default Terms;