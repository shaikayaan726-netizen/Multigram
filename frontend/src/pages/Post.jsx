import { useEffect, useState, useRef } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FiArrowLeft,
    FiMoreHorizontal,
    FiHeart,
    FiMessageCircle,
    FiSend,
    FiBookmark,
    FiMusic,
    FiMapPin,
    FiUser,
    FiX
} from "react-icons/fi";

import { api } from "../utils/api";



function Post() {

    const navigate = useNavigate();

    const { postId } = useParams();


    // ==========================================
    // POST
    // ==========================================

    const [post, setPost] =
        useState(null);


    // ==========================================
    // CURRENT USER
    // ==========================================

    const [currentUser, setCurrentUser] =
        useState(null);


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // ==========================================
    // AUDIO PLAYER REF
    // ==========================================

    const audioRef = useRef(null);

const audioTimerRef = useRef(null);
    // ==========================================
    // MENU
    // ==========================================

    const [showMenu, setShowMenu] =
        useState(false);


    // ==========================================
    // COMMENTS
    // ==========================================

    const [comments, setComments] =
        useState([]);


    const [showComments, setShowComments] =
        useState(false);


    const [commentText, setCommentText] =
        useState("");


    const [replyingTo, setReplyingTo] =
        useState(null);


    const [commentsLoading, setCommentsLoading] =
        useState(false);


    // ==========================================
    // ACTION LOADING
    // ==========================================

    const [likeLoading, setLikeLoading] =
        useState(false);


    const [saveLoading, setSaveLoading] =
        useState(false);


    // ==========================================
    // LOAD POST
    // ==========================================

    useEffect(function () {

        async function loadPost() {

            try {

                setLoading(true);

                setError("");


                if (!postId) {

                    throw new Error(
                        "Post ID is missing"
                    );

                }


                const response =
                    await api(
                        "/posts/" +
                        postId
                    );


                console.log(
                    "SINGLE POST RESPONSE:",
                    response
                );


                setPost(
                    response.post
                );

            }
            catch (error) {

                console.error(
                    "LOAD POST ERROR:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to load post"
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadPost();

    }, [postId]);

useEffect(function () {

    return function () {

        if (audioTimerRef.current) {
            clearTimeout(
                audioTimerRef.current
            );

            audioTimerRef.current =
                null;
        }

        if (audioRef.current) {

            audioRef.current.pause();

            audioRef.current.currentTime =
                0;
        }

    };

}, [postId]);
    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

    useEffect(function () {

        async function loadMe() {

            try {

                const response =
                    await api(
                        "/auth/me"
                    );


                setCurrentUser(
                    response.user
                );

            }
            catch (error) {

                console.error(
                    "LOAD USER ERROR:",
                    error
                );

            }

        }


        loadMe();

    }, []);


    // ==========================================
    // LOAD COMMENTS
    // ==========================================

    async function loadComments() {

        if (!postId) {

            return;

        }


        try {

            setCommentsLoading(true);


            const response =
                await api(
                    "/comments/" +
                    postId
                );


            setComments(
                Array.isArray(
                    response.comments
                )
                    ? response.comments
                    : []
            );

        }
        catch (error) {

            console.error(
                "LOAD COMMENTS ERROR:",
                error
            );

        }
        finally {

            setCommentsLoading(false);

        }

    }


    // ==========================================
    // OPEN COMMENTS
    // ==========================================

    async function handleComments() {

        setShowComments(true);

        await loadComments();

    }


    // ==========================================
    // BACK
    // ==========================================

    function handleBack() {

        navigate(-1);

    }


    // ==========================================
    // PROFILE
    // ==========================================

    function handleProfile() {

        if (
            !post ||
            !post.author ||
            !post.author.username
        ) {

            return;

        }


        navigate(
            "/profile/" +
            post.author.username
        );

    }


    // ==========================================
    // EDIT POST
    // ==========================================

    function handleEdit() {

        if (!post) {

            return;

        }


        setShowMenu(false);


        navigate(
            "/editpost",
            {
                state: {

                    postId:
                        post._id,

                    postImage:
                        post.image,

                    caption:
                        post.caption || "",

                    textOverlay:
                        post.textOverlay || null,

                    textFont:
                        post.textFont || null,

                    textColor:
                        post.textColor || null,

                    selectedFilter:
                        post.filter || null,

                    adjustments:
                        post.adjustments || {},

                    audio:
                        post.audio || null,

                    taggedUser:
                        post.taggedUser || null,

                    selectedLocation:
                        post.location || null

                }

            }
        );

    }


    // ==========================================
    // DELETE POST
    // ==========================================

    async function handleDelete() {

        if (!post) {

            return;

        }


        setShowMenu(false);


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this post?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await api(
                "/posts/" +
                post._id,
                {

                    method:
                        "DELETE"

                }
            );


            alert(
                "Post deleted successfully"
            );


            navigate(
                "/profile"
            );

        }
        catch (error) {

            console.error(
                "DELETE POST ERROR:",
                error
            );


            alert(
                error.message ||
                "Failed to delete post"
            );

        }

    }


    // ==========================================
    // POST LIKE
    // ==========================================

    async function handleLike() {

        if (
            !post ||
            likeLoading
        ) {

            return;

        }


        try {

            setLikeLoading(true);


            const response =
                await api(
                    "/posts/" +
                    post._id +
                    "/like",
                    {

                        method:
                            "POST"

                    }
                );


            setPost(function (previous) {

                if (!previous) {

                    return previous;

                }


                const likes =
                    Array.isArray(
                        previous.likes
                    )
                        ? [
                            ...previous.likes
                        ]
                        : [];


                const userId =
                    currentUser?._id ||
                    currentUser?.id;


                if (response.liked) {

                    if (
                        userId &&
                        !likes.some(
                            function (id) {

                                return (
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

                    const filtered =
                        likes.filter(
                            function (id) {

                                return (
                                    !userId ||
                                    id.toString() !==
                                    userId.toString()
                                );

                            }
                        );


                    return {

                        ...previous,

                        likes:
                            filtered

                    };

                }


                return {

                    ...previous,

                    likes

                };

            });

        }
        catch (error) {

            console.error(
                "LIKE POST ERROR:",
                error
            );

        }
        finally {

            setLikeLoading(false);

        }

    }


    // ==========================================
    // CHECK POST LIKED
    // ==========================================

    function isPostLiked() {

        if (
            !post ||
            !currentUser
        ) {

            return false;

        }


        const userId =
            currentUser._id ||
            currentUser.id;


        if (!userId) {

            return false;

        }


        return (
            Array.isArray(post.likes) &&
            post.likes.some(
                function (id) {

                    return (
                        id.toString() ===
                        userId.toString()
                    );

                }
            )
        );

    }


    // ==========================================
    // SAVE / UNSAVE
    // ==========================================

// ==========================================
// SAVE / UNSAVE
// ==========================================

async function handleSave() {

    console.log("SAVE CLICK");

    if (
        !post ||
        saveLoading
    ) {
        console.log(
            "SAVE BLOCKED:",
            {
                postExists: !!post,
                saveLoading
            }
        );

        return;
    }

    console.log(
        "SAVE POST ID:",
        post._id
    );

    try {

        setSaveLoading(true);

        const response =
            await api(
                "/posts/" +
                post._id +
                "/save",
                {
                    method: "POST"
                }
            );

        console.log(
            "SAVE RESPONSE:",
            response
        );

        const userId =
            currentUser?._id ||
            currentUser?.id;

        setPost(function (previous) {

            if (!previous) {
                return previous;
            }

            let saves =
                Array.isArray(
                    previous.saves
                )
                    ? [
                        ...previous.saves
                    ]
                    : [];

            if (response.saved) {

                if (
                    userId &&
                    !saves.some(
                        function (id) {

                            return (
                                id.toString() ===
                                userId.toString()
                            );

                        }
                    )
                ) {

                    saves.push(userId);

                }

            }
            else {

                saves =
                    saves.filter(
                        function (id) {

                            return (
                                !userId ||
                                id.toString() !==
                                userId.toString()
                            );

                        }
                    );

            }

            return {
                ...previous,
                saves
            };

        });

    }
    catch (error) {

        console.error(
            "SAVE POST ERROR:",
            error
        );

    }
    finally {

        setSaveLoading(false);

    }

}


    // ==========================================
    // CHECK SAVED
    // ==========================================

    function isPostSaved() {

        if (
            !post ||
            !currentUser
        ) {

            return false;

        }


        const userId =
            currentUser._id ||
            currentUser.id;


        if (!userId) {

            return false;

        }


        return (
            Array.isArray(post.saves) &&
            post.saves.some(
                function (id) {

                    return (
                        id.toString() ===
                        userId.toString()
                    );

                }
            )
        );

    }


    // ==========================================
    // ADD COMMENT
    // ==========================================

    async function handleAddComment() {

        const text =
            commentText.trim();


        if (!text) {

            return;

        }


        try {

            const response =
                await api(
                    "/comments/" +
                    post._id,
                    {

                        method:
                            "POST",

                        body:
                            JSON.stringify({

                                text:

                                    text,

                                parentComment:
                                    replyingTo
                                        ? replyingTo._id
                                        : null

                            })

                    }
                );


            if (
                response.comment
            ) {

                if (replyingTo) {

                    setComments(
                        function (previous) {

                            return previous.map(
                                function (comment) {

                                    if (
                                        comment._id ===
                                        replyingTo._id
                                    ) {

                                        return {

                                            ...comment,

                                            replies: [

                                                ...(comment.replies || []),

                                                response.comment

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
                        function (previous) {

                            return [

                                ...previous,

                                {

                                    ...response.comment,

                                    replies: []

                                }

                            ];

                        }
                    );

                }

            }


            setCommentText("");

            setReplyingTo(null);

        }
        catch (error) {

            console.error(
                "ADD COMMENT ERROR:",
                error
            );


            alert(
                error.message ||
                "Failed to add comment"
            );

        }

    }


    // ==========================================
    // LIKE COMMENT
    // ==========================================

    async function handleCommentLike(
        commentId,
        isReply = false,
        parentId = null
    ) {

        try {

            const response =
                await api(
                    "/comments/" +
                    commentId +
                    "/like",
                    {

                        method:
                            "POST"

                    }
                );


            setComments(
                function (previous) {

                    return previous.map(
                        function (comment) {

                            if (
                                !isReply &&
                                comment._id ===
                                commentId
                            ) {

                                return {

                                    ...comment,

                                    likes:
                                        createUpdatedLikes(
                                            comment.likes,
                                            response,
                                            currentUser
                                        )

                                };

                            }


                            if (
                                isReply &&
                                comment._id ===
                                parentId
                            ) {

                                return {

                                    ...comment,

                                    replies:
                                        (
                                            comment.replies ||
                                            []
                                        ).map(
                                            function (reply) {

                                                if (
                                                    reply._id ===
                                                    commentId
                                                ) {

                                                    return {

                                                        ...reply,

                                                        likes:
                                                            createUpdatedLikes(
                                                                reply.likes,
                                                                response,
                                                                currentUser
                                                            )

                                                    };

                                                }


                                                return reply;

                                            }
                                        )

                                };

                            }


                            return comment;

                        }
                    );

                }
            );

        }
        catch (error) {

            console.error(
                "COMMENT LIKE ERROR:",
                error
            );

        }

    }


    // ==========================================
    // UPDATED COMMENT LIKES
    // ==========================================

    function createUpdatedLikes(
        existingLikes,
        response,
        user
    ) {

        let likes =
            Array.isArray(
                existingLikes
            )
                ? [
                    ...existingLikes
                ]
                : [];


        const userId =
            user?._id ||
            user?.id;


        if (!userId) {

            return likes;

        }


        if (response.liked) {

            if (
                !likes.some(
                    function (id) {

                        return (
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
                            id.toString() !==
                            userId.toString()
                        );

                    }
                );

        }


        return likes;

    }


    // ==========================================
    // COMMENT LIKED
    // ==========================================

    function isCommentLiked(
        comment
    ) {

        const userId =
            currentUser?._id ||
            currentUser?.id;


        if (!userId) {

            return false;

        }


        return (
            Array.isArray(
                comment.likes
            ) &&
            comment.likes.some(
                function (id) {

                    return (
                        id.toString() ===
                        userId.toString()
                    );

                }
            )
        );

    }


    // ==========================================
    // REPLY
    // ==========================================

    function handleReply(
        comment
    ) {

        setReplyingTo(
            comment
        );

        setShowComments(
            true
        );

    }


    // ==========================================
    // IMAGE URL
    // ==========================================

    function getImageUrl(
        image
    ) {

        if (!image) {

            return "";

        }


        if (
            image.startsWith("http")
        ) {

            return image;

        }


        return image;

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="post-page">

                <div className="post-loading">

                    Loading...

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        error ||
        !post
    ) {

        return (

            <div className="post-page">

                <div className="post-error">

                    <button
                        onClick={handleBack}
                    >

                        <FiArrowLeft />

                    </button>


                    <p>

                        {error ||
                            "Post not found"}

                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // OWNER
    // ==========================================

    const authorId =
        post.author?._id ||
        post.author?.id;


    const currentUserId =
        currentUser?._id ||
        currentUser?.id;


    const isOwner =
        authorId &&
        currentUserId &&
        authorId.toString() ===
        currentUserId.toString();


    // ==========================================
    // AUDIO
    // ==========================================

    const audio =
        post.audio &&
        post.audio.title
            ? post.audio
            : null;

// ==========================================
    // LOCATION
    // ==========================================

    const location =
        post.location &&
        post.location.name
            ? post.location
            : null;


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="post-page">


            {/* ======================================
                NAVBAR
            ====================================== */}

            <div className="post-nav">

                <button
                    className="post-back-btn"
                    onClick={handleBack}
                >

                    <FiArrowLeft />

                </button>


                <div
                    className="post-nav-user"
                    onClick={handleProfile}
                >

                    <img
                        src={
                            post.author?.profilePicture ||
                            "/default-avatar.jpg"
                        }
                        alt={
                            post.author?.username ||
                            "user"
                        }
                    />


                    <strong>

                        {
                            post.author?.username ||
                            "Unknown user"
                        }

                    </strong>

                </div>


                {/* ==================================
                    THREE DOTS
                ================================== */}

                {isOwner && (

                    <div className="post-menu-wrapper">

                        <button
                            className="post-more-btn"
                            onClick={
                                function () {

                                    setShowMenu(
                                        function (value) {

                                            return !value;

                                        }
                                    );

                                }
                            }
                        >

                            <FiMoreHorizontal />

                        </button>


                        {showMenu && (

                            <div className="post-menu">

                                <button
                                    onClick={
                                        handleEdit
                                    }
                                >

                                    Edit post

                                </button>


                                <button
                                    className="delete-option"
                                    onClick={
                                        handleDelete
                                    }
                                >

                                    Delete post

                                </button>

                            </div>

                        )}

                    </div>

                )}

            </div>


            {/* ======================================
                IMAGE
            ====================================== */}

            <div className="post-image-container">

                <img
                    src={
                        getImageUrl(
                            post.image
                        )
                    }
                    alt="post"
                    className="post-main-image"
                />

            </div>


            {/* ======================================
                ACTIONS
            ====================================== */}

            <div className="post-actions">

                <div className="post-actions-left">

                    <button
                        className={
                            isPostLiked()
                                ? "post-action liked"
                                : "post-action"
                        }
                        onClick={
                            handleLike
                        }
                    >

                        <FiHeart 
                          fill={isPostLiked() ? "currentColor" : "none"}/>

                    </button>


                    <button
                        className="post-action"
                        onClick={
                            handleComments
                        }
                    >

                        <FiMessageCircle />

                    </button>


                    <button
                        className="post-action"
                    >

                        <FiSend />

                    </button>

                </div>


                <button
    type="button"
    className={
        isPostSaved()
            ? "post-action saved"
            : "post-action"
    }
    onClick={handleSave}
>
    <FiBookmark
    fill={isPostSaved() ? "currentColor" : "none"} />
</button>

            </div>


            {/* ======================================
                LIKES
            ====================================== */}

            <div className="post-likes">

                {
                    Array.isArray(
                        post.likes
                    )
                        ? post.likes.length
                        : 0
                }

                {" "}

                {
                    Array.isArray(
                        post.likes
                    ) &&
                    post.likes.length === 1
                        ? "like"
                        : "likes"
                }

            </div>


            {/* ======================================
                CAPTION
            ====================================== */}

            {post.caption && (

                <div className="post-caption">

                    <strong>

                        {
                            post.author?.username
                        }

                    </strong>

                    {" "}

                    <span>

                        {
                            post.caption
                        }

                    </span>

                </div>

            )}


            {/* ======================================
                COMMENTS PREVIEW
            ====================================== */}

            {comments.length > 0 && (

                <button
                    className="view-comments-btn"
                    onClick={
                        handleComments
                    }
                >

                    View all{" "}
                    {comments.length}{" "}
                    comments

                </button>

            )}


            {/* ======================================
                TAGGED USER
            ====================================== */}

            {post.taggedUser && (

                <div className="post-extra-info">

                    <FiUser />

                    <span>

                        Tagged @
                        {
                            post.taggedUser.username
                        }

                    </span>

                </div>

            )}


            {/* ======================================
                LOCATION
            ====================================== */}

            {location && (

                <div className="post-extra-info">

                    <FiMapPin />

                    <div>

                        <strong>

                            {
                                location.name
                            }

                        </strong>


                        {location.subtitle && (

                            <small>

                                {
                                    location.subtitle
                                }

                            </small>

                        )}

                    </div>

                </div>

            )}


            {/* ======================================
                AUDIO
            ====================================== */}
{/* ======================================
    AUDIO
====================================== */}
{audio && audio.audioUrl && (
    <div className="post-audio-info">

        <FiMusic />

        <div>

            <strong>
                {audio.title}
            </strong>

            {audio.channel && (
                <small>
                    {audio.channel}
                </small>
            )}

            <span>
                {audio.startTime ?? 0}s
                {" - "}
                {(audio.startTime ?? 0) +
                    (audio.duration ?? 30)}s
            </span>

            <audio
                ref={audioRef}
                src={audio.audioUrl}
                controls
                preload="metadata"

                onLoadedMetadata={
                    function () {

                        const player =
                            audioRef.current;

                        if (!player) {
                            return;
                        }

                        const start =
                            Number(
                                audio.startTime
                            ) || 0;

                        const clipDuration =
                            Number(
                                audio.duration
                            ) || 30;

                        const clipEnd =
                            start +
                            clipDuration;

                        try {

                            /*
                             * Always begin from
                             * the selected start.
                             */
                            player.currentTime =
                                start;

                            /*
                             * Start the selected
                             * portion automatically.
                             */
                            const playPromise =
                                player.play();

                            if (
                                playPromise &&
                                typeof playPromise.catch ===
                                    "function"
                            ) {

                                playPromise.catch(
                                    function (error) {

                                        console.warn(
                                            "POST AUDIO AUTOPLAY BLOCKED:",
                                            error
                                        );

                                    }
                                );

                            }

                        }
                        catch (error) {

                            console.warn(
                                "POST AUDIO START ERROR:",
                                error
                            );

                        }

                    }
                }

                onTimeUpdate={
                    function () {

                        const player =
                            audioRef.current;

                        if (!player) {
                            return;
                        }

                        const start =
                            Number(
                                audio.startTime
                            ) || 0;

                        const clipDuration =
                            Number(
                                audio.duration
                            ) || 30;

                        const clipEnd =
                            start +
                            clipDuration;

                        /*
                         * Selected portion finished.
                         * Immediately jump back to the
                         * selected start and replay.
                         */
                        if (
                            player.currentTime >=
                            clipEnd
                        ) {

                            try {

                                player.pause();

                                player.currentTime =
                                    start;

                                const playPromise =
                                    player.play();

                                if (
                                    playPromise &&
                                    typeof playPromise.catch ===
                                        "function"
                                ) {

                                    playPromise.catch(
                                        function (error) {

                                            console.warn(
                                                "POST AUDIO LOOP ERROR:",
                                                error
                                            );

                                        }
                                    );

                                }

                            }
                            catch (error) {

                                console.warn(
                                    "POST AUDIO LOOP SEEK ERROR:",
                                    error
                                );

                            }

                        }

                    }
                }

                onEnded={
                    function () {

                        const player =
                            audioRef.current;

                        if (!player) {
                            return;
                        }

                        const start =
                            Number(
                                audio.startTime
                            ) || 0;

                        try {

                            player.currentTime =
                                start;

                            const playPromise =
                                player.play();

                            if (
                                playPromise &&
                                typeof playPromise.catch ===
                                    "function"
                            ) {

                                playPromise.catch(
                                    function () {}
                                );

                            }

                        }
                        catch {
                            // Ignore playback restart errors
                        }

                    }
                }
            />

        </div>

    </div>
)}
            {/* ======================================
                COMMENTS MODAL
            ====================================== */}

            {showComments && (

                <div
                    className="comments-overlay"
                    onClick={
                        function () {

                            setShowComments(
                                false
                            );

                        }
                    }
                >

                    <div
                        className="comments-modal"
                        onClick={
                            function (event) {

                                event.stopPropagation();

                            }
                        }
                    >

                        {/* HEADER */}

                        <div className="comments-header">

                            <h2>
                                Comments
                            </h2>


                            <button
                                onClick={
                                    function () {

                                        setShowComments(
                                            false
                                        );

                                    }
                                }
                            >

                                <FiX />

                            </button>

                        </div>


                        {/* COMMENTS */}

                        <div className="comments-list">

                            {commentsLoading ? (

                                <p className="comments-loading">

                                    Loading comments...

                                </p>

                            ) : comments.length === 0 ? (

                                <p className="no-comments">

                                    No comments yet.

                                </p>

                            ) : (

                                comments.map(
                                    function (
                                        comment
                                    ) {

                                        return (

                                            <div
                                                className="comment-block"
                                                key={
                                                    comment._id
                                                }
                                            >

                                                <div className="comment-row">

                                                    <img
                                                        src={
                                                            comment.author?.profilePicture ||
                                                            "/default-avatar.jpg"
                                                        }
                                                        alt=""
                                                    />


                                                    <div className="comment-content">

                                                        <p>

                                                            <strong>

                                                                {
                                                                    comment.author?.username
                                                                }

                                                            </strong>

                                                            {" "}

                                                            {
                                                                comment.text
                                                            }

                                                        </p>


                                                        <div className="comment-meta">

                                                            <span>

                                                                {
                                                                    Array.isArray(
                                                                        comment.likes
                                                                    )
                                                                        ? comment.likes.length
                                                                        : 0
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

                                                    </div>


                                                    <button
                                                        className={
                                                            isCommentLiked(
                                                                comment
                                                            )
                                                                ? "comment-like liked"
                                                                : "comment-like"
                                                        }
                                                        onClick={
                                                            function () {

                                                                handleCommentLike(
                                                                    comment._id
                                                                );

                                                            }
                                                        }
                                                    >

                                                       <FiHeart
    fill={
        isCommentLiked(comment)
            ? "currentColor"
            : "none"
    }
/>

                                                    </button>

                                                </div>


                                                {/* REPLIES */}

                                                {Array.isArray(
                                                    comment.replies
                                                ) &&
                                                comment.replies.length > 0 && (

                                                    <div className="comment-replies">

                                                        {comment.replies.map(
                                                            function (
                                                                reply
                                                            ) {

                                                                return (

                                                                    <div
                                                                        className="comment-row reply-row"
                                                                        key={
                                                                            reply._id
                                                                        }
                                                                    >

                                                                        <img
                                                                            src={
                                                                                reply.author?.profilePicture ||
                                                                                "/default-avatar.jpg"
                                                                            }
                                                                            alt=""
                                                                        />


                                                                        <div className="comment-content">

                                                                            <p>

                                                                                <strong>

                                                                                    {
                                                                                        reply.author?.username
                                                                                    }

                                                                                </strong>

                                                                                {" "}

                                                                                {
                                                                                    reply.text
                                                                                }

                                                                            </p>


                                                                            <div className="comment-meta">

                                                                                <span>

                                                                                    {
                                                                                        Array.isArray(
                                                                                            reply.likes
                                                                                        )
                                                                                            ? reply.likes.length
                                                                                            : 0
                                                                                    }{" "}

                                                                                    likes

                                                                                </span>

                                                                            </div>

                                                                        </div>


                                                                        <button
                                                                            className={
                                                                                isCommentLiked(
                                                                                    reply
                                                                                )
                                                                                    ? "comment-like liked"
                                                                                    : "comment-like"
                                                                            }
                                                                            onClick={
                                                                                function () {

                                                                                    handleCommentLike(
                                                                                        reply._id,
                                                                                        true,
                                                                                        comment._id
                                                                                    );

                                                                                }
                                                                            }
                                                                        >

                                                                          <FiHeart
    fill={
        isCommentLiked(reply)
            ? "currentColor"
            : "none"
    }
/>

                                                                        </button>

                                                                    </div>

                                                                );

                                                            }
                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        );

                                    }
                                )

                            )}

                        </div>


                        {/* REPLY INDICATOR */}

                        {replyingTo && (

                            <div className="replying-bar">

                                Replying to @
                                {
                                    replyingTo.author?.username
                                }

                                <button
                                    onClick={
                                        function () {

                                            setReplyingTo(
                                                null
                                            );

                                        }
                                    }
                                >

                                    <FiX />

                                </button>

                            </div>

                        )}


                        {/* INPUT */}

                        <div className="comment-input-area">

                            <img
                                src={
                                    currentUser?.profilePicture ||
                                    "/default-avatar.jpg"
                                }
                                alt=""
                            />


                            <input
                                type="text"
                                placeholder={
                                    replyingTo
                                        ? "Write a reply..."
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
                            >

                                Post

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Post;