import express from "express";

import {
    createStory,
    getStories,
    viewStory,
    getStoryViewers,
    deleteStory
} from "../controllers/storyController.js";

import auth from "../middleware/auth.js";

import uploadStory from "../middleware/uploadStory.js";


const router =
    express.Router();


router.post(
    "/",
    auth,
    uploadStory.single("media"),
    createStory
);


router.get(
    "/",
    auth,
    getStories
);


router.post(
    "/:storyId/view",
    auth,
    viewStory
);


router.get(
    "/:storyId/viewers",
    auth,
    getStoryViewers
);


router.delete(
    "/:storyId",
    auth,
    deleteStory
);


export default router;