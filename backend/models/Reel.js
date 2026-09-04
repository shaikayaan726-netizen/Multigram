// ==========================================
// IMPORT
// ==========================================

import mongoose from "mongoose";


// ==========================================
// REEL SCHEMA
// ==========================================

const reelSchema = new mongoose.Schema(

    {

        // ======================================
        // REEL OWNER
        // ======================================

             author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: false,

            default: null

        },


        // ======================================
        // VIDEO
        // ======================================

               video: {

            type: String,

            required: true

        },


        // ======================================
        // REEL SOURCE
        // ======================================

        source: {
            type: String,
            enum: ["user", "pexels", "youtube"],
            default: "user",
            index: true
        },


        // ======================================
        // EXTERNAL SOURCE ID
        // ======================================

        sourceId: {

            type: String,

            default: "",

            index: true

        },


        // ======================================
        // EXTERNAL SOURCE URL
        // ======================================

        sourceUrl: {

            type: String,

            default: ""

        },


        // ======================================
        // EXTERNAL CREATOR
        // ======================================

        externalAuthor: {

            name: {

                type: String,

                default: ""

            },

            profileUrl: {

                type: String,

                default: ""

            }

        },


        // ======================================
        // CAPTION
        // ======================================

        // ======================================
        // CAPTION
        // ======================================

        caption: {

            type: String,

            default: "",

            maxlength: 2200

        },


        // ======================================
        // REEL CATEGORY
        // ======================================

        category: {
            type: String,
            enum: [
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
                "entertainment",
                "other"
            ],
            default: "other",
            index: true
        },


        // ======================================
        // DURATION
        // ======================================

        duration: {

            type: Number,

            default: 0,

            min: 0

        },


        // ======================================
        // TEXT
        // ======================================

        text: {

            type: String,

            default: ""

        },


        // ======================================
        // REEL ELEMENTS
        // ======================================

        elements: {

            type: mongoose.Schema.Types.Mixed,

            default: []

        },


        // ======================================
        // MUSIC
        // ======================================

        music: {

            title: {

                type: String,

                default: ""

            },

            artist: {

                type: String,

                default: ""

            },

            audioUrl: {

                type: String,

                default: ""

            }

        },


        // ======================================
        // EFFECTS
        // ======================================

        effects: {

            type: mongoose.Schema.Types.Mixed,

            default: []

        },


        // ======================================
        // STICKERS
        // ======================================

        stickers: {

            type: mongoose.Schema.Types.Mixed,

            default: []

        },


        // ======================================
        // AUDIO
        // ======================================

        audio: {

            volume: {

                type: Number,

                default: 100,

                min: 0,

                max: 100

            },

            voiceover: {

                type: Boolean,

                default: false

            }

        },


        // ======================================
        // SHARE TO FEED
        // ======================================

        shareToFeed: {

            type: Boolean,

            default: true

        },


        // ======================================
        // COMMENTS
        // ======================================

        allowComments: {

            type: Boolean,

            default: true

        },


        // ======================================
        // LIKES
        // ======================================

        likes: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],


        // ======================================
        // SAVES
        // ======================================

        saves: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],


        // ======================================
        // COMMENTS
        // ======================================

        comments: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "Comment"

            }

        ],


        // ======================================
        // SHARES
        // ======================================

        shares: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],


        // ======================================
        // VIEWS
        // ======================================

        views: [

            {

                user: {

                    type: mongoose.Schema.Types.ObjectId,

                    ref: "User"

                },

                watchedAt: {

                    type: Date,

                    default: Date.now

                },

                watchTime: {

                    type: Number,

                    default: 0,

                    min: 0

                },

                completed: {

                    type: Boolean,

                    default: false

                },

                replayed: {

                    type: Boolean,

                    default: false

                }

            }

        ]

    },

    {

        // ======================================
        // CREATED / UPDATED
        // ======================================

        timestamps: true

    }

);


// ==========================================
// INDEXES
// ==========================================

// Latest reels.

reelSchema.index({

    createdAt: -1

});


// User ke reels.

reelSchema.index({

    author: 1,

    createdAt: -1

});


// Recommendation ke liye.

// Popular engagement wale reels ko
// efficiently query karne mein help karega.

reelSchema.index({

    "views.completed": 1,

    createdAt: -1

});


// ==========================================
// MODEL
// ==========================================

const Reel =
    mongoose.models.Reel ||
    mongoose.model(
        "Reel",
        reelSchema
    );


// ==========================================
// EXPORT
// ==========================================

export default Reel;