


function StoryText({
    value,
    font,
    color,
    onChange,
    onClose
}) {

    const fonts = [

        "Arial",
        "Georgia",
        "Times New Roman",
        "Courier New",
        "Verdana",
        "Impact",
        "Trebuchet MS"

    ];


    const colors = [

        "#ffffff",
        "#000000",
        "#ff3040",
        "#ff9500",
        "#ffd60a",
        "#30d158",
        "#0a84ff",
        "#bf5af2",
        "#ff375f"

    ];


    return (

        <div className="story-text-panel">

            <div className="story-text-header">

                <strong>
                    Text
                </strong>

                <button onClick={onClose}>
                    Done
                </button>

            </div>


            <input
                className="story-text-input"
                value={value}
                placeholder="Type something..."
                onChange={function (event) {

                    onChange({
                        text: event.target.value
                    });

                }}
            />


            <h3>
                Fonts
            </h3>


            <div className="story-font-list">

                {fonts.map(function (item) {

                    return (

                        <button
                            key={item}
                            className={
                                font === item
                                    ? "story-font active"
                                    : "story-font"
                            }
                            style={{
                                fontFamily: item
                            }}
                            onClick={function () {

                                onChange({
                                    font: item
                                });

                            }}
                        >

                            Aa

                        </button>

                    );

                })}

            </div>


            <h3>
                Colours
            </h3>


            <div className="story-color-list">

                {colors.map(function (item) {

                    return (

                        <button
                            key={item}
                            className={
                                color === item
                                    ? "story-color active"
                                    : "story-color"
                            }
                            style={{
                                background: item
                            }}
                            onClick={function () {

                                onChange({
                                    color: item
                                });

                            }}
                        />

                    );

                })}

            </div>

        </div>

    );

}


export default StoryText;