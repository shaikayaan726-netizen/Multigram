import { useEffect, useRef } from "react";


// ==========================================
// BACKEND URL
// ==========================================

const BACKEND_URL = "http://localhost:3000";


// ==========================================
// AUDIO URL HELPER
// ==========================================

function getAudioUrl(url) {

    if (!url) {
        return "";
    }


    // Already complete URL

    if (
        url.startsWith("http://") ||
        url.startsWith("https://")
    ) {

        return url;

    }


    // Backend relative URL

    if (url.startsWith("/")) {

        return BACKEND_URL + url;

    }


    return BACKEND_URL + "/" + url;

}


// ==========================================
// BACKGROUND MUSIC
// ==========================================

function BackgroundMusic() {

    const audioRef =
        useRef(null);


    const musicRef =
        useRef(null);


    const shouldResumeRef =
        useRef(false);


    // ==========================================
    // PLAY MUSIC
    // ==========================================

    function playMusic(music) {

        const audio =
            audioRef.current;


        if (!audio) {
            return;
        }


        if (
            !music ||
            !music.audioUrl
        ) {

            audio.pause();

            musicRef.current = null;

            return;

        }


        musicRef.current =
            music;


const audioUrl =
    getAudioUrl(
        music.audioUrl
    );

console.log(
    "🎵 MUSIC URL:",
    audioUrl
);

console.log(
    "🎵 MUSIC DATA:",
    music
);

        const startTime =
            Number(
                music.startTime
            ) || 0;


        // ======================================
        // SAME SONG
        // ======================================

        const currentUrl =
            audio.getAttribute(
                "src"
            );


        const isSameSong =
            currentUrl === audioUrl;


        // ======================================
        // NEW SONG
        // ======================================

        if (!isSameSong) {

            audio.pause();

            audio.src =
                audioUrl;

            audio.load();

        }


        // ======================================
        // START PLAYBACK
        // ======================================

        function startPlayback() {

            try {

                /*
                 * New song:
                 * start from selected clip time.
                 *
                 * Same song:
                 * DON'T reset currentTime.
                 *
                 * This is important because
                 * route change ke baad song
                 * wahi se continue hoga.
                 */

                if (!isSameSong) {

                    audio.currentTime =
                        startTime;

                }

            }
            catch (error) {

                console.warn(
                    "BACKGROUND MUSIC SEEK ERROR:",
                    error
                );

            }


            const promise =
                audio.play();


            if (
                promise &&
                typeof promise.catch ===
                    "function"
            ) {

                promise.catch(
                    function (error) {

                        console.warn(
                            "BACKGROUND MUSIC AUTOPLAY BLOCKED:",
                            error
                        );


                        /*
                         * Browser ne autoplay
                         * block kiya.
                         *
                         * User ke next click/touch
                         * par resume karenge.
                         */

                        shouldResumeRef.current =
                            true;

                    }
                );

            }

        }


        if (
            audio.readyState >= 1
        ) {

            startPlayback();

        }
        else {

            audio.addEventListener(
                "loadedmetadata",
                startPlayback,
                {
                    once: true
                }
            );

        }

    }


    // ==========================================
    // STOP MUSIC
    // ==========================================

    function stopMusic() {

        const audio =
            audioRef.current;


        if (!audio) {
            return;
        }


        audio.pause();

        shouldResumeRef.current =
            false;

    }


    // ==========================================
    // RESUME AFTER USER INTERACTION
    // ==========================================

    function resumeAfterInteraction() {

        const audio =
            audioRef.current;


        if (!audio) {
            return;
        }


        if (
            !shouldResumeRef.current
        ) {

            return;

        }


        if (
            !musicRef.current
        ) {

            return;

        }


        audio.play()
            .then(function () {

                shouldResumeRef.current =
                    false;

            })
            .catch(function () {

                // Browser still blocking.
                // Next interaction will try again.

            });

    }


    // ==========================================
    // CLIP END
    // ==========================================

    function stopAtClipEnd() {

        const audio =
            audioRef.current;


        const music =
            musicRef.current;


        if (
            !audio ||
            !music
        ) {

            return;

        }


        const startTime =
            Number(
                music.startTime
            ) || 0;


        const duration =
            Number(
                music.duration
            ) || 30;


        const clipEnd =
            startTime +
            duration;


        if (
            audio.currentTime >=
            clipEnd - 0.05
        ) {

            audio.pause();

            audio.currentTime =
                startTime;

        }

    }


    // ==========================================
    // INITIAL SETUP
    // ==========================================

    useEffect(function () {

        const audio =
            audioRef.current;


        if (!audio) {
            return;
        }


        audio.preload =
            "auto";


        audio.volume =
            1;


        // ======================================
        // MUSIC CHANGE EVENT
        // ======================================

        function handleMusicChange(event) {

            console.log(
                "BACKGROUND MUSIC CHANGE:",
                event.detail
            );


            const music =
                event.detail;


            if (!music) {
                return;
            }


            // Save globally

            try {

                localStorage.setItem(

                    "instagram_background_music",

                    JSON.stringify(
                        music
                    )

                );

            }
            catch (error) {

                console.warn(
                    "BACKGROUND MUSIC SAVE ERROR:",
                    error
                );

            }


            shouldResumeRef.current =
                false;


            playMusic(music);

        }


        // ======================================
        // MUSIC STOP EVENT
        // ======================================

        function handleMusicStop() {

            console.log(
                "BACKGROUND MUSIC STOP"
            );


            stopMusic();

        }


        // ======================================
        // AUDIO END
        // ======================================

        audio.addEventListener(
            "timeupdate",
            stopAtClipEnd
        );


        // ======================================
        // CUSTOM EVENTS
        // ======================================

        window.addEventListener(

            "background-music-change",

            handleMusicChange

        );


        window.addEventListener(

            "background-music-stop",

            handleMusicStop

        );


        // ======================================
        // USER INTERACTION
        // ======================================

        document.addEventListener(
            "click",
            resumeAfterInteraction
        );


        document.addEventListener(
            "touchstart",
            resumeAfterInteraction
        );


               document.addEventListener(
            "keydown",
            resumeAfterInteraction
        );


        // ======================================
        // RESTORE SAVED MUSIC
        // ======================================

        const savedMusic =
            localStorage.getItem(
                "instagram_background_music"
            );

        if (savedMusic) {
            try {
                const music =
                    JSON.parse(savedMusic);

                if (
                    music &&
                    music.audioUrl
                ) {
                    musicRef.current =
                        music;

                    const audioUrl =
                        getAudioUrl(
                            music.audioUrl
                        );

                    audio.src =
                        audioUrl;

                    audio.load();

                    function startRestoredMusic() {
                        try {
                            audio.currentTime =
                                Number(
                                    music.startTime
                                ) || 0;
                        }
                        catch (error) {
                            console.warn(
                                "RESTORE MUSIC SEEK ERROR:",
                                error
                            );
                        }

                        audio.play()
                            .then(function () {
                                shouldResumeRef.current =
                                    false;
                            })
                            .catch(function (error) {
                                console.warn(
                                    "RESTORED MUSIC PLAY ERROR:",
                                    error
                                );

                                shouldResumeRef.current =
                                    true;
                            });
                    }

                    if (
                        audio.readyState >= 1
                    ) {
                        startRestoredMusic();
                    }
                    else {
                        audio.addEventListener(
                            "loadedmetadata",
                            startRestoredMusic,
                            {
                                once: true
                            }
                        );
                    }
                }
            }
            catch (error) {
                console.warn(
                    "BACKGROUND MUSIC RESTORE ERROR:",
                    error
                );
            }
        }


        // ======================================
        // CLEANUP
        // ======================================



        // ======================================
        // CLEANUP
        // ======================================

        return function () {

            /*
             * IMPORTANT:
             *
             * App normally stays mounted while
             * React Router changes pages.
             *
             * So music will NOT stop on:
             *
             * Home -> Post
             * Post -> EditPost
             * EditPost -> AddAudio
             * AddAudio -> EditPost
             * EditPost -> Profile
             * Profile -> Saved
             *
             */

            audio.removeEventListener(
                "timeupdate",
                stopAtClipEnd
            );


            window.removeEventListener(

                "background-music-change",

                handleMusicChange

            );


            window.removeEventListener(

                "background-music-stop",

                handleMusicStop

            );


            document.removeEventListener(
                "click",
                resumeAfterInteraction
            );


            document.removeEventListener(
                "touchstart",
                resumeAfterInteraction
            );


            document.removeEventListener(
                "keydown",
                resumeAfterInteraction
            );

        };

    }, []);


    // ==========================================
    // AUDIO ELEMENT
    // ==========================================

    return (

        <audio
            ref={audioRef}
            preload="auto"
        />

    );

}


export default BackgroundMusic;