// ==========================================
// IMPORT
// ==========================================

import mongoose from "mongoose";


// ==========================================
// POST SCHEMA
// ==========================================

const postSchema = new mongoose.Schema(

    {

        // ======================================
        // POST OWNER
        // ======================================
        // Ye automatically logged-in user se
        // req.user.id ke through aayega.

        author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // ======================================
        // POST IMAGE
        // ======================================

        image: {

            type: String,

            required: true

        },


        // ======================================
        // CAPTION
        // ======================================

        caption: {

            type: String,

            default: "",

            maxlength: 2200

        },


        // ======================================
        // TEXT OVERLAY
        // ======================================

        textOverlay: {

            type: String,

            default: ""

        },


        // ======================================
        // TEXT FONT
        // ======================================

        textFont: {

            type: String,

            default: ""

        },


        // ======================================
        // TEXT COLOR
        // ======================================

        textColor: {

            type: String,

            default: ""

        },


        // ======================================
        // FILTER
        // ======================================

        filter: {

            type: String,

            default: ""

        },


        // ======================================
        // ADJUSTMENTS
        // ======================================
        // Brightness, contrast, saturation,
        // warmth etc. jo Post Editor se aayenge.

        adjustments: {

            type: mongoose.Schema.Types.Mixed,

            default: {}

        },


        // ======================================
        // TAGGED USER
        // ======================================

        taggedUser: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null

        },


        // ======================================
        // LOCATION
        // ======================================

        location: {

            name: {

                type: String,

                default: ""

            },

            subtitle: {

                type: String,

                default: ""

            }

        },


        // ======================================
        // MUSIC
        // ======================================
        // Sirf selected song ka information save
        // hoga.
        //
        // Audio clip maximum 30 seconds rakhenge.

        audio: {

            title: {

                type: String,

                default: ""

            },

            channel: {

                type: String,

                default: ""

            },

            image: {

                type: String,

                default: ""

            },

            audioUrl: {

                type: String,

                default: ""

            },

            startTime: {

                type: Number,

                default: 0,

                min: 0

            },

            duration: {

                type: Number,

                default: 30,

                min: 0,

                max: 30

            }

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
        // SAVE COUNT / USERS
        // ======================================
        // SavedPost system baad mein properly
        // SavedPost model ke saath connect karenge.

        saves: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],


        // ======================================
        // COMMENTS
        // ======================================
        // Comment model baad mein connect hoga.

        comments: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "Comment"

            }

        ]

    },

    {

        // ======================================
        // CREATED AT / UPDATED AT
        // ======================================

        timestamps: true

    }

);


// ==========================================
// INDEXES
// ==========================================

// Latest posts jaldi retrieve karne ke liye.

postSchema.index({

    createdAt: -1

});


// User ke posts jaldi retrieve karne ke liye.

postSchema.index({

    author: 1,

    createdAt: -1

});


// ==========================================
// MODEL
// ==========================================

const Post =
    mongoose.models.Post ||
    mongoose.model(
        "Post",
        postSchema
    );


// ==========================================
// EXPORT
// ==========================================

export default Post;