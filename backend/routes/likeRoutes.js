// ==========================================
// IMPORT
// ==========================================

import express from "express";

import {
    togglePostLike
} from "../controllers/likeController.js";

import auth from "../middleware/auth.js";
import {
    toggleReelLike
} from "../controllers/reelLikeController.js";

// ==========================================
// ROUTER
// ==========================================

const router =
    express.Router();


// ==========================================
// LIKE / UNLIKE POST
// POST /api/posts/:postId/like
// ==========================================

router.post(

    "/posts/:postId/like",

    auth,

    togglePostLike

);

// ==========================================
// LIKE / UNLIKE REEL
// POST /api/reels/:reelId/like
// ==========================================

router.post(

    "/reels/:reelId/like",

    auth,

    toggleReelLike

);
// ==========================================
// EXPORT
// ==========================================

export default router;