// ==========================================
// IMPORT
// ==========================================

import express from "express";

import {
    togglePostSave,
    getSavedPosts
} from "../controllers/saveController.js";

import auth from "../middleware/auth.js";


// ==========================================
// ROUTER
// ==========================================

const router =
    express.Router();


// ==========================================
// GET SAVED POSTS
// GET /api/saved
// ==========================================

router.get(

    "/saved",

    auth,

    getSavedPosts

);


// ==========================================
// SAVE / UNSAVE POST
// POST /api/posts/:postId/save
// ==========================================

router.post(

    "/posts/:postId/save",

    auth,

    togglePostSave

);


// ==========================================
// EXPORT
// ==========================================

export default router;