import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function Comments() {

    const navigate = useNavigate();


    const [allowComments, setAllowComments] =
        useState(true);

    const [hideOffensive, setHideOffensive] =
        useState(true);


    function handleBack() {

        navigate(-1);

    }


    function Toggle({ value, onChange, label }) {

        return (

            <button
                className={
                    value
                        ? "privacy-detail-toggle active"
                        : "privacy-detail-toggle"
                }
                onClick={function () {

                    onChange(!value);

                }}
                aria-label={label}
            >

                <span></span>

            </button>

        );

    }


    return (

        <div className="privacy-detail-page">

            <div className="privacy-detail-nav">

                <button
                    className="privacy-detail-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Comments
                </h1>

            </div>


            <div className="privacy-detail-section">

                <h2>
                    Comment controls
                </h2>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Allow comments
                        </strong>

                        <p>
                            Allow people to comment on your posts.
                        </p>

                    </div>


                    <Toggle
                        value={allowComments}
                        onChange={setAllowComments}
                        label="Allow comments"
                    />

                </div>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Hide offensive comments
                        </strong>

                        <p>
                            Automatically hide potentially offensive comments.
                        </p>

                    </div>


                    <Toggle
                        value={hideOffensive}
                        onChange={setHideOffensive}
                        label="Hide offensive comments"
                    />

                </div>

            </div>

        </div>

    );

}


export default Comments;