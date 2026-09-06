import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FiArrowLeft,
    FiGrid,
    FiBookmark,
    FiMoreHorizontal,
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiVideo,
    FiUser,
    FiShare2,
    FiLink
} from "react-icons/fi";

import { api } from "../utils/api";


function Profile() {

    const navigate = useNavigate();

    const { username } = useParams();


    // ===========================
    // PROFILE DATA
    // ===========================

    const [profile, setProfile] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    // ===========================
    // FOLLOW STATUS
    // pending
    // accepted
    // null
    // ===========================

    const [followStatus, setFollowStatus] =
        useState(null);


    // ===========================
    // MUTUAL FOLLOWERS
    // ===========================

    const [mutualFollowers, setMutualFollowers] =
        useState([]);

// ===========================
// USER POSTS
// ===========================

const [userPosts, setUserPosts] =
    useState([]);
    // ===========================
// USER REELS
// ===========================

const [userReels, setUserReels] =
    useState([]);


// ===========================
// ACTIVE PROFILE TAB
// ===========================

const [activeTab, setActiveTab] =
    useState("Posts");

const [postsLoading, setPostsLoading] =
    useState(true);
    // ===========================
    // SHARE PROFILE
    // ===========================

    const [showShare, setShowShare] =
        useState(false);


    const [copied, setCopied] =
        useState(false);


    // ===========================
    // LOAD PROFILE
    // ===========================

    useEffect(function () {

        async function loadProfile() {

            try {

                setLoading(true);


                // =================================
                // OWN PROFILE
                // =================================

                if (!username) {

                    const response =
                        await api("/auth/me");


                    console.log(
                        "ME API RESPONSE:",
                        response
                    );


                    const user =
                        response.user;


                    if (!user) {

                        throw new Error(
                            "Current user not found"
                        );

                    }


                    setProfile({

                        id:
                            user.id,

                        username:
                            user.username,

                        fullName:
                            user.fullName || "",

                        bio:
                            user.bio || "",

                        profession:
                            user.profession || "",

                      followers:
    Array.isArray(user.followers)
        ? user.followers.length
        : Number(user.followers) || 0,

following:
    Array.isArray(user.following)
        ? user.following.length
        : Number(user.following) || 0,
                        posts:
                            Array.isArray(
                                user.posts
                            )
                                ? user.posts.length
                                : 0,

                        image:
                            user.profilePicture
                                ? (
                                    user.profilePicture.startsWith(
                                        "http"
                                    )
                                        ? user.profilePicture
                                        : user.profilePicture.startsWith(
                                            "/"
                                        )
                                            ? user.profilePicture
                                            : "/" +
                                              user.profilePicture
                                )
                                : "/default-avatar.jpg"

                    });


                    // Own profile
                    setFollowStatus(null);

                    setMutualFollowers([]);


                    // =================================
                    // LOAD OWN POSTS
                    // =================================

                    let loadedPosts = [];

                    try {

                        const postsResponse =
                            await api(
                                "/posts/user/" +
                                user.id
                            );

                        loadedPosts =
                            Array.isArray(
                                postsResponse.posts
                            )
                                ? postsResponse.posts
                                : [];

                        setUserPosts(
                            loadedPosts
                        );

                    }
                    catch (postError) {

                        console.error(
                            "OWN PROFILE POSTS ERROR:",
                            postError
                        );

                        setUserPosts([]);

                    }


                    // =================================
                    // LOAD OWN REELS
                    // =================================

                    let loadedReels = [];

                    try {

                        const reelsResponse =
                            await api(
                                "/reels/user/" +
                                user.id
                            );

                        loadedReels =
                            Array.isArray(
                                reelsResponse.reels
                            )
                                ? reelsResponse.reels
                                : [];

                        setUserReels(
                            loadedReels
                        );

                    }
                    catch (reelError) {

                        console.error(
                            "OWN PROFILE REELS ERROR:",
                            reelError
                        );

                        setUserReels([]);

                    }


                    // =================================
                    // TOTAL CONTENT COUNT
                    // =================================

                    setProfile(function (oldProfile) {

                        return {

                            ...oldProfile,

                            posts:
                                loadedPosts.length +
                                loadedReels.length

                        };

                    });


                    setPostsLoading(false);

                    return;

                }


                // =================================
                // OTHER USER
                // =================================

                const response =
                    await api(
                        "/search-user?username=" +
                        encodeURIComponent(username)
                    );


                console.log(
                    "OTHER USER SEARCH RESPONSE:",
                    response
                );


                // =================================
                // FIND EXACT USER
                // =================================

                const user =
                    Array.isArray(response)
                        ? response.find(
                            function (item) {

                                return (
                                    item.username &&
                                    item.username.toLowerCase() ===
                                    username.toLowerCase()
                                );

                            }
                        )
                        : null;


                if (!user) {

                    throw new Error(
                        "User not found"
                    );

                }


                // =================================
                // PROFILE ID
                // =================================

                const profileId =
                    user._id || user.id;

                // =================================
// =================================
// LOAD USER POSTS
                // =================================

                let loadedPosts = [];

                try {

                    const postsResponse =
                        await api(
                            "/posts/user/" +
                            profileId
                        );

                    loadedPosts =
                        Array.isArray(
                            postsResponse.posts
                        )
                            ? postsResponse.posts
                            : [];

                    setUserPosts(
                        loadedPosts
                    );

                }
                catch (postError) {

                    console.error(
                        "USER PROFILE POSTS ERROR:",
                        postError
                    );

                    setUserPosts([]);

                }


                // =================================
                // LOAD USER REELS
                // =================================

                let loadedReels = [];

                try {

                    const reelsResponse =
                        await api(
                            "/reels/user/" +
                            profileId
                        );

                    loadedReels =
                        Array.isArray(
                            reelsResponse.reels
                        )
                            ? reelsResponse.reels
                            : [];

                    setUserReels(
                        loadedReels
                    );

                }
                catch (reelError) {

                    console.error(
                        "USER PROFILE REELS ERROR:",
                        reelError
                    );

                    setUserReels([]);

                }


                // =================================
                // TOTAL CONTENT COUNT
                // =================================

                setProfile(function (oldProfile) {

                    return {

                        ...oldProfile,

                        posts:
                            loadedPosts.length +
                            loadedReels.length

                    };

                });


                setPostsLoading(false);

                // FOLLOW REQUEST STATUS
                // =================================

                const currentFollowStatus =
                    user.requestStatus || null;


                console.log(
                    "PROFILE FOLLOW STATUS:",
                    currentFollowStatus
                );


                setFollowStatus(
                    currentFollowStatus
                );


                // =================================
                // MUTUAL FOLLOWERS
                // =================================

                const mutuals =
                    Array.isArray(
                        user.mutualFollowers
                    )
                        ? user.mutualFollowers
                        : [];


                setMutualFollowers(
                    mutuals
                );


                // =================================
                // PROFILE DATA
                // =================================

                setProfile({

                    id:
                        profileId,

                    username:
                        user.username,

                    fullName:
                        user.fullName || "",

                    bio:
                        user.bio || "",

                    profession:
                        user.profession || "",

                    followers:
    Array.isArray(user.followers)
        ? user.followers.length
        : Number(user.followers) || 0,

following:
    Array.isArray(user.following)
        ? user.following.length
        : Number(user.following) || 0,
posts:
    loadedPosts.length +
    loadedReels.length,

                    image:
                        user.profilePicture
                            ? (
                                user.profilePicture.startsWith(
                                    "http"
                                )
                                    ? user.profilePicture
                                    : user.profilePicture.startsWith(
                                        "/"
                                    )
                                        ? user.profilePicture
                                        : "/" +
                                          user.profilePicture
                            )
                            : "/default-avatar.jpg"

                });

            }
            catch (error) {

                console.error(
                    "PROFILE ERROR:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadProfile();

    }, [username]);


    // ===========================
    // BACK
    // ===========================

    function handleBack() {

        navigate(-1);

    }


    // ===========================
    // HOME
    // ===========================

    function handleHome() {

        navigate("/home");

    }


    // ===========================
    // SEARCH
    // ===========================

    function handleSearch() {

        navigate("/search");

    }


    // ===========================
    // CREATE
    // ===========================

    function handleCreate() {

        navigate("/postgallery");

    }


    // ===========================
    // REELS
    // ===========================

    function handleReels() {

        navigate("/reels");

    }


    // ===========================
    // MY PROFILE
    // ===========================

    function handleProfile() {

        navigate("/profile");

    }


    // ===========================
    // SAVED
    // ===========================

    function handleSaved() {

        navigate("/saved");

    }


    // ===========================
    // SETTINGS
    // ===========================

    function handleSettings() {

        navigate("/settings");

    }


    // ===========================
    // FOLLOWERS
    // ===========================

    function handleFollowers() {

        if (
            !profile ||
            !profile.id
        ) {

            return;

        }


        navigate(
            "/followers/" +
            profile.id
        );

    }


    // ===========================
    // FOLLOWING
    // ===========================

    function handleFollowing() {

        if (
            !profile ||
            !profile.id
        ) {

            return;

        }


        navigate(
            "/following/" +
            profile.id
        );

    }


    // ===========================
    // POSTS
    // ===========================

    function handlePosts() {

        setActiveTab(
            "Posts"
        );

    }


    // ===========================
    // REELS
    // ===========================

    function handleProfileReels() {

        setActiveTab(
            "Reels"
        );

    }


    // ===========================
    // TAGGED
    // ===========================

    function handleTagged() {

        setActiveTab(
            "Tagged"
        );

    }


    // ===========================
    // EDIT PROFILE
    // ===========================

    function handleEditProfile() {

        navigate(
            "/editprofile"
        );

    }


    // ===========================
    // SHARE PROFILE
    // ===========================

    function handleShareProfile() {

        setCopied(false);

        setShowShare(true);

    }


    // ===========================
    // CLOSE SHARE
    // ===========================

    function handleCloseShare() {

        setShowShare(false);

    }


    // ===========================
    // PROFILE LINK
    // ===========================

    function getProfileLink() {

        if (
            !profile ||
            !profile.username
        ) {

            return "";

        }


        return (
            window.location.origin +
            "/profile/" +
            profile.username
        );

    }


    // ===========================
    // COPY PROFILE LINK
    // ===========================

    async function handleCopyLink() {

        const link =
            getProfileLink();


        if (!link) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                link
            );


            setCopied(true);


            setTimeout(function () {

                setCopied(false);

            }, 2000);

        }
        catch (error) {

            console.error(
                "COPY LINK ERROR:",
                error
            );

        }

    }


    // ===========================
    // NATIVE SHARE
    // ===========================

    async function handleNativeShare() {

        const link =
            getProfileLink();


        if (!link) {

            return;

        }


        try {

            if (
                navigator.share
            ) {

                await navigator.share({

                    title:
                        "Instagram Profile",

                    text:
                        "Check out @" +
                        profile.username,

                    url:
                        link

                });

            }
            else {

                await navigator.clipboard.writeText(
                    link
                );


                setCopied(true);


                setTimeout(function () {

                    setCopied(false);

                }, 2000);

            }

        }
        catch (error) {

            console.log(
                "Share cancelled"
            );

        }

    }


    // ===========================
    // FOLLOW
    // ===========================

   async function handleFollow() {

    try {

        // =================================
        // PROFILE CHECK
        // =================================

        if (
            !profile ||
            !profile.id
        ) {

            return;

        }


        // =================================
        // CURRENT USER
        // =================================

        const meResponse =
            await api("/auth/me");


        const currentUser =
            meResponse.user;


        const currentUserId =
            currentUser?._id ||
            currentUser?.id;


        // =================================
        // PREVENT SELF FOLLOW
        // =================================

        if (
            currentUserId &&
            currentUserId.toString() ===
            profile.id.toString()
        ) {

            console.log(
                "CANNOT FOLLOW YOURSELF"
            );

            return;

        }


        // =================================
        // UNFOLLOW
        // =================================

        if (
            followStatus ===
            "accepted"
        ) {

            const unfollowResponse =
                await api(
                    "/unfollow/" +
                    profile.id,
                    {
                        method: "DELETE"
                    }
                );


            console.log(
                "UNFOLLOW RESPONSE:",
                unfollowResponse
            );


            // =================================
            // UPDATE PROFILE COUNTS
            // =================================

            setProfile(function (oldProfile) {

                return {

                    ...oldProfile,

                    followers:
                        unfollowResponse.followersCount,

                    following:
                        oldProfile.following

                };

            });


            // =================================
            // UPDATE FOLLOW STATUS
            // =================================

            setFollowStatus(null);


            return;

        }


        // =================================
        // ALREADY PENDING
        // =================================

        if (
            followStatus ===
            "pending"
        ) {

            console.log(
                "FOLLOW REQUEST ALREADY SENT"
            );

            return;

        }


        // =================================
        // SEND FOLLOW REQUEST
        // =================================

        const followResponse =
            await api(
                "/follow/" +
                profile.id,
                {
                    method: "POST"
                }
            );


        console.log(
            "PROFILE FOLLOW RESPONSE:",
            followResponse
        );


        // =================================
        // REQUEST SENT
        // =================================

        if (
            followResponse.message ===
                "Follow Request Sent" ||
            followResponse.message ===
                "Follow Request Already Sent"
        ) {

            setFollowStatus(
                "pending"
            );

        }


        // =================================
        // ALREADY FOLLOWING
        // =================================

        if (
            followResponse.message ===
            "Already Following"
        ) {

            setFollowStatus(
                "accepted"
            );


            setProfile(function (oldProfile) {

                return {

                    ...oldProfile,

                    followers:
                        followResponse.followersCount,

                    following:
                        oldProfile.following

                };

            });

        }

    }
    catch (error) {

        console.error(
            "PROFILE FOLLOW ERROR:",
            error
        );

    }

}


    // ===========================
    // LOADING
    // ===========================

    if (
        loading ||
        !profile
    ) {

        return (

            <div className="Profile-page">

                <div className="profile-loading">

                    Loading...

                </div>

            </div>

        );

    }


    // ===========================
    // OWN PROFILE
    // ===========================

    const isOwnProfile =
        !username;


    // ===========================
    // MAIN UI
    // ===========================

    return (

        <div className="Profile-page">


            {/* ===========================
                PROFILE NAVBAR
            =========================== */}

            <div className="profile-nav">

                <div className="profile-nav-left">

                    <span
                        className="profile-back-btn"
                        onClick={handleBack}
                        title="Back"
                    >

                        <FiArrowLeft />

                    </span>


                    <p>

                        {profile.username}

                    </p>

                </div>


                <div className="profile-nav-right">

                    <span
                        className="profile-nav-icon"
                        onClick={handleSaved}
                        title="Saved"
                    >

                        <FiGrid />

                    </span>


                    <span
                        className="profile-nav-icon"
                        onClick={handleSettings}
                        title="Settings"
                    >

                        <FiMoreHorizontal />

                    </span>

                </div>

            </div>


            {/* ===========================
                PROFILE HEADER
            =========================== */}

            <div className="profile-friends">

                <div className="profile-friends-image">

                    <img
                        src={profile.image}
                        alt={profile.username}
                    />

                </div>


                <div className="profile-stats">

                    {/* POSTS */}

                    <span
                        className="stat-item"
                        onClick={handlePosts}
                    >

                        <span className="stat-number">

                            {profile.posts}

                        </span>

                        <span className="stat-label">

                            Posts

                        </span>

                    </span>


                    {/* FOLLOWERS */}

                    <span
                        className="stat-item"
                        onClick={handleFollowers}
                    >

                        <span className="stat-number">

                            {profile.followers}

                        </span>

                        <span className="stat-label">

                            Followers

                        </span>

                    </span>


                    {/* FOLLOWING */}

                    <span
                        className="stat-item"
                        onClick={handleFollowing}
                    >

                        <span className="stat-number">

                            {profile.following}

                        </span>

                        <span className="stat-label">

                            Following

                        </span>

                    </span>

                </div>

            </div>


            {/* ===========================
                PROFILE BIO
            =========================== */}

            <div className="profile-bio">

                <h1>

                    {profile.fullName}

                </h1>


                {profile.bio && (

                    <p>

                        {profile.bio}

                    </p>

                )}


                {profile.profession && (

                    <p>

                        {profile.profession}

                    </p>

                )}


                {/* ===========================
                    MUTUAL FOLLOWERS
                =========================== */}

                {!isOwnProfile &&
                    mutualFollowers.length > 0 && (

                    <p className="profile-mutual-followers">

                        Followed by{" "}

                        {mutualFollowers
                            .slice(0, 2)
                            .map(function (
                                user,
                                index
                            ) {

                                return (

                                    <span
                                        key={
                                            user._id ||
                                            user.id ||
                                            user.username
                                        }
                                        className="profile-mutual-username"
                                    >

                                        @{user.username}

                                        {index <
                                            Math.min(
                                                mutualFollowers.length,
                                                2
                                            ) - 1
                                            ? ", "
                                            : ""
                                        }

                                    </span>

                                );

                            })
                        }


                        {mutualFollowers.length > 2 && (

                            <span>

                                {" "}and{" "}

                                {mutualFollowers.length - 2}

                                {" "}

                                {
                                    mutualFollowers.length - 2 === 1
                                        ? "other"
                                        : "others"
                                }

                            </span>

                        )}

                    </p>

                )}


                {/* ===========================
                    OWN PROFILE BUTTONS
                =========================== */}

                {isOwnProfile && (

                    <div className="profile-action-buttons">

                        <button
                            className="profile-edit-btn"
                            onClick={
                                handleEditProfile
                            }
                        >

                            Edit profile

                        </button>


                        <button
                            className="profile-share-btn"
                            onClick={
                                handleShareProfile
                            }
                        >

                            Share profile

                        </button>

                    </div>

                )}


                {/* ===========================
                    OTHER USER BUTTONS
                =========================== */}

                {!isOwnProfile && (

                    <div className="profile-other-buttons">

                        {/* FOLLOW */}

                        <button
                            className={
                                followStatus === "pending" ||
                                followStatus === "accepted"
                                    ? "profile-follow-btn following"
                                    : "profile-follow-btn"
                            }
                            onClick={handleFollow}
                        >

                            {
                                followStatus === "pending"
                                    ? "Requested"
                                    : followStatus === "accepted"
                                        ? "Following"
                                        : "Follow"
                            }

                        </button>


                        {/* MESSAGE */}

                        <button
                            className="profile-message-btn"
                            onClick={function () {

                                navigate(
                                    "/chat",
                                    {
                                        state: {
                                            user: {

                                                id:
                                                    profile.id,

                                                _id:
                                                    profile.id,

                                                name:
                                                    profile.username,

                                                username:
                                                    profile.username,

                                                fullName:
                                                    profile.fullName,

                                                avatar:
                                                    profile.image

                                            }
                                        }
                                    }
                                );

                            }}
                        >

                            Message

                        </button>

                    </div>

                )}

            </div>


            {/* ===========================
                PROFILE TABS
            =========================== */}

            <div className="profile-tabs">

                <span
                    className={
                        activeTab === "Posts"
                            ? "tab active"
                            : "tab"
                    }
                    onClick={handlePosts}
                >

                    <FiGrid />

                    <p>
                        Posts
                    </p>

                </span>


                <span
                    className={
                        activeTab === "Reels"
                            ? "tab active"
                            : "tab"
                    }
                    onClick={handleProfileReels}
                >

                    <FiVideo />

                    <p>
                        Reels
                    </p>

                </span>


                <span
                    className={
                        activeTab === "Tagged"
                            ? "tab active"
                            : "tab"
                    }
                    onClick={handleTagged}
                >

                    <FiBookmark />

                    <p>
                        Tagged
                    </p>

                </span>

            </div>


            {/* ===========================
                PROFILE GRID
            =========================== */}
<div className="profile-grid">

    {postsLoading ? (

        <div className="profile-posts-loading">
            Loading posts...
        </div>

    ) : activeTab === "Tagged" ? (

        <div className="profile-no-posts">
            No tagged posts yet
        </div>

    ) : activeTab === "Reels" ? (

        userReels.length > 0 ? (

            userReels.map(function (reel) {

                return (

                    <div
                        className="profile-grid-item"
                        key={
                            "reel-" +
                            reel._id
                        }
                        onClick={function () {
    navigate(
        "/reels",
        {
            state: {
                reelId: reel._id
            }
        }
    );
}}
                    >

                        <video
                            src={
                                reel.video &&
                                (
                                    reel.video.startsWith("http://") ||
                                    reel.video.startsWith("https://")
                                )
                                    ? reel.video
                                    : "https://localhost:3000" +
                                      (reel.video || "")
                            }
                            muted
                            playsInline
                            preload="metadata"
                        />

                        <span className="profile-reel-play">
                            <FiVideo />
                        </span>

                    </div>

                );

            })

        ) : (

            <div className="profile-no-posts">
                No reels yet
            </div>

        )

    ) : (

        (userPosts.length + userReels.length) > 0 ? (

            [
                ...userPosts.map(function (post) {

                    return {
                        type: "post",
                        data: post
                    };

                }),

                ...userReels.map(function (reel) {

                    return {
                        type: "reel",
                        data: reel
                    };

                })

            ].map(function (item) {

                if (item.type === "post") {

                    const post = item.data;

                    return (

                        <div
                            className="profile-grid-item"
                            key={
                                "post-" +
                                post._id
                            }
                            onClick={function () {

                                navigate(
                                    "/post/" +
                                    post._id
                                );

                            }}
                        >

                            <img
                                src={post.image}
                                alt={
                                    post.caption ||
                                    "Post"
                                }
                            />

                        </div>

                    );

                }

                const reel = item.data;

                return (

                    <div
                        className="profile-grid-item"
                        key={
                            "reel-" +
                            reel._id
                        }
                    onClick={function () {

    navigate(
        "/reels",
        {
            state: {
                reelId: reel._id
            }
        }
    );

}}
                    >

                        <video
                            src={
                                reel.video &&
                                (
                                    reel.video.startsWith("http://") ||
                                    reel.video.startsWith("https://")
                                )
                                    ? reel.video
                                    : "https://localhost:3000" +
                                      (reel.video || "")
                            }
                            muted
                            playsInline
                            preload="metadata"
                        />

                        <span className="profile-reel-play">
                            <FiVideo />
                        </span>

                    </div>

                );

            })

        ) : (

            <div className="profile-no-posts">
                No posts yet
            </div>

        )

    )}

</div>


            {/* ===========================
                BOTTOM NAV
            =========================== */}

            <div className="profile-bottom-nav">

                <span
                    className="icon-btn"
                    onClick={handleHome}
                    title="Home"
                >

                    <FiHome />

                </span>


                <span
                    className="icon-btn"
                    onClick={handleSearch}
                    title="Search"
                >

                    <FiSearch />

                </span>


                <span
                    className="icon-btn"
                    onClick={handleCreate}
                    title="Create"
                >

                    <FiPlusSquare />

                </span>


                <span
                    className="icon-btn"
                    onClick={handleReels}
                    title="Reels"
                >

                    <FiVideo />

                </span>


                <span
                    className="icon-btn"
                    onClick={handleProfile}
                    title="Profile"
                >

                    <FiUser />

                </span>

            </div>


            {/* ===========================
                SHARE PROFILE MODAL
            =========================== */}

            {showShare && (

                <div
                    className="profile-share-overlay"
                    onClick={handleCloseShare}
                >

                    <div
                        className="profile-share-box"
                        onClick={function (event) {

                            event.stopPropagation();

                        }}
                    >

                        <div className="profile-share-header">

                            <h2>
                                Share profile
                            </h2>


                            <button
                                onClick={
                                    handleCloseShare
                                }
                            >

                                ×

                            </button>

                        </div>


                        <p className="profile-share-link">

                            {getProfileLink()}

                        </p>


                        <div className="profile-share-actions">

                            <button
                                onClick={
                                    handleCopyLink
                                }
                            >

                                <FiLink />

                                <span>

                                    {
                                        copied
                                            ? "Copied!"
                                            : "Copy link"
                                    }

                                </span>

                            </button>


                            <button
                                onClick={
                                    handleNativeShare
                                }
                            >

                                <FiShare2 />

                                <span>

                                    Share link

                                </span>

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Profile;