import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiMonitor,
    FiSmartphone
} from "react-icons/fi";


function LoginActivity() {

    const navigate = useNavigate();


    const [sessions, setSessions] = useState([

        {
            id: 1,
            device: "Windows PC",
            location: "Hyderabad, India",
            current: true
        },

        {
            id: 2,
            device: "Android Phone",
            location: "Hyderabad, India",
            current: false
        }

    ]);


    function handleBack() {
        navigate(-1);
    }


    function logoutDevice(id) {

        setSessions(function (previous) {

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
                    Where you're logged in
                </h1>

            </div>


            <div className="security-detail-section">

                <h2>
                    Logged in devices
                </h2>


                {sessions.map(function (session) {

                    return (

                        <div
                            className="security-device-row"
                            key={session.id}
                        >

                            <div className="security-device-icon">

                                {session.device.includes("Windows")
                                    ? <FiMonitor />
                                    : <FiSmartphone />
                                }

                            </div>


                            <div className="security-device-info">

                                <strong>
                                    {session.device}
                                </strong>

                                <span>
                                    {session.location}
                                </span>


                                {session.current && (

                                    <small>
                                        Active now
                                    </small>

                                )}

                            </div>


                            {!session.current && (

                                <button
                                    className="security-logout-device"
                                    onClick={function () {

                                        logoutDevice(
                                            session.id
                                        );

                                    }}
                                >

                                    Log out

                                </button>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );

}


export default LoginActivity;