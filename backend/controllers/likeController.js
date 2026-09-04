// ==========================================
// IMPORTS
// ==========================================

import mongoose from "mongoose";

import Post from "../models/Post.js";


// ==========================================
// LIKE / UNLIKE POST
// POST /api/posts/:postId/like
// ==========================================

export async function togglePostLike(req, res) {

    try {

        const userId =
            req.user.id;

        const { postId } =
            req.params;


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
        // CHECK LIKE
        // ======================================

        const alreadyLiked =
            post.likes.some(function (id) {

                return (
                    id.toString() ===
                    userId.toString()
                );

            });


        // ======================================
        // UNLIKE
        // ======================================

        if (alreadyLiked) {

            post.likes =
                post.likes.filter(function (id) {

                    return (
                        id.toString() !==
                        userId.toString()
                    );

                });


            await post.save();


            return res.json({

                liked: false,

                likes:
                    post.likes.length,

                message:
                    "Post unliked"

            });

        }


        // ======================================
        // LIKE
        // ======================================

        post.likes.push(
            userId
        );


        await post.save();


        return res.json({

            liked: true,

            likes:
                post.likes.length,

            message:
                "Post liked"

        });

    }
    catch (error) {

        console.error(
            "TOGGLE POST LIKE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to like post"

        });

    }

}