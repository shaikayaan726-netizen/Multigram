import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function Tags() {

    const navigate = useNavigate();


    const [everyone, setEveryone] =
        useState(true);

    const [peopleYouFollow, setPeopleYouFollow] =
        useState(false);

    const [noOne, setNoOne] =
        useState(false);

    const [manualApproval, setManualApproval] =
        useState(false);


    function handleBack() {

        navigate(-1);

    }


    function selectTag(option) {

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
                    Tags
                </h1>

            </div>


            <div className="privacy-detail-section">

                <h2>
                    Who can tag you
                </h2>


                <div
                    className="privacy-choice-row"
                    onClick={function () {

                        selectTag("everyone");

                    }}
                >

                    <div>

                        <strong>
                            Everyone
                        </strong>

                        <p>
                            Anyone can tag you in posts.
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

                        selectTag("following");

                    }}
                >

                    <div>

                        <strong>
                            People you follow
                        </strong>

                        <p>
                            Only people you follow can tag you.
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

                        selectTag("none");

                    }}
                >

                    <div>

                        <strong>
                            No one
                        </strong>

                        <p>
                            Nobody can tag you.
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


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Manually approve tags
                        </strong>

                        <p>
                            Review tags before they appear on your profile.
                        </p>

                    </div>


                    <button
                        className={
                            manualApproval
                                ? "privacy-detail-toggle active"
                                : "privacy-detail-toggle"
                        }
                        onClick={function () {

                            setManualApproval(
                                !manualApproval
                            );

                        }}
                    >

                        <span></span>

                    </button>

                </div>

            </div>

        </div>

    );

}


export default Tags;