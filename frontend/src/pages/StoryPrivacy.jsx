import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft
} from "react-icons/fi";


function StoryPrivacy() {

    const navigate = useNavigate();


    const [hideStoryFrom, setHideStoryFrom] =
        useState(false);

    const [allowSharing, setAllowSharing] =
        useState(true);

    const [allowMessages, setAllowMessages] =
        useState(true);

    const [storyActivity, setStoryActivity] =
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
                    Story privacy
                </h1>

            </div>


            <div className="privacy-detail-section">

                <h2>
                    Story controls
                </h2>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Hide story from
                        </strong>

                        <p>
                            Choose people who cannot see your stories.
                        </p>

                    </div>


                    <Toggle
                        value={hideStoryFrom}
                        onChange={setHideStoryFrom}
                        label="Hide story from"
                    />

                </div>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Allow story sharing
                        </strong>

                        <p>
                            Allow others to share your stories.
                        </p>

                    </div>


                    <Toggle
                        value={allowSharing}
                        onChange={setAllowSharing}
                        label="Allow story sharing"
                    />

                </div>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Allow sharing to messages
                        </strong>

                        <p>
                            Allow your stories to be shared in messages.
                        </p>

                    </div>


                    <Toggle
                        value={allowMessages}
                        onChange={setAllowMessages}
                        label="Allow sharing to messages"
                    />

                </div>


                <div className="privacy-detail-switch-row">

                    <div>

                        <strong>
                            Show story activity
                        </strong>

                        <p>
                            Allow people to see that you viewed their story.
                        </p>

                    </div>


                    <Toggle
                        value={storyActivity}
                        onChange={setStoryActivity}
                        label="Show story activity"
                    />

                </div>

            </div>

        </div>

    );

}


export default StoryPrivacy;