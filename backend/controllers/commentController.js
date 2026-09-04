// ==========================================
// IMPORTS
// ==========================================

import mongoose from "mongoose";

import Comment from "../models/Comment.js";

import Post from "../models/Post.js";

import Reel from "../models/Reel.js";
// ==========================================
// GET COMMENTS
// GET /api/comments/:postId
// ==========================================

export async function getComments(req, res) {

    try {

        const { postId } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(
                postId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid post ID"

            });

        }


        const comments =
            await Comment.find({

                post: postId,

                parentComment: null

            })
                .populate(
                    "author",
                    "fullName username profilePicture"
                )
                .sort({

                    createdAt: 1

                });


        const replies =
            await Comment.find({

                post: postId,

                parentComment: {
                    $ne: null
                }

            })
                .populate(
                    "author",
                    "fullName username profilePicture"
                )
                .sort({

                    createdAt: 1

                });


        const formattedComments =
            comments.map(function (comment) {

                const commentReplies =
                    replies.filter(
                        function (reply) {

                            return (
                                reply.parentComment &&
                                reply.parentComment.toString() ===
                                comment._id.toString()
                            );

                        }
                    );


                return {

                    ...comment.toObject(),

                    replies:
                        commentReplies

                };

            });


        return res.json({

            comments:
                formattedComments

        });

    }
    catch (error) {

        console.error(
            "GET COMMENTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load comments"

        });

    }

}


// ==========================================
// CREATE COMMENT / REPLY
// POST /api/comments/:postId
// ==========================================

export async function createComment(req, res) {

    try {

        const userId =
            req.user.id;

        const { postId } =
            req.params;


        const {
            text,
            parentComment
        } = req.body;


        // ======================================
        // VALIDATE POST
        // ======================================

        if (
            !mongoose.Types.ObjectId.isValid(
                postId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid post ID"

            });

        }


        // ======================================
        // TEXT
        // ======================================

        if (
            !text ||
            !String(text).trim()
        ) {

            return res.status(400).json({

                message:
                    "Comment cannot be empty"

            });

        }


        // ======================================
        // CHECK POST
        // ======================================

        const post =
            await Post.findById(
                postId
            );


        if (!post) {

            return res.status(404).json({

                message:
                    "Post not found"

            });

        }


        // ======================================
        // PARENT COMMENT
        // ======================================

        let parentId =
            null;


        if (parentComment) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    parentComment
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid parent comment"

                });

            }


            const parent =
                await Comment.findOne({

                    _id:
                        parentComment,

                    post:
                        postId

                });


            if (!parent) {

                return res.status(404).json({

                    message:
                        "Parent comment not found"

                });

            }


            parentId =
                parentComment;

        }


        // ======================================
        // CREATE
        // ======================================

        const comment =
            await Comment.create({

                post:
                    postId,

                author:
                    userId,

                text:
                    String(text).trim(),

                parentComment:
                    parentId,

                likes:
                    []

            });


        // ======================================
        // ADD TO POST
        // ======================================

        post.comments.push(
            comment._id
        );


        await post.save();


        // ======================================
        // POPULATE
        // ======================================

        await comment.populate(

            "author",

            "fullName username profilePicture"

        );


        return res.status(201).json({

            message:
                "Comment added successfully",

            comment

        });

    }
    catch (error) {

        console.error(
            "CREATE COMMENT ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to add comment"

        });

    }

}


// ==========================================
// LIKE / UNLIKE COMMENT
// POST /api/comments/:commentId/like
// ==========================================

export async function toggleCommentLike(
    req,
    res
) {

    try {

        const userId =
            req.user.id;

        const { commentId } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(
                commentId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid comment ID"

            });

        }


        const comment =
            await Comment.findById(
                commentId
            );


        if (!comment) {

            return res.status(404).json({

                message:
                    "Comment not found"

            });

        }


        const alreadyLiked =
            comment.likes.some(function (id) {

                return (
                    id.toString() ===
                    userId.toString()
                );

            });


        // ======================================
        // UNLIKE
        // ======================================

        if (alreadyLiked) {

            comment.likes =
                comment.likes.filter(
                    function (id) {

                        return (
                            id.toString() !==
                            userId.toString()
                        );

                    }
                );


            await comment.save();


            return res.json({

                liked: false,

                likes:
                    comment.likes.length

            });

        }


        // ======================================
        // LIKE
        // ======================================

        comment.likes.push(
            userId
        );


        await comment.save();


        return res.json({

            liked: true,

            likes:
                comment.likes.length

        });

    }
    catch (error) {

        console.error(
            "COMMENT LIKE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to like comment"

        });

    }

}
// ==========================================
// GET REEL COMMENTS
// GET /api/reel-comments/:reelId
// ==========================================

export async function getReelComments(req, res) {

    try {

        const { reelId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(reelId)
        ) {

            return res.status(400).json({
                message: "Invalid reel ID"
            });

        }

        const comments =
            await Comment.find({

                reel: reelId,

                parentComment: null

            })
                .populate(
                    "author",
                    "fullName username profilePicture"
                )
                .sort({
                    createdAt: 1
                });


        const replies =
            await Comment.find({

                reel: reelId,

                parentComment: {
                    $ne: null
                }

            })
                .populate(
                    "author",
                    "fullName username profilePicture"
                )
                .sort({
                    createdAt: 1
                });


        const formattedComments =
            comments.map(function (comment) {

                const commentReplies =
                    replies.filter(
                        function (reply) {

                            return (
                                reply.parentComment &&
                                reply.parentComment.toString() ===
                                comment._id.toString()
                            );

                        }
                    );


                return {

                    ...comment.toObject(),

                    replies:
                        commentReplies

                };

            });


        return res.json({

            comments:
                formattedComments

        });

    }
    catch (error) {

        console.error(
            "GET REEL COMMENTS ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to load reel comments"

        });

    }

}


// ==========================================
// CREATE REEL COMMENT / REPLY
// POST /api/reel-comments/:reelId
// ==========================================

export async function createReelComment(req, res) {

    try {

        const userId =
            req.user.id;

        const { reelId } =
            req.params;

        const {
            text,
            parentComment
        } = req.body;


        if (
            !mongoose.Types.ObjectId.isValid(reelId)
        ) {

            return res.status(400).json({

                message:
                    "Invalid reel ID"

            });

        }


        if (
            !text ||
            !String(text).trim()
        ) {

            return res.status(400).json({

                message:
                    "Comment cannot be empty"

            });

        }


        const reel =
            await Reel.findById(reelId);


        if (!reel) {

            return res.status(404).json({

                message:
                    "Reel not found"

            });

        }


        let parentId = null;


        if (parentComment) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    parentComment
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid parent comment"

                });

            }


            const parent =
                await Comment.findOne({

                    _id:
                        parentComment,

                    reel:
                        reelId

                });


            if (!parent) {

                return res.status(404).json({

                    message:
                        "Parent comment not found"

                });

            }


            parentId =
                parentComment;

        }


        const comment =
            await Comment.create({

                reel:
                    reelId,

                author:
                    userId,

                text:
                    String(text).trim(),

                parentComment:
                    parentId,

                likes:
                    []

            });


        reel.comments.push(
            comment._id
        );

        await reel.save();


        await comment.populate(

            "author",

            "fullName username profilePicture"

        );


        return res.status(201).json({

            message:
                "Comment added successfully",

            comment

        });

    }
    catch (error) {

        console.error(
            "CREATE REEL COMMENT ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to add reel comment"

        });

    }

}