import Audio from "../models/Audio.js";


// ==========================================
// GET AUDIO
// GET /api/audio
// ==========================================

export async function getAudio(
    req,
    res
) {

    try {

        const {
            search,
            category
        } = req.query;


        const query = {};


        // ======================================
        // SEARCH
        // ======================================

        if (
            search &&
            search.trim()
        ) {

            query.$or = [

                {
                    title: {
                        $regex:
                            search.trim(),
                        $options: "i"
                    }
                },

                {
                    artist: {
                        $regex:
                            search.trim(),
                        $options: "i"
                    }
                }

            ];

        }


        // ======================================
        // CATEGORY
        // ======================================

        if (
            category &&
            category !== "For you"
        ) {

            query.category =
                category;

        }


        // ======================================
        // SORT
        // ======================================

        let sort = {

            createdAt: -1

        };


        if (
            category === "Trending"
        ) {

            sort = {

                plays: -1

            };

        }


        // ======================================
        // FIND
        // ======================================

        const songs =
            await Audio.find(query)
                .sort(sort)
                .limit(100);


        return res.json({

            songs

        });

    }
    catch (error) {

        console.error(
            "GET AUDIO ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load audio"

        });

    }

}