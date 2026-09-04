import fs from "fs";
import path from "path";

import Story from "../models/Story.js";


// ==========================================
// GET CURRENT USER ID
// ==========================================

function getUserId(req) {

    return (

        req.user?.id ||

        req.user?._id

    );

}


// ==========================================
// DELETE STORY MEDIA FILE
// ==========================================

function deleteStoryMediaFile(mediaUrl) {

    if (!mediaUrl) {

        return;

    }


    try {

        const cleanPath =
            mediaUrl.replace(
                /^\/+/,
                ""
            );


        const filePath =
            path.join(
                process.cwd(),
                cleanPath
            );


        if (
            fs.existsSync(filePath)
        ) {

            fs.unlinkSync(
                filePath
            );


            console.log(
                "STORY MEDIA DELETED:",
                filePath
            );

        }

    }
    catch (error) {

        console.error(

            "STORY MEDIA DELETE ERROR:",

            error

        );

    }

}


// ==========================================
// CREATE STORY
// POST /api/stories
// ==========================================

export async function createStory(req, res) {

    let uploadedFilePath = null;


    try {

        const userId =
            getUserId(req);


        // ======================================
        // AUTH
        // ======================================

        if (!userId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // FILE CHECK
        // ======================================

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Story media is required"

            });

        }


        uploadedFilePath =
            req.file.path;


        // ======================================
        // MEDIA TYPE
        // ======================================

        const mediaType =

            req.file.mimetype &&

            req.file.mimetype.startsWith(
                "video/"
            )

                ? "video"

                : "image";


        // ======================================
        // PERMANENT MEDIA URL
        // ======================================

        let mediaUrl = "";


        if (req.file.path) {

            const relativePath =

                path.relative(

                    process.cwd(),

                    req.file.path

                );


            mediaUrl =

                "/" +

                relativePath.replace(
                    /\\/g,
                    "/"
                );

        }


        else if (req.file.filename) {

            mediaUrl =

                "/uploads/stories/" +

                req.file.filename;

        }


        if (!mediaUrl) {

            return res.status(500).json({

                message:
                    "Unable to create media URL"

            });

        }


        // ======================================
        // BODY DATA
        // ======================================

        let elements = [];

        let music = null;

        let effect = "None";

        let settings = {

            replies: true,

            sharing: true

        };


        // ======================================
        // ELEMENTS
        // ======================================

        if (req.body.elements) {

            try {

                elements =

                    typeof req.body.elements ===
                    "string"

                        ? JSON.parse(
                            req.body.elements
                        )

                        : req.body.elements;

            }
            catch (error) {

                console.error(

                    "ELEMENTS PARSE ERROR:",

                    error

                );

                elements = [];

            }

        }


        // ======================================
        // MUSIC
        // ======================================

        if (req.body.music) {

            try {

                music =

                    typeof req.body.music ===
                    "string"

                        ? JSON.parse(
                            req.body.music
                        )

                        : req.body.music;

            }
            catch {

                music =
                    req.body.music;

            }

        }


        // ======================================
        // EFFECT
        // ======================================

        if (req.body.effect) {

            effect =
                req.body.effect;

        }


        // ======================================
        // SETTINGS
        // ======================================

        if (req.body.settings) {

            try {

                settings =

                    typeof req.body.settings ===
                    "string"

                        ? JSON.parse(
                            req.body.settings
                        )

                        : req.body.settings;

            }
            catch {

                settings = {

                    replies: true,

                    sharing: true

                };

            }

        }


        // ======================================
        // EXPIRY
        // ======================================
        //
        // EXACTLY 24 HOURS FROM CREATION
        //
        // ======================================

        const createdAt =
            new Date();


        const expiresAt =
            new Date(

                createdAt.getTime() +

                24 *
                60 *
                60 *
                1000

            );


        // ======================================
        // CREATE STORY
        // ======================================

        const story =
            await Story.create({

                user:
                    userId,


                mediaUrl:
                    mediaUrl,


                mediaType:
                    mediaType,


                elements:

                    Array.isArray(
                        elements
                    )

                        ? elements

                        : [],


                music:
                    music || null,


                effect:
                    effect || "None",


                settings: {

                    replies:
                        settings?.replies !== false,

                    sharing:
                        settings?.sharing !== false

                },


                viewers: [],


                createdAt:
                    createdAt,


                expiresAt:
                    expiresAt

            });


        // ======================================
        // POPULATE USER
        // ======================================

        const populatedStory =

            await Story

                .findById(
                    story._id
                )

                .populate(

                    "user",

                    "username fullName image profilePicture"

                );


        console.log(
            "STORY CREATED:",
            populatedStory
        );


        console.log(
            "STORY EXPIRES AT:",
            expiresAt
        );


        // ======================================
        // SUCCESS
        // ======================================

        return res.status(201).json({

            message:
                "Story created successfully",

            story:
                populatedStory

        });

    }

    catch (error) {

        console.error(

            "CREATE STORY ERROR:",

            error

        );


        // ======================================
        // REMOVE UPLOADED FILE IF DB FAILED
        // ======================================

        if (
            uploadedFilePath &&
            fs.existsSync(
                uploadedFilePath
            )
        ) {

            try {

                fs.unlinkSync(
                    uploadedFilePath
                );

                console.log(
                    "ORPHAN STORY FILE REMOVED"
                );

            }
            catch (fileError) {

                console.error(

                    "ORPHAN FILE DELETE ERROR:",

                    fileError

                );

            }

        }


        return res.status(500).json({

            message:
                "Failed to create story",

            error:
                error.message

        });

    }

}


// ==========================================
// GET STORIES
// GET /api/stories
// ==========================================

export async function getStories(req, res) {

    try {

        const now =
            new Date();


        // ======================================
        // ONLY ACTIVE STORIES
        // ======================================

        const stories =

            await Story

                .find({

                    expiresAt: {

                        $gt:
                            now

                    }

                })

                .populate(

                    "user",

                    "username fullName image profilePicture"

                )

                .sort({

                    createdAt:
                        1

                });


        return res.json({

            stories:
                stories

        });

    }

    catch (error) {

        console.error(

            "GET STORIES ERROR:",

            error

        );


        return res.status(500).json({

            message:
                "Failed to get stories",

            error:
                error.message

        });

    }

}


// ==========================================
// VIEW STORY
// POST /api/stories/:storyId/view
// ==========================================

export async function viewStory(req, res) {

    try {

        const userId =
            getUserId(req);


        // ======================================
        // AUTH
        // ======================================

        if (!userId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // ACTIVE STORY ONLY
        // ======================================

        const story =

            await Story.findOne({

                _id:
                    req.params.storyId,

                expiresAt: {

                    $gt:
                        new Date()

                }

            });


        if (!story) {

            return res.status(404).json({

                message:
                    "Story not found or expired"

            });

        }


        // ======================================
        // ALREADY VIEWED?
        // ======================================

        const alreadyViewed =

            story.viewers.some(

                function(viewer) {

                    return (

                        String(
                            viewer.user
                        ) ===

                        String(
                            userId
                        )

                    );

                }

            );


        // ======================================
        // ADD VIEW
        // ======================================

        if (!alreadyViewed) {

            story.viewers.push({

                user:
                    userId,

                viewedAt:
                    new Date()

            });


            await story.save();

        }


        return res.json({

            message:
                "Story viewed",

            viewed:
                true,

            viewerCount:
                story.viewers.length

        });

    }

    catch (error) {

        console.error(

            "VIEW STORY ERROR:",

            error

        );


        return res.status(500).json({

            message:
                "Failed to view story",

            error:
                error.message

        });

    }

}


// ==========================================
// GET STORY VIEWERS
// GET /api/stories/:storyId/viewers
// ==========================================

export async function getStoryViewers(
    req,
    res
) {

    try {

        const userId =
            getUserId(req);


        if (!userId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // ONLY ACTIVE STORY
        // ======================================

        const story =

            await Story

                .findOne({

                    _id:
                        req.params.storyId,

                    expiresAt: {

                        $gt:
                            new Date()

                    }

                })

                .populate(

                    "viewers.user",

                    "username fullName image profilePicture"

                );


        if (!story) {

            return res.status(404).json({

                message:
                    "Story not found or expired"

            });

        }


        // ======================================
        // ONLY OWNER CAN SEE VIEWERS
        // ======================================

        if (

            String(
                story.user
            ) !==

            String(
                userId
            )

        ) {

            return res.status(403).json({

                message:
                    "Only the story owner can view the viewer list"

            });

        }


        return res.json({

            count:
                story.viewers.length,

            viewers:
                story.viewers

        });

    }

    catch (error) {

        console.error(

            "GET STORY VIEWERS ERROR:",

            error

        );


        return res.status(500).json({

            message:
                "Failed to get viewers",

            error:
                error.message

        });

    }

}


// ==========================================
// DELETE STORY
// DELETE /api/stories/:storyId
// ==========================================

export async function deleteStory(
    req,
    res
) {

    try {

        const userId =
            getUserId(req);


        if (!userId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // ONLY OWNER CAN DELETE
        // ======================================

        const story =

            await Story.findOne({

                _id:
                    req.params.storyId,

                user:
                    userId

            });


        if (!story) {

            return res.status(404).json({

                message:
                    "Story not found"

            });

        }


        // ======================================
        // DELETE MEDIA
        // ======================================

        deleteStoryMediaFile(
            story.mediaUrl
        );


        // ======================================
        // DELETE DATABASE RECORD
        // ======================================

        await story.deleteOne();


        console.log(

            "STORY DELETED:",

            story._id.toString()

        );


        return res.json({

            message:
                "Story deleted"

        });

    }

    catch (error) {

        console.error(

            "DELETE STORY ERROR:",

            error

        );


        return res.status(500).json({

            message:
                "Failed to delete story",

            error:
                error.message

        });

    }

}