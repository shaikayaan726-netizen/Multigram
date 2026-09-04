import mongoose from "mongoose";


// ==========================================
// MESSAGE SCHEMA
// ==========================================

const messageSchema = new mongoose.Schema(

    {

        // ======================================
        // SENDER
        // ======================================

        sender: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // ======================================
        // RECEIVER
        // ======================================

       receiver:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},

callId:{
    type:String,
    default:""
},

        // ======================================
        // REPLY TO MESSAGE
        // ======================================

        replyTo: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "Message",

            default: null

        },
        // ======================================
        // MESSAGE TYPE
        // ======================================

        type: {

            type: String,

            enum: [

                "text",

                "image",

                "video",

                "audio",

                "call"

            ],

            default: "text"

        },


        // ======================================
        // TEXT
        // ======================================

        text: {

            type: String,

            default: ""

        },


        // ======================================
        // MEDIA URL
        // ======================================

        mediaUrl: {

            type: String,

            default: ""

        },


        // ======================================
        // CALL TYPE
        // ======================================

        callType: {

            type: String,

            enum: [

                "voice",

                "video",

                ""

            ],

            default: ""

        },


        // ======================================
        // CALL STATUS
        // ======================================

        callStatus: {

            type: String,

            enum: [

                "calling",

                "answered",

                "missed",

                "rejected",

                "ended",

                ""

            ],

            default: ""

        },


        // ======================================
        // CALL DURATION
        // ======================================

        callDuration: {

            type: Number,

            default: 0

        },


        // ======================================
        // CALL START TIME
        // ======================================

        callStartedAt: {

            type: Date,

            default: null

        },


        // ======================================
        // CALL END TIME
        // ======================================

        callEndedAt: {

            type: Date,

            default: null

        },


        // ======================================
        // READ STATUS
        // ======================================

        read: {

            type: Boolean,

            default: false

        },


        // ======================================
        // READ TIME
        // ======================================

        readAt: {

            type: Date,

            default: null

        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// INDEXES
// ==========================================

messageSchema.index({

    sender: 1,

    receiver: 1,

    createdAt: -1

});


messageSchema.index({

    receiver: 1,

    read: 1,

    createdAt: -1

});


// ==========================================
// MODEL
// ==========================================

const Message =

    mongoose.models.Message ||

    mongoose.model(

        "Message",

        messageSchema

    );


// ==========================================
// EXPORT
// ==========================================

export default Message;