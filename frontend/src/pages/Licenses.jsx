import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronDown,
    FiChevronUp
} from "react-icons/fi";


function Licenses() {

    const navigate = useNavigate();

    const [openLicense, setOpenLicense] =
        useState(null);


    function handleBack() {
        navigate(-1);
    }


    function toggleLicense(id) {

        setOpenLicense(function (previous) {

            return previous === id ? null : id;

        });

    }


    const licenses = [

        {
            id: 1,
            name: "React",
            version: "18+",
            license: "MIT License"
        },

        {
            id: 2,
            name: "React Router",
            version: "6+",
            license: "MIT License"
        },

        {
            id: 3,
            name: "React Icons",
            version: "Latest",
            license: "MIT License"
        }

    ];


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
                    Open Source Licenses
                </h1>

            </div>


            <div className="licenses-intro">

                <p>
                    This application uses open-source software
                    libraries and packages.
                </p>

            </div>


            <div className="licenses-list">

                {licenses.map(function (item) {

                    const open =
                        openLicense === item.id;


                    return (

                        <div
                            className="license-item"
                            key={item.id}
                        >

                            <button
                                className="license-row"
                                onClick={function () {

                                    toggleLicense(
                                        item.id
                                    );

                                }}
                            >

                                <div>

                                    <strong>
                                        {item.name}
                                    </strong>

                                    <span>
                                        Version {item.version}
                                    </span>

                                </div>


                                {open
                                    ? <FiChevronUp />
                                    : <FiChevronDown />
                                }

                            </button>


                            {open && (

                                <div className="license-details">

                                    <strong>
                                        {item.license}
                                    </strong>

                                    <p>
                                        This package is used as
                                        part of the application.
                                    </p>

                                </div>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );

}


export default Licenses;