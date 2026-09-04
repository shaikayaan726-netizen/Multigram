import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiShield
} from "react-icons/fi";


function RecentActivity() {

    const navigate = useNavigate();


    const [activities, setActivities] = useState([

        {
            id: 1,
            title: "Login",
            description: "Logged in from Windows PC",
            time: "Today"
        },

        {
            id: 2,
            title: "Password",
            description: "Password settings were updated",
            time: "Yesterday"
        },

        {
            id: 3,
            title: "Login",
            description: "Logged in from Android Phone",
            time: "2 days ago"
        }

    ]);


    function handleBack() {
        navigate(-1);
    }


    function clearActivity(id) {

        setActivities(function (previous) {

            return previous.filter(function (item) {

                return item.id !== id;

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
                    Recent security activity
                </h1>

            </div>


            <div className="security-detail-section">

                <h2>
                    Recent activity
                </h2>


                {activities.length === 0 ? (

                    <div className="security-empty-state">

                        <FiCheckCircle />

                        <p>
                            No recent security activity.
                        </p>

                    </div>

                ) : (

                    activities.map(function (activity) {

                        return (

                            <div
                                className="security-activity-row"
                                key={activity.id}
                            >

                                <div className="security-activity-icon">

                                    <FiShield />

                                </div>


                                <div className="security-activity-info">

                                    <strong>
                                        {activity.title}
                                    </strong>

                                    <span>
                                        {activity.description}
                                    </span>

                                    <small>
                                        {activity.time}
                                    </small>

                                </div>


                                <button
                                    onClick={function () {

                                        clearActivity(
                                            activity.id
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


export default RecentActivity;