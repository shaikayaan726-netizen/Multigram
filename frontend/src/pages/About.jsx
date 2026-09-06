import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronRight
} from "react-icons/fi";


function About() {

    const navigate = useNavigate();


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // OPEN PAGE
    // ==========================================

    function openPage(path) {

        navigate(path);

    }


    return (

        <div className="about-page">


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <div className="about-nav">

                <button
                    className="about-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    About
                </h1>

            </div>


            {/* ==========================================
                APP INFORMATION
            ========================================== */}

            <div className="about-app-card">

              <div className="about-logo">
    <img
        src="https://i.postimg.cc/zGLgy81h/icon-512.jpg"
        alt="Multigram"
    />
</div>


                <h2>
                    Multigram
                </h2>


                <p>
                    Version 1.0.0
                </p>

            </div>


            {/* ==========================================
                HELP
            ========================================== */}

            <div className="about-section">

                <h2>
                    Help
                </h2>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/help");

                    }}
                >

                    <span>
                        Help Center
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/reportproblem");

                    }}
                >

                    <span>
                        Report a Problem
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/accountstatus");

                    }}
                >

                    <span>
                        Account Status
                    </span>

                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                LEGAL
            ========================================== */}

            <div className="about-section">

                <h2>
                    Legal
                </h2>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/terms");

                    }}
                >

                    <span>
                        Terms of Service
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/privacypolicy");

                    }}
                >

                    <span>
                        Privacy Policy
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/communityguidelines");

                    }}
                >

                    <span>
                        Community Guidelines
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/copyright");

                    }}
                >

                    <span>
                        Copyright
                    </span>

                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                INFORMATION
            ========================================== */}

            <div className="about-section">

                <h2>
                    Information
                </h2>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/licenses");

                    }}
                >

                    <span>
                        Open Source Licenses
                    </span>

                    <FiChevronRight />

                </div>


                <div
                    className="about-row"
                    onClick={function () {

                        openPage("/acknowledgements");

                    }}
                >

                    <span>
                        Acknowledgements
                    </span>

                    <FiChevronRight />

                </div>

            </div>


            {/* ==========================================
                VERSION
            ========================================== */}

            <div className="about-version">

                Multigram

                <br />

                Version 1.0.0

            </div>


        </div>

    );

}


export default About;