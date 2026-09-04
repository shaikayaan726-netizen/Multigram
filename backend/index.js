// ==========================================
// IMPORTS
// ==========================================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import https from "https";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import messageRoutes from "./routes/messageRoutes.js";
import User from "./models/User.js";
import Story from "./models/Story.js";

import { setupCallSignaling } from "./socket.js";

import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import audioRoutes from "./routes/audioRoutes.js";

import likeRoutes from "./routes/likeRoutes.js";
import saveRoutes from "./routes/saveRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";

// ==========================================
// ENV
// ==========================================

dotenv.config();


// ==========================================
// APP
// ==========================================

const app = express();


// ==========================================
// HTTPS CERTIFICATE
// ==========================================
//
// Files:
//
// backend/certs/server.key
// backend/certs/server.crt
//
// ==========================================

const certsPath =
    path.join(
        process.cwd(),
        "certs"
    );


const httpsOptions = {

    key: fs.readFileSync(
        path.join(
            certsPath,
            "server.key"
        )
    ),

    cert: fs.readFileSync(
        path.join(
            certsPath,
            "server.crt"
        )
    )

};


// ==========================================
// HTTPS SERVER
// ==========================================

const server =
    process.env.RENDER
        ? http.createServer(app)
        : https.createServer(
            httpsOptions,
            app
        );


// ==========================================
// SOCKET.IO
// ==========================================

const io =
    new Server(
        server,
        {
            cors: {

                origin: true,

                credentials: true

            }
        }
    );


// ==========================================
// CALL SIGNALING
// ==========================================

setupCallSignaling(io);


// ==========================================
// CONFIG
// ==========================================

const PORT =
    process.env.PORT || 3000;


const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/instagram";


// ==========================================
// CORS
// ==========================================

app.use(

    cors({

        origin: true,

        credentials: true

    })

);


// ==========================================
// BODY PARSING
// ==========================================

app.use(

    express.json({

        limit: "10mb"

    })

);


app.use(

    express.urlencoded({

        extended: true,

        limit: "10mb"

    })

);


// ==========================================
// UPLOADS
// ==========================================

app.use(

    "/uploads",

    express.static(

        path.join(

            process.cwd(),

            "uploads"

        )

    )

);


// ==========================================
// STORY EXPIRY CLEANUP
// ==========================================

async function cleanupExpiredStories() {

    try {

        const now =
            new Date();


        const expiredStories =

            await Story.find({

                expiresAt: {

                    $lte: now

                }

            });


        if (
            expiredStories.length === 0
        ) {

            return;

        }


        console.log(

            "EXPIRED STORIES FOUND:",

            expiredStories.length

        );


        for (
            const story
            of expiredStories
        ) {


            // ==================================
            // DELETE MEDIA FILE
            // ==================================

            if (
                story.mediaUrl
            ) {

                try {

                    const cleanPath =

                        story.mediaUrl.replace(

                            /^\/+/,

                            ""

                        );


                    const filePath =

                        path.join(

                            process.cwd(),

                            cleanPath

                        );


                    if (

                        fs.existsSync(
                            filePath
                        )

                    ) {

                        fs.unlinkSync(
                            filePath
                        );


                        console.log(

                            "EXPIRED STORY MEDIA DELETED:",

                            filePath

                        );

                    }

                }

                catch (fileError) {

                    console.error(

                        "EXPIRED STORY MEDIA DELETE ERROR:",

                        fileError

                    );

                }

            }


            // ==================================
            // DELETE STORY DOCUMENT
            // ==================================

            try {

                await Story.deleteOne({

                    _id:
                        story._id

                });


                console.log(

                    "EXPIRED STORY DELETED:",

                    story._id.toString()

                );

            }

            catch (deleteError) {

                console.error(

                    "EXPIRED STORY DB DELETE ERROR:",

                    deleteError

                );

            }

        }

    }

    catch (error) {

        console.error(

            "STORY EXPIRY CLEANUP ERROR:",

            error

        );

    }

}


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(

    "/api/health",

    function(
        req,
        res
    ) {

        res.json({

            success:
                true,

            message:
                "Backend is running",

            database:

                mongoose.connection.readyState === 1

                    ? "connected"

                    : "disconnected"

        });

    }

);


// ==========================================
// POST ROUTES
// ==========================================

app.use(

    "/api",

    postRoutes

);


// ==========================================
// LIKE ROUTES
// ==========================================

app.use(

    "/api",

    likeRoutes

);


// ==========================================
// SAVE ROUTES
// ==========================================

app.use(

    "/api",

    saveRoutes

);

app.use("/api", reelRoutes);
// ==========================================
// COMMENT ROUTES
// ==========================================

app.use(

    "/api",

    commentRoutes

);


// ==========================================
// STORY ROUTES
// ==========================================

app.use(

    "/api/stories",

    storyRoutes

);


// ==========================================
// MESSAGE ROUTES
// ==========================================

app.use(

    "/api/messages",

    messageRoutes

);


// ==========================================
// AUTH ROUTES
// ==========================================

app.use(

    "/api/auth",

    authRoutes

);


// ==========================================
// DEBUG USERS
// ==========================================

app.get(

    "/api/debug/users",

    async function(
        req,
        res
    ) {

        try {

            const users =

                await User

                    .find({})

                    .select(

                        "fullName username email phone"

                    );


            console.log(

                "DEBUG USERS:",

                users

            );


            return res.json(
                users
            );

        }

        catch (error) {

            console.error(

                "DEBUG USERS ERROR:",

                error

            );


            return res.status(
                500
            ).json({

                message:
                    error.message,

                error:
                    error.name

            });

        }

    }

);


// ==========================================
// FOLLOW ROUTES
// ==========================================

app.use(

    "/api",

    followRoutes

);


// ==========================================
// AUDIO ROUTES
// ==========================================

app.use(

    "/api/audio",

    audioRoutes

);


// ==========================================
// API 404
// ==========================================

app.use(

    "/api",

    function(
        req,
        res
    ) {

        res.status(
            404
        ).json({

            message:
                "API route not found"

        });

    }

);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(

    function(
        error,
        req,
        res,
        next
    ) {

        console.error(

            "SERVER ERROR:",

            error

        );


        res.status(
            500
        ).json({

            message:
                "Internal Server Error"

        });

    }

);


// ==========================================
// MONGODB + SERVER
// ==========================================

async function startServer() {

    try {

        await mongoose.connect(

            MONGO_URI

        );


        console.log(
            "MongoDB Connected"
        );


        // ==================================
        // CLEAN OLD EXPIRED STORIES
        // ==================================

        await cleanupExpiredStories();


        // ==================================
        // START EXPIRY CLEANUP
        // ==================================

        setInterval(

            cleanupExpiredStories,

            30 * 1000

        );


        // ==================================
        // START HTTPS SERVER
        // ==================================

        server.listen(

            PORT,

            "0.0.0.0",

            function() {

                console.log(

                    `HTTPS Server running on https://0.0.0.0:${PORT}`

                );


                console.log(

                    "Story expiry cleanup active"

                );


                console.log(

                    "CALL SOCKET SERVER READY"

                );

            }

        );

    }

    catch (error) {

        console.error(

            "MongoDB Connection Failed:",

            error

        );


        process.exit(1);

    }

}


startServer();