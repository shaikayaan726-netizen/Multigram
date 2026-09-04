// ==========================================
// IMPORTS
// ==========================================

import express from "express";

import {
    createPost,
    getPosts,
    getPost,
    getUserPosts,
    updatePost,
    deletePost
} from "../controllers/postController.js";

import auth from "../middleware/auth.js";

import uploadPost from "../middleware/uploadPost.js";


// ==========================================
// ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// CREATE POST
// POST /api/posts
// ==========================================
//
// Image:
// uploadPost.single("image")
//
// User:
// auth middleware se req.user.id
//

router.post(
    "/posts",
    auth,
    uploadPost.single("image"),
    createPost
);


// ==========================================
// GET ALL POSTS
// GET /api/posts
// ==========================================

router.get(
    "/posts",
    auth,
    getPosts
);


// ==========================================
// GET SINGLE POST
// GET /api/posts/:postId
// ==========================================

router.get(
    "/posts/:postId",
    auth,
    getPost
);


// ==========================================
// GET USER POSTS
// GET /api/posts/user/:userId
// ==========================================

router.get(
    "/posts/user/:userId",
    auth,
    getUserPosts
);


// ==========================================
// UPDATE POST
// PUT /api/posts/:postId
// ==========================================
//
// Image optional hai.
// Agar new image nahi hai toh purani image
// same rahegi.
//

router.put(
    "/posts/:postId",
    auth,
    uploadPost.single("image"),
    updatePost
);


// ==========================================
// DELETE POST
// DELETE /api/posts/:postId
// ==========================================

router.delete(
    "/posts/:postId",
    auth,
    deletePost
);


// ==========================================
// EXPORT
// ==========================================

export default router;