// ==========================================
// IMPORTS
// ==========================================

import express from "express";


import auth from "../middleware/auth.js";

import {
    getComments,
    createComment,
    toggleCommentLike,
    getReelComments,
    createReelComment
} from "../controllers/commentController.js";
// ==========================================
// ROUTER
// ==========================================

const router =
    express.Router();


// ==========================================
// GET COMMENTS
// GET /api/comments/:postId
// ==========================================

router.get(

    "/comments/:postId",

    auth,

    getComments

);


// ==========================================
// CREATE COMMENT / REPLY
// POST /api/comments/:postId
// ==========================================

router.post(

    "/comments/:postId",

    auth,

    createComment

);


// ==========================================
// LIKE / UNLIKE COMMENT
// POST /api/comments/:commentId/like
// ==========================================

router.post(

    "/comments/:commentId/like",

    auth,

    toggleCommentLike

);
// ==========================================
// GET REEL COMMENTS
// GET /api/reel-comments/:reelId
// ==========================================

router.get(

    "/reel-comments/:reelId",

    auth,

    getReelComments

);


// ==========================================
// CREATE REEL COMMENT / REPLY
// POST /api/reel-comments/:reelId
// ==========================================

router.post(

    "/reel-comments/:reelId",

    auth,

    createReelComment

);

// ==========================================
// EXPORT
// ==========================================

export default router;