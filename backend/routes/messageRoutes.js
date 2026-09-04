import express from "express";

import {
    sendMessage,
    sendVoiceMessage,
    sendImageMessage,
    getChatMessages,
    getMessageList,
    markChatRead,
    createCall,
    updateCall
} from "../controllers/messageController.js";

import auth from "../middleware/auth.js";

import uploadMessageAudio from "../middleware/uploadMessageAudio.js";
import uploadMessageImage from "../middleware/uploadMessageImage.js";
const router =
    express.Router();


// ==========================================
// MESSAGE LIST
// GET /api/messages
// ==========================================

router.get(

    "/",

    auth,

    getMessageList

);


// ==========================================
// CHAT
// GET /api/messages/:userId
// ==========================================
// ==========================================
// CREATE CALL
// POST /api/messages/call
// ==========================================

router.post(
    "/call",
    auth,
    createCall
);


// ==========================================
// UPDATE CALL
// PATCH /api/messages/call/:callId
// ==========================================

router.patch(
    "/call/:callId",
    auth,
    updateCall
);

router.get(

    "/:userId",

    auth,

    getChatMessages

);


// ==========================================
// SEND
// POST /api/messages
// ==========================================

router.post("/",auth,sendMessage);
router.post(
    "/voice",
    auth,
    uploadMessageAudio.single("audio"),
    sendVoiceMessage
);

// ==========================================
// SEND IMAGE MESSAGE
// POST /api/messages/image
// ==========================================

router.post(
    "/image",
    auth,
    uploadMessageImage.single("image"),
    sendImageMessage
);
// ==========================================
// MARK READ
// POST /api/messages/:userId/read
// ==========================================

router.post(

    "/:userId/read",

    auth,

    markChatRead

);


export default router;