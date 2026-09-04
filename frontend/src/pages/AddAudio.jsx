
// IMPORTS
// ==========================================

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    FiArrowLeft,
    FiSearch,
    FiPlay,
    FiPause,
    FiCheck,
    FiBookmark
} from "react-icons/fi";


// ==========================================
// ADD AUDIO
// ==========================================

function AddAudio() {

    const navigate = useNavigate();

    const location = useLocation();


    // ==========================================
    // AUDIO ELEMENT
    // ==========================================

    const audioRef =
        useRef(null);


    // ==========================================
    // WAVEFORM
    // ==========================================

    const waveformRef =
        useRef(null);


    // ==========================================
    // PLAY AFTER SELECT
    // ==========================================

    const pendingPlayRef =
        useRef(false);


    // ==========================================
    // RETURN PAGE
    // ==========================================

    const returnTo =
        location.state?.returnTo ||
        "/editpost";


    // ==========================================
    // EXISTING TAGGED USER
    // ==========================================

    const existingTaggedUser =
        location.state?.taggedUser ||
        null;


    // ==========================================
    // SEARCH
    // ==========================================

    const [search, setSearch] =
        useState("");


    // ==========================================
    // SONGS
    // ==========================================

    const [songs, setSongs] =
        useState([]);


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // ERROR
    // ==========================================

    const [error, setError] =
        useState("");


    // ==========================================
    // SELECTED SONG
    // ==========================================

    const [selectedSong, setSelectedSong] =
        useState(null);


    // ==========================================
    // PLAYING
    // ==========================================

    const [isPlaying, setIsPlaying] =
        useState(false);


    // ==========================================
    // CURRENT TIME
    // ==========================================

    const [currentTime, setCurrentTime] =
        useState(0);


    // ==========================================
    // START TIME
    // ==========================================

    const [startTime, setStartTime] =
        useState(0);


    // ==========================================
    // DURATION
    // ==========================================

    const [duration, setDuration] =
        useState(30);

// ==========================================
// ACTUAL AUDIO DURATION
// ==========================================

const [actualAudioDuration, setActualAudioDuration] =
    useState(0);
    // ==========================================
    // DRAGGING
    // ==========================================

    const [dragging, setDragging] =
        useState(null);


    // ==========================================
    // BOOKMARKS
    // ==========================================

    const [savedSongs, setSavedSongs] =
        useState([]);


    // ==========================================
    // SEARCH MUSIC
    // ==========================================

    useEffect(function () {

        if (!search.trim()) {

            setSongs([]);

            setError("");

            return;

        }


        const timer =
            setTimeout(async function () {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await fetch(
                            "/api/audio/search?q=" +
                            encodeURIComponent(
                                search.trim()
                            )
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Music search failed"
                        );

                    }


                    const data =
                        await response.json();


                    console.log(
                        "MUSIC SEARCH:",
                        data
                    );


                    const resultSongs =
                        Array.isArray(data)
                            ? data
                            : data.songs || [];


                    setSongs(
                        resultSongs
                    );

                }
                catch (error) {

                    console.error(
                        "MUSIC SEARCH ERROR:",
                        error
                    );


                    setError(
                        error.message ||
                        "Music search failed"
                    );


                    setSongs([]);

                }
                finally {

                    setLoading(false);

                }

            }, 450);


        return function () {

            clearTimeout(timer);

        };

    }, [search]);


    // ==========================================
    // FORMAT TIME
    // ==========================================

    function formatTime(seconds) {

        const value =
            Math.max(
                0,
                Math.floor(
                    Number(seconds) || 0
                )
            );


        const minutes =
            Math.floor(
                value / 60
            );


        const remainingSeconds =
            value % 60;


        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(2, "0")
        );

    }


    // ==========================================
    // GET SONG DURATION
    // ==========================================

    function getSongDuration(song) {

    const value =
        song.duration ??
        song.songDuration ??
        song.length ??
        0;


    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {

        return value;

    }


    if (
        typeof value === "string"
    ) {

        const text =
            value.trim();


        // Example: "5:48"
        if (
            text.includes(":")
        ) {

            const parts =
                text.split(":");


            if (parts.length === 2) {

                const minutes =
                    Number(parts[0]);


                const seconds =
                    Number(parts[1]);


                if (
                    Number.isFinite(minutes) &&
                    Number.isFinite(seconds)
                ) {

                    return (
                        minutes * 60 +
                        seconds
                    );

                }

            }


            if (parts.length === 3) {

                const hours =
                    Number(parts[0]);


                const minutes =
                    Number(parts[1]);


                const seconds =
                    Number(parts[2]);


                if (
                    Number.isFinite(hours) &&
                    Number.isFinite(minutes) &&
                    Number.isFinite(seconds)
                ) {

                    return (
                        hours * 3600 +
                        minutes * 60 +
                        seconds
                    );

                }

            }

        }


        const numberValue =
            Number(text);


        if (
            Number.isFinite(numberValue)
        ) {

            return numberValue;

        }

    }


    return 0;

}


    // ==========================================
    // GET AUDIO URL
    // ==========================================

    function getAudioUrl(song) {

        return (
            song.audioUrl ||
            song.audioURL ||
            song.previewUrl ||
            song.previewURL ||
            song.url ||
            ""
        );

    }


    // ==========================================
    // SELECT SONG
    // ==========================================

function handleSelect(song, autoPlay = false) {

    // Stop previous audio immediately
    if (audioRef.current) {

        audioRef.current.pause();

        try {
            audioRef.current.currentTime = 0;
        }
        catch (error) {
            console.warn("Could not reset previous audio", error);
        }

    }


    pendingPlayRef.current =
        autoPlay;


    setSelectedSong(song);

    setIsPlaying(false);

    setCurrentTime(0);

    setStartTime(0);

    setActualAudioDuration(0);


    const apiDuration =
        getSongDuration(song);


    if (
        apiDuration > 0
    ) {

        setDuration(
            Math.min(
                30,
                apiDuration
            )
        );

    }
    else {

        setDuration(30);

    }

}


    // ==========================================
    // LOAD SELECTED SONG
    // ==========================================

    useEffect(function () {

        if (!selectedSong) {

            return;

        }


        const audio =
            audioRef.current;


        if (!audio) {

            return;

        }


        const audioUrl =
            getAudioUrl(
                selectedSong
            );


        if (!audioUrl) {

            console.warn(
                "No audioUrl found for selected song"
            );

            return;

        }


        // React has rendered the new <audio>.
        // Do not force currentTime before metadata is ready.

        function resetPosition() {

            try {

                audio.pause();

                if (
                    Number.isFinite(startTime)
                ) {

                    audio.currentTime =
                        startTime;

                }

                setCurrentTime(
                    startTime
                );

                setIsPlaying(false);

            }
            catch (error) {

                console.warn(
                    "AUDIO RESET ERROR:",
                    error
                );

            }

        }


        if (
            audio.readyState >= 1
        ) {

            resetPosition();

        }


        function handleInitialMetadata() {

            resetPosition();

            if (
                pendingPlayRef.current
            ) {

                pendingPlayRef.current =
                    false;

                const playPromise =
                    audio.play();

                if (
                    playPromise &&
                    typeof playPromise.catch === "function"
                ) {

                    playPromise.catch(
                        function (error) {

                            console.error(
                                "INITIAL AUDIO PLAY ERROR:",
                                error
                            );

                            setIsPlaying(false);

                        }
                    );

                }

            }

        }


        audio.addEventListener(
            "loadedmetadata",
            handleInitialMetadata,
            { once: true }
        );


        return function () {

            audio.removeEventListener(
                "loadedmetadata",
                handleInitialMetadata
            );

        };

    }, [selectedSong]);


    // ==========================================
    // AUDIO EVENTS
    // ==========================================

    useEffect(function () {

        const audio =
            audioRef.current;


        if (!audio) {

            return;

        }


        function handleTimeUpdate() {

            const time =
                audio.currentTime;


            setCurrentTime(
                time
            );


            // ======================================
            // SELECTED CLIP END
            // ======================================

          const clipEnd =
    startTime + duration;


// Small tolerance rakhenge.
// Exact boundary par browser floating-point
// ki wajah se playback prematurely stop nahi hoga.

if (
    time >= clipEnd - 0.05
) {

    audio.pause();

    audio.currentTime =
        startTime;

    setCurrentTime(
        startTime
    );

    setIsPlaying(false);

    return;

}

        }


        function handlePlay() {

            setIsPlaying(true);

        }


        function handlePause() {

            setIsPlaying(false);

        }


        function handleEnded() {

            audio.currentTime =
                startTime;

            setCurrentTime(
                startTime
            );

            setIsPlaying(false);

        }


        audio.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );


        audio.addEventListener(
            "play",
            handlePlay
        );


        audio.addEventListener(
            "pause",
            handlePause
        );


        audio.addEventListener(
            "ended",
            handleEnded
        );


        return function () {

            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "play",
                handlePlay
            );

            audio.removeEventListener(
                "pause",
                handlePause
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

        };

    }, [startTime, duration]);


    // ==========================================
    // PLAY / PAUSE
    // ==========================================

   async function handlePlayPause() {

    const audio =
        audioRef.current;


    if (
        !audio ||
        !selectedSong
    ) {

        return;

    }


    const audioUrl =
        getAudioUrl(
            selectedSong
        );


    if (!audioUrl) {

        setError(
            "Audio preview is not available"
        );

        return;

    }


    try {

        // ================================
        // PAUSE
        // ================================

        if (
            !audio.paused
        ) {

            audio.pause();

            return;

        }


        // ================================
        // PLAY FROM SELECTED START
        // ================================

        const clipEnd =
            startTime + duration;


        // If current position is outside
        // selected range, seek to its start.

        if (
            !Number.isFinite(audio.currentTime) ||
            audio.currentTime < startTime ||
            audio.currentTime >= clipEnd
        ) {

            if (
                audio.readyState >= 1
            ) {

                audio.currentTime =
                    startTime;

                setCurrentTime(
                    startTime
                );

            }

        }


        const playPromise =
            audio.play();


        if (
            playPromise &&
            typeof playPromise.then === "function"
        ) {

            await playPromise;

        }

    }
    catch (error) {

        console.error(
            "AUDIO PLAY ERROR:",
            error
        );

        setIsPlaying(false);

    }

}


    // ==========================================
    // MAX START
    // ==========================================




const songFullDuration =
    selectedSong
        ? (
            actualAudioDuration ||
            getSongDuration(selectedSong) ||
            0
        )
        : 0;


    const maximumStart =
        selectedSong
            ? Math.max(
                0,
                songFullDuration -
                duration
            )
            : 0;


    // ==========================================
    // POINTER → TIME
    // ==========================================

    function getTimeFromPointer(
        event
    ) {

        if (
            !waveformRef.current ||
            !selectedSong
        ) {

            return 0;

        }


        const rect =
            waveformRef.current.getBoundingClientRect();


        const clientX =
            event.clientX;


        const position =
            Math.max(
                0,
                Math.min(
                    rect.width,
                    clientX -
                    rect.left
                )
            );


        const percentage =
            position /
            rect.width;


        return (
            percentage *
            songFullDuration
        );

    }


    // ==========================================
    // START DRAG
    // ==========================================

    function handleStartPointerDown(
        event
    ) {

        event.preventDefault();

        setDragging(
            "start"
        );

    }


    // ==========================================
    // END DRAG
    // ==========================================

    function handleEndPointerDown(
        event
    ) {

        event.preventDefault();

        setDragging(
            "end"
        );

    }


    // ==========================================
    // MOVE WHOLE SELECTION WINDOW
    // ==========================================

    function handleWindowPointerDown(event) {

        event.preventDefault();

        event.stopPropagation();

        setDragging("window");

    }


    // ==========================================
    // POINTER MOVE
    // ==========================================

    useEffect(function () {

        if (!dragging) {

            return;

        }


        function handlePointerMove(event) {

            if (!selectedSong) {

                return;

            }


            const newTime =
                getTimeFromPointer(event);


            // ======================================
            // MOVE SELECTION WINDOW
            // ======================================

            if (
                dragging === "window"
            ) {

                const nextStart =
                    Math.max(
                        0,
                        Math.min(
                            newTime,
                            maximumStart
                        )
                    );


                setStartTime(
                    nextStart
                );


                if (
                    audioRef.current &&
                    !audioRef.current.paused
                ) {

                    try {

                        audioRef.current.currentTime =
                            nextStart;

                        setCurrentTime(
                            nextStart
                        );

                    }
                    catch (error) {

                        console.warn(
                            "WINDOW DRAG AUDIO ERROR:",
                            error
                        );

                    }

                }


                return;

            }


            // ======================================
            // DRAG LEFT HANDLE
            // ======================================

            if (
                dragging === "start"
            ) {

                const maximumAllowedStart =
                    Math.max(
                        0,
                        maximumStart
                    );


                const nextStart =
                    Math.max(
                        0,
                        Math.min(
                            newTime,
                            maximumAllowedStart
                        )
                    );


                setStartTime(
                    nextStart
                );


                if (
                    audioRef.current &&
                    !audioRef.current.paused
                ) {

                    try {

                        audioRef.current.currentTime =
                            nextStart;

                        setCurrentTime(
                            nextStart
                        );

                    }
                    catch (error) {

                        console.warn(
                            "START DRAG AUDIO ERROR:",
                            error
                        );

                    }

                }


                return;

            }


            // ======================================
            // DRAG RIGHT HANDLE
            // ======================================

            if (
                dragging === "end"
            ) {

                const maximumEnd =
                    Math.min(
                        songFullDuration,
                        startTime + 30
                    );


                const minimumEnd =
                    startTime + 1;


                const nextEnd =
                    Math.max(
                        minimumEnd,
                        Math.min(
                            newTime,
                            maximumEnd
                        )
                    );


                const nextDuration =
                    nextEnd - startTime;


                setDuration(
                    Math.max(
                        1,
                        Math.min(
                            30,
                            nextDuration
                        )
                    )
                );


                if (
                    audioRef.current &&
                    !audioRef.current.paused
                ) {

                    try {

                        const current =
                            audioRef.current.currentTime;


                        if (
                            current >=
                            startTime + nextDuration
                        ) {

                            audioRef.current.currentTime =
                                startTime;

                            setCurrentTime(
                                startTime
                            );

                        }

                    }
                    catch (error) {

                        console.warn(
                            "END DRAG AUDIO ERROR:",
                            error
                        );

                    }

                }

            }

        }


        function handlePointerUp() {

            setDragging(null);

        }


        window.addEventListener(
            "pointermove",
            handlePointerMove
        );


        window.addEventListener(
            "pointerup",
            handlePointerUp
        );


        return function () {

            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );


            window.removeEventListener(
                "pointerup",
                handlePointerUp
            );

        };

    }, [
        dragging,
        selectedSong,
        startTime,
        duration,
        songFullDuration,
        maximumStart
    ]);


    // ==========================================
    // CHANGE START WITH WAVEFORM CLICK
    // ==========================================

    function handleWaveformClick(
        event
    ) {

        if (
            dragging ||
            !selectedSong
        ) {

            return;

        }


        const newTime =
            getTimeFromPointer(
                event
            );


        const newStart =
            Math.max(
                0,
                Math.min(
                    newTime,
                    maximumStart
                )
            );


        setStartTime(
            newStart
        );


        setCurrentTime(
            newStart
        );


        if (
            audioRef.current &&
            !audioRef.current.paused
        ) {

            try {

                audioRef.current.currentTime =
                    newStart;

            }
            catch (error) {

                console.warn(
                    "WAVEFORM SEEK ERROR:",
                    error
                );

            }

        }

    }


    // ==========================================
    // PLAY SELECTED PORTION
    // ==========================================

    async function handlePreviewSelection() {

    const audio =
        audioRef.current;


    if (
        !audio ||
        !selectedSong
    ) {

        return;

    }


    try {

        const clipEnd =
            startTime + duration;


        if (
            audio.readyState < 1
        ) {

            return;

        }


        audio.pause();


        audio.currentTime =
            startTime;


        setCurrentTime(
            startTime
        );


        const playPromise =
            audio.play();


        if (
            playPromise &&
            typeof playPromise.then === "function"
        ) {

            await playPromise;

        }


        console.log(
            "PREVIEW:",
            formatTime(startTime),
            "-",
            formatTime(clipEnd)
        );

    }
    catch (error) {

        console.error(
            "PREVIEW ERROR:",
            error
        );

        setIsPlaying(false);

    }

}


    // ==========================================
    // SAVE / BOOKMARK
    // ==========================================

    function handleBookmark(
        song
    ) {

        setSavedSongs(
            function (previous) {

                if (
                    previous.includes(
                        song.id
                    )
                ) {

                    return previous.filter(
                        function (id) {

                            return id !==
                                song.id;

                        }
                    );

                }


                return [
                    ...previous,
                    song.id
                ];

            }
        );

    }


    // ==========================================
    // DONE
    // ==========================================

// ==========================================
// DONE
// ==========================================

function handleDone() {

    if (
        !selectedSong
    ) {

        return;

    }


    // ======================================
    // FINAL AUDIO DATA
    // ======================================

    const audioData = {

        id:
            selectedSong.id,

        title:
            selectedSong.title ||
            "",

        channel:
            selectedSong.channel ||
            selectedSong.artist ||
            "",

        thumbnail:
            selectedSong.thumbnail ||
            selectedSong.image ||
            "",

        audioUrl:
            getAudioUrl(
                selectedSong
            ),

        songDuration:
            songFullDuration,

        startTime:
            Number(
                startTime.toFixed(2)
            ),

        duration:
            Number(
                duration.toFixed(2)
            )

    };


    console.log(
        "FINAL AUDIO:",
        audioData
    );
    // ======================================
    // PRESERVE PREVIOUS PAGE DATA
    // ======================================

    const previousState =
        location.state || {};


    // ======================================
    // RETURN
    // ======================================

 navigate(
    returnTo,
    {
        state: {
            ...previousState,

            /*
             * Reel ke liye selected
             * Add Audio song ko music
             * field mein bhejenge.
             */
            ...(returnTo === "/reelcreate"
                ? {
                    music: audioData
                }
                : {
                    audio: audioData
                }
            ),

            taggedUser:
                existingTaggedUser
        }
    }
);

}


    // ==========================================
    // SELECTED WINDOW %
    // ==========================================

const safeSongDuration =
    Math.max(
        1,
        songFullDuration
    );


const selectionLeft =
    Math.max(
        0,
        Math.min(
            100,
            (
                startTime /
                safeSongDuration
            ) * 100
        )
    );


const selectionWidth =
    Math.max(
        2,
        Math.min(
            100 - selectionLeft,
            (
                duration /
                safeSongDuration
            ) * 100
        )
    );


    const progressPercent =
        songFullDuration > 0
            ? (
                (
                    currentTime -
                    startTime
                ) /
                duration
            ) * 100
            : 0;


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="add-audio-page">


            {/* ======================================
                NAVBAR
            ====================================== */}

            <div className="add-audio-nav">


                <button
                    className="audio-back-btn"
                    onClick={
                        function () {

                            

                            navigate(-1);

                        }
                    }
                >

                    <FiArrowLeft />

                </button>


                <h1>
                    Add audio
                </h1>


                <button
                    className="audio-done-btn"
                    onClick={
                        handleDone
                    }
                    disabled={
                        !selectedSong
                    }
                >

                    <FiCheck />

                </button>


            </div>


            {/* ======================================
                SEARCH
            ====================================== */}

            <div className="audio-search">


                <FiSearch />


                <input
                    type="text"
                    placeholder="Search music"
                    value={search}
                    onChange={
                        function (event) {

                            setSearch(
                                event.target.value
                            );

                        }
                    }
                />


            </div>


            {/* ======================================
                LOADING
            ====================================== */}

            {loading && (

                <div className="audio-message">

                    Searching music...

                </div>

            )}


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

                <div className="audio-error">

                    {error}

                </div>

            )}


            {/* ======================================
                EMPTY
            ====================================== */}

            {!search &&
            !selectedSong && (

                <div className="audio-empty">

                    <FiPlay />

                    <h2>
                        Add music to your post
                    </h2>

                    <p>
                        Search for songs, artists or albums
                    </p>

                </div>

            )}


            {/* ======================================
                SONG LIST
            ====================================== */}

            <div className="audio-list">


                {songs.map(
                    function (song) {


                        const isSelected =
                            selectedSong &&
                            selectedSong.id ===
                            song.id;


                        const isSaved =
                            savedSongs.includes(
                                song.id
                            );


                        const songDuration =
                            getSongDuration(
                                song
                            );


                        return (

                            <div
                                className={
                                    isSelected
                                        ? "audio-item selected-audio"
                                        : "audio-item"
                                }
                                key={
                                    song.id
                                }
                            >


                                {/* IMAGE */}

                                <img
                                    className="audio-image"
                                    src={
                                        song.thumbnail ||
                                        song.image ||
                                        ""
                                    }
                                    alt={
                                        song.title
                                    }
                                />


                                {/* INFO */}

                                <div className="audio-info">


                                    <h3>
                                        {
                                            song.title
                                        }
                                    </h3>


                                    <p>
                                        {
                                            song.channel ||
                                            song.artist ||
                                            ""
                                        }
                                    </p>


                                    <span>
                                        {
                                            formatTime(
                                                songDuration
                                            )
                                        }
                                    </span>


                                </div>


                                {/* PLAY */}

                                <button
                                    className="audio-play-list-btn"
                                    onClick={
                                        function () {

                                            if (
                                                isSelected
                                            ) {

                                                handlePlayPause();

                                            }
                                            else {

                                                handleSelect(
                                                    song,
                                                    true
                                                );

                                            }

                                        }
                                    }
                                >

                                    {isSelected &&
                                    isPlaying
                                        ? <FiPause />
                                        : <FiPlay />
                                    }

                                </button>


                                {/* BOOKMARK */}

                                <button
                                    className={
                                        isSaved
                                            ? "audio-bookmark-btn saved"
                                            : "audio-bookmark-btn"
                                    }
                                    onClick={
                                        function () {

                                            handleBookmark(
                                                song
                                            );

                                        }
                                    }
                                >

                                    <FiBookmark />

                                </button>


                                {/* SELECT */}

                                <button
                                    className={
                                        isSelected
                                            ? "audio-select-btn selected"
                                            : "audio-select-btn"
                                    }
                                    onClick={
                                        function () {

                                            handleSelect(
                                                song
                                            );

                                        }
                                    }
                                >

                                    {isSelected
                                        ? "Selected"
                                        : "Select"
                                    }

                                </button>


                            </div>

                        );

                    }
                )}


                {!loading &&
                search &&
                songs.length === 0 &&
                !error && (

                    <div className="audio-message">

                        No music found

                    </div>

                )}


            </div>


            {/* ======================================
                SELECTED SONG PANEL
            ====================================== */}

            {selectedSong && (

                <div className="audio-selection-panel">


                    {/* ==================================
                        TOP
                    ================================== */}

                    <div className="selection-header">


                        <div>

                            <strong>
                                New song
                            </strong>

                        </div>


                        <button
                            onClick={
                                handleDone
                            }
                        >

                            Done

                        </button>


                    </div>


                    {/* ==================================
                        SONG IMAGE
                    ================================== */}

                    <img
                        className="selected-song-image"
                        src={
                            selectedSong.thumbnail ||
                            selectedSong.image ||
                            ""
                        }
                        alt={
                            selectedSong.title
                        }
                    />


                    {/* ==================================
                        SONG TITLE
                    ================================== */}

                    <h2 className="selected-song-title">

                        {
                            selectedSong.title
                        }

                    </h2>


                    {/* ==================================
                        ARTIST
                    ================================== */}

                    <p className="selected-song-artist">

                        {
                            selectedSong.channel ||
                            selectedSong.artist ||
                            ""
                        }

                    </p>


                    {/* ==================================
                        TIME
                    ================================== */}

                    <div className="selection-time-row">


                        <span>

                            {
                                formatTime(
                                    startTime
                                )
                            }

                        </span>


                        <span>

                            {
                                formatTime(
                                    startTime +
                                    duration
                                )
                            }

                        </span>


                    </div>


                    {/* ==================================
                        WAVEFORM
                    ================================== */}

                    <div
                        className="waveform"
                        ref={
                            waveformRef
                        }
                        onClick={
                            handleWaveformClick
                        }
                    >


                        {/* Fake waveform bars */}

                        {Array.from(
                            {
                                length: 55
                            }
                        ).map(
                            function (_, index) {

                                const height =
                                    8 +
                                    (
                                        index *
                                        17
                                    ) % 30;


                                return (

                                    <span
                                        key={
                                            index
                                        }
                                        className={
                                            index % 4 === 0
                                                ? "wave-bar strong"
                                                : "wave-bar"
                                        }
                                        style={{
                                            height:
                                                height +
                                                "px"
                                        }}
                                    />

                                );

                            }
                        )}


                        {/* ==================================
                            SELECTED WINDOW
                        ================================== */}

                        <div
                            className="selection-window"
                            style={{
                                left:
                                    selectionLeft +
                                    "%",

                                width:
                                    selectionWidth +
                                    "%"
                            }}
                            onPointerDown={
                                handleWindowPointerDown
                            }

                            onClick={
                                function (
                                    event
                                ) {

                                    event.stopPropagation();

                                }
                            }
                        >


                            {/* Progress */}

                            <div
                                className="selection-progress"
                                style={{
                                    width:
                                        Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                progressPercent
                                            )
                                        ) +
                                        "%"
                                }}
                            />


                            {/* LEFT HANDLE */}

                            <div
                                className="selection-handle left"
                                onPointerDown={
                                    handleStartPointerDown
                                }
                            />


                            {/* RIGHT HANDLE */}

                            <div
                                className="selection-handle right"
                                onPointerDown={
                                    handleEndPointerDown
                                }
                            />


                        </div>


                    </div>


                    {/* ==================================
                        DURATION
                    ================================== */}

                    <div className="selection-controls">


                        <div className="duration-circle">

                            {
                                Math.round(
                                    duration
                                )
                            }

                        </div>


                        <span>
                            seconds
                        </span>


                        <button
                            className="big-play-btn"
                            onClick={
                                handlePlayPause
                            }
                        >

                            {isPlaying
                                ? <FiPause />
                                : <FiPlay />
                            }

                        </button>


                    </div>


                    {/* ==================================
                        SELECTED RANGE
                    ================================== */}

                    <p className="selected-range-text">

                        Selected{" "}

                        {
                            formatTime(
                                startTime
                            )
                        }

                        {" - "}

                        {
                            formatTime(
                                startTime +
                                duration
                            )
                        }

                    </p>


                    {/* ==================================
                        PREVIEW
                    ================================== */}

                    <button
                        className="preview-selection-btn"
                        onClick={
                            handlePreviewSelection
                        }
                    >

                        {isPlaying
                            ? <FiPause />
                            : <FiPlay />
                        }


                        <span>

                            {
                                isPlaying
                                    ? "Pause"
                                    : "Preview selection"
                            }

                        </span>

                    </button>


                </div>

            )}


            {/* ======================================
                HIDDEN AUDIO
            ====================================== */}

            {selectedSong && (

                <audio
                    ref={audioRef}

                    src={
                        getAudioUrl(
                            selectedSong
                        )
                    }

                    preload="metadata"

                    onLoadedMetadata={
                        function (event) {

                            const realDuration =
                                event.currentTarget.duration;


                            if (
                                Number.isFinite(
                                    realDuration
                                ) &&
                                realDuration > 0
                            ) {

                                setActualAudioDuration(
                                    realDuration
                                );


                                setDuration(
                                    Math.min(
                                        30,
                                        realDuration
                                    )
                                );


                                setStartTime(0);

                                setCurrentTime(0);


                                if (
                                    pendingPlayRef.current
                                ) {

                                    pendingPlayRef.current =
                                        false;


                                    const playPromise =
                                        event.currentTarget.play();


                                    if (
                                        playPromise &&
                                        typeof playPromise.catch === "function"
                                    ) {

                                        playPromise.catch(
                                            function (error) {

                                                console.error(
                                                    "INITIAL AUDIO PLAY ERROR:",
                                                    error
                                                );

                                                setIsPlaying(false);

                                            }
                                        );

                                    }

                                }

                            }

                        }
                    }

                    onError={
                        function () {

                            console.error(
                                "AUDIO LOAD ERROR"
                            );

                            setError(
                                "This audio preview cannot be played"
                            );

                            setIsPlaying(false);

                        }
                    }
                />

            )}

        </div>

    );

}


// ==========================================
// EXPORT
// ==========================================

export default AddAudio