// ==========================================
// IMPORTS
// ==========================================

import mongoose from "mongoose";

import Post from "../models/Post.js";

import User from "../models/User.js";

import fs from "fs";
import path from "path";
// ==========================================
// CREATE POST
// POST /api/posts
// ==========================================

export async function createPost(req, res) {

    try {

        // ======================================
        // LOGGED-IN USER
        // ======================================

        const userId =
            req.user.id;


        // ======================================
        // REQUEST DATA
        // ======================================

        const {
            caption,
            textOverlay,
            textFont,
            textColor,
            filter,
            adjustments,
            taggedUser,
            location,
            audio
        } = req.body;


        // ======================================
        // IMAGE
        // ======================================

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Post image is required"

            });

        }


        // ======================================
        // CHECK USER
        // ======================================

        const user =
            await User.findById(
                userId
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ======================================
        // CHECK DEACTIVATED
        // ======================================

        if (
            user.isDeactivated
        ) {

            return res.status(403).json({

                message:
                    "This account is deactivated"

            });

        }


        // ======================================
        // PARSE JSON DATA
        // ======================================

        let parsedAdjustments =
            {};

        let parsedLocation =
            null;

        let parsedAudio =
            null;


        try {

            if (
                adjustments
            ) {

                parsedAdjustments =
                    typeof adjustments === "string"
                        ? JSON.parse(adjustments)
                        : adjustments;

            }


            if (
                location
            ) {

                parsedLocation =
                    typeof location === "string"
                        ? JSON.parse(location)
                        : location;

            }


            if (
                audio
            ) {

                parsedAudio =
                    typeof audio === "string"
                        ? JSON.parse(audio)
                        : audio;

            }

        }
        catch (parseError) {

            return res.status(400).json({

                message:
                    "Invalid post data"

            });

        }


        // ======================================
        // AUDIO 30 SECOND LIMIT
        // ======================================

        if (
            parsedAudio &&
            parsedAudio.duration !== undefined
        ) {

            const duration =
                Number(
                    parsedAudio.duration
                );


            if (
                Number.isNaN(duration) ||
                duration < 0 ||
                duration > 30
            ) {

                return res.status(400).json({

                    message:
                        "Audio duration cannot exceed 30 seconds"

                });

            }

        }


        // ======================================
        // TAGGED USER
        // ======================================

        let taggedUserId =
            null;


        if (
            taggedUser
        ) {

            if (
                typeof taggedUser === "object"
            ) {

                taggedUserId =
                    taggedUser._id ||
                    taggedUser.id ||
                    null;

            }
            else {

                taggedUserId =
                    taggedUser;

            }


            if (
                taggedUserId &&
                !mongoose.Types.ObjectId.isValid(
                    taggedUserId
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid tagged user"

                });

            }

        }


        // ======================================
        // IMAGE PATH
        // ======================================

        const image =
            "/uploads/posts/" +
            req.file.filename;


        // ======================================
        // CREATE POST
        // ======================================

        const post =
            await Post.create({

                author:
                    userId,

                image:
                    image,

                caption:
                    caption
                        ? String(caption).trim()
                        : "",

                textOverlay:
                    textOverlay
                        ? String(textOverlay)
                        : "",

                textFont:
                    textFont
                        ? String(textFont)
                        : "",

                textColor:
                    textColor
                        ? String(textColor)
                        : "",

                filter:
                    filter
                        ? String(filter)
                        : "",

                adjustments:
                    parsedAdjustments || {},

                taggedUser:
                    taggedUserId,

                location:
                    parsedLocation || null,

                audio:
                    parsedAudio || null,

                likes:
                    [],

                saves:
                    [],

                comments:
                    []

            });


        // ======================================
        // POPULATE USER
        // ======================================

        await post.populate([

            {

                path:
                    "author",

                select:
                    "fullName username profilePicture"

            },

            {

                path:
                    "taggedUser",

                select:
                    "fullName username profilePicture"

            }

        ]);


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            message:
                "Post created successfully",

            post

        });

    }
    catch (error) {

        console.error(
            "CREATE POST ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to create post"

        });

    }

}


// ==========================================
// GET FEED POSTS
// GET /api/posts
// ==========================================

export async function getPosts(req, res) {

    try {

        const posts =
            await Post.find({})

                .populate(
                    "author",
                    "fullName username profilePicture"
                )

                .populate(
                    "taggedUser",
                    "fullName username profilePicture"
                )

                .sort({

                    createdAt:
                        -1

                });


        return res.json({

            posts

        });

    }
    catch (error) {

        console.error(
            "GET POSTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load posts"

        });

    }

}


// ==========================================
// GET SINGLE POST
// GET /api/posts/:postId
// ==========================================

export async function getPost(
    req,
    res
) {

    try {

        const {
            postId
        } = req.params;


        // ======================================
        // VALIDATE ID
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
        // FIND POST
        // ======================================

        const post =
            await Post.findById(
                postId
            )

                .populate(
                    "author",
                    "fullName username profilePicture"
                )

                .populate(
                    "taggedUser",
                    "fullName username profilePicture"
                );


        if (!post) {

            return res.status(404).json({

                message:
                    "Post not found"

            });

        }


        return res.json({

            post

        });

    }
    catch (error) {

        console.error(
            "GET POST ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load post"

        });

    }

}


// ==========================================
// GET USER POSTS
// GET /api/posts/user/:userId
// ==========================================

export async function getUserPosts(
    req,
    res
) {

    try {

        const {
            userId
        } = req.params;


        // ======================================
        // VALIDATE USER ID
        // ======================================

        if (
            !mongoose.Types.ObjectId.isValid(
                userId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid user ID"

            });

        }


        // ======================================
        // CHECK USER
        // ======================================

        const user =
            await User.findById(
                userId
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ======================================
        // GET POSTS
        // ======================================

        const posts =
            await Post.find({

                author:
                    userId

            })

                .populate(
                    "author",
                    "fullName username profilePicture"
                )

                .populate(
                    "taggedUser",
                    "fullName username profilePicture"
                )

                .sort({

                    createdAt:
                        -1

                });


        return res.json({

            posts

        });

    }
    catch (error) {

        console.error(
            "GET USER POSTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load user posts"

        });

    }

}


// ==========================================
// UPDATE POST
// PUT /api/posts/:postId
// ==========================================

export async function updatePost(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        const {
            postId
        } = req.params;


        // ======================================
        // VALIDATE POST ID
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
        // FIND POST
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
        // OWNER CHECK
        // ======================================

        if (
            post.author.toString() !==
            userId.toString()
        ) {

            return res.status(403).json({

                message:
                    "You can only edit your own post"

            });

        }


        // ======================================
        // REQUEST DATA
        // ======================================

        const {
            caption,
            textOverlay,
            textFont,
            textColor,
            filter,
            adjustments,
            taggedUser,
            location,
            audio
        } = req.body;


        // ======================================
        // BASIC FIELDS
        // ======================================

        if (
            caption !== undefined
        ) {

            post.caption =
                String(caption).trim();

        }


        if (
            textOverlay !== undefined
        ) {

            post.textOverlay =
                String(textOverlay);

        }


        if (
            textFont !== undefined
        ) {

            post.textFont =
                String(textFont);

        }


        if (
            textColor !== undefined
        ) {

            post.textColor =
                String(textColor);

        }


        if (
            filter !== undefined
        ) {

            post.filter =
                String(filter);

        }


        // ======================================
        // ADJUSTMENTS
        // ======================================

        if (
            adjustments !== undefined
        ) {

            post.adjustments =
                typeof adjustments === "string"
                    ? JSON.parse(adjustments)
                    : adjustments;

        }


        // ======================================
        // TAGGED USER
        // ======================================

        if (
            taggedUser !== undefined
        ) {

            if (
                taggedUser === null ||
                taggedUser === ""
            ) {

                post.taggedUser =
                    null;

            }
            else {

                let taggedUserId =
                    taggedUser;


                if (
                    typeof taggedUser === "object"
                ) {

                    taggedUserId =
                        taggedUser._id ||
                        taggedUser.id ||
                        null;

                }


                if (
                    taggedUserId &&
                    mongoose.Types.ObjectId.isValid(
                        taggedUserId
                    )
                ) {

                    post.taggedUser =
                        taggedUserId;

                }

            }

        }


        // ======================================
        // LOCATION
        // ======================================

        if (
            location !== undefined
        ) {

            post.location =
                typeof location === "string"
                    ? JSON.parse(location)
                    : location;

        }


        // ======================================
        // AUDIO
        // ======================================

        if (
            audio !== undefined
        ) {

            const parsedAudio =
                typeof audio === "string"
                    ? JSON.parse(audio)
                    : audio;


            if (
                parsedAudio &&
                parsedAudio.duration !== undefined
            ) {

                const duration =
                    Number(
                        parsedAudio.duration
                    );


                if (
                    Number.isNaN(duration) ||
                    duration < 0 ||
                    duration > 30
                ) {

                    return res.status(400).json({

                        message:
                            "Audio duration cannot exceed 30 seconds"

                    });

                }

            }


            post.audio =
                parsedAudio;

        }


        // ======================================
        // NEW IMAGE
        // ======================================

        if (
            req.file
        ) {

            post.image =
                "/uploads/posts/" +
                req.file.filename;

        }


        // ======================================
        // SAVE
        // ======================================

        await post.save();


        // ======================================
        // POPULATE
        // ======================================

        await post.populate([

            {

                path:
                    "author",

                select:
                    "fullName username profilePicture"

            },

            {

                path:
                    "taggedUser",

                select:
                    "fullName username profilePicture"

            }

        ]);


        return res.json({

            message:
                "Post updated successfully",

            post

        });

    }
    catch (error) {

        console.error(
            "UPDATE POST ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to update post"

        });

    }

}


// ==========================================
// DELETE POST
// DELETE /api/posts/:postId
// ==========================================

export async function deletePost(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        const {
            postId
        } = req.params;


        // ======================================
        // VALIDATE
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
        // FIND
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
        // OWNER CHECK
        // ======================================

        if (
            post.author.toString() !==
            userId.toString()
        ) {

            return res.status(403).json({

                message:
                    "You can only delete your own post"

            });

        }


        // ======================================
        // DELETE
        // ======================================
        // ==========================================
// DELETE POST DOCUMENT
// ==========================================

await Post.findByIdAndDelete(postId);

return res.json({
    message: "Post deleted successfully"
});

        // ==========================================
        // DELETE POST DOCUMENT
        // ==========================================

        await Post.findByIdAndDelete(postId);

        return res.json({
            message: "Post deleted successfully"
        });

    }
    catch (error) {

        console.error(
            "DELETE POST ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to delete post"

        });

    }

}