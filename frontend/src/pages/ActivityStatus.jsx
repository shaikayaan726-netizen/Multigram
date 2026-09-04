import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function ActivityStatus() {

    const navigate = useNavigate();


    const [activityStatus, setActivityStatus] =
        useState(false);


    function handleBack() {

        navigate(-1);

    }


    return (

        <div className="privacy-detail-page">

            {/* NAVBAR */}

            <div className="privacy-detail-nav">

                <button
                    className="privacy-detail-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Activity status
                </h1>

            </div>


            {/* CONTENT */}

            <div className="privacy-detail-section">

                <h2>
                    Activity status
                </h2>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Show activity status
                        </strong>

                        <p>
                            Allow people you follow and people you message
                            to see when you are active.
                        </p>

                    </div>


                    <button
                        className={
                            activityStatus
                                ? "privacy-detail-toggle active"
                                : "privacy-detail-toggle"
                        }
                        onClick={function () {

                            setActivityStatus(
                                !activityStatus
                            );

                        }}
                    >

                        <span></span>

                    </button>

                </div>

            </div>

        </div>

    );

}


export default ActivityStatus;