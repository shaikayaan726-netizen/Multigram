import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiMonitor,
    FiSmartphone
} from "react-icons/fi";


function Devices() {

    const navigate = useNavigate();


    const [devices, setDevices] = useState([

        {
            id: 1,
            name: "Windows PC",
            details: "Chrome • Hyderabad",
            trusted: true
        },

        {
            id: 2,
            name: "Android Phone",
            details: "Android • Hyderabad",
            trusted: false
        },

        {
            id: 3,
            name: "iPhone",
            details: "iOS • Hyderabad",
            trusted: false
        }

    ]);


    function handleBack() {
        navigate(-1);
    }


    function removeDevice(id) {

        setDevices(function (previous) {

            return previous.filter(function (device) {

                return device.id !== id;

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
                    Devices
                </h1>

            </div>


            <div className="security-detail-section">

                <h2>
                    Trusted devices
                </h2>


                {devices.map(function (device) {

                    return (

                        <div
                            className="security-device-row"
                            key={device.id}
                        >

                            <div className="security-device-icon">

                                {device.name.includes("Windows")
                                    ? <FiMonitor />
                                    : <FiSmartphone />
                                }

                            </div>


                            <div className="security-device-info">

                                <strong>
                                    {device.name}
                                </strong>

                                <span>
                                    {device.details}
                                </span>

                                {device.trusted && (

                                    <small>
                                        This device
                                    </small>

                                )}

                            </div>


                            {!device.trusted && (

                                <button
                                    className="security-logout-device"
                                    onClick={function () {

                                        removeDevice(
                                            device.id
                                        );

                                    }}
                                >

                                    Remove

                                </button>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );

}


export default Devices;