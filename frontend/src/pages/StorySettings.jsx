


function StorySettings({
    settings,
    onChange,
    onClose
}) {

    return (

        <div className="story-settings-panel">

            <div className="story-settings-header">

                <strong>
                    Story Settings
                </strong>

                <button onClick={onClose}>
                    Done
                </button>

            </div>


            <div className="story-setting-row">

                <div>

                    <strong>
                        Allow replies
                    </strong>

                    <p>
                        Let people reply to your story.
                    </p>

                </div>


                <button
                    className={
                        settings.replies
                            ? "story-setting-toggle active"
                            : "story-setting-toggle"
                    }
                    onClick={function () {

                        onChange({
                            replies:
                                !settings.replies
                        });

                    }}
                >

                    <span />

                </button>

            </div>


            <div className="story-setting-row">

                <div>

                    <strong>
                        Allow sharing
                    </strong>

                    <p>
                        Allow others to share your story.
                    </p>

                </div>


                <button
                    className={
                        settings.sharing
                            ? "story-setting-toggle active"
                            : "story-setting-toggle"
                    }
                    onClick={function () {

                        onChange({
                            sharing:
                                !settings.sharing
                        });

                    }}
                >

                    <span />

                </button>

            </div>

        </div>

    );

}


export default StorySettings;