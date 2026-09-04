import mongoose from "mongoose";
import Post from "../models/Post.js";

export async function togglePostSave(req, res) {

    try {

        const userId = req.user.id;
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!Array.isArray(post.saves)) {
            post.saves = [];
        }

        const alreadySaved = post.saves.some(function (id) {

            return id.toString() === userId.toString();

        });

        if (alreadySaved) {

            post.saves = post.saves.filter(function (id) {

                return id.toString() !== userId.toString();

            });

            await post.save();

            return res.json({
                saved: false,
                saves: post.saves.length,
                message: "Post unsaved"
            });
        }

        post.saves.push(userId);

        await post.save();

        return res.json({
            saved: true,
            saves: post.saves.length,
            message: "Post saved"
        });

    }
    catch (error) {

        console.error(
            "TOGGLE POST SAVE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to save post"
        });

    }

}
// ==========================================
// GET SAVED POSTS
// GET /api/posts/saved
// ==========================================

export async function getSavedPosts(req, res) {

    try {

        const userId =
            req.user.id;


        const posts =
            await Post.find({

                saves: userId

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

                createdAt: -1

            });


        return res.json({

            posts

        });

    }
    catch (error) {

        console.error(
            "GET SAVED POSTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load saved posts"

        });

    }

}