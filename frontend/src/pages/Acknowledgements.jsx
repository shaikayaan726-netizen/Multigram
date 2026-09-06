import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiHeart
} from "react-icons/fi";


function Acknowledgements() {

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
                    Acknowledgements
                </h1>

            </div>


            <div className="acknowledgements-content">

                <FiHeart />

                <h2>
                    Thank you
                </h2>

                <p>
                    This project is built with the help of
                    open-source technologies and the developer
                    community.
                </p>


                <div className="acknowledgement-card">

                    <strong>
                        Technologies
                    </strong>

                    <span>
                        React
                    </span>

                    <span>
                        React Router
                    </span>

                    <span>
                        React Icons
                    </span>

                    <span>
                        JavaScript
                    </span>

                    <span>
                        CSS
                    </span>

                </div>


                <p className="acknowledgement-footer">
                    Built with care for this Multigram Clone project.
                </p>

            </div>

        </div>

    );

}


export default Acknowledgements;