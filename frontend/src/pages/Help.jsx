import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiChevronDown,
    FiChevronUp
} from "react-icons/fi";


function Help() {

    const navigate = useNavigate();

    const [openItem, setOpenItem] = useState(null);


    function handleBack() {
        navigate(-1);
    }


    function toggleItem(id) {

        setOpenItem(function (previous) {

            return previous === id ? null : id;

        });

    }


    const helpItems = [

        {
            id: 1,
            title: "How do I create a post?",
            answer:
                "Tap the + button, select a photo or video, edit it if needed, add a caption and tap Done."
        },

        {
            id: 2,
            title: "How do I change my profile?",
            answer:
                "Open your profile, choose Edit Profile and update your profile information."
        },

        {
            id: 3,
            title: "How do I reset my password?",
            answer:
                "Open Security settings and choose Change Password. You can update your password from there."
        },

        {
            id: 4,
            title: "How do I control my privacy?",
            answer:
                "Open Settings and choose Privacy. You can control account privacy, stories, comments, tags, messages and other privacy options."
        },

        {
            id: 5,
            title: "How do I report a problem?",
            answer:
                "Open About, choose Report a Problem and describe the issue you are experiencing."
        }

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
                    Help
                </h1>

            </div>


            <div className="about-detail-intro">

                <h2>
                    How can we help?
                </h2>

                <p>
                    Find answers to common questions.
                </p>

            </div>


            <div className="about-detail-list">

                {helpItems.map(function (item) {

                    const open =
                        openItem === item.id;


                    return (

                        <div
                            className="help-item"
                            key={item.id}
                        >

                            <button
                                className="help-question"
                                onClick={function () {

                                    toggleItem(item.id);

                                }}
                            >

                                <span>
                                    {item.title}
                                </span>

                                {open
                                    ? <FiChevronUp />
                                    : <FiChevronDown />
                                }

                            </button>


                            {open && (

                                <div className="help-answer">

                                    {item.answer}

                                </div>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );

}


export default Help;