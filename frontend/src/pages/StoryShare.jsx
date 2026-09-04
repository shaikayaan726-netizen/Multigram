import { useState } from "react";




function StoryShare({
    onClose,
    onShare
}) {

    const [destination, setDestination] =
        useState("story");


    function handleShare() {

        onShare({

            destination: destination

        });

    }


    return (

        <div className="story-share-overlay">

            <div className="story-share-panel">


                <div className="story-share-header">

                    <strong>
                        Share Story
                    </strong>

                    <button onClick={onClose}>
                        ×
                    </button>

                </div>


                <button
                    className={
                        destination === "story"
                            ? "story-destination active"
                            : "story-destination"
                    }
                    onClick={function () {

                        setDestination("story");

                    }}
                >

                    <div className="story-share-avatar">
                        S
                    </div>


                    <div>

                        <strong>
                            Your Story
                        </strong>

                        <span>
                            Share with your followers
                        </span>

                    </div>

                </button>


                <button
                    className={
                        destination === "close"
                            ? "story-destination active"
                            : "story-destination"
                    }
                    onClick={function () {

                        setDestination("close");

                    }}
                >

                    <div className="close-friends-avatar">
                        ★
                    </div>


                    <div>

                        <strong>
                            Close Friends
                        </strong>

                        <span>
                            Share with close friends
                        </span>

                    </div>

                </button>


                <button
                    className="story-final-share"
                    onClick={handleShare}
                >

                    Share

                </button>

            </div>

        </div>

    );

}


export default StoryShare;