// ==========================================
// IMPORTS
// ==========================================

import mongoose from "mongoose";

import Reel from "../models/Reel.js";


// ==========================================
// LIKE / UNLIKE REEL
// POST /api/reels/:reelId/like
// ==========================================

export async function toggleReelLike(req, res) {

    try {

        const userId =
            req.user.id;

        const { reelId } =
            req.params;


        // ======================================
        // VALIDATE REEL ID
        // ======================================

        if (
            !mongoose.Types.ObjectId.isValid(
                reelId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid reel ID"

            });

        }


        // ======================================
        // FIND REEL
        // ======================================

        const reel =
            await Reel.findById(
                reelId
            );


        if (!reel) {

            return res.status(404).json({

                message:
                    "Reel not found"

            });

        }


        // ======================================
        // CHECK LIKE
        // ======================================

        const alreadyLiked =
            reel.likes.some(function (id) {

                return (
                    id.toString() ===
                    userId.toString()
                );

            });


        // ======================================
        // UNLIKE
        // ======================================

        if (alreadyLiked) {

            reel.likes =
                reel.likes.filter(function (id) {

                    return (
                        id.toString() !==
                        userId.toString()
                    );

                });


            await reel.save();


            return res.json({

                liked: false,

                likes:
                    reel.likes.length,

                message:
                    "Reel unliked"

            });

        }


        // ======================================
        // LIKE
        // ======================================

        reel.likes.push(
            userId
        );


        await reel.save();


        return res.json({

            liked: true,

            likes:
                reel.likes.length,

            message:
                "Reel liked"

        });

    }
    catch (error) {

        console.error(
            "TOGGLE REEL LIKE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to like reel"

        });

    }

}