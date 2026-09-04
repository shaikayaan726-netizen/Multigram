import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function CallNotifications() {

    const navigate = useNavigate();

    const [videoChats, setVideoChats] = useState("everyone");


    function RadioOption({ value, selected, onClick }) {

        return (
            <button
                className="cn-radio-option"
                onClick={function () {
                    onClick(value);
                }}
            >

                <span>
                    {value === "off" && "Off"}
                    {value === "following" && "From profiles I follow"}
                    {value === "everyone" && "From everyone"}
                </span>

                <span
                    className={
                        selected === value
                            ? "cn-radio selected"
                            : "cn-radio"
                    }
                >
                    <span></span>
                </span>

            </button>
        );
    }


    return (

        <div className="cn-page">

            <div className="cn-nav">

                <button
                    className="cn-back"
                    onClick={function () {
                        navigate(-1);
                    }}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Calls
                </h1>

            </div>


            <section className="cn-section">

                <h2>
                    Video Chats
                </h2>

                <RadioOption
                    value="off"
                    selected={videoChats}
                    onClick={setVideoChats}
                />

                <RadioOption
                    value="following"
                    selected={videoChats}
                    onClick={setVideoChats}
                />

                <RadioOption
                    value="everyone"
                    selected={videoChats}
                    onClick={setVideoChats}
                />

                <p>
                    Incoming video chat from John Appleseed.
                </p>

            </section>


            <div className="cn-system-settings">

                <button>
                    Additional options in system settings...
                </button>

                <p>
                    These settings affect notification permissions
                    for accounts logged into this device.
                </p>

            </div>

        </div>
    );
}

export default CallNotifications;