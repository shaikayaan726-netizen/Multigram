// ==========================================
// IMPORTS
// ==========================================

import express from "express";

import {

    createReel,

    getReels,

    getReel,

    getUserReels,

    deleteReel,
     toggleReelSave

} from "../controllers/reelController.js";

import auth from "../middleware/auth.js";

import uploadReel from "../middleware/uploadReel.js";


// ==========================================
// ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// CREATE REEL
// POST /api/reels
// ==========================================
//
// Video:
// uploadReel.single("video")
//
// User:
// auth middleware se req.user.id
//
// ==========================================

router.post(

    "/reels",

    auth,

    uploadReel.single("video"),

    createReel

);


// ==========================================
// GET ALL REELS
// GET /api/reels
// ==========================================

router.get(

    "/reels",

    auth,

    getReels

);


// ==========================================
// GET SINGLE REEL
// GET /api/reels/:reelId
// ==========================================

router.get(

    "/reels/:reelId",

    auth,

    getReel

);


// ==========================================
// GET USER REELS
// GET /api/reels/user/:userId
// ==========================================

router.get(

    "/reels/user/:userId",

    auth,

    getUserReels

);


// ==========================================
// DELETE REEL
// DELETE /api/reels/:reelId
// ==========================================

router.delete(

    "/reels/:reelId",

    auth,

    deleteReel

);
// ==========================================
// SAVE / UNSAVE REEL
// POST /api/reels/:reelId/save
// ==========================================

router.post(

    "/reels/:reelId/save",

    auth,

    toggleReelSave

);

// ==========================================
// EXPORT
// ==========================================

export default router;