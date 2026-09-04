import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function FollowingFollowers() {

    const navigate = useNavigate();

    const [followerRequests, setFollowerRequests] = useState("on");
    const [acceptedRequests, setAcceptedRequests] = useState("on");
    const [accountSuggestions, setAccountSuggestions] = useState("on");
    const [mentionsBio, setMentionsBio] = useState("everyone");


    function RadioOption({ value, selected, onClick }) {

        return (
            <button
                className="ff-radio-option"
                onClick={function () {
                    onClick(value);
                }}
            >

                <span>
                    {value === "off" && "Off"}
                    {value === "following" && "From profiles I follow"}
                    {value === "everyone" && "From everyone"}
                    {value === "on" && "On"}
                </span>

                <span
                    className={
                        selected === value
                            ? "ff-radio selected"
                            : "ff-radio"
                    }
                >
                    <span></span>
                </span>

            </button>
        );
    }


    return (

        <div className="ff-page">

            <div className="ff-nav">

                <button
                    className="ff-back"
                    onClick={function () {
                        navigate(-1);
                    }}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Following and followers
                </h1>

            </div>


            <section className="ff-section">

                <h2>
                    Follower requests
                </h2>

                <RadioOption
                    value="off"
                    selected={followerRequests}
                    onClick={setFollowerRequests}
                />

                <RadioOption
                    value="on"
                    selected={followerRequests}
                    onClick={setFollowerRequests}
                />

                <p>
                    John Appleseed has requested to follow you.
                </p>

            </section>


            <section className="ff-section">

                <h2>
                    Accepted follow requests
                </h2>

                <RadioOption
                    value="off"
                    selected={acceptedRequests}
                    onClick={setAcceptedRequests}
                />

                <RadioOption
                    value="on"
                    selected={acceptedRequests}
                    onClick={setAcceptedRequests}
                />

                <p>
                    John Appleseed accepted your follow request.
                </p>

            </section>


            <section className="ff-section">

                <h2>
                    Account suggestions
                </h2>

                <RadioOption
                    value="off"
                    selected={accountSuggestions}
                    onClick={setAccountSuggestions}
                />

                <RadioOption
                    value="on"
                    selected={accountSuggestions}
                    onClick={setAccountSuggestions}
                />

                <p>
                    John Appleseed, who you might know, is on Instagram.
                </p>

            </section>


            <section className="ff-section">

                <h2>
                    Mentions in bio
                </h2>

                <RadioOption
                    value="off"
                    selected={mentionsBio}
                    onClick={setMentionsBio}
                />

                <RadioOption
                    value="following"
                    selected={mentionsBio}
                    onClick={setMentionsBio}
                />

                <RadioOption
                    value="everyone"
                    selected={mentionsBio}
                    onClick={setMentionsBio}
                />

                <p>
                    John Appleseed mentioned you in their bio.
                </p>

            </section>

        </div>
    );
}

export default FollowingFollowers;