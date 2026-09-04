import {
    useState
} from "react";

import {
    FiSearch,
    FiX
} from "react-icons/fi";


function ReelStickers({
    selected,
    onSelect,
    onClose
}) {

    const [
        q,
        setQ
    ] = useState("");


    const stickers = [
        "😂",
        "😍",
        "😭",
        "🔥",
        "❤️",
        "🥹",
        "😎",
        "✨",
        "💯",
        "👍",
        "🎉",
        "😇",
        "🌟",
        "🎵",
        "💖",
        "🚀",
        "☀️",
        "🌈"
    ];


    function handleSelect(
        sticker
    ) {

        const current =
            Array.isArray(selected)
                ? selected
                : [];


        const next =
            [
                ...current,
                sticker
            ];


        /*
         * Keep the old stickers
         * array behaviour.
         *
         * ReelEditor will take the
         * newly added sticker and
         * create an independent
         * element from it.
         */

        onSelect(
            next
        );

        onClose();
    }


    return (
        <div
            className="reel-panel"
        >

            <header>

                <h2>
                    Stickers
                </h2>

                <button
                    onClick={onClose}
                >
                    <FiX />
                </button>

            </header>


            <div
                className="panel-search"
            >

                <FiSearch />

                <input
                    value={q}
                    onChange={
                        function (e) {
                            setQ(
                                e.target.value
                            );
                        }
                    }
                    placeholder="Search stickers"
                />

            </div>


            <div
                className="sticker-grid"
            >

                {
                    stickers
                        .filter(
                            function (sticker) {
                                return (
                                    !q ||
                                    sticker.includes(q)
                                );
                            }
                        )
                        .map(
                            function (
                                sticker,
                                index
                            ) {

                                return (
                                    <button
                                        key={
                                            index
                                        }
                                        onClick={
                                            function () {
                                                handleSelect(
                                                    sticker
                                                );
                                            }
                                        }
                                    >
                                        {sticker}
                                    </button>
                                );

                            }
                        )

                }

            </div>

        </div>
    );
}


export default ReelStickers;