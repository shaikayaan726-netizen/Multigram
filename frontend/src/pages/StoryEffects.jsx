


function StoryEffects({
    selected,
    onSelect,
    onClose
}) {

    const effects = [

        {
            name: "None",
            filter: "none"
        },

        {
            name: "Vivid",
            filter: "saturate(1.5)"
        },

        {
            name: "Warm",
            filter: "sepia(.3) saturate(1.3)"
        },

        {
            name: "Cool",
            filter: "hue-rotate(15deg)"
        },

        {
            name: "Fade",
            filter: "contrast(.8) brightness(1.1)"
        },

        {
            name: "Mono",
            filter: "grayscale(1)"
        },

        {
            name: "Drama",
            filter: "contrast(1.4)"
        },

        {
            name: "Vintage",
            filter: "sepia(.45)"
        }

    ];


    return (

        <div className="story-effects-panel">

            <div className="story-effects-header">

                <strong>
                    Effects
                </strong>

                <button onClick={onClose}>
                    Done
                </button>

            </div>


            <div className="story-effect-grid">

                {effects.map(function (effect) {

                    return (

                        <button
                            key={effect.name}
                            className={
                                selected === effect.name
                                    ? "active"
                                    : ""
                            }
                            onClick={function () {

                                onSelect(
                                    effect.name
                                );

                            }}
                        >

                            <div
                                className="story-effect-preview"
                                style={{
                                    filter:
                                        effect.filter
                                }}
                            >

                                A

                            </div>


                            <span>
                                {effect.name}
                            </span>

                        </button>

                    );

                })}

            </div>

        </div>

    );

}


export default StoryEffects;