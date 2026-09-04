import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        // ===========================
        // POST
        // ===========================

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null
        },


        // ===========================
        // REEL
        // ===========================

        reel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel",
            default: null
        },


        // ===========================
        // AUTHOR
        // ===========================

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ===========================
        // COMMENT TEXT
        // ===========================

        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },


        // ===========================
        // PARENT COMMENT / REPLY
        // ===========================

        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },


        // ===========================
        // LIKES
        // ===========================

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },


    // ===========================
    // TIMESTAMPS
    // ===========================

    {
        timestamps: true
    }
);


// ===========================
// POST COMMENTS INDEX
// ===========================

commentSchema.index({
    post: 1,
    createdAt: 1
});


// ===========================
// REPLY INDEX
// ===========================

commentSchema.index({
    parentComment: 1
});


// ===========================
// REEL COMMENTS INDEX
// ===========================

commentSchema.index({
    reel: 1,
    createdAt: 1
});


// ===========================
// EXPORT
// ===========================

export default mongoose.models.Comment ||
    mongoose.model(
        "Comment",
        commentSchema
    );