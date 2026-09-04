import express from "express";

const router = express.Router();


// ==========================================
// SEARCH MUSIC
// GET /api/audio/search?q=...
// ==========================================

router.get(
    "/search",
    async function(req, res) {

        try {

            const query =
                String(
                    req.query.q || ""
                ).trim();


            if (!query) {

                return res.json({
                    songs: []
                });

            }


            const url =
                "https://itunes.apple.com/search" +
                "?term=" +
                encodeURIComponent(query) +
                "&country=IN" +
                "&media=music" +
                "&entity=song" +
                "&limit=25";


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Music API request failed"
                );

            }


            const data =
                await response.json();


            const songs =
                (data.results || [])
                    .filter(function(item) {

                        return (
                            item.previewUrl &&
                            item.trackName &&
                            item.artistName
                        );

                    })
                    .map(function(item) {

                        return {

                            id:
                                String(
                                    item.trackId
                                ),

                            title:
                                item.trackName,

                            artist:
                                item.artistName,

                            album:
                                item.collectionName ||
                                "",

                            thumbnail:
                                item.artworkUrl100 ||
                                "",

                            audioUrl:
                                item.previewUrl,

                            fullDuration:
                                Math.round(
                                    (
                                        item.trackTimeMillis ||
                                        0
                                    ) / 1000
                                ),

                            storeUrl:
                                item.trackViewUrl ||
                                ""

                        };

                    });


            return res.json({
                songs
            });

        }
        catch (error) {

            console.error(
                "AUDIO SEARCH ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Music search failed",

                songs:
                    []

            });

        }

    }
);


export default router;