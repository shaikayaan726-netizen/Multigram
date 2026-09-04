import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    FiArrowLeft,
    FiHeart,
    FiMessageCircle,
    FiSend,
    FiBookmark,
    FiMoreVertical,
    FiMusic,
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiVideo,
    FiUser,
    FiVolume2,
    FiVolumeX
} from "react-icons/fi";


function Reels() {

    const navigate = useNavigate();
    const location = useLocation();

    const reelContainerRef =
        useRef(null);

    const reelVideoRefs =
        useRef([]);


    // ==========================================
    // STARTER REELS
    // ==========================================

    const starterReels = [
    {
        _id: "starter-1",
        video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "Welcome to Reels 🎬",
        author: {
            username: "reels",
            profilePicture: ""
        },
        music: {
            title: "Original audio"
        },
        likes: [],
        comments: []
    },

    {
        _id: "starter-2",
        video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "Explore something new ✨",
        author: {
            username: "explore",
            profilePicture: ""
        },
        music: {
            title: "Original audio"
        },
        likes: [],
        comments: []
    },

    {
        _id: "starter-3",
        video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "Just enjoy the moment 😄",
        author: {
            username: "fun",
            profilePicture: ""
        },
        music: {
            title: "Trending audio"
        },
        likes: [],
        comments: []
    },

    {
        _id: "starter-4",
        video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "Take a break and enjoy 🌍",
        author: {
            username: "travel",
            profilePicture: ""
        },
        music: {
            title: "Travel audio"
        },
        likes: [],
        comments: []
    },

    {
        _id: "starter-5",
        video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        caption: "Another reel for you 🎥",
        author: {
            username: "creator",
            profilePicture: ""
        },
        music: {
            title: "Original audio"
        },
        likes: [],
        comments: []
    }
];
    // ==========================================
    // REELS
    // ==========================================

    const [reels, setReels] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // ==========================================
    // ACTIVE REEL
    // ==========================================

    const [activeIndex, setActiveIndex] =
        useState(0);

const [isMuted, setIsMuted] =
    useState(false);
    // ==========================================
    // LIKE
    // ==========================================

    const [liked, setLiked] =
        useState(false);

const [likeLoading, setLikeLoading] =
    useState(false);

    // ==========================================
// CURRENT USER
// ==========================================

const [currentUser, setCurrentUser] =
    useState(null);
    // ==========================================
    // SAVE
    // ==========================================

    const [saved, setSaved] =
        useState(false);

const [comments, setComments] =
    useState([]);

const [commentsOpen, setCommentsOpen] =
    useState(false);

const [commentsLoading, setCommentsLoading] =
    useState(false);
    const [commentText, setCommentText] =
    useState("");

const [replyTarget, setReplyTarget] =
    useState(null);

const [likedComments, setLikedComments] =
    useState([]);

const [likedReplies, setLikedReplies] =
    useState([]);

// ==========================================
// SHARE REEL
// ==========================================

const [shareOpen, setShareOpen] =
    useState(false);

const [shareLoading, setShareLoading] =
    useState(false);

const [shareTab, setShareTab] =
    useState("recent");

const [shareSearch, setShareSearch] =
    useState("");

const [shareUsers, setShareUsers] =
    useState({
        recent: [],
        followers: [],
        following: []
    });

const [shareSendingId, setShareSendingId] =
    useState(null);

function getReelUserImage(userData) {

    if (userData && userData.profilePicture) {
        if (userData.profilePicture.startsWith("http")) {
            return userData.profilePicture;
        }
        return "https://localhost:3000" + userData.profilePicture;
    }

    return "/default-avatar.jpg";
}
    // ==========================================
    // CREATE MENU
    // ==========================================

    const [createMenuOpen, setCreateMenuOpen] =
        useState(false);


    // ==========================================
    // ACTIVE VIDEO CONTROL
    // ==========================================

// ==========================================
// ACTIVE VIDEO CONTROL
// ==========================================

useEffect(function () {

    reelVideoRefs.current.forEach(
        function (video, index) {

            if (!video) {
                return;
            }

            video.muted = isMuted;

            if (index === activeIndex) {

                video.currentTime =
                    video.currentTime || 0;

                video.play().catch(
                    function () {
                        // Browser autoplay policy
                    }
                );

            } else {

                video.pause();

            }

        }
    );

}, [activeIndex, reels, isMuted]);



// ==========================================
// KEEP ACTIVE VIDEO AUDIO STATE
// ==========================================

useEffect(function () {

    const video =
        reelVideoRefs.current[activeIndex];

    if (!video) {
        return;
    }

    video.muted = isMuted;

    video.play().catch(
        function () {}
    );

}, [activeIndex, isMuted]);
// ==========================================
    // LOAD REELS
    // ==========================================

    useEffect(function () {

        async function loadReels() {

            try {

                setLoading(true);

                setError("");


                const token =
                    localStorage.getItem("token");


               const savedPage =
    Number(
        localStorage.getItem(
            "reelsFeedPage"
        ) || "0"
    );

const nextPage =
    savedPage + 1;

localStorage.setItem(
    "reelsFeedPage",
    String(nextPage)
);

const response =
    await fetch(
        "/api/reels?page=" +
        nextPage,
        {
            headers: token
                ? {
                    Authorization:
                        "Bearer " +
                        token
                }
                : {}
        }
    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load reels"
                    );

                }


                const data =
                    await response.json();


                const serverReels =
                    Array.isArray(data.reels)
                        ? data.reels
                        : [];

                const requestedReelId =
    location.state?.reelId;

let finalReels = serverReels;

if (requestedReelId) {
    try {
        const singleResponse =
            await fetch(
                "/api/reels/" +
                requestedReelId,
                {
                    headers: token
                        ? {
                            Authorization:
                                "Bearer " + token
                        }
                        : {}
                }
            );

        if (singleResponse.ok) {
            const singleData =
                await singleResponse.json();

            const requestedReel =
                singleData.reel ||
                singleData;

            if (
                requestedReel &&
                requestedReel._id
            ) {
                finalReels = [
                    requestedReel,
                    ...serverReels.filter(
                        function (item) {
                            return (
                                String(item._id) !==
                                String(requestedReel._id)
                            );
                        }
                    )
                ];
            }
        }
    }
    catch (singleReelError) {
        console.error(
            "LOAD REQUESTED REEL ERROR:",
            singleReelError
        );
    }
}
             if (finalReels.length > 0) {
    setReels(finalReels);

    const requestedReelId =
        location.state?.reelId;

    if (requestedReelId) {
        const requestedIndex =
            serverReels.findIndex(
                function (item) {
                    return (
                        String(item._id) ===
                        String(requestedReelId)
                    );
                }
            );

        if (requestedIndex >= 0) {
            setActiveIndex(
                requestedIndex
            );
        }
    }
}
else {
    setReels(starterReels);
}

            }
            catch (err) {

                console.error(
                    "LOAD REELS ERROR:",
                    err
                );


                // API fail ho tab bhi
                // starter reels dikhao

                setReels(starterReels);

                setError("");

            }
            finally {

                setLoading(false);

            }

        }


        loadReels();

    }, [location.state]);


    // ==========================================
    // ACTIVE REEL DETECTION
    // ==========================================

    useEffect(function () {

        const container =
            reelContainerRef.current;


        if (!container) {

            return;

        }


        function handleScroll() {

            const height =
                container.clientHeight;


            if (!height) {

                return;

            }


            const index =
                Math.round(
                    container.scrollTop /
                    height
                );


            setActiveIndex(
                Math.max(
                    0,
                    Math.min(
                        index,
                        reels.length - 1
                    )
                )
            );

        }


        container.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        return function () {

            container.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, [reels.length]);


    // ==========================================
    // RESET LIKE / SAVE ON REEL CHANGE
    // ==========================================

  // ==========================================
// RESET LIKE / SAVE ON REEL CHANGE
// ==========================================

useEffect(function () {

    const reel =
        reels[activeIndex];

    const userId =
        currentUser?._id ||
        currentUser?.id;


    const isLiked =
        Array.isArray(reel?.likes) &&
        userId &&
        reel.likes.some(function (id) {

            return (
                id != null &&
                id.toString() ===
                userId.toString()
            );

        });


    const isSaved =
        Array.isArray(reel?.saves) &&
        userId &&
        reel.saves.some(function (id) {

            return (
                id != null &&
                id.toString() ===
                userId.toString()
            );

        });


    setLiked(
        !!isLiked
    );

    setSaved(
        !!isSaved
    );

}, [activeIndex, reels, currentUser]);

    // ==========================================
// LOAD CURRENT USER
// ==========================================

useEffect(function () {

    async function loadCurrentUser() {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                return;
            }

            const data =
                await fetch(
                    "/api/auth/me",
                    {
                        headers: {
                            Authorization:
                                "Bearer " +
                                token
                        }
                    }
                );

            if (!data.ok) {
                return;
            }

            const result =
                await data.json();

            setCurrentUser(
                result.user || result
            );

        }
        catch (error) {

            console.error(
                "REELS USER ERROR:",
                error
            );

        }

    }

    loadCurrentUser();

}, []);
// ==========================================
// REEL LIKE / UNLIKE
// ==========================================

// ==========================================
// REEL LIKE / UNLIKE
// ==========================================

async function handleReelLike(reel) {

    if (
        !reel ||
        !reel._id ||
        likeLoading
    ) {
        return;
    }

    try {

        setLikeLoading(true);

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                "/api/reels/" +
                reel._id +
                "/like",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            "Bearer " +
                            token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to like reel"
            );

        }


        const data =
            await response.json();


        const userId =
            currentUser?._id ||
            currentUser?.id;


        setReels(function (previous) {

            return previous.map(
                function (item) {

                    if (
                        item._id !==
                        reel._id
                    ) {
                        return item;
                    }


                    let likes =
                        Array.isArray(
                            item.likes
                        )
                            ? [...item.likes]
                            : [];


                    if (data.liked) {

                        if (
                            userId &&
                            !likes.some(
                                function (id) {

                                    return (
                                        id != null &&
                                        id.toString() ===
                                        userId.toString()
                                    );

                                }
                            )
                        ) {

                            likes.push(
                                userId
                            );

                        }

                    }
                    else {

                        likes =
                            likes.filter(
                                function (id) {

                                    return (
                                        !userId ||
                                        id == null ||
                                        id.toString() !==
                                        userId.toString()
                                    );

                                }
                            );

                    }


                    return {
                        ...item,
                        likes
                    };

                }
            );

        });


        setLiked(
            data.liked
        );

    }
    catch (error) {

        console.error(
            "REEL LIKE ERROR:",
            error
        );

    }
    finally {

        setLikeLoading(
            false
        );

    }

}
// ==========================================
// REEL SAVE / UNSAVE
// ==========================================

async function handleReelSave(reel) {

    if (
        !reel ||
        !reel._id ||
        reel._id.startsWith("starter-")
    ) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                "/api/reels/" +
                reel._id +
                "/save",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to save reel"
            );

        }


        const data =
            await response.json();


        const userId =
            currentUser?._id ||
            currentUser?.id;


        // ======================================
        // UPDATE REEL SAVES LOCALLY
        // ======================================

        setReels(function (previous) {

            return previous.map(
                function (item) {

                    if (
                        item._id !==
                        reel._id
                    ) {

                        return item;

                    }


                    let saves =
                        Array.isArray(
                            item.saves
                        )
                            ? [...item.saves]
                            : [];


                    if (data.saved) {

                        if (
                            userId &&
                            !saves.some(
                                function (id) {

                                    return (
                                        id != null &&
                                        id.toString() ===
                                        userId.toString()
                                    );

                                }
                            )
                        ) {

                            saves.push(
                                userId
                            );

                        }

                    }
                    else {

                        saves =
                            saves.filter(
                                function (id) {

                                    return (
                                        !userId ||
                                        id == null ||
                                        id.toString() !==
                                        userId.toString()
                                    );

                                }
                            );

                    }


                    return {
                        ...item,
                        saves
                    };

                }
            );

        });


        // ======================================
        // UPDATE SAVE BUTTON
        // ======================================

        setSaved(
            data.saved
        );

    }
    catch (error) {

        console.error(
            "REEL SAVE ERROR:",
            error
        );

    }

}
async function loadReelComments(reelId) {

    if (!reelId || reelId.startsWith("starter-")) {
        setComments([]);
        return;
    }

    try {

        setCommentsLoading(true);

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                "/api/reel-comments/" +
                reelId,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            token
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "Failed to load reel comments"
            );
        }

        const data =
            await response.json();

        setComments(
            Array.isArray(data.comments)
                ? data.comments
                : []
        );

    }
    catch (error) {

        console.error(
            "LOAD REEL COMMENTS ERROR:",
            error
        );

        setComments([]);

    }
    finally {

        setCommentsLoading(false);

    }

}
async function handleAddReelComment() {

    if (!commentText.trim()) {
        return;
    }

    const reel = reels[activeIndex];

    if (
        !reel ||
        !reel._id ||
        reel._id.startsWith("starter-")
    ) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token");

        const body = {
            text: commentText.trim()
        };

        if (replyTarget) {
            body.parentComment =
                replyTarget._id;
        }

        const response =
            await fetch(
                "/api/reel-comments/" +
                reel._id,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer " +
                            token
                    },

                    body:
                        JSON.stringify(body)
                }
            );

        if (!response.ok) {
            throw new Error(
                "Failed to add reel comment"
            );
        }

        const data =
            await response.json();

        const newComment =
            data.comment;

        if (!newComment) {
            return;
        }

        if (replyTarget) {

            setComments(
                function (oldComments) {

                    return oldComments.map(
                        function (comment) {

                            if (
                                comment._id ===
                                replyTarget._id
                            ) {

                                return {
                                    ...comment,

                                    replies: [
                                        ...(comment.replies || []),
                                        newComment
                                    ]
                                };

                            }

                            return comment;

                        }
                    );

                }
            );

        }
        else {

            setComments(
                function (oldComments) {

                    return [
                        ...oldComments,
                        newComment
                    ];

                }
            );

        }

        setCommentText("");
        setReplyTarget(null);

    }
    catch (error) {

        console.error(
            "CREATE REEL COMMENT ERROR:",
            error
        );

        alert(
            error.message ||
            "Comment post nahi hua"
        );

    }

}
    // ==========================================
    // REEL COMMENT REPLY
    // ==========================================

    function handleReelReply(comment) {
        setReplyTarget(comment);
        setCommentText(
            "@" + (comment.author?.username || "") + " "
        );
    }


    // ==========================================
    // REEL COMMENT / REPLY LIKE
    // ==========================================

    async function handleReelCommentLike(commentId, isReply) {

        if (!commentId) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "/api/comments/" + commentId + "/like",
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to like comment");
            }

            const data = await response.json();
            const likesCount = Number(data.likes || 0);

            setComments(function (oldComments) {
                return oldComments.map(function (comment) {

                    if (!isReply && comment._id === commentId) {
                        return {
                            ...comment,
                            likes: Array(likesCount).fill(null)
                        };
                    }

                    if (Array.isArray(comment.replies)) {
                        return {
                            ...comment,
                            replies: comment.replies.map(function (reply) {
                                if (isReply && reply._id === commentId) {
                                    return {
                                        ...reply,
                                        likes: Array(likesCount).fill(null)
                                    };
                                }
                                return reply;
                            })
                        };
                    }

                    return comment;
                });
            });

            if (isReply) {
                setLikedReplies(function (oldLiked) {
                    if (data.liked) {
                        return oldLiked.includes(commentId)
                            ? oldLiked
                            : [...oldLiked, commentId];
                    }
                    return oldLiked.filter(function (id) {
                        return id !== commentId;
                    });
                });
            } else {
                setLikedComments(function (oldLiked) {
                    if (data.liked) {
                        return oldLiked.includes(commentId)
                            ? oldLiked
                            : [...oldLiked, commentId];
                    }
                    return oldLiked.filter(function (id) {
                        return id !== commentId;
                    });
                });
            }

        } catch (error) {
            console.error("REEL COMMENT LIKE ERROR:", error);
        }
    }


    // ==========================================
    // SHARE USER FORMAT
    // ==========================================

    function formatShareUser(userData) {

        if (!userData) {
            return null;
        }

        const user = userData.user || userData;

        const id =
            user._id ||
            user.id ||
            null;

        if (!id) {
            return null;
        }

        return {
            ...user,
            id: id,
            _id: user._id || id,
            username: user.username || user.name || "User",
            fullName: user.fullName || "",
            profilePicture:
                user.profilePicture ||
                user.image ||
                user.avatar ||
                ""
        };
    }


    // ==========================================
    // OPEN SHARE PANEL
    // ==========================================

    async function handleOpenShare() {

        setShareOpen(true);
        setShareSearch("");
        setShareLoading(true);

        try {

            const token =
                localStorage.getItem("token");

            const headers = {
                Authorization:
                    "Bearer " + token
            };

            const results =
                await Promise.all([
                    fetch("/api/followers", {
                        headers
                    }),
                    fetch("/api/following", {
                        headers
                    }),
                    fetch("/api/messages", {
                        headers
                    })
                ]);

            const followersData =
                results[0].ok
                    ? await results[0].json()
                    : {};

            const followingData =
                results[1].ok
                    ? await results[1].json()
                    : {};

            const messagesData =
                results[2].ok
                    ? await results[2].json()
                    : {};

            const currentUserId =
                currentUser?._id ||
                currentUser?.id;

            function withoutCurrent(list) {
                return list
                    .map(formatShareUser)
                    .filter(function (user) {
                        if (!user) {
                            return false;
                        }

                        return (
                            !currentUserId ||
                            String(user.id) !==
                            String(currentUserId)
                        );
                    });
            }

            const followers =
                Array.isArray(followersData.followers)
                    ? withoutCurrent(followersData.followers)
                    : [];

            const following =
                Array.isArray(followingData.following)
                    ? withoutCurrent(followingData.following)
                    : [];

            const recent =
                Array.isArray(messagesData.conversations)
                    ? withoutCurrent(messagesData.conversations)
                    : [];

            setShareUsers({
                recent: recent,
                followers: followers,
                following: following
            });

            if (recent.length > 0) {
                setShareTab("recent");
            } else if (followers.length > 0) {
                setShareTab("followers");
            } else {
                setShareTab("following");
            }

        }
        catch (error) {

            console.error(
                "LOAD REEL SHARE USERS ERROR:",
                error
            );

            setShareUsers({
                recent: [],
                followers: [],
                following: []
            });
        }
        finally {
            setShareLoading(false);
        }
    }


    // ==========================================
    // SEND REEL TO CHAT
    // ==========================================

    async function handleSendReel(user) {

        const reel = reels[activeIndex];

        const receiverId =
            user?._id ||
            user?.id;

        if (!reel || !receiverId) {
            return;
        }

        try {

            setShareSendingId(
                String(receiverId)
            );

            const token =
                localStorage.getItem("token");

            const reelData = {
                reelId:
                    String(reel._id || ""),
                video:
                    reel.video || "",
                caption:
                    reel.caption || "",
                author: {
                    username:
                        reel.author?.username ||
                        "user",
                    profilePicture:
                        reel.author?.profilePicture ||
                        ""
                }
            };

            const shareText =
                "__REEL_SHARE__" +
                encodeURIComponent(
                    JSON.stringify(reelData)
                );

            const response =
                await fetch(
                    "/api/messages",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                "Bearer " + token
                        },
                        body: JSON.stringify({
                            receiver:
                                receiverId,
                            text: shareText
                        })
                    }
                );

            const data =
                await response.json().catch(
                    function () {
                        return {};
                    }
                );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to share reel"
                );
            }

            const chatUser = {
                ...user,
                id: receiverId,
                name:
                    user.username ||
                    user.fullName ||
                    "User",
                username:
                    user.username ||
                    "User",
                avatar:
                    getReelUserImage(user),
                image:
                    getReelUserImage(user),
                profilePicture:
                    user.profilePicture ||
                    ""
            };

            setShareOpen(false);

            navigate(
                "/chat",
                {
                    state: {
                        user: chatUser
                    }
                }
            );

        }
        catch (error) {

            console.error(
                "SEND REEL ERROR:",
                error
            );

            alert(
                error.message ||
                "Failed to share reel"
            );
        }
        finally {
            setShareSendingId(null);
        }
    }


    // ==========================================
    // SHARE SEARCH / CURRENT LIST
    // ==========================================

    const currentShareUsers =
        Array.isArray(shareUsers[shareTab])
            ? shareUsers[shareTab]
            : [];

    const visibleShareUsers =
        currentShareUsers.filter(
            function (user) {

                const query =
                    shareSearch
                        .trim()
                        .toLowerCase();

                if (!query) {
                    return true;
                }

                return (
                    (user.username || "")
                        .toLowerCase()
                        .includes(query) ||
                    (user.fullName || "")
                        .toLowerCase()
                        .includes(query)
                );
            }
        );


    // ==========================================
    // CREATE POST
    // ==========================================

    function handleCreatePost() {

        setCreateMenuOpen(false);

        navigate("/postgallery");

    }


    // ==========================================
    // CREATE STORY
    // ==========================================

    function handleCreateStory() {

        setCreateMenuOpen(false);

        navigate("/createstory");

    }


    // ==========================================
    // CREATE REEL
    // ==========================================

    function handleCreateReel() {

        setCreateMenuOpen(false);

        navigate("/reelcreate");

    }


    // ==========================================
    // SCROLL TO REEL
    // ==========================================

    function scrollToReel(index) {

        const container =
            reelContainerRef.current;


        if (!container) {

            return;

        }


        const safeIndex =
            Math.max(
                0,
                Math.min(
                    index,
                    reels.length - 1
                )
            );


        container.scrollTo({

            top:
                safeIndex *
                container.clientHeight,

            behavior:
                "smooth"

        });

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="reels-page">

                <div className="reels-loading">

                    Loading reels...

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR / EMPTY
    // ==========================================

    if (
        error &&
        reels.length === 0
    ) {

        return (

            <div className="reels-page">

                <div className="reels-empty">

                    <button
                        className="reel-icon"
                        onClick={function () {

                            navigate("/home");

                        }}
                    >

                        <FiArrowLeft />

                    </button>


                    <FiVideo
                        className="empty-reel-icon"
                    />


                    <h2>
                        No reels yet
                    </h2>


                    <p>
                        Apna pehla reel create karo.
                    </p>


                    <button
                        className="create-first-reel"
                        onClick={handleCreateReel}
                    >

                        Create Reel

                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // REELS PAGE
    // ==========================================

    return (

        <div
            className="reels-page"
            ref={reelContainerRef}
        >

            {reels.map(function (reel, index) {

                const author =
                    reel.author || {};


                const isActive =
                    index === activeIndex;


                const videoUrl =
    reel.video || "";

const isYouTubeReel =
    reel.source === "youtube" ||
    videoUrl.includes("youtube.com/embed/") ||
    videoUrl.includes("youtu.be/");


                return (

                    <div
                        className="reel"
                        key={reel._id}
                    >

                        {/* ===========================
                            VIDEO
                        =========================== */}

    {
    isYouTubeReel ? (
        isActive ? (
            <iframe
                className="reel-video"
                src={
                    videoUrl +
                    "?autoplay=1" +
                    "&mute=" +
                    (isMuted ? "1" : "0") +
                    "&playsinline=1" +
                    "&controls=0" +
                    "&rel=0" +
                    "&modestbranding=1" +
                    "&enablejsapi=1" +
                    "&origin=" +
                    encodeURIComponent(
                        window.location.origin
                    )
                }
                title={
                    reel.caption ||
                    "Reel video"
                }
                allow={
                    "autoplay; encrypted-media; picture-in-picture"
                }
                allowFullScreen
                frameBorder="0"
                loading="eager"
            />
        ) : (
            <div
                className="reel-video"
                style={{
                    background:
                        "#000"
                }}
            />
        )
    ) : (
        <video
            ref={function (element) {
                reelVideoRefs.current[index] =
                    element;
            }}
            className="reel-video"
            src={videoUrl}
            muted={isMuted}
            loop
            playsInline
            autoPlay={isActive}
            preload={
                isActive
                    ? "auto"
                    : "none"
            }
            onLoadedMetadata={
                function (event) {
                    if (
                        index ===
                        activeIndex
                    ) {
                        const video =
                            event.currentTarget;

                        video.muted =
                            isMuted;

                        video.play().catch(
                            function () {}
                        );
                    }
                }
            }
        />
    )
}

                        {/* ===========================
                            DARK OVERLAY
                        =========================== */}

                        <div className="reel-overlay">
                        </div>


                        {/* ===========================
                            TOP BAR
                        =========================== */}

                        <div className="reel-top">

                            <button
                                className="reel-icon"
                                onClick={
                                    function () {

                                        navigate(
                                            "/home"
                                        );

                                    }
                                }
                            >

                                <FiArrowLeft />

                            </button>


                            <h2>
                                Reels
                            </h2>


                            <button
                                className="reel-icon"
                                onClick={function () {

                                    const video =
                                        reelVideoRefs.current[activeIndex];

                                    const nextMuted =
                                        !isMuted;

                                    setIsMuted(nextMuted);

                                    if (video) {

                                        video.muted =
                                            nextMuted;

                                        if (!nextMuted) {

                                            video.play().catch(
                                                function () {}
                                            );

                                        }

                                    }

                                }}
                            >

                                {
                                    isMuted
                                        ? <FiVolumeX />
                                        : <FiVolume2 />
                                }

                            </button>


                            <button
                                className="reel-icon"
                            >

                                <FiMoreVertical />

                            </button>

                        </div>


                        {/* ===========================
                            RIGHT ACTIONS
                        =========================== */}

                        <div className="reel-actions">

                            {/* LIKE */}

                            <button
                                className={
                                    liked
                                        ? "reel-action liked"
                                        : "reel-action"
                                }

                              onClick={
    function () {

        handleReelLike(
            reel
        );

    }
}
                            >

                                <FiHeart />

                                <span>

                                    {
    reel.likes?.length ||
    0
}

                                </span>

                            </button>


                            {/* COMMENT */}

                           <button
    className="reel-action"
    onClick={function () {

        setCommentsOpen(true);

        loadReelComments(
            reel._id
        );

    }}
>

    <FiMessageCircle />

    <span>
        {
            reel.comments?.length ||
            0
        }
    </span>

</button>


                            {/* SHARE */}

                            <button
                                className="reel-action"
                                type="button"
                                onClick={handleOpenShare}
                            >

                                <FiSend />

                            </button>


                            {/* SAVE */}

                           <button
    className={
        saved
            ? "reel-action liked"
            : "reel-action"
    }

    onClick={
        function () {

            handleReelSave(
                reel
            );

        }
    }
>

    <FiBookmark />

</button>

                        </div>


                        {/* ===========================
                            REEL INFORMATION
                        =========================== */}

                        <div className="reel-info">

                            <div className="reel-user">

                             <img
  src={getReelUserImage(author)}
  alt=""
/>


                                <strong>

                                    {
                                        author.username ||
                                        "user"
                                    }

                                </strong>


                                <button>
                                    Follow
                                </button>

                            </div>


                            {/* CAPTION */}

                            {
                                reel.caption && (

                                    <p>
                                        {reel.caption}
                                    </p>

                                )
                            }


                            {/* MUSIC */}

                            <div className="reel-music">

                                <FiMusic />

                                <span>

                                    {
                                        reel.music?.title
                                            ? reel.music.title
                                            : "Original audio"
                                    }

                                    {" · "}

                                    {
                                        author.username ||
                                        "user"
                                    }

                                </span>

                            </div>

                        </div>


                    </div>

                );

            })}


            {/* ===========================
                CREATE MENU
            =========================== */}

            {
                createMenuOpen && (

                    <div className="reels-create-menu">

                        <div className="reels-create-title">

                            <h3>
                                Create
                            </h3>

                        </div>


                        <button
                            onClick={
                                handleCreatePost
                            }
                        >

                            <FiPlusSquare />

                            <span>
                                Create Post
                            </span>

                        </button>


                        <button
                            onClick={
                                handleCreateStory
                            }
                        >

                           <FiHeart
    fill={
        liked
            ? "currentColor"
            : "none"
    }
/>

                            <span>
                                Create Story
                            </span>

                        </button>


                        <button
                            onClick={
                                handleCreateReel
                            }
                        >

                            <FiVideo />

                            <span>
                                Create Reel
                            </span>

                        </button>


                        <button
                            className="reels-create-cancel"
                            onClick={
                                function () {

                                    setCreateMenuOpen(
                                        false
                                    );

                                }
                            }
                        >

                            Cancel

                        </button>

                    </div>

                )
            }

            {/* ===========================
                COMMENTS PANEL
            =========================== */}

            {
                commentsOpen && (

                    <div className="reel-comments-panel">

                        <div className="reel-comments-header">
                            <h3>Comments</h3>

                            <button
                                type="button"
                                onClick={function () {
                                    setCommentsOpen(false);
                                    setCommentText("");
                                    setReplyTarget(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="reel-comments-list">

                            {commentsLoading ? (
                                <div className="reel-comments-empty">
                                    Loading comments...
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="reel-comments-empty">
                                    No comments yet.
                                </div>
                            ) : (
                                comments.map(function (comment) {

                                    const commentLiked =
                                        likedComments.includes(comment._id);

                                    const commentLikes =
                                        Array.isArray(comment.likes)
                                            ? comment.likes.length
                                            : 0;

                                    return (
                                        <div
                                            className="reel-comment-block"
                                            key={comment._id}
                                        >

                                            <div className="reel-comment-row">

                                                <img
                                                    src={getReelUserImage(comment.author)}
                                                    alt=""
                                                    className="reel-comment-avatar"
                                                />

                                                <div className="reel-comment-content">

                                                    <div className="reel-comment-main">
                                                        <strong>
                                                            {comment.author?.username || comment.author?.fullName || "User"}
                                                        </strong>
                                                        <span>{comment.text}</span>
                                                    </div>

                                                    <div className="reel-comment-actions">
                                                        <span>{commentLikes} likes</span>

                                                        <button
                                                            type="button"
                                                            onClick={function () {
                                                                handleReelReply(comment);
                                                            }}
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>

                                                    {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                                                        <div className="reel-replies">
                                                            {comment.replies.map(function (reply) {

                                                                const replyLiked =
                                                                    likedReplies.includes(reply._id);

                                                                const replyLikes =
                                                                    Array.isArray(reply.likes)
                                                                        ? reply.likes.length
                                                                        : 0;

                                                                return (
                                                                    <div
                                                                        className="reel-reply-row"
                                                                        key={reply._id}
                                                                    >
                                                                        <img
                                                                            src={getReelUserImage(reply.author)}
                                                                            alt=""
                                                                            className="reel-comment-avatar"
                                                                        />

                                                                        <div className="reel-comment-content">
                                                                            <div className="reel-comment-main">
                                                                                <strong>
                                                                                    {reply.author?.username || reply.author?.fullName || "User"}
                                                                                </strong>
                                                                                <span>{reply.text}</span>
                                                                            </div>

                                                                            <div className="reel-comment-actions">
                                                                                <span>{replyLikes} likes</span>
                                                                            </div>
                                                                        </div>

                                                                        <button
                                                                            type="button"
                                                                            className={replyLiked ? "reel-comment-like liked" : "reel-comment-like"}
                                                                            onClick={function () {
                                                                                handleReelCommentLike(reply._id, true);
                                                                            }}
                                                                        >
                                                                            <FiHeart />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                </div>

                                                <button
                                                    type="button"
                                                    className={commentLiked ? "reel-comment-like liked" : "reel-comment-like"}
                                                    onClick={function () {
                                                        handleReelCommentLike(comment._id, false);
                                                    }}
                                                >
                                                    <FiHeart />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })
                            )}

                        </div>

                        <div className="reel-comment-input">

                            {replyTarget && (
                                <div className="reel-replying">
                                    Replying to @{replyTarget.author?.username || "user"}

                                    <button
                                        type="button"
                                        onClick={function () {
                                            setReplyTarget(null);
                                            setCommentText("");
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            <div className="reel-comment-input-row">

                                <img
                                    src={getReelUserImage(currentUser)}
                                    alt=""
                                />

                                <input
                                    type="text"
                                    placeholder={replyTarget ? "Reply..." : "Add a comment..."}
                                    value={commentText}
                                    onChange={function (event) {
                                        setCommentText(event.target.value);
                                    }}
                                    onKeyDown={function (event) {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleAddReelComment();
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleAddReelComment}
                                    disabled={!commentText.trim()}
                                >
                                    Post
                                </button>

                            </div>
                        </div>

                    </div>
                )
            }

            {/* ===========================
                SHARE REEL PANEL
            =========================== */}

            {shareOpen && (

                <div
                    className="reel-share-overlay"
                    onClick={function () {
                        setShareOpen(false);
                    }}
                >

                    <div
                        className="reel-share-panel"
                        onClick={function (event) {
                            event.stopPropagation();
                        }}
                    >

                        <div className="reel-share-header">

                            <h3>
                                Share reel
                            </h3>

                            <button
                                type="button"
                                onClick={function () {
                                    setShareOpen(false);
                                }}
                            >
                                ×
                            </button>

                        </div>

                        <input
                            className="reel-share-search"
                            type="text"
                            placeholder="Search"
                            value={shareSearch}
                            onChange={function (event) {
                                setShareSearch(
                                    event.target.value
                                );
                            }}
                        />

                        <div className="reel-share-tabs">

                            <button
                                type="button"
                                className={shareTab === "recent" ? "active" : ""}
                                onClick={function () {
                                    setShareTab("recent");
                                }}
                            >
                                Recent
                            </button>

                            <button
                                type="button"
                                className={shareTab === "followers" ? "active" : ""}
                                onClick={function () {
                                    setShareTab("followers");
                                }}
                            >
                                Followers
                            </button>

                            <button
                                type="button"
                                className={shareTab === "following" ? "active" : ""}
                                onClick={function () {
                                    setShareTab("following");
                                }}
                            >
                                Following
                            </button>

                        </div>

                        <div className="reel-share-users">

                            {shareLoading ? (

                                <div className="reel-share-empty">
                                    Loading people...
                                </div>

                            ) : visibleShareUsers.length === 0 ? (

                                <div className="reel-share-empty">
                                    No users found
                                </div>

                            ) : (

                                visibleShareUsers.map(function (user) {

                                    const userId =
                                        user._id ||
                                        user.id;

                                    const image =
                                        getReelUserImage(user);

                                    const isSending =
                                        shareSendingId ===
                                        String(userId);

                                    return (

                                        <div
                                            className="reel-share-user"
                                            key={String(userId)}
                                        >

                                            <img
                                                src={image}
                                                alt={user.username || "User"}
                                            />

                                            <div className="reel-share-user-info">
                                                <strong>
                                                    {user.username || "User"}
                                                </strong>
                                                <span>
                                                    {user.fullName || ""}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isSending}
                                                onClick={function () {
                                                    handleSendReel(user);
                                                }}
                                            >
                                                {isSending ? "Sending..." : "Send"}
                                            </button>

                                        </div>
                                    );
                                })

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* ===========================
                BOTTOM NAVIGATION
            =========================== */}

            {/* ===========================
                BOTTOM NAVIGATION
            =========================== */}

            <div className="reels-bottom-nav">

                {/* HOME */}

                <button
                    onClick={
                        function () {

                            navigate("/home");

                        }
                    }
                >

                    <FiHome />

                </button>


                {/* SEARCH */}

                <button
                    onClick={
                        function () {

                            navigate("/search");

                        }
                    }
                >

                    <FiSearch />

                </button>


                {/* CREATE */}

                <button
                    onClick={
                        function () {

                            setCreateMenuOpen(
                                !createMenuOpen
                            );

                        }
                    }
                >

                    <FiPlusSquare />

                </button>


                {/* REELS */}

                <button
                    className="active-reel"
                    onClick={
                        function () {

                            navigate("/reels");

                        }
                    }
                >

                    <FiVideo />

                </button>


                {/* PROFILE */}

                <button
                    onClick={
                        function () {

                            navigate("/profile");

                        }
                    }
                >

                    <FiUser />

                </button>

            </div>


            {/* ===========================
                UP BUTTON
            =========================== */}

            {
                activeIndex > 0 && (

                    <button
                        className="reel-prev-button"
                        onClick={
                            function () {

                                scrollToReel(
                                    activeIndex - 1
                                );

                            }
                        }
                    >

                        ↑

                    </button>

                )
            }


            {/* ===========================
                DOWN BUTTON
            =========================== */}

            {
                activeIndex <
                    reels.length - 1 && (

                    <button
                        className="reel-next-button"
                        onClick={
                            function () {

                                scrollToReel(
                                    activeIndex + 1
                                );

                            }
                        }
                    >

                        ↓

                    </button>

                )
            }


        </div>

    );

}


export default Reels;