import { useState } from "react";

import {
    FiSearch
} from "react-icons/fi";




function StoryStickers({
    selected,
    onSelect,
    onClose
}) {

    const [search, setSearch] =
        useState("");


    const stickers = [

        "😂", "😍", "😭", "🔥",
        "❤️", "🥹", "😎", "✨",
        "💯", "👍", "🎉", "😇",
        "🤣", "😘", "💔", "👏",
        "🙌", "🤍", "⭐", "🌙",
        "☀️", "💫", "🎵", "💖"

    ];


    const filtered =
        stickers.filter(function (item) {

            return item.includes(search);

        });


    return (

        <div className="story-stickers-panel">

            <div className="story-stickers-header">

                <strong>
                    Stickers
                </strong>

                <button onClick={onClose}>
                    Done
                </button>

            </div>


            <div className="story-sticker-search">

                <FiSearch />

                <input
                    value={search}
                    placeholder="Search stickers"
                    onChange={function (event) {

                        setSearch(
                            event.target.value
                        );

                    }}
                />

            </div>


            <div className="story-sticker-grid">

                {filtered.map(function (sticker) {

                    return (

                        <button
                            key={sticker}
                            className={
                                selected === sticker
                                    ? "selected"
                                    : ""
                            }
                            onClick={function () {

                                onSelect(sticker);

                            }}
                        >

                            {sticker}

                        </button>

                    );

                })}

            </div>

        </div>

    );

}


export default StoryStickers;