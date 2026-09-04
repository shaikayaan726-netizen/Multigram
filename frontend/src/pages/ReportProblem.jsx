import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function ReportProblem() {

    const navigate = useNavigate();

    const [category, setCategory] =
        useState("Something isn't working");

    const [description, setDescription] =
        useState("");

    const [sent, setSent] =
        useState(false);


    function handleBack() {
        navigate(-1);
    }


    function handleSubmit() {

        if (!description.trim()) {
            return;
        }

        setSent(true);

        setDescription("");

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
                    Report a Problem
                </h1>

            </div>


            <div className="report-problem-content">

                <h2>
                    Tell us what went wrong
                </h2>

                <p>
                    Your feedback helps improve the app.
                </p>


                <label>
                    Problem type
                </label>

                <select
                    value={category}
                    onChange={function (event) {

                        setCategory(
                            event.target.value
                        );

                    }}
                >

                    <option>
                        Something isn't working
                    </option>

                    <option>
                        Account problem
                    </option>

                    <option>
                        Login problem
                    </option>

                    <option>
                        Privacy problem
                    </option>

                    <option>
                        Security problem
                    </option>

                    <option>
                        Other
                    </option>

                </select>


                <label>
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={function (event) {

                        setDescription(
                            event.target.value
                        );

                    }}
                    placeholder="Describe the problem..."
                />


                {sent && (

                    <p className="report-success">
                        Your report has been submitted.
                    </p>

                )}


                <button
                    className="about-primary-btn"
                    onClick={handleSubmit}
                >

                    Submit report

                </button>

            </div>

        </div>

    );

}


export default ReportProblem;