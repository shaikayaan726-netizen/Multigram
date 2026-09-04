import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function PrivacyPolicy() {

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
                    Privacy Policy
                </h1>

            </div>


            <div className="legal-content">

                <h2>
                    Privacy Policy
                </h2>

                <p>
                    Last updated: August 2026
                </p>


                <h3>
                    Information we use
                </h3>

                <p>
                    The application may use account information,
                    profile information and content that you choose
                    to provide.
                </p>


                <h3>
                    How information is used
                </h3>

                <p>
                    Information may be used to provide account
                    functionality, improve the application and
                    protect users and the service.
                </p>


                <h3>
                    Your controls
                </h3>

                <p>
                    Privacy settings allow you to control features
                    such as activity status, stories, comments,
                    messages, tags and account visibility.
                </p>


                <h3>
                    Security
                </h3>

                <p>
                    We use reasonable measures designed to protect
                    account information and application data.
                </p>


                <h3>
                    Contact
                </h3>

                <p>
                    If you have questions about privacy, use the
                    Report a Problem option in the About section.
                </p>

            </div>

        </div>

    );

}


export default PrivacyPolicy;