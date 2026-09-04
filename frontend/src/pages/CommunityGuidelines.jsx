import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiCheckCircle
} from "react-icons/fi";


function CommunityGuidelines() {

    const navigate = useNavigate();


    function handleBack() {
        navigate(-1);
    }


    const rules = [

        "Treat other people with respect.",

        "Do not harass, threaten or bully others.",

        "Do not impersonate other people.",

        "Do not use the platform for scams or fraud.",

        "Do not share harmful or illegal content.",

        "Respect intellectual property and copyright.",

        "Use reporting tools when you find content that violates the rules."

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
                    Community Guidelines
                </h1>

            </div>


            <div className="guidelines-content">

                <h2>
                    Community Guidelines
                </h2>

                <p>
                    Help keep the community safe, respectful and
                    enjoyable for everyone.
                </p>


                <div className="guidelines-list">

                    {rules.map(function (rule, index) {

                        return (

                            <div
                                className="guideline-row"
                                key={index}
                            >

                                <FiCheckCircle />

                                <span>
                                    {rule}
                                </span>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}


export default CommunityGuidelines;