import mongoose from "mongoose";


// ==========================================
// STORY ELEMENT SCHEMA
// ==========================================

const storyElementSchema =
    new mongoose.Schema(

        {

            type: {

                type: String,

                enum: [

                    "text",

                    "sticker",

                    "mention",

                    "music"

                ],

                required: true

            },


            value: {

                type:
                    mongoose.Schema.Types.Mixed,

                default: null

            },


            x: {

                type: Number,

                default: 50

            },


            y: {

                type: Number,

                default: 50

            },


            scale: {

                type: Number,

                default: 1

            },


            rotation: {

                type: Number,

                default: 0

            },


            font: {

                type: String,

                default: "Arial"

            },


            color: {

                type: String,

                default: "#ffffff"

            }

        },

        {

            _id: false

        }

    );


// ==========================================
// STORY SCHEMA
// ==========================================

const storySchema =
    new mongoose.Schema(

        {

            // ======================================
            // OWNER
            // ======================================

            user: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true

            },


            // ======================================
            // MEDIA
            // ======================================

            mediaUrl: {

                type: String,

                required: true

            },


            mediaType: {

                type: String,

                enum: [

                    "image",

                    "video"

                ],

                required: true

            },


            // ======================================
            // STORY ELEMENTS
            // ======================================

            elements: {

                type:
                    [storyElementSchema],

                default: []

            },


            // ======================================
            // MUSIC
            // ======================================

            music: {

                type:
                    mongoose.Schema.Types.Mixed,

                default: null

            },


            // ======================================
            // EFFECT
            // ======================================

            effect: {

                type: String,

                default: "None"

            },


            // ======================================
            // SETTINGS
            // ======================================

            settings: {

                replies: {

                    type: Boolean,

                    default: true

                },


                sharing: {

                    type: Boolean,

                    default: true

                }

            },


            // ======================================
            // VIEWERS
            // ======================================

            viewers: [

                {

                    user: {

                        type:
                            mongoose.Schema.Types.ObjectId,

                        ref: "User"

                    },


                    viewedAt: {

                        type: Date,

                        default: Date.now

                    }

                }

            ],


            // ======================================
            // STORY EXPIRY
            // ======================================

            expiresAt: {

                type: Date,

                required: true,

                index: true

            }

        },


        {

            timestamps: true

        }

    );


// ==========================================
// MODEL
// ==========================================
//
// IMPORTANT:
//
// No MongoDB TTL index here.
//
// We delete the Story AND its uploaded
// media file together from the backend
// cleanup job in index.js.
//
// ==========================================

const Story =

    mongoose.models.Story ||

    mongoose.model(

        "Story",

        storySchema

    );


// ==========================================
// EXPORT
// ==========================================

export default Story;