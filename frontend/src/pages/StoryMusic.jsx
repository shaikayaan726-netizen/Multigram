import { useState } from "react";

import {
    FiSearch,
    FiMusic,
    FiBookmark
} from "react-icons/fi";




function StoryMusic({
    selected,
    onSelect,
    onClose
}) {

    const [search, setSearch] =
        useState("");


    const [playing, setPlaying] =
        useState(null);


    const musicList = [

        {
            id: 1,
            title: "Tera Mera Rishta - New Version",
            artist: "Mithoon, Pritam, Mustafa Zahid"
        },

        {
            id: 2,
            title: "Broken Heart",
            artist: "EMIN, JONY"
        },

        {
            id: 3,
            title: "Sad Tune",
            artist: "Marven Matyka"
        },

        {
            id: 4,
            title: "TOXIC: BGM",
            artist: "Mk Soul Beats"
        },

        {
            id: 5,
            title: "Sad Music",
            artist: "RO-KI"
        },

        {
            id: 6,
            title: "Tabah",
            artist: "Sajid-Wajid"
        },

        {
            id: 7,
            title: "Bad Boy",
            artist: "Badshah, Neeti Mohan"
        }

    ];


    const filtered =
        musicList.filter(function (song) {

            return (

                song.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                song.artist
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

            );

        });


    function selectMusic(song) {

        onSelect(song);

        setPlaying(song.id);

    }


    return (

        <div className="story-music-panel">


            <div className="story-music-header">

                <strong>
                    Music
                </strong>

                <button onClick={onClose}>
                    Done
                </button>

            </div>


            <div className="story-music-search">

                <FiSearch />

                <input
                    value={search}
                    placeholder="Search music"
                    onChange={function (event) {

                        setSearch(
                            event.target.value
                        );

                    }}
                />

            </div>


            <div className="story-music-tabs">

                <button className="active">
                    For you
                </button>

                <button>
                    Trending
                </button>

                <button>
                    Saved
                </button>

                <button>
                    Original audio
                </button>

            </div>


            <div className="story-music-list">

                {filtered.map(function (song) {

                    const isSelected =
                        selected?.id === song.id;


                    return (

                        <button
                            key={song.id}
                            className={
                                isSelected
                                    ? "story-music-item selected"
                                    : "story-music-item"
                            }
                            onClick={function () {

                                selectMusic(song);

                            }}
                        >

                            <div className="story-music-cover">

                                <FiMusic />

                            </div>


                            <div className="story-music-info">

                                <strong>
                                    {song.title}
                                </strong>

                                <span>
                                    {song.artist}
                                </span>

                            </div>


                            <span className="story-music-play">

                                {playing === song.id
                                    ? "✓"
                                    : "▶"}

                            </span>


                            <FiBookmark />

                        </button>

                    );

                })}

            </div>

        </div>

    );

}


export default StoryMusic;