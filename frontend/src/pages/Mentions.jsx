import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function Mentions() {

    const navigate = useNavigate();


    const [everyone, setEveryone] =
        useState(true);

    const [peopleYouFollow, setPeopleYouFollow] =
        useState(false);

    const [noOne, setNoOne] =
        useState(false);


    function handleBack() {

        navigate(-1);

    }


    function selectMention(option) {

        setEveryone(option === "everyone");

        setPeopleYouFollow(
            option === "following"
        );

        setNoOne(option === "none");

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
                    Mentions
                </h1>

            </div>


            <div className="privacy-detail-section">

                <h2>
                    Who can mention you
                </h2>


                <div
                    className="privacy-choice-row"
                    onClick={function () {

                        selectMention("everyone");

                    }}
                >

                    <div>

                        <strong>
                            Everyone
                        </strong>

                        <p>
                            Anyone can mention you.
                        </p>

                    </div>


                    <span
                        className={
                            everyone
                                ? "privacy-radio selected"
                                : "privacy-radio"
                        }
                    >
                    </span>

                </div>


                <div
                    className="privacy-choice-row"
                    onClick={function () {

                        selectMention("following");

                    }}
                >

                    <div>

                        <strong>
                            People you follow
                        </strong>

                        <p>
                            Only people you follow can mention you.
                        </p>

                    </div>


                    <span
                        className={
                            peopleYouFollow
                                ? "privacy-radio selected"
                                : "privacy-radio"
                        }
                    >
                    </span>

                </div>


                <div
                    className="privacy-choice-row"
                    onClick={function () {

                        selectMention("none");

                    }}
                >

                    <div>

                        <strong>
                            No one
                        </strong>

                        <p>
                            Nobody can mention you.
                        </p>

                    </div>


                    <span
                        className={
                            noOne
                                ? "privacy-radio selected"
                                : "privacy-radio"
                        }
                    >
                    </span>

                </div>

            </div>

        </div>

    );

}


export default Mentions;