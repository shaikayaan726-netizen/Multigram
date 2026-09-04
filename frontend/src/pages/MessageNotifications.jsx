import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function MessageNotifications() {

    const navigate = useNavigate();

    const [messageRequests, setMessageRequests] = useState("on");
    const [individualChats, setIndividualChats] = useState("on");
    const [messageReminders, setMessageReminders] = useState("everyone");
    const [groupRequests, setGroupRequests] = useState("on");


    function RadioOption({ value, selected, onClick }) {

        return (
            <button
                className="mn-radio-option"
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
                            ? "mn-radio selected"
                            : "mn-radio"
                    }
                >
                    <span></span>
                </span>

            </button>
        );
    }


    return (

        <div className="mn-page">

            <div className="mn-nav">

                <button
                    className="mn-back"
                    onClick={function () {
                        navigate(-1);
                    }}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Messages
                </h1>

            </div>


            <section className="mn-section">

                <h2>
                    Message requests
                </h2>

                <RadioOption
                    value="off"
                    selected={messageRequests}
                    onClick={setMessageRequests}
                />

                <RadioOption
                    value="on"
                    selected={messageRequests}
                    onClick={setMessageRequests}
                />

                <p>
                    John Appleseed wants to send you a message.
                </p>

            </section>


            <section className="mn-section">

                <h2>
                    Messages from individual and group chats
                </h2>

                <RadioOption
                    value="off"
                    selected={individualChats}
                    onClick={setIndividualChats}
                />

                <RadioOption
                    value="on"
                    selected={individualChats}
                    onClick={setIndividualChats}
                />

                <p>
                    John Appleseed sent you a message.
                </p>

            </section>


            <section className="mn-section">

                <h2>
                    Message reminders
                </h2>

                <RadioOption
                    value="off"
                    selected={messageReminders}
                    onClick={setMessageReminders}
                />

                <RadioOption
                    value="following"
                    selected={messageReminders}
                    onClick={setMessageReminders}
                />

                <RadioOption
                    value="everyone"
                    selected={messageReminders}
                    onClick={setMessageReminders}
                />

                <p>
                    John Appleseed sent you a message (1d ago).
                </p>

            </section>


            <section className="mn-section">

                <h2>
                    Group requests
                </h2>

                <RadioOption
                    value="off"
                    selected={groupRequests}
                    onClick={setGroupRequests}
                />

                <RadioOption
                    value="on"
                    selected={groupRequests}
                    onClick={setGroupRequests}
                />

            </section>

        </div>
    );
}

export default MessageNotifications;