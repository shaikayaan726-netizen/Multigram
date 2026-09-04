// ==========================================
// IMPORTS
// ==========================================

import mongoose from "mongoose";
import Reel from "../models/Reel.js";
import User from "../models/User.js";


// ==========================================
// CREATE REEL
// POST /api/reels
// ==========================================

export async function createReel(req, res) {

    try {

        // ======================================
        // LOGGED-IN USER
        // ======================================

        const userId =
            req.user.id;


        // ======================================
        // REQUEST DATA
        // ======================================

        const {
            caption,
            duration,
            text,
            elements,
            music,
            effects,
            stickers,
            audio,
            shareToFeed,
            allowComments
        } = req.body;


        // ======================================
        // VIDEO
        // ======================================

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Reel video is required"

            });

        }


        // ======================================
        // CHECK USER
        // ======================================

        const user =
            await User.findById(
                userId
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ======================================
        // CHECK DEACTIVATED
        // ======================================

        if (
            user.isDeactivated
        ) {

            return res.status(403).json({

                message:
                    "This account is deactivated"

            });

        }


        // ======================================
        // PARSE JSON DATA
        // ======================================

        let parsedMusic =
            {};

        let parsedEffects =
            [];

        let parsedStickers =
            [];

        let parsedElements =
            [];

        let parsedAudio =
            {};


        try {

            if (
                music
            ) {

                parsedMusic =
                    typeof music === "string"
                        ? JSON.parse(music)
                        : music;

            }


            if (
                effects
            ) {

                parsedEffects =
                    typeof effects === "string"
                        ? JSON.parse(effects)
                        : effects;

            }


            if (
                stickers
            ) {

                parsedStickers =
                    typeof stickers === "string"
                        ? JSON.parse(stickers)
                        : stickers;

            }


            if (
                elements
            ) {

                parsedElements =
                    typeof elements === "string"
                        ? JSON.parse(elements)
                        : elements;

            }


            if (
                audio
            ) {

                parsedAudio =
                    typeof audio === "string"
                        ? JSON.parse(audio)
                        : audio;

            }

        }

        catch (parseError) {

            return res.status(400).json({

                message:
                    "Invalid reel data"

            });

        }


        // ======================================
        // DURATION
        // ======================================

        let reelDuration =
            Number(
                duration || 0
            );


        if (
            Number.isNaN(
                reelDuration
            ) ||
            reelDuration < 0
        ) {

            reelDuration =
                0;

        }


        // ======================================
        // VIDEO PATH
        // ======================================

        const video =
            "/uploads/reels/" +
            req.file.filename;


        // ======================================
        // CREATE REEL
        // ======================================

        const reel =
            await Reel.create({

                author:
                    userId,

                video:
                    video,

                caption:
                    caption
                        ? String(
                            caption
                        ).trim()
                        : "",

                duration:
                    reelDuration,

                text:
                    text
                        ? String(
                            text
                        )
                        : "",

                elements:
                    Array.isArray(
                        parsedElements
                    )
                        ? parsedElements
                        : [],

                music:
                    parsedMusic || {},

                effects:
                    parsedEffects || [],

                stickers:
                    parsedStickers || [],

                audio:
                    parsedAudio || {},

                shareToFeed:
                    shareToFeed !== undefined
                        ? shareToFeed === true ||
                          shareToFeed === "true"
                        : true,

                allowComments:
                    allowComments !== undefined
                        ? allowComments === true ||
                          allowComments === "true"
                        : true,

                likes:
                    [],

                saves:
                    [],

                comments:
                    [],

                shares:
                    [],

                views:
                    []

            });


        // ======================================
        // POPULATE USER
        // ======================================

        await reel.populate({

            path:
                "author",

            select:
                "fullName username profilePicture"

        });


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            message:
                "Reel created successfully",

            reel

        });

    }

    catch (error) {

        console.error(
            "CREATE REEL ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to create reel"

        });

    }

}


// ==========================================
// AUTOMATIC PEXELS REELS
// ==========================================

const automaticReelTopics = [
    "Indian Hindi comedy funny",
    "Indian Hindi love couple flirt romance",
    "Indian Hindi sad emotional breakup",
    "Indian music Bollywood music",
    "Bollywood Hindi cinema Indian movie",
    "Hindi jokes Indian memes comedy",
    "Indian fashion beauty lifestyle",
    "Indian Hindi technology AI coding",
    "Hindi facts knowledge education",
    "India travel tourism beautiful places",
    "Indian cricket sports",
    "Indian desi lifestyle",
    "Hindi emotional story feelings",
    "Indian entertainment trending"
];


const automaticTopicQueries = {

    comedy:
        "Indian Hindi comedy funny",

    love:
        "Indian couple romantic love",

    sad:
        "emotional sad breakup love",

    music:
        "Indian music Bollywood",

    bollywood:
        "Bollywood Indian cinema",

    jokes:
        "Indian funny comedy",

    fashion:
        "Indian fashion beauty",

    "ai-tech":
        "Indian technology AI",

    facts:
        "education knowledge science",

    travel:
        "India travel tourism",

    sports:
        "Indian cricket sports",

    desi:
        "Indian desi lifestyle culture",

    stories:
        "emotional life story India",

    entertainment:
        "Indian entertainment trending"

};


// ==========================================
// FETCH AUTOMATIC REELS FROM PEXELS
// ==========================================

async function fetchAutomaticReels(
    topic,
    page = 1
) {

    const pexelsKey =
        process.env.PEXELS_API_KEY;

    const youtubeKeys = [
        process.env.YOUTUBE_API_KEY_1,
        process.env.YOUTUBE_API_KEY_2,
        process.env.YOUTUBE_API_KEY_3,
        process.env.YOUTUBE_API_KEY_4
    ].filter(Boolean);

    const safePage =
        Math.max(
            1,
            Number(page) || 1
        );

    const searchQuery =
        automaticTopicQueries[topic] ||
        topic;


    // ==========================================
    // YOUTUBE
    // ==========================================

    if (youtubeKeys.length > 0) {

        for (
            const youtubeKey of youtubeKeys
        ) {

            try {

                let pageToken = "";

                let latestVideos = [];


                // Move to requested YouTube page
                for (
                    let currentPage = 1;
                    currentPage <= safePage;
                    currentPage++
                ) {

                    const youtubeUrl =
                        "https://www.googleapis.com/youtube/v3/search" +
                        "?part=snippet" +
                        "&q=" +
                        encodeURIComponent(
                            searchQuery
                        ) +
                        "&type=video" +
                        "&videoEmbeddable=true" +
                        "&videoSyndicated=true" +
                        "&videoDuration=short" +
                        "&maxResults=25" +
                        (
                            pageToken
                                ? "&pageToken=" +
                                  encodeURIComponent(
                                      pageToken
                                  )
                                : ""
                        ) +
                        "&key=" +
                        encodeURIComponent(
                            youtubeKey
                        );


                    const response =
                        await fetch(
                            youtubeUrl
                        );


                    if (!response.ok) {

                        console.error(
                            "YouTube API failed:",
                            response.status
                        );


                        // ==========================================
                        // YOUTUBE QUOTA / RATE LIMIT
                        // ==========================================

                        if (
                            response.status === 429
                        ) {

                            // YouTube quota/rate-limit fail hua,
                            // doosri API key ko immediately hit mat karo.

                            latestVideos = [];

                            break;

                        }


                        latestVideos = [];

                        break;

                    }


                    const data =
                        await response.json();


                    const items =
                        Array.isArray(
                            data.items
                        )
                            ? data.items
                            : [];


                    latestVideos =
                        items
                            .filter(
                                function (item) {

                                    return (
                                        item &&
                                        item.id &&
                                        item.id.videoId
                                    );

                                }
                            )
                            .map(
                                function (item) {

                                    return {

                                        id:
                                            item.id
                                                .videoId,

                                        title:
                                            item.snippet
                                                ?.title ||
                                            "",

                                        description:
                                            item.snippet
                                                ?.description ||
                                            "",

                                        channelTitle:
                                            item.snippet
                                                ?.channelTitle ||
                                            "",

                                        channelId:
                                            item.snippet
                                                ?.channelId ||
                                            "",

                                        publishedAt:
                                            item.snippet
                                                ?.publishedAt ||
                                            "",

                                        thumbnail:
                                            item.snippet
                                                ?.thumbnails
                                                ?.high
                                                ?.url ||
                                            item.snippet
                                                ?.thumbnails
                                                ?.medium
                                                ?.url ||
                                            item.snippet
                                                ?.thumbnails
                                                ?.default
                                                ?.url ||
                                            "",

                                        youtubeUrl:
                                            "https://www.youtube.com/watch?v=" +
                                            item.id
                                                .videoId

                                    };

                                }
                            );


                    // Requested page reached
                    if (
                        currentPage ===
                        safePage
                    ) {

                        break;

                    }


                    // No next page available
                    if (
                        !data.nextPageToken
                    ) {

                        latestVideos = [];

                        break;

                    }


                    pageToken =
                        data.nextPageToken;

                }


                if (
                    latestVideos.length > 0
                ) {

                    return latestVideos;

                }

            }

            catch (youtubeError) {

                console.error(
                    "YouTube topic failed:",
                    topic,
                    youtubeError.message
                );

            }

        }

    }


    // ==========================================
    // PEXELS FALLBACK
    // ==========================================

    if (!pexelsKey) {

        return [];

    }


    try {

        const pexelsUrl =
            "https://api.pexels.com/v1/videos/search" +
            "?query=" +
            encodeURIComponent(
                searchQuery
            ) +
            "&orientation=portrait" +
            "&size=medium" +
            "&per_page=20" +
            "&page=" +
            safePage;


        const response =
            await fetch(
                pexelsUrl,
                {
                    headers: {
                        Authorization:
                            pexelsKey
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Pexels API request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        return Array.isArray(
            data.videos
        )
            ? data.videos
            : [];

    }

    catch (pexelsError) {

        console.error(
            "Pexels topic failed:",
            topic,
            pexelsError.message
        );

        return [];

    }

}


// ==========================================
// FIND USER'S PREFERRED REEL TOPICS
// ==========================================

function getPreferredReelTopics(
    likedReels
) {

    const topicScores = {

        comedy: 0,
        love: 0,
        sad: 0,
        music: 0,
        bollywood: 0,
        jokes: 0,
        fashion: 0,
        "ai-tech": 0,
        facts: 0,
        travel: 0,
        sports: 0,
        desi: 0,
        stories: 0,
        entertainment: 0

    };


    const keywordGroups = {

        comedy: [
            "comedy",
            "funny",
            "fun",
            "हंसी",
            "मजाक",
            "कॉमेडी",
            "फनी",
            "joke"
        ],

        love: [
            "love",
            "couple",
            "romance",
            "romantic",
            "flirt",
            "crush",
            "relationship",
            "प्यार",
            "इश्क",
            "मोहब्बत",
            "रोमांस"
        ],

        sad: [
            "sad",
            "emotional",
            "breakup",
            "heartbreak",
            "alone",
            "feelings",
            "दुख",
            "उदास",
            "ब्रेकअप",
            "इमोशनल"
        ],

        music: [
            "music",
            "song",
            "songs",
            "singer",
            "bollywood song",
            "हिंदी गाना",
            "गाना",
            "संगीत",
            "बॉलीवुड"
        ],

        bollywood: [
            "bollywood",
            "hindi cinema",
            "hindi movie",
            "movie",
            "film",
            "actor",
            "actress",
            "बॉलीवुड",
            "हिंदी फिल्म",
            "सिनेमा"
        ],

        jokes: [
            "joke",
            "jokes",
            "meme",
            "memes",
            "मजाक",
            "जोक",
            "मीम",
            "हिंदी जोक्स"
        ],

        fashion: [
            "fashion",
            "style",
            "outfit",
            "dress",
            "beauty",
            "makeup",
            "model",
            "फैशन",
            "ब्यूटी",
            "मेकअप"
        ],

        "ai-tech": [
            "ai",
            "artificial intelligence",
            "technology",
            "tech",
            "coding",
            "programming",
            "robot",
            "computer",
            "एआई",
            "टेक्नोलॉजी"
        ],

        facts: [
            "facts",
            "fact",
            "information",
            "knowledge",
            "education",
            "learn",
            "tips",
            "facts hindi",
            "फैक्ट",
            "ज्ञान",
            "जानकारी"
        ],

        travel: [
            "travel",
            "trip",
            "tour",
            "vacation",
            "beach",
            "mountain",
            "india travel",
            "यात्रा",
            "घूमना",
            "ट्रैवल"
        ],

        sports: [
            "cricket",
            "sports",
            "ipl",
            "football",
            "match",
            "player",
            "क्रिकेट",
            "खेल",
            "स्पोर्ट्स"
        ],

        desi: [
            "desi",
            "indian",
            "india",
            "indian lifestyle",
            "village",
            "street",
            "culture",
            "देसी",
            "इंडियन",
            "भारत"
        ],

        stories: [
            "story",
            "stories",
            "emotional story",
            "life story",
            "kahani",
            "कहानी",
            "किस्सा",
            "स्टोरी",
            "जिंदगी"
        ],

        entertainment: [
            "entertainment",
            "trending",
            "viral",
            "celebrity",
            "show",
            "fun",
            "मनोरंजन",
            "ट्रेंडिंग",
            "वायरल"
        ]

    };


    likedReels.forEach(
        function (reel) {

            const searchableText = [

                reel.category || "",

                reel.caption || "",

                reel.text || "",

                reel.music?.title || "",

                reel.music?.artist || ""

            ]
                .join(" ")
                .toLowerCase();


            Object.keys(
                keywordGroups
            ).forEach(
                function (topic) {

                    keywordGroups[topic].forEach(
                        function (keyword) {

                            if (
                                searchableText.includes(
                                    keyword
                                )
                            ) {

                                topicScores[topic] += 1;

                            }

                        }
                    );

                }
            );

        }
    );


    const sortedTopics =
        Object.entries(
            topicScores
        )
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            )
            .filter(
                function (entry) {

                    return entry[1] > 0;

                }
            )
            .map(
                function (entry) {

                    return entry[0];

                }
            );


    return sortedTopics.length > 0
        ? sortedTopics
        : [
            "comedy",
            "love",
            "sad",
            "music",
            "bollywood",
            "jokes",
            "fashion",
            "ai-tech",
            "facts",
            "travel",
            "sports",
            "desi",
            "stories",
            "entertainment"
        ];

}


// ==========================================
// GET REELS
// GET /api/reels
// ==========================================

export const getReels = async (req, res) => {

    try {

        const userId =
            req.user.id;

        const page =
            Math.max(
                1,
                Number(
                    req.query.page || 1
                )
            );


        // ==========================================
        // 1. GET USER REELS
        // ONLY PAGE 1
        // ==========================================

        let userReels = [];


        if (
            page === 1
        ) {

            userReels = await Reel.find({
                source: "user",
                author: {
                    $ne: userId
                },
                shareToFeed: true
            })
            .populate({
                path: "author",
                select: "fullName username profilePicture"
            })
            .sort({
                createdAt: -1
            });

        }


        // ==========================================
        // 2. GET USER'S LIKED REELS
        // ==========================================

        const likedReels =
            await Reel.find({

                likes:
                    userId

            })
                .select(
                    "category caption text music"
                );


        // ==========================================
        // 3. FIND PREFERRED TOPICS
        // ==========================================

        const preferredTopics =
            getPreferredReelTopics(
                likedReels
            );


        // ==========================================
        // 4. AUTOMATIC REELS
        // ==========================================

        const automaticReels = [];


        // ==========================================
        // FETCH ALL PREFERRED TOPICS
        // WITH CURRENT PAGE
        // ==========================================

        for (
            const topic of preferredTopics.slice(0, 1)
        ) {

            try {

                const videos =
                    await fetchAutomaticReels(
                        topic,
                        page
                    );


                for (
                    const video of videos
                ) {

                    // ==================================
                    // DETECT SOURCE
                    // ==================================

                    const isYouTube =
                        !!video.youtubeUrl;

                    const source =
                        isYouTube
                            ? "youtube"
                            : "pexels";

                    const sourceId =
                        String(
                            video.id
                        );


                    // ==================================
                    // VIDEO DATA
                    // ==================================

                    let videoUrl = "";

                    let sourceUrl = "";

                    let externalName = "";

                    let externalProfileUrl = "";

                    let duration = 0;


                    // ==================================
                    // YOUTUBE
                    // ==================================

                    if (isYouTube) {

                        videoUrl =
                            "https://www.youtube.com/embed/" +
                            sourceId;

                        sourceUrl =
                            video.youtubeUrl ||
                            "";

                        externalName =
                            video.channelTitle ||
                            "YouTube Creator";

                        externalProfileUrl =
                            video.channelId
                                ? "https://www.youtube.com/channel/" +
                                  video.channelId
                                : "";

                        duration = 0;

                    }


                    // ==================================
                    // PEXELS
                    // ==================================

                    else {

                        // FIND PORTRAIT MP4

                        let videoFile =
                            video.video_files?.find(
                                function (file) {

                                    return (
                                        file.file_type ===
                                            "video/mp4" &&
                                        file.width <=
                                            file.height
                                    );

                                }
                            );


                        // FALLBACK TO ANY MP4

                        if (!videoFile) {

                            videoFile =
                                video.video_files?.find(
                                    function (file) {

                                        return (
                                            file.file_type ===
                                                "video/mp4"
                                        );

                                    }
                                );

                        }


                        if (!videoFile) {

                            continue;

                        }


                        videoUrl =
                            videoFile.link;

                        sourceUrl =
                            video.url ||
                            "";

                        externalName =
                            video.user?.name ||
                            "Pexels Creator";

                        externalProfileUrl =
                            video.user?.url ||
                            "";

                        duration =
                            Number(
                                video.duration ||
                                0
                            );

                    }


                    // ==================================
                    // CHECK EXISTING AUTOMATIC REEL
                    // ==================================

                    let reel =
                        await Reel.findOne({

                            source:
                                source,

                            sourceId:
                                sourceId

                        });


                    // ==================================
                    // CREATE AUTOMATIC REEL
                    // ==================================

                    if (!reel) {

                        reel =
                            await Reel.create({

                                author:
                                    null,

                                video:
                                    videoUrl,

                                caption:
                                    video.title ||
                                    (
                                        "Discover more " +
                                        topic +
                                        " content ✨"
                                    ),

                                category:
                                    topic,

                                source:
                                    source,

                                sourceId:
                                    sourceId,

                                sourceUrl:
                                    sourceUrl,

                                externalAuthor: {

                                    name:
                                        externalName,

                                    profileUrl:
                                        externalProfileUrl

                                },

                                duration:
                                    duration,

                                text:
                                    "",

                                elements:
                                    [],

                                music: {

                                    title:
                                        "",

                                    artist:
                                        "",

                                    audioUrl:
                                        ""

                                },

                                effects:
                                    [],

                                stickers:
                                    [],

                                audio: {

                                    volume:
                                        100,

                                    voiceover:
                                        false

                                },

                                shareToFeed:
                                    true,

                                allowComments:
                                    true,

                                likes:
                                    [],

                                saves:
                                    [],

                                comments:
                                    [],

                                shares:
                                    [],

                                views:
                                    []

                            });

                    }


                    // ==================================
                    // POPULATE AUTHOR
                    // ==================================

                    await reel.populate({

                        path:
                            "author",

                        select:
                            "fullName username profilePicture"

                    });


                    automaticReels.push(
                        reel
                    );

                }

            }

            catch (topicError) {

                console.error(

                    "Automatic reel topic failed:",

                    topic,

                    topicError.message

                );

            }

        }


        // ==========================================
        // 5. REMOVE DUPLICATE AUTOMATIC REELS
        // ==========================================

        const uniqueAutomaticReels = [];

        const automaticIds =
            new Set();


        automaticReels.forEach(
            function (reel) {

                const id =
                    String(
                        reel._id
                    );


                if (
                    !automaticIds.has(
                        id
                    )
                ) {

                    automaticIds.add(
                        id
                    );

                    uniqueAutomaticReels.push(
                        reel
                    );

                }

            }
        );


        // ==========================================
        // 6. MIX USER + AUTOMATIC REELS
        // ==========================================

        const mixedReels = [];

        let automaticIndex =
            0;


        userReels.forEach(
            function (reel) {

                mixedReels.push(
                    reel
                );


                // ==================================
                // ADD AUTOMATIC REEL
                // AFTER USER REEL
                // ==================================

                if (
                    automaticIndex <
                    uniqueAutomaticReels.length
                ) {

                    mixedReels.push(

                        uniqueAutomaticReels[
                            automaticIndex
                        ]

                    );

                    automaticIndex++;

                }

            }
        );


        // ==========================================
        // 7. APPEND REMAINING AUTOMATIC REELS
        // ==========================================

        while (
            automaticIndex <
            uniqueAutomaticReels.length
        ) {

            mixedReels.push(

                uniqueAutomaticReels[
                    automaticIndex
                ]

            );

            automaticIndex++;

        }


        // ==========================================
        // 8. HAS MORE
        // ==========================================

        const hasMore =
            uniqueAutomaticReels.length >
            0;


        // ==========================================
        // 9. FINAL RESPONSE
        // ==========================================

        return res.status(200).json({

            reels:
                mixedReels,

            page:
                page,

            hasMore:
                uniqueAutomaticReels.length > 0

        });

    }

    catch (error) {

        console.error(
            "GET REELS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch reels"

        });

    }

};


// ==========================================
// GET SINGLE REEL
// GET /api/reels/:reelId
// ==========================================

export async function getReel(
    req,
    res
) {

    try {

        const {
            reelId
        } = req.params;


        // ======================================
        // VALIDATE ID
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
            )
                .populate(
                    "author",
                    "fullName username profilePicture"
                );


        if (!reel) {

            return res.status(404).json({

                message:
                    "Reel not found"

            });

        }


        return res.json({

            reel

        });

    }

    catch (error) {

        console.error(
            "GET REEL ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load reel"

        });

    }

}


// ==========================================
// GET USER REELS
// GET /api/reels/user/:userId
// ==========================================

export async function getUserReels(
    req,
    res
) {

    try {

        const {
            userId
        } = req.params;


        // ======================================
        // VALIDATE ID
        // ======================================

        if (
            !mongoose.Types.ObjectId.isValid(
                userId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid user ID"

            });

        }


        // ======================================
        // CHECK USER
        // ======================================

        const user =
            await User.findById(
                userId
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ======================================
        // GET REELS
        // ======================================

        const reels =
            await Reel.find({

                author:
                    userId

            })
                .populate(
                    "author",
                    "fullName username profilePicture"
                )
                .sort({

                    createdAt:
                        -1

                });


        return res.json({

            reels

        });

    }

    catch (error) {

        console.error(
            "GET USER REELS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to load user reels"

        });

    }

}


// ==========================================
// DELETE REEL
// DELETE /api/reels/:reelId
// ==========================================

export async function deleteReel(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        const {
            reelId
        } = req.params;


        // ======================================
        // VALIDATE ID
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
        // AUTOMATIC REEL CHECK
        // ======================================

        if (
            reel.source ===
            "pexels"
        ) {

            return res.status(403).json({

                message:
                    "Automatic reels cannot be deleted"

            });

        }


        // ======================================
        // OWNER CHECK
        // ======================================

        if (
            !reel.author ||
            reel.author.toString() !==
            userId.toString()
        ) {

            return res.status(403).json({

                message:
                    "You can only delete your own reel"

            });

        }


        // ======================================
        // DELETE
        // ======================================

        await Reel.findByIdAndDelete(
            reelId
        );


        return res.json({

            message:
                "Reel deleted successfully"

        });

    }

    catch (error) {

        console.error(
            "DELETE REEL ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to delete reel"

        });

    }

}


// ==========================================
// SAVE / UNSAVE REEL
// POST /api/reels/:reelId/save
// ==========================================

export async function toggleReelSave(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        const {
            reelId
        } = req.params;


        // ======================================
        // VALIDATE ID
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
        // CHECK ALREADY SAVED
        // ======================================

        const alreadySaved =
            reel.saves.some(
                id =>
                    id.toString() ===
                    userId.toString()
            );


        // ======================================
        // UNSAVE
        // ======================================

        if (alreadySaved) {

            reel.saves =
                reel.saves.filter(
                    id =>
                        id.toString() !==
                        userId.toString()
                );


            await reel.save();


            return res.json({

                saved:
                    false,

                saves:
                    reel.saves.length,

                message:
                    "Reel removed from saved"

            });

        }


        // ======================================
        // SAVE
        // ======================================

        reel.saves.push(
            userId
        );


        await reel.save();


        return res.json({

            saved:
                true,

            saves:
                reel.saves.length,

            message:
                "Reel saved"

        });

    }

    catch (error) {

        console.error(
            "TOGGLE REEL SAVE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to save reel"

        });

    }

}