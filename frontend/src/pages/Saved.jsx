import {
    useState,
    useEffect
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    api
} from "../utils/api";

import {
    FiArrowLeft,
    FiPlus,
    FiLock,
    FiPlay,
    FiMessageCircle
} from "react-icons/fi";


function Saved() {

    const navigate = useNavigate();


    // ===========================
    // ACTIVE TAB
    // ===========================

    const [
        activeTab,
        setActiveTab
    ] = useState("All");


    // ===========================
    // SAVED POSTS
    // ===========================

    const [
        savedPosts,
        setSavedPosts
    ] = useState([]);


    // ===========================
    // SAVED REELS
    // ===========================

    const [
        savedReels,
        setSavedReels
    ] = useState([]);


    // ===========================
    // LOADING
    // ===========================

    const [
        loading,
        setLoading
    ] = useState(true);


    // ===========================
    // LOAD SAVED POSTS + REELS
    // ===========================

    useEffect(function () {

        async function loadSavedContent() {

            try {

                setLoading(true);


                // =================================
                // GET CURRENT USER
                // =================================

                const meResponse =
                    await api(
                        "/auth/me"
                    );


                const currentUser =
                    meResponse?.user;


                const userId =
                    currentUser?._id ||
                    currentUser?.id;


                // =================================
                // GET SAVED POSTS
                // =================================

                const postsResponse =
                    await api(
                        "/saved"
                    );


                console.log(
                    "SAVED POSTS RESPONSE:",
                    postsResponse
                );


                setSavedPosts(
                    Array.isArray(
                        postsResponse?.posts
                    )
                        ? postsResponse.posts
                        : []
                );


                // =================================
                // GET REELS
                // =================================

                const reelsResponse =
                    await api(
                        "/reels"
                    );


                console.log(
                    "REELS RESPONSE:",
                    reelsResponse
                );


                const allReels =
                    Array.isArray(
                        reelsResponse?.reels
                    )
                        ? reelsResponse.reels
                        : [];


                // =================================
                // FILTER SAVED REELS
                // =================================

                const userSavedReels =
                    allReels.filter(
                        function (reel) {

                            if (
                                !userId ||
                                !Array.isArray(
                                    reel?.saves
                                )
                            ) {

                                return false;

                            }


                            return reel.saves.some(
                                function (savedUserId) {

                                    return (
                                        savedUserId != null &&
                                        savedUserId.toString() ===
                                        userId.toString()
                                    );

                                }
                            );

                        }
                    );


                setSavedReels(
                    userSavedReels
                );


                console.log(
                    "SAVED REELS:",
                    userSavedReels
                );

            }
            catch (error) {

                console.error(
                    "SAVED CONTENT ERROR:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadSavedContent();

    }, []);


    // ===========================
    // BACK
    // ===========================

    function handleBack() {

        navigate(-1);

    }


    // ===========================
    // ADD COLLECTION
    // ===========================

    function handleAdd() {

        console.log(
            "Add collection clicked"
        );

    }


    // ===========================
    // MANAGE
    // ===========================

    function handleManage() {

        console.log(
            "Manage saved content clicked"
        );

    }


    // ===========================
    // TABS
    // ===========================

    function handleTab(tab) {

        setActiveTab(tab);

    }


    // ===========================
    // CONTENT TO SHOW
    // ===========================

    let content = [];


    if (
        activeTab === "Posts"
    ) {

        content =
            savedPosts.map(
                function (post) {

                    return {

                        type: "post",

                        data: post

                    };

                }
            );

    }
    else if (
        activeTab === "Reels"
    ) {

        content =
            savedReels.map(
                function (reel) {

                    return {

                        type: "reel",

                        data: reel

                    };

                }
            );

    }
    else if (
        activeTab === "All"
    ) {

        content = [

            ...savedPosts.map(
                function (post) {

                    return {

                        type: "post",

                        data: post

                    };

                }
            ),

            ...savedReels.map(
                function (reel) {

                    return {

                        type: "reel",

                        data: reel

                    };

                }
            )

        ];

    }


    // ===========================
    // EMPTY MESSAGE
    // ===========================

    function getEmptyMessage() {

        if (
            activeTab === "Posts"
        ) {

            return "No saved posts yet";

        }


        if (
            activeTab === "Reels"
        ) {

            return "No saved reels yet";

        }


        if (
            activeTab === "Audio"
        ) {

            return "No saved audio yet";

        }


        return "No saved posts or reels yet";

    }


    // ===========================
    // REEL VIDEO URL
    // ===========================

    function getReelVideoUrl(
        reel
    ) {

        if (
            !reel?.video
        ) {

            return "";

        }


        if (
            reel.video.startsWith(
                "http://"
            ) ||
            reel.video.startsWith(
                "https://"
            )
        ) {

            return reel.video;

        }


        return (
            "https://localhost:3000" +
            reel.video
        );

    }


    return (

        <div className="saved-page">


            {/* ===========================
                SAVED HEADER
            =========================== */}

            <div className="saved-header">


                {/* BACK */}

                <span
                    className="saved-back-btn"
                    onClick={handleBack}
                    title="Back"
                >

                    <FiArrowLeft />

                </span>


                {/* TITLE */}

                <h1>
                    Saved
                </h1>


                {/* ADD */}

                <span
                    className="saved-add-btn"
                    onClick={handleAdd}
                    title="Add Collection"
                >

                    <FiPlus />

                </span>


            </div>


            {/* ===========================
                FILTER TABS
            =========================== */}

            <div className="saved-tabs">


                {/* ALL */}

                <span
                    className={
                        activeTab === "All"
                            ? "saved-tab active"
                            : "saved-tab"
                    }
                    onClick={
                        function () {

                            handleTab(
                                "All"
                            );

                        }
                    }
                >

                    All

                </span>


                {/* POSTS */}

                <span
                    className={
                        activeTab === "Posts"
                            ? "saved-tab active"
                            : "saved-tab"
                    }
                    onClick={
                        function () {

                            handleTab(
                                "Posts"
                            );

                        }
                    }
                >

                    Posts

                </span>


                {/* REELS */}

                <span
                    className={
                        activeTab === "Reels"
                            ? "saved-tab active"
                            : "saved-tab"
                    }
                    onClick={
                        function () {

                            handleTab(
                                "Reels"
                            );

                        }
                    }
                >

                    Reels

                </span>


                {/* AUDIO */}

                <span
                    className={
                        activeTab === "Audio"
                            ? "saved-tab active"
                            : "saved-tab"
                    }
                    onClick={
                        function () {

                            handleTab(
                                "Audio"
                            );

                        }
                    }
                >

                    Audio

                </span>


            </div>


            {/* ===========================
                COLLECTIONS
            =========================== */}

            <div className="saved-collections-section">


                <div className="saved-section-header">

                    <h2>
                        Collections
                    </h2>


                    <span
                        onClick={
                            function () {

                                console.log(
                                    "See all collections"
                                );

                            }
                        }
                    >

                        See all

                    </span>

                </div>


                {/* AUDIO COLLECTION */}

                <div
                    className="saved-collection"
                    onClick={
                        function () {

                            console.log(
                                "Audio collection clicked"
                            );

                        }
                    }
                >

                    <img
                        src="https://picsum.photos/120/120?random=50"
                        alt="Audio"
                    />


                    <div className="saved-collection-info">

                        <h3>
                            Audio
                        </h3>


                        <p>

                            <FiLock />

                            Private

                        </p>

                    </div>

                </div>


            </div>


            {/* ===========================
                SAVED CONTENT HEADER
            =========================== */}

            <div className="saved-posts-header">


                <h2>

                    {activeTab === "All"
                        ? "Reels and posts"
                        : activeTab}

                </h2>


                <span
                    onClick={
                        handleManage
                    }
                >

                    Manage

                </span>


            </div>


            {/* ===========================
                SAVED GRID
            =========================== */}

            <div className="saved-grid">


                {/* ===========================
                    LOADING
                =========================== */}

                {loading ? (

                    <p className="saved-empty">

                        Loading...

                    </p>

                ) : activeTab === "Audio" ? (

                    <p className="saved-empty">

                        No saved audio yet

                    </p>

                ) : content.length === 0 ? (

                    <p className="saved-empty">

                        {getEmptyMessage()}

                    </p>

                ) : (

                    content.map(
                        function (item) {


                            // =====================
                            // POST
                            // =====================

                            if (
                                item.type ===
                                "post"
                            ) {

                                const post =
                                    item.data;


                                return (

                                    <div
                                        key={
                                            "post-" +
                                            post._id
                                        }
                                        className="saved-grid-item"
                                        onClick={
                                            function () {

                                                navigate(
                                                    "/post/" +
                                                    post._id
                                                );

                                            }
                                        }
                                    >

                                        <img
                                            src={
                                                post.image
                                            }
                                            alt="Saved post"
                                        />

                                    </div>

                                );

                            }


                            // =====================
                            // REEL
                            // =====================

                            const reel =
                                item.data;


                            return (

                                <div
                                    key={
                                        "reel-" +
                                        reel._id
                                    }
                                    className="saved-grid-item"
                                    onClick={
                                        function () {

                                            navigate(
                                                "/reels"
                                            );

                                        }
                                    }
                                >

                                    <video
                                        src={
                                            getReelVideoUrl(
                                                reel
                                            )
                                        }
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />


                                    <FiPlay
                                        className="saved-media-icon"
                                    />

                                </div>

                            );

                        }
                    )

                )}

            </div>


        </div>

    );

}


export default Saved;