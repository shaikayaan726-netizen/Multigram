
import { useNavigate , useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { getMediaUrl } from "../utils/mediaUtils";
import StoryViewer from "../components/StoryViewer";
import { useEffect, useState, useRef } from "react";
import {
    FiHeart,
    FiMessageCircle,
    FiSend,
    FiBookmark,
    FiHome,
    FiSearch,
    FiPlusSquare,
    FiVideo,
    FiUser,
    FiMoreVertical,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiCopy,
    FiLink,
    FiFlag
} from "react-icons/fi";


function Home() {

  const navigate = useNavigate();
const location = useLocation();


    // ===========================
    // Current User
    // ===========================

    const [user, setUser] = useState(null);

    const [userLoading, setUserLoading] =
        useState(true);

    const [userError, setUserError] =
        useState("");


    // ===========================
    // Create Menu
    // ===========================

    const [createMenuOpen, setCreateMenuOpen] =
        useState(false);


    // ===========================
    // Post Menu
    // ===========================

    const [openPostMenu, setOpenPostMenu] =
        useState(null);


    // ===========================
    // Delete Confirmation
    // ===========================

    const [deletePostId, setDeletePostId] =
        useState(null);


    // ===========================
    // Report Confirmation
    // ===========================

    const [reportPostId, setReportPostId] =
        useState(null);


    // ===========================
    // Deleted Posts
    // ===========================

    const [deletedPosts, setDeletedPosts] =
        useState([]);


    // ===========================
    // Reported Posts
    // ===========================

    const [reportedPosts, setReportedPosts] =
        useState([]);


    // ===========================
    // Post Likes
    // ===========================

    const [likedPosts, setLikedPosts] =
        useState([]);


    // ===========================
    // Post Saves
    // ===========================

    const [savedPosts, setSavedPosts] =
        useState([]);

    // ===========================
    // Save Loading
    // ===========================

    const [savingPostId, setSavingPostId] =
        useState(null);


    // ===========================
    // Comment Likes
    // ===========================

    const [likedComments, setLikedComments] =
        useState([]);


    // ===========================
    // Reply Likes
    // ===========================

    const [likedReplies, setLikedReplies] =
        useState([]);


    // ===========================
    // Comment Modal
    // ===========================

    const [commentPostId, setCommentPostId] =
        useState(null);


    // ===========================
    // Comment Input
    // ===========================

    const [commentText, setCommentText] =
        useState("");


    // ===========================
    // Reply Target
    // ===========================

    const [replyTarget, setReplyTarget] =
        useState(null);


    // ===========================
    // Share
    // ===========================

    const [sharePostId, setSharePostId] =
        useState(null);


    // ===========================
    // Story
    // ===========================

   const [storyIndex, setStoryIndex] =
    useState(null);

const [activeStoryGroup, setActiveStoryGroup] =
    useState(null);

const [seenStoryUsers, setSeenStoryUsers] =
    useState([]);

    // ===========================
    // Toast
    // ===========================

    const [toast, setToast] =
        useState("");


    // ===========================
    // Stories
    // ===========================

  const [stories, setStories] = useState([]);

const [storiesLoading, setStoriesLoading] =
    useState(true);


    // ===========================
    // Posts
    // ===========================

    /*
        ownerId + ownerUsername IMPORTANT HAI.

        Isi se decide hoga:
        owner -> Edit / Delete
        other user -> Report post
    */
const [posts, setPosts] = useState([]);

const homeAudioRef =
    useRef(null);

const activeAudioPostRef =
    useRef(null);

const [postsLoading, setPostsLoading] =
    useState(true);


    // ===========================
    // Comments
    // ===========================
const [comments, setComments] =
    useState({});
    // ===========================
// LOAD COMMENTS FOR POSTS
// ===========================

useEffect(function () {

    async function loadAllComments() {

        if (!posts || posts.length === 0) {
            return;
        }

        try {

            const commentsData = {};

            for (const post of posts) {

                if (!post.id) {
                    continue;
                }

                try {

                    const response =
                        await api(
                            "/comments/" +
                            post.id
                        );

                    const backendComments =
                        response.comments || [];

                    const formattedComments =
                        backendComments.map(function (comment) {

                            const author =
                                comment.author || {};

                            return {

                                id:
                                    comment._id,

                                userId:
                                    author._id,

                                username:
                                    author.username || "",

                                fullName:
                                    author.fullName || "",

                                image:
                                    getUserProfileImage(author),

                                text:
                                    comment.text || "",

                                likes:
                                    Array.isArray(comment.likes)
                                        ? comment.likes.length
                                        : 0,

                                replies:
                                    Array.isArray(comment.replies)
                                        ? comment.replies.map(
                                            function (reply) {

                                                const replyAuthor =
                                                    reply.author || {};

                                                return {

                                                    id:
                                                        reply._id,

                                                    userId:
                                                        replyAuthor._id,

                                                    username:
                                                        replyAuthor.username || "",

                                                    fullName:
                                                        replyAuthor.fullName || "",

                                                    image:
                                                        getUserProfileImage(
                                                            replyAuthor
                                                        ),

                                                    text:
                                                        reply.text || "",

                                                    likes:
                                                        Array.isArray(
                                                            reply.likes
                                                        )
                                                            ? reply.likes.length
                                                            : 0

                                                };

                                            }
                                        )
                                        : []

                            };

                        });

                    commentsData[post.id] =
                        formattedComments;

                }
                catch (error) {

                    console.error(
                        "COMMENTS LOAD ERROR:",
                        post.id,
                        error
                    );

                    commentsData[post.id] = [];

                }

            }

            setComments(commentsData);

        }
        catch (error) {

            console.error(
                "LOAD ALL COMMENTS ERROR:",
                error
            );

        }

    }

    loadAllComments();

}, [posts]);


    // ===========================
    // Current User API
    // ===========================

   useEffect(function () {

    async function loadCurrentUser() {

        const savedToken =
            localStorage.getItem("token");

        if (!savedToken) {

            setUserLoading(false);
            navigate("/login", { replace: true });

            return;

        }

        try {

            const data =
    await api("/auth/me");

const currentUser =
    data.user || data;

setUser(currentUser);

setPosts(function (oldPosts) {

    return oldPosts.map(function (post) {

        if (post.id === 1) {

            return {
                ...post,

                ownerId:
                    currentUser._id ||
                    currentUser.id,

                ownerUsername:
                    currentUser.username,

                ownerFullName:
                    currentUser.fullName,

                ownerImage:
                    getUserProfileImage(currentUser)
            };

        }

        return post;

    });

});

localStorage.setItem(
    "user",
    JSON.stringify(currentUser)
);
        }
        catch (error) {

            console.error(
                "HOME USER ERROR:",
                error
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate(
                "/login",
                { replace: true }
            );

        }
        finally {

            setUserLoading(false);

        }

    }

    loadCurrentUser();

}, [navigate]);

// ===========================
// SYNC SAVED POSTS FROM BACKEND
// ===========================
useEffect(function () {

    if (!user || !Array.isArray(posts)) {
        return;
    }

    const userId =
        user._id || user.id;

    if (!userId) {
        return;
    }

    const backendSavedPostIds =
        posts
            .filter(function (post) {
                return (
                    Array.isArray(post.saves) &&
                    post.saves.some(function (id) {
                        return (
                            id != null &&
                            id.toString() ===
                                userId.toString()
                        );
                    })
                );
            })
            .map(function (post) {
                return post.id;
            });

    setSavedPosts(backendSavedPostIds);

}, [user, posts]);

// ===========================
// LOAD REAL STORIES
// ===========================

useEffect(function () {

    async function loadStories() {

        try {

            setStoriesLoading(true);

            const response =
                await api("/stories");

            console.log(
                "HOME STORIES RESPONSE:",
                response
            );

            const backendStories =
                Array.isArray(response)
                    ? response
                    : response?.stories || [];

            const formattedStories =
                backendStories.map(
                    function (story) {

                        const storyUser =
                            story.user || {};

                        return {

                            id:
                                story._id,


                            userId:
                                storyUser._id ||
                                storyUser.id ||
                                "",

                            username:
                                storyUser.username || "",

                            fullName:
                                storyUser.fullName || "",

                            image:
                                getUserProfileImage(
                                    storyUser
                                ),

                            mediaUrl:
                                story.mediaUrl || "",

                            mediaType:
                                story.mediaType || "image",

                            elements:
                                Array.isArray(
                                    story.elements
                                )
                                    ? story.elements
                                    : [],

                            music:
                                story.music || null,

                            effect:
                                story.effect || "None",

                            settings:
                                story.settings || {},

                            viewers:
                                Array.isArray(
                                    story.viewers
                                )
                                    ? story.viewers
                                    : [],

                            createdAt:
                                story.createdAt,

                            expiresAt:
                                story.expiresAt

                        };

                    }
                );

            setStories(
                formattedStories
            );

        }
        catch (error) {

            console.error(
                "HOME STORIES ERROR:",
                error
            );

            setStories([]);

        }
        finally {

            setStoriesLoading(false);

        }

    }


    loadStories();

}, []);

// ===========================
// LOAD REAL POSTS
// ===========================

useEffect(function () {

    async function loadPosts() {

        try {

            setPostsLoading(true);

            const response =
                await api("/posts");

            console.log(
                "HOME POSTS RESPONSE:",
                response
            );

            const backendPosts =
                Array.isArray(response)
                    ? response
                    : response?.posts || [];


            const formattedPosts =
                backendPosts.map(
                    function (post) {

                        const author =
                            post.author || {};


                        return {

                            // MongoDB ID
                            id:
                                post._id,

                            // Owner
                            ownerId:
                                author._id,

                            ownerUsername:
                                author.username ||
                                "",

                            ownerFullName:
                                author.fullName ||
                                "",

                            ownerImage:
                                getUserProfileImage(
                                    author
                                ),


                            // Image
                            image:
                                getMediaUrl(
                                    post.image
                                ),


                            // Caption
                            caption:
                                post.caption || "",


                            // Real likes
                            likes:
                                Array.isArray(
                                    post.likes
                                )
                                    ? post.likes.length
                                    : 0,

                            // Real saves
                            saves:
                                Array.isArray(
                                    post.saves
                                )
                                    ? post.saves
                                    : [],


                            // Backend data
                            taggedUser:
                                post.taggedUser ||
                                null,

                            location:
                                post.location ||
                                null,

                            audio:
                                post.audio ||
                                null,


                            // Comments
                            comments:
                                Array.isArray(
                                    post.comments
                                )
                                    ? post.comments
                                    : [],


                            // Date
                            createdAt:
                                post.createdAt,

                            time:
                                post.createdAt
                                    ? new Date(
                                        post.createdAt
                                      ).toLocaleString()
                                    : ""

                        };

                    }
                );


            setPosts(
                formattedPosts
            );

        }
        catch (error) {

            console.error(
                "HOME POSTS ERROR:",
                error
            );

            setPosts([]);

        }
        finally {

            setPostsLoading(false);

        }

    }


    loadPosts();

}, []);

// ===========================
// NEWLY CREATED POST
// ===========================

useEffect(function () {

    const createdPost =
        location.state?.createdPost;


    if (!createdPost) {

        return;

    }


    const author =
        createdPost.author ||
        user ||
        {};


    const formattedPost = {

        id:
            createdPost._id,

        ownerId:
            author._id,

        ownerUsername:
            author.username ||
            "",

        ownerFullName:
            author.fullName ||
            "",

        ownerImage:
            getUserProfileImage(
                author
            ),


        image:
            getMediaUrl(
                createdPost.image
            ),


        caption:
            createdPost.caption || "",


        likes:
            Array.isArray(
                createdPost.likes
            )
                ? createdPost.likes.length
                : 0,

        saves:
            Array.isArray(
                createdPost.saves
            )
                ? createdPost.saves
                : [],


        taggedUser:
            createdPost.taggedUser ||
            null,

        location:
            createdPost.location ||
            null,

        audio:
            createdPost.audio ||
            null,

        comments:
            Array.isArray(
                createdPost.comments
            )
                ? createdPost.comments
                : [],


        createdAt:
            createdPost.createdAt,

        time:
            "Just now"

    };


    setPosts(
        function (oldPosts) {

            const alreadyExists =
                oldPosts.some(
                    function (post) {

                        return (
                            post.id ===
                            formattedPost.id
                        );

                    }
                );


            if (alreadyExists) {

                return oldPosts;

            }


            return [
                formattedPost,
                ...oldPosts
            ];

        }
    );


    // State ko clear kar do
    // taaki navigation state baar-baar use na ho

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );


}, [location.state, user]);
// ===========================
// HOME POST AUDIO
// ===========================

useEffect(function () {

    if (!posts || posts.length === 0) {
        return;
    }

    const audio =
        homeAudioRef.current;

    if (!audio) {
        return;
    }

    const postElements =
        Array.from(
            document.querySelectorAll(
                ".home .feed .post"
            )
        );

    if (postElements.length === 0) {
        return;
    }

    function playPostAudio(post) {

        if (
            !post ||
            !post.audio ||
            !post.audio.audioUrl
        ) {
            audio.pause();
            audio.removeAttribute("src");
            activeAudioPostRef.current =
                null;
            return;
        }

        if (
            activeAudioPostRef.current ===
            post.id
        ) {
            return;
        }

        const audioUrl =
            post.audio.audioUrl;

        if (!audioUrl) {
            return;
        }

        activeAudioPostRef.current =
            post.id;

        audio.pause();

        audio.src =
            audioUrl;

        audio.load();

        function startAudio() {

            const startTime =
                Number(
                    post.audio.startTime
                ) || 0;

            try {
                audio.currentTime =
                    startTime;
            }
            catch (error) {
                console.warn(
                    "HOME AUDIO SEEK ERROR:",
                    error
                );
            }

            audio.play()
                .catch(function (error) {

                    console.warn(
                        "HOME AUDIO PLAY ERROR:",
                        error
                    );

                });
        }

        if (audio.readyState >= 1) {
            startAudio();
        }
        else {
            audio.addEventListener(
                "loadedmetadata",
                startAudio,
                {
                    once: true
                }
            );
        }
    }


    function findActivePost() {

        const viewportCenter =
            window.innerHeight / 2;

        let closestPost =
            null;

        let closestDistance =
            Infinity;

        postElements.forEach(
            function (element) {

                const rect =
                    element.getBoundingClientRect();

                const postCenter =
                    rect.top +
                    rect.height / 2;

                const distance =
                    Math.abs(
                        postCenter -
                        viewportCenter
                    );

                if (
                    distance <
                    closestDistance
                ) {
                    closestDistance =
                        distance;

                    closestPost =
                        element;
                }
            }
        );

        if (!closestPost) {
            return;
        }

        const postId =
            closestPost.getAttribute(
                "data-post-id"
            );

        const post =
            posts.find(
                function (item) {
                    return (
                        String(item.id) ===
                        String(postId)
                    );
                }
            );

        playPostAudio(post);
    }


    window.addEventListener(
        "scroll",
        findActivePost,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        findActivePost
    );

    findActivePost();
document.removeEventListener(
    "click",
    findActivePost
);

document.removeEventListener(
    "touchstart",
    findActivePost
);

    return function () {

        window.removeEventListener(
            "scroll",
            findActivePost
        );

        window.removeEventListener(
            "resize",
            findActivePost
        );

        audio.pause();

        audio.removeAttribute(
            "src"
        );

        activeAudioPostRef.current =
            null;
    };

}, [posts]);
    // ===========================
    // Toast
    // ===========================

    function showToast(message) {

        setToast(message);


        setTimeout(function () {

            setToast("");

        }, 1800);

    }


    // ===========================
    // Current Username
    // ===========================

  const currentUsername =
    user?.username || "";


const currentUserId =
    user?._id || user?.id || "";


// ==========================================
// CURRENT USER PROFILE IMAGE
// ==========================================

function getUserProfileImage(userData) {

    if (
        userData &&
        userData.profilePicture
    ) {

        if (
            userData.profilePicture.startsWith("http")
        ) {

            return userData.profilePicture;

        }

        return getMediaUrl(
            userData.profilePicture
        );

    }


    // NO RANDOM IMAGE
    return "/default-avatar.jpg";

}


const currentUserImage =
    getUserProfileImage(user);


    // ===========================
    // Is Post Owner?
    // ===========================

    function isPostOwner(post) {

        if (!user) {

            /*
                Temporary fallback for frontend testing.
                Backend user aane ke baad actual _id compare hoga.
            */

            return (
                post.ownerId ===
                currentUserId
            );

        }


        return (
            post.ownerId === user._id ||
            post.ownerUsername === user.username
        );

    }


    // ===========================
    // Profile Navigation
    // ===========================

    function handleProfileClick(profileUser) {

    if (
        !profileUser ||
        !profileUser.username
    ) {
        return;
    }

    navigate(
        "/profile/" +
        encodeURIComponent(profileUser.username)
    );

}

    // ===========================
    // Home
    // ===========================

    function handleHome() {

        setCreateMenuOpen(false);

        navigate("/home");

    }


    // ===========================
    // Search
    // ===========================

    function handleSearch() {

        setCreateMenuOpen(false);

        navigate("/search");

    }


    // ===========================
    // Profile
    // ===========================

    function handleProfile() {

        setCreateMenuOpen(false);

        navigate("/profile");

    }


    // ===========================
    // Reels
    // ===========================

    function handleReels() {

        setCreateMenuOpen(false);

        navigate("/reels");

    }


    // ===========================
    // Notification
    // ===========================

    function handleNotification() {

        navigate("/notification");

    }


    // ===========================
    // Message
    // ===========================

    function handleMessage() {

        navigate("/message");

    }


    // ===========================
    // Create Post
    // ===========================

    function handleCreatePost() {

        setCreateMenuOpen(false);

        navigate("/postgallery");

    }


    // ===========================
    // Create Reel
    // ===========================

    function handleCreateReel() {

        setCreateMenuOpen(false);

        navigate("/reelcreate");

    }


    // ===========================
    // Create Story
    // ===========================

    function handleCreateStory() {

        setCreateMenuOpen(false);

        navigate("/createstory");

    }


    // ===========================
    // Like Post
    // ===========================

 async function handleLikePost(postId) {
    if (!postId) {
        return;
    }

    try {
        const response = await api(
            "/posts/" +
            postId +
            "/like",
            {
                method: "POST"
            }
        );

        const liked =
            !!(
                response &&
                response.liked
            );

        setLikedPosts(function (oldLiked) {
            if (liked) {
                if (
                    oldLiked.includes(postId)
                ) {
                    return oldLiked;
                }

                return [
                    ...oldLiked,
                    postId
                ];
            }

            return oldLiked.filter(
                function (id) {
                    return id !== postId;
                }
            );
        });

    }
    catch (error) {
        console.error(
            "HOME LIKE ERROR:",
            error
        );
    }
}

    // ===========================
    // Save / Unsave Post
    // ===========================

    async function handleSavePost(postId) {

        if (
            !postId ||
            savingPostId === postId
        ) {
            return;
        }

        try {

            setSavingPostId(postId);

            const response =
                await api(
                    "/posts/" +
                    postId +
                    "/save",
                    {
                        method: "POST"
                    }
                );

            const saved =
                !!(response && response.saved);

            const userId =
                user?._id || user?.id;

            setSavedPosts(function (oldSaved) {

                if (saved) {

                    if (oldSaved.some(function (id) {
                        return (
                            id != null &&
                            id.toString() ===
                                postId.toString()
                        );
                    })) {
                        return oldSaved;
                    }

                    return [
                        ...oldSaved,
                        postId
                    ];
                }

                return oldSaved.filter(function (id) {
                    return (
                        id == null ||
                        id.toString() !==
                            postId.toString()
                    );
                });

            });

            setPosts(function (oldPosts) {

                return oldPosts.map(function (post) {

                    if (
                        !post.id ||
                        post.id.toString() !==
                            postId.toString()
                    ) {
                        return post;
                    }

                    let saves =
                        Array.isArray(post.saves)
                            ? [...post.saves]
                            : [];

                    if (saved) {

                        if (
                            userId &&
                            !saves.some(function (id) {
                                return (
                                    id != null &&
                                    id.toString() ===
                                        userId.toString()
                                );
                            })
                        ) {
                            saves.push(userId);
                        }

                    }
                    else {

                        saves = saves.filter(function (id) {
                            return (
                                !userId ||
                                id == null ||
                                id.toString() !==
                                    userId.toString()
                            );
                        });

                    }

                    return {
                        ...post,
                        saves
                    };

                });

            });

            showToast(
                saved
                    ? "Saved"
                    : "Removed from saved"
            );

        }
        catch (error) {

            console.error(
                "HOME SAVE POST ERROR:",
                error
            );

            showToast(
                error.message ||
                "Failed to save post"
            );

        }
        finally {

            setSavingPostId(null);

        }
    }


    // ===========================
    // Post Menu
    // ===========================

    function handlePostMenu(postId) {

        if (
            openPostMenu === postId
        ) {

            setOpenPostMenu(null);

        } else {

            setOpenPostMenu(postId);

        }

    }


    // ===========================
    // Edit Post
    // ===========================

    function handleEditPost(post) {

        setOpenPostMenu(null);

        navigate(
            "/editpost",
            {
                state: {
                    post: post
                }
            }
        );

    }


    // ===========================
    // Delete Request
    // ===========================

    function handleDeleteRequest(postId) {

        setOpenPostMenu(null);

        setDeletePostId(postId);

    }


    // ===========================
    // Confirm Delete
    // ===========================

    function handleConfirmDelete() {

        if (
            deletePostId === null
        ) {

            return;

        }


        setDeletedPosts(
            function (oldDeleted) {

                return [
                    ...oldDeleted,
                    deletePostId
                ];

            }
        );


        setDeletePostId(null);

        showToast(
            "Post deleted"
        );

    }


    // ===========================
    // Report
    // ===========================

    function handleReportRequest(postId) {

        setOpenPostMenu(null);

        setReportPostId(postId);

    }


    function handleConfirmReport() {

        if (
            reportPostId === null
        ) {

            return;

        }


        setReportedPosts(
            function (oldReported) {

                return [
                    ...oldReported,
                    reportPostId
                ];

            }
        );


        setReportPostId(null);

        showToast(
            "Post reported"
        );

    }


    // ===========================
    // Open Comments
    // ===========================

    function handleOpenComments(postId) {

        setCommentPostId(postId);

        setCommentText("");

        setReplyTarget(null);

    }


    // ===========================
    // Add Comment / Reply
    // ===========================

async function handleAddComment() {

    if (!commentText.trim()) {
        return;
    }

    if (!commentPostId) {
        return;
    }

    try {

        const text =
            commentText.trim();

        const body = {

            text: text,

            ...(replyTarget
                ? {
                    parentComment:
                        replyTarget.id
                }
                : {})

        };

        const response =
            await api(
                "/comments/" +
                commentPostId,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );

        console.log(
            "COMMENT CREATE RESPONSE:",
            response
        );

        const backendComment =
            response.comment;

        if (!backendComment) {
            return;
        }

        const author =
            backendComment.author ||
            user ||
            {};

        const formattedComment = {

            id:
                backendComment._id,

            userId:
                author._id ||
                currentUserId,

            username:
                author.username ||
                currentUsername,

            fullName:
                author.fullName ||
                currentUsername,

            image:
                getUserProfileImage(author),

            text:
                backendComment.text || "",

            likes:
                Array.isArray(
                    backendComment.likes
                )
                    ? backendComment.likes.length
                    : 0,

            replies: []

        };


        // ======================================
        // REPLY
        // ======================================

        if (replyTarget) {

            setComments(
                function (oldComments) {

                    const postComments =
                        oldComments[
                            commentPostId
                        ] || [];

                    const updatedComments =
                        postComments.map(
                            function (comment) {

                                if (
                                    comment.id ===
                                    replyTarget.id
                                ) {

                                    return {

                                        ...comment,

                                        replies: [

                                            ...(comment.replies || []),

                                            formattedComment

                                        ]

                                    };

                                }

                                return comment;

                            }
                        );

                    return {

                        ...oldComments,

                        [commentPostId]:
                            updatedComments

                    };

                }
            );

        }


        // ======================================
        // NORMAL COMMENT
        // ======================================

        else {

            setComments(
                function (oldComments) {

                    return {

                        ...oldComments,

                        [commentPostId]: [

                            ...(oldComments[
                                commentPostId
                            ] || []),

                            formattedComment

                        ]

                    };

                }
            );

        }


        // ======================================
        // RESET
        // ======================================

        setReplyTarget(null);

        setCommentText("");

    }
    catch (error) {

        console.error(
            "CREATE COMMENT ERROR:",
            error
        );

        showToast(
            error.message ||
            "Failed to add comment"
        );

    }

}


    // ===========================
    // Reply
    // ===========================

    function handleReply(comment) {

        setReplyTarget(comment);

        setCommentText(
            "@" +
            comment.username +
            " "
        );

    }


    // ===========================
    // Comment Like
    // ===========================

    function handleCommentLike(
        postId,
        commentId
    ) {

        const likeId =
            postId +
            "-" +
            commentId;


        setLikedComments(
            function (oldLiked) {

                if (
                    oldLiked.includes(
                        likeId
                    )
                ) {

                    return oldLiked.filter(
                        function (id) {

                            return id !== likeId;

                        }
                    );

                }


                return [
                    ...oldLiked,
                    likeId
                ];

            }
        );

    }


    // ===========================
    // Reply Like
    // ===========================

    function handleReplyLike(
        postId,
        replyId
    ) {

        const likeId =
            postId +
            "-" +
            replyId;


        setLikedReplies(
            function (oldLiked) {

                if (
                    oldLiked.includes(
                        likeId
                    )
                ) {

                    return oldLiked.filter(
                        function (id) {

                            return id !== likeId;

                        }
                    );

                }


                return [
                    ...oldLiked,
                    likeId
                ];

            }
        );

    }


    // ===========================
    // Share
    // ===========================

    function handleShare(postId) {

        setSharePostId(postId);

    }


    function handleCopyLink() {

        const link =
            window.location.origin +
            "/post/" +
            sharePostId;


        if (
            navigator.clipboard
        ) {

            navigator.clipboard.writeText(
                link
            );

        }


        setSharePostId(null);

        showToast(
            "Link copied"
        );

    }


    function handleShareMessage() {

        setSharePostId(null);

        navigate("/message");

    }


    // ===========================
    // Stories
    // ===========================

    

    // ===========================
    // Stories
    // ===========================

    // One user = one story circle.
    // All stories from that user stay together.
    // ===========================
// Stories
// ===========================
// ==========================================
// STORY GROUPS
// ==========================================

// One user = ONE circle.
// Same user's all stories stay together.

const storyGroups = [];


stories.forEach(function (story) {

    const groupUserId =
        story.userId ||
        story.username;


    let group =
        storyGroups.find(function (item) {

            return (
                String(item.userId) ===
                String(groupUserId)
            );

        });


    if (!group) {

        group = {

            userId:
                groupUserId,

            username:
                story.username,

            image:
                story.image,

            stories: []

        };


        storyGroups.push(group);

    }


    group.stories.push(story);

});


// ==========================================
// INITIAL SEEN USERS
// ==========================================

useEffect(function () {

    if (
        !Array.isArray(stories) ||
        !currentUserId
    ) {

        return;

    }


    const seenUsers = [];


    storyGroups.forEach(function (group) {

        const hasSeen =
            group.stories.some(
                function (story) {

                    return (
                        Array.isArray(
                            story.viewers
                        ) &&
                        story.viewers.some(
                            function (viewer) {

                                const viewerId =
                                    typeof viewer === "object"
                                        ? viewer._id ||
                                          viewer.id
                                        : viewer;


                                return (
                                    viewerId != null &&
                                    String(viewerId) ===
                                    String(currentUserId)
                                );

                            }
                        )
                    );

                }
            );


        if (hasSeen) {

            seenUsers.push(
                String(group.userId)
            );

        }

    });


    setSeenStoryUsers(seenUsers);

}, [stories, currentUserId]);

// ==========================================
// OPEN MY STORY
// ==========================================

function handleMyStoryOpen() {

    const myStories =
        stories.filter(function (story) {
            return (
                String(story.userId) ===
                String(currentUserId)
            );
        });

    if (
        !Array.isArray(myStories) ||
        myStories.length === 0
    ) {
        return;
    }

    setActiveStoryGroup(myStories);

    setStoryIndex(0);

    setSeenStoryUsers(function (oldSeen) {

        const userId =
            String(currentUserId);

        if (oldSeen.includes(userId)) {
            return oldSeen;
        }

        return [
            ...oldSeen,
            userId
        ];

    });
}
// ==========================================
// OPEN STORY
// ==========================================

function handleStoryOpen(groupIndex) {

    const group =
        storyGroups[groupIndex];


    if (
        !group ||
        !group.stories ||
        group.stories.length === 0
    ) {

        return;

    }


    // Viewer ke andar SIRF isi user ki stories.

    setActiveStoryGroup(
        group.stories
    );


    // First story.

    setStoryIndex(0);


    // User ko seen mark karo.

    setSeenStoryUsers(
        function (oldSeen) {

            const userId =
                String(group.userId);


            if (
                oldSeen.includes(userId)
            ) {

                return oldSeen;

            }


            return [
                ...oldSeen,
                userId
            ];

        }
    );

}


// ==========================================
// PREVIOUS STORY
// ==========================================

function handlePreviousStory() {

    if (
        storyIndex === null ||
        storyIndex <= 0
    ) {

        return;

    }


    setStoryIndex(
        function (oldIndex) {

            return oldIndex - 1;

        }
    );

}


// ==========================================
// NEXT STORY
// ==========================================

function handleNextStory() {

    if (
        storyIndex === null ||
        !activeStoryGroup
    ) {
        return;
    }

    if (
        storyIndex <
        activeStoryGroup.length - 1
    ) {
        setStoryIndex(function (oldIndex) {
            return oldIndex + 1;
        });

        return;
    }

    const currentGroupUserId =
        String(activeStoryGroup[0]?.userId || "");

    const currentGroupIndex =
        storyGroups.findIndex(function (group) {
            return (
                String(group.userId) ===
                currentGroupUserId
            );
        });

    const nextGroup =
        currentGroupIndex >= 0
            ? storyGroups[currentGroupIndex + 1]
            : null;

    if (
        nextGroup &&
        Array.isArray(nextGroup.stories) &&
        nextGroup.stories.length > 0
    ) {
        setActiveStoryGroup(nextGroup.stories);
        setStoryIndex(0);

        setSeenStoryUsers(function (oldSeen) {

            const nextUserId =
                String(nextGroup.userId);

            if (oldSeen.includes(nextUserId)) {
                return oldSeen;
            }

            return [
                ...oldSeen,
                nextUserId
            ];

        });

        return;
    }

    handleStoryClose();

}


// ==========================================
// NEXT STORY
// ==========================================

function handleStoryClose() {

    setStoryIndex(null);

    setActiveStoryGroup(null);

}
    // ===========================
    // Visible Posts
    // ===========================

    const visiblePosts =
        posts.filter(
            function (post) {

                return !deletedPosts.includes(
                    post.id
                );

            }
        );


    return (

        <div className="home">


            {/* ===========================
            NAVBAR
            =========================== */}

            <div className="navbar">

                <div className="left">

                    <h1>
                        Instagram
                    </h1>

                </div>


                <div className="right">

                    <button
                        className="icon-btn"
                        onClick={
                            handleNotification
                        }
                    >

                        <FiHeart />

                    </button>


                    <button
                        className="icon-btn"
                        onClick={
                            handleMessage
                        }
                    >

                        <FiMessageCircle />

                    </button>

                </div>

            </div>


            {/* ===========================
            STORIES
            =========================== */}

         {/* ===========================
    STORIES
=========================== */}

<div className="stories">

    {/* ===========================
        MY STORY / CREATE STORY
    =========================== */}
<button
    type="button"
    className="story my-story"
    onClick={
        handleMyStoryOpen
    }
>
        <div className="story-ring my-story-ring">

            <img
                src={
                    currentUserImage ||
                    "/default-avatar.jpg"
                }
                alt={
                    currentUsername
                }
            />

            <span
    className="story-add-icon"
    onClick={function (event) {
        event.stopPropagation();
        handleCreateStory();
    }}
>
    +
</span>

        </div>

        <p>
            {
                currentUsername
            }
        </p>
    </button>


    {storiesLoading ? (
        <p>
            Loading...
        </p>
    ) : (
        storyGroups
            .filter(
                function (group) {
                    return (
                        String(
                            group.userId
                        ) !==
                        String(
                            currentUserId
                        )
                    );
                }
            )
            .map(
                function (
                    group,
                    index
                ) {
            

                const isSeen =
                    seenStoryUsers.includes(
                        String(group.userId)
                    );


                return (

                    <button
                        type="button"
                        className={
                            isSeen
                                ? "story story-seen"
                                : "story story-unseen"
                        }
                        key={
                            String(
                                group.userId
                            )
                        }
                        onClick={
                            function () {

                                handleStoryOpen(
                                    index
                                );

                            }
                        }
                    >

                        <div className="story-ring">

                            <img
                                src={
                                    group.image ||
                                    "/default-avatar.jpg"
                                }
                                alt={
                                    group.username
                                }
                            />

                        </div>


                        <p>
                            {
                                group.username
                            }
                        </p>

                    </button>

                );

            }
        )

    )}

</div>


            {/* ===========================
            ERROR
            =========================== */}

            {userError && (

                <div className="home-error">

                    {userError}

                </div>

            )}

<audio
    ref={
        homeAudioRef
    }
    preload="auto"
    playsInline
/>


            {/* ===========================
            POSTS
            =========================== */}

            <div className="feed">

                {visiblePosts.map(
                    function (post) {

                        const owner =
                            isPostOwner(post);


                        const liked =
                            likedPosts.includes(
                                post.id
                            );


                        const saved =
                            savedPosts.includes(
                                post.id
                            );


                        const postComments =
                            comments[
                                post.id
                            ] || [];


                        return (

                   <article
    className="post"
    key={
        post.id
    }
    data-post-id={post.id}
>


                                {/* ===========================
                                POST HEADER
                                =========================== */}

                                <div className="feed-header">


                                    {/* PROFILE */}

                                    <button
                                        className="post-profile-button"
                                        onClick={
                                            function () {

                                                handleProfileClick(
                                                    {
                                                        _id:
                                                            post.ownerId,

                                                        username:
                                                            post.ownerUsername,

                                                        fullName:
                                                            post.ownerFullName,

                                                        image:
                                                            post.ownerImage
                                                    }
                                                );

                                            }
                                        }
                                    >

                                        <img
                                            src={
                                                post.ownerImage
                                            }
                                            alt={
                                                post.ownerUsername
                                            }
                                        />

                                        <p>

                                            {
                                                post.ownerUsername
                                            }

                                        </p>

                                    </button>


                                    {/* THREE DOT */}

                                    <button
                                        className="icon-btn three-dots-btn"
                                        onClick={
                                            function () {

                                                handlePostMenu(
                                                    post.id
                                                );

                                            }
                                        }
                                    >

                                        <FiMoreVertical />

                                    </button>


                                    {/* ===========================
                                    OWNER MENU
                                    =========================== */}

                                    {
                                        openPostMenu ===
                                        post.id &&
                                        owner && (

                                            <div
                                                className="post-menu-box"
                                            >

                                                <button
                                                    onClick={
                                                        function () {

                                                            handleEditPost(
                                                                post
                                                            );

                                                        }
                                                    }
                                                >

                                                    Edit

                                                </button>


                                                <button
                                                    className="delete-menu-btn"
                                                    onClick={
                                                        function () {

                                                            handleDeleteRequest(
                                                                post.id
                                                            );

                                                        }
                                                    }
                                                >

                                                    Delete

                                                </button>

                                            </div>

                                        )
                                    }


                                    {/* ===========================
                                    OTHER USER MENU
                                    =========================== */}

                                    {
                                        openPostMenu ===
                                        post.id &&
                                        !owner && (

                                            <div
                                                className="post-menu-box"
                                            >

                                                <button
                                                    className="report-menu-btn"
                                                    onClick={
                                                        function () {

                                                            handleReportRequest(
                                                                post.id
                                                            );

                                                        }
                                                    }
                                                >

                                                    <FiFlag />

                                                    <span>
                                                        Report post
                                                    </span>

                                                </button>

                                            </div>

                                        )
                                    }

                                </div>


                                {/* ===========================
                                POST IMAGE
                                =========================== */}

                                <div className="post-image">

                                    <img
                                        src={
                                            post.image
                                        }
                                        alt="Post"
                                    />

                                </div>


                                {/* ===========================
                                ACTIONS
                                =========================== */}

                                <div className="post-actions">

                                    <div className="post-left">

                                        <button
                                            className={
                                                liked
                                                    ? "icon-btn liked-icon"
                                                    : "icon-btn"
                                            }
                                            onClick={
                                                function () {

                                                    handleLikePost(
                                                        post.id
                                                    );

                                                }
                                            }
                                        >

                                            <FiHeart />

                                        </button>


                                        <button
                                            className="icon-btn"
                                            onClick={
                                                function () {

                                                    handleOpenComments(
                                                        post.id
                                                    );

                                                }
                                            }
                                        >

                                            <FiMessageCircle />

                                        </button>


                                        <button
                                            className="icon-btn"
                                            onClick={
                                                function () {

                                                    handleShare(
                                                        post.id
                                                    );

                                                }
                                            }
                                        >

                                            <FiSend />

                                        </button>

                                    </div>


                                    <div className="post-right">

                                        <button
                                            className={
                                                saved
                                                    ? "icon-btn saved-icon"
                                                    : "icon-btn"
                                            }
                                            onClick={
                                                function () {

                                                    handleSavePost(
                                                        post.id
                                                    );

                                                }
                                            }
                                            disabled={
                                                savingPostId ===
                                                post.id
                                            }
                                        >

                                            <FiBookmark />

                                        </button>

                                    </div>

                                </div>


                                {/* ===========================
                                POST INFO
                                =========================== */}

                                <div className="post-info">

                                    <p className="post-likes">

                                        <strong>

                                            {
                                                post.likes +
                                                (
                                                    liked
                                                        ? 1
                                                        : 0
                                                )
                                            }

                                        </strong>

                                        {" "}
                                        likes

                                    </p>


                                    <p>

                                        <button
                                            className="inline-profile"
                                            onClick={
                                                function () {

                                                    handleProfileClick(
                                                        {
                                                            _id:
                                                                post.ownerId,

                                                            username:
                                                                post.ownerUsername,

                                                            fullName:
                                                                post.ownerFullName,

                                                            image:
                                                                post.ownerImage
                                                        }
                                                    );

                                                }
                                            }
                                        >

                                            {post.ownerUsername}

                                        </button>

                                        {" "}

                                        {post.caption}

                                    </p>


                                    {postComments.length >
                                        0 && (

                                        <button
                                            className="view-comments-btn"
                                            onClick={
                                                function () {

                                                    handleOpenComments(
                                                        post.id
                                                    );

                                                }
                                            }
                                        >

                                            View all{" "}
                                            {
                                                postComments.length
                                            }{" "}
                                            comments

                                        </button>

                                    )}


                                    <span className="post-time">

                                        {post.time}

                                    </span>

                                </div>

                            </article>

                        );

                    }
                )}

            </div>


            {/* ===========================
            CREATE MENU
            =========================== */}

            {createMenuOpen && (

                <div
                    className="overlay"
                    onClick={
                        function () {

                            setCreateMenuOpen(
                                false
                            );

                        }
                    }
                >

                    <div
                        className="create-menu"
                        onClick={
                            function (
                                event
                            ) {

                                event.stopPropagation();

                            }
                        }
                    >

                        <div className="create-menu-title">

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

                            <FiHeart />

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
                            className="create-cancel"
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

                </div>

            )}


            {/* ===========================
            COMMENTS MODAL
            =========================== */}

            {commentPostId !== null && (

                <div
                    className="overlay"
                    onClick={
                        function () {

                            setCommentPostId(
                                null
                            );

                            setReplyTarget(
                                null
                            );

                        }
                    }
                >

                    <div
                        className="comments-box"
                        onClick={
                            function (
                                event
                            ) {

                                event.stopPropagation();

                            }
                        }
                    >


                        {/* HEADER */}

                        <div className="comments-header">

                            <h3>
                                Comments
                            </h3>

                            <button
                                className="icon-btn"
                                onClick={
                                    function () {

                                        setCommentPostId(
                                            null
                                        );

                                        setReplyTarget(
                                            null
                                        );

                                    }
                                }
                            >

                                <FiX />

                            </button>

                        </div>


                        {/* COMMENTS */}

                        <div className="comments-list">

                            {
                                postCommentsForModal(
                                    comments,
                                    commentPostId
                                ).length === 0
                                    ? (

                                        <p className="no-comments">

                                            No comments yet.

                                        </p>

                                    )
                                    : (

                                        postCommentsForModal(
                                            comments,
                                            commentPostId
                                        ).map(
                                            function (
                                                comment
                                            ) {

                                                const commentLikeId =
                                                    commentPostId +
                                                    "-" +
                                                    comment.id;


                                                const commentLiked =
                                                    likedComments.includes(
                                                        commentLikeId
                                                    );


                                                return (

                                                    <div
                                                        className="comment-block"
                                                        key={
                                                            comment.id
                                                        }
                                                    >

                                                        {/* MAIN COMMENT */}

                                                        <div className="comment-row">

                                                            <button
                                                                className="comment-profile"
                                                                onClick={
                                                                    function () {

                                                                        handleProfileClick(
                                                                            {
                                                                                _id:
                                                                                    comment.userId,

                                                                                username:
                                                                                    comment.username,

                                                                                fullName:
                                                                                    comment.fullName,

                                                                                image:
                                                                                    comment.image
                                                                            }
                                                                        );

                                                                    }
                                                                }
                                                            >

                                                                <img
                                                                    src={
                                                                        comment.image
                                                                    }
                                                                    alt={
                                                                        comment.username
                                                                    }
                                                                />

                                                            </button>


                                                            <div className="comment-content">

                                                                <div className="comment-main-text">

                                                                    <button
                                                                        className="comment-username"
                                                                        onClick={
                                                                            function () {

                                                                                handleProfileClick(
                                                                                    {
                                                                                        _id:
                                                                                            comment.userId,

                                                                                        username:
                                                                                            comment.username,

                                                                                        fullName:
                                                                                            comment.fullName,

                                                                                        image:
                                                                                            comment.image
                                                                                    }
                                                                                );

                                                                            }
                                                                        }
                                                                    >

                                                                        {
                                                                            comment.username
                                                                        }

                                                                    </button>


                                                                    <span>

                                                                        {
                                                                            comment.text
                                                                        }

                                                                    </span>

                                                                </div>


                                                                <div className="comment-actions">

                                                                    <span>

                                                                        {
                                                                            comment.likes +
                                                                            (
                                                                                commentLiked
                                                                                    ? 1
                                                                                    : 0
                                                                            )
                                                                        }{" "}

                                                                        likes

                                                                    </span>


                                                                    <button
                                                                        onClick={
                                                                            function () {

                                                                                handleReply(
                                                                                    comment
                                                                                );

                                                                            }
                                                                        }
                                                                    >

                                                                        Reply

                                                                    </button>

                                                                </div>


                                                                {/* REPLIES */}

                                                                {
                                                                    comment.replies &&
                                                                    comment.replies.length >
                                                                    0 && (

                                                                        <div className="replies">

                                                                            {
                                                                                comment.replies.map(
                                                                                    function (
                                                                                        reply
                                                                                    ) {

                                                                                        const replyLikeId =
                                                                                            commentPostId +
                                                                                            "-" +
                                                                                            reply.id;


                                                                                        const replyLiked =
                                                                                            likedReplies.includes(
                                                                                                replyLikeId
                                                                                            );


                                                                                        return (

                                                                                            <div
                                                                                                className="reply-row"
                                                                                                key={
                                                                                                    reply.id
                                                                                                }
                                                                                            >

                                                                                                <button
                                                                                                    className="comment-profile"
                                                                                                    onClick={
                                                                                                        function () {

                                                                                                            handleProfileClick(
                                                                                                                {
                                                                                                                    _id:
                                                                                                                        reply.userId,

                                                                                                                    username:
                                                                                                                        reply.username,

                                                                                                                    fullName:
                                                                                                                        reply.username,

                                                                                                                    image:
                                                                                                                        reply.image
                                                                                                                }
                                                                                                            );

                                                                                                        }
                                                                                                    }
                                                                                                >

                                                                                                    <img
                                                                                                        src={
                                                                                                            reply.image
                                                                                                        }
                                                                                                        alt={
                                                                                                            reply.username
                                                                                                        }
                                                                                                    />

                                                                                                </button>


                                                                                                <div className="comment-content">

                                                                                                    <div className="comment-main-text">

                                                                                                        <button
                                                                                                            className="comment-username"
                                                                                                        >

                                                                                                            {
                                                                                                                reply.username
                                                                                                            }

                                                                                                        </button>


                                                                                                        <span>

                                                                                                            {
                                                                                                                reply.text
                                                                                                            }

                                                                                                        </span>

                                                                                                    </div>


                                                                                                    <div className="comment-actions">

                                                                                                        <span>

                                                                                                            {
                                                                                                                reply.likes +
                                                                                                                (
                                                                                                                    replyLiked
                                                                                                                        ? 1
                                                                                                                        : 0
                                                                                                                )
                                                                                                            }{" "}

                                                                                                            likes

                                                                                                        </span>

                                                                                                    </div>

                                                                                                </div>


                                                                                                <button
                                                                                                    className={
                                                                                                        replyLiked
                                                                                                            ? "comment-like-btn comment-liked"
                                                                                                            : "comment-like-btn"
                                                                                                    }
                                                                                                    onClick={
                                                                                                        function () {

                                                                                                            handleReplyLike(
                                                                                                                commentPostId,
                                                                                                                reply.id
                                                                                                            );

                                                                                                        }
                                                                                                    }
                                                                                                >

                                                                                                    <FiHeart />

                                                                                                </button>

                                                                                            </div>

                                                                                        );

                                                                                    }
                                                                                )
                                                                            }

                                                                        </div>

                                                                    )
                                                                }

                                                            </div>


                                                            <button
                                                                className={
                                                                    commentLiked
                                                                        ? "comment-like-btn comment-liked"
                                                                        : "comment-like-btn"
                                                                }
                                                                onClick={
                                                                    function () {

                                                                        handleCommentLike(
                                                                            commentPostId,
                                                                            comment.id
                                                                        );

                                                                    }
                                                                }
                                                            >

                                                                <FiHeart />

                                                            </button>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )

                                    )
                            }

                        </div>


                        {/* INPUT */}

                        <div className="comment-input">

                            {
                                replyTarget && (

                                    <div className="replying-to">

                                        Replying to @
                                        {
                                            replyTarget.username
                                        }

                                        <button
                                            onClick={
                                                function () {

                                                    setReplyTarget(
                                                        null
                                                    );

                                                    setCommentText(
                                                        ""
                                                    );

                                                }
                                            }
                                        >

                                            <FiX />

                                        </button>

                                    </div>

                                )
                            }


                            <div className="comment-input-row">

                                <img
                                    src={
                                        currentUserImage
                                    }
                                    alt=""
                                />


                                <input
                                    type="text"
                                    placeholder={
                                        replyTarget
                                            ? "Reply..."
                                            : "Add a comment..."
                                    }
                                    value={
                                        commentText
                                    }
                                    onChange={
                                        function (
                                            event
                                        ) {

                                            setCommentText(
                                                event.target.value
                                            );

                                        }
                                    }
                                    onKeyDown={
                                        function (
                                            event
                                        ) {

                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {

                                                handleAddComment();

                                            }

                                        }
                                    }
                                />


                                <button
                                    onClick={
                                        handleAddComment
                                    }
                                    disabled={
                                        !commentText.trim()
                                    }
                                >

                                    Post

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ===========================
            SHARE
            =========================== */}

            {sharePostId !== null && (

                <div
                    className="overlay"
                    onClick={
                        function () {

                            setSharePostId(
                                null
                            );

                        }
                    }
                >

                    <div
                        className="share-box"
                        onClick={
                            function (
                                event
                            ) {

                                event.stopPropagation();

                            }
                        }
                    >

                        <div className="share-header">

                            <h3>
                                Share
                            </h3>

                            <button
                                className="icon-btn"
                                onClick={
                                    function () {

                                        setSharePostId(
                                            null
                                        );

                                    }
                                }
                            >

                                <FiX />

                            </button>

                        </div>


                        <button
                            onClick={
                                handleShareMessage
                            }
                        >

                            <FiSend />

                            <span>
                                Send in message
                            </span>

                        </button>


                        <button
                            onClick={
                                handleCopyLink
                            }
                        >

                            <FiCopy />

                            <span>
                                Copy link
                            </span>

                        </button>


                        <button
                            onClick={
                                handleCopyLink
                            }
                        >

                            <FiLink />

                            <span>
                                Share link
                            </span>

                        </button>

                    </div>

                </div>

            )}


            {/* ===========================
            DELETE
            =========================== */}

            {deletePostId !== null && (

                <div
                    className="overlay center-overlay"
                    onClick={
                        function () {

                            setDeletePostId(
                                null
                            );

                        }
                    }
                >

                    <div
                        className="delete-box"
                        onClick={
                            function (
                                event
                            ) {

                                event.stopPropagation();

                            }
                        }
                    >

                        <h3>
                            Delete post?
                        </h3>

                        <p>
                            Are you sure you want to delete this post?
                        </p>


                        <button
                            className="confirm-delete"
                            onClick={
                                handleConfirmDelete
                            }
                        >

                            Delete

                        </button>


                        <button
                            onClick={
                                function () {

                                    setDeletePostId(
                                        null
                                    );

                                }
                            }
                        >

                            Cancel

                        </button>

                    </div>

                </div>

            )}


            {/* ===========================
            REPORT
            =========================== */}

            {reportPostId !== null && (

                <div
                    className="overlay center-overlay"
                    onClick={
                        function () {

                            setReportPostId(
                                null
                            );

                        }
                    }
                >

                    <div
                        className="delete-box"
                        onClick={
                            function (
                                event
                            ) {

                                event.stopPropagation();

                            }
                        }
                    >

                        <FiFlag className="report-big-icon" />

                        <h3>
                            Report post?
                        </h3>

                        <p>
                            Are you sure you want to report this post?
                        </p>


                        <button
                            className="confirm-delete"
                            onClick={
                                handleConfirmReport
                            }
                        >

                            Report

                        </button>


                        <button
                            onClick={
                                function () {

                                    setReportPostId(
                                        null
                                    );

                                }
                            }
                        >

                            Cancel

                        </button>

                    </div>

                </div>

            )}


            {/* ===========================
            STORY VIEWER
            =========================== */}
{/* ===========================
    STORY VIEWER
=========================== */}

{storyIndex !== null &&
 activeStoryGroup &&
 activeStoryGroup.length > 0 && (

    <StoryViewer

        stories={
            activeStoryGroup
        }

        storyIndex={
            storyIndex
        }

        currentUserImage={
            currentUserImage
        }

        currentUsername={
            currentUsername
        }

        currentUserId={
            currentUserId
        }

        onClose={
            handleStoryClose
        }

        onPrevious={
            handlePreviousStory
        }

        onNext={
            handleNextStory
        }

    />

)}

            {/* ===========================
            TOAST
            =========================== */}

            {toast && (

                <div className="home-toast">

                    {toast}

                </div>

            )}


            {/* ===========================
            BOTTOM NAV
            =========================== */}

            <div className="bottom-nav">

                <button
                    className="icon-btn active"
                    onClick={
                        handleHome
                    }
                >

                    <FiHome />

                </button>


                <button
                    className="icon-btn"
                    onClick={
                        handleSearch
                    }
                >

                    <FiSearch />

                </button>


                <button
                    className="icon-btn"
                    onClick={
                        function () {

                            setCreateMenuOpen(
                                true
                            );

                        }
                    }
                >

                    <FiPlusSquare />

                </button>


                <button
                    className="icon-btn"
                    onClick={
                        handleReels
                    }
                >

                    <FiVideo />

                </button>


                <button
                    className="icon-btn"
                    onClick={
                        handleProfile
                    }
                >

                    <FiUser />

                </button>

            </div>

        </div>

    );

}


// ===========================
// Helper
// ===========================

function postCommentsForModal(
    comments,
    postId
) {

    return (
        comments[postId] || []
    );

}


export default Home;