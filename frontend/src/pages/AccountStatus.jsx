import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiAlertCircle
} from "react-icons/fi";


function AccountStatus() {

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
                    Account Status
                </h1>

            </div>


            <div className="account-status-card">

                <FiCheckCircle />

                <h2>
                    Your account is in good standing
                </h2>

                <p>
                    There are no restrictions on your account.
                </p>

            </div>


            <div className="account-status-section">

                <h3>
                    Account features
                </h3>


                <div className="account-status-row">

                    <FiCheckCircle />

                    <div>

                        <strong>
                            Posts
                        </strong>

                        <span>
                            No restrictions
                        </span>

                    </div>

                </div>


                <div className="account-status-row">

                    <FiCheckCircle />

                    <div>

                        <strong>
                            Reels
                        </strong>

                        <span>
                            No restrictions
                        </span>

                    </div>

                </div>


                <div className="account-status-row">

                    <FiCheckCircle />

                    <div>

                        <strong>
                            Messaging
                        </strong>

                        <span>
                            No restrictions
                        </span>

                    </div>

                </div>

            </div>


            <div className="account-status-note">

                <FiAlertCircle />

                <p>
                    If your account has an issue in the future,
                    it will appear here.
                </p>

            </div>

        </div>

    );

}


export default AccountStatus;