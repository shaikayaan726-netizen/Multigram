import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function Copyright() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");

    const [submitted, setSubmitted] =
        useState(false);


    function handleBack() {
        navigate(-1);
    }


    function handleSubmit() {

        if (
            !name.trim() ||
            !email.trim() ||
            !description.trim()
        ) {
            return;
        }


        setSubmitted(true);

        setName("");
        setEmail("");
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
                    Copyright
                </h1>

            </div>


            <div className="copyright-content">

                <h2>
                    Copyright
                </h2>

                <p>
                    If you believe content on this application
                    infringes your copyright, you can submit a
                    copyright report.
                </p>


                <label>
                    Your name
                </label>

                <input
                    value={name}
                    onChange={function (event) {

                        setName(
                            event.target.value
                        );

                    }}
                    placeholder="Enter your name"
                />


                <label>
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={function (event) {

                        setEmail(
                            event.target.value
                        );

                    }}
                    placeholder="Enter your email"
                />


                <label>
                    Copyright issue
                </label>

                <textarea
                    value={description}
                    onChange={function (event) {

                        setDescription(
                            event.target.value
                        );

                    }}
                    placeholder="Describe the copyrighted content..."
                />


                {submitted && (

                    <p className="copyright-success">
                        Copyright report submitted.
                    </p>

                )}


                <button
                    className="about-primary-btn"
                    onClick={handleSubmit}
                >

                    Submit copyright report

                </button>

            </div>

        </div>

    );

}


export default Copyright;