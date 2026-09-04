import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {

        // =========================================
        // BASIC PROFILE
        // =========================================

        fullName: {
            type: String,
            trim: true,
            default: ""
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        email: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },


        // =========================================
        // PROFILE
        // =========================================

        profilePicture: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: "",
            trim: true
        },

        gender: {
            type: String,
            enum: [
                "",
                "male",
                "female",
                "other"
            ],
            default: ""
        },


        // =========================================
        // ACCOUNT PRIVACY
        // =========================================

        isPrivate: {
            type: Boolean,
            default: false
        },


        // =========================================
        // FOLLOWERS / FOLLOWING
        // =========================================

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],


        // =========================================
        // ACTIVITY STATUS
        // =========================================

        isOnline: {
            type: Boolean,
            default: false
        },

        lastSeen: {
            type: Date,
            default: null
        },

        showActivityStatus: {
            type: Boolean,
            default: true
        },


        // =========================================
        // MESSAGE SETTINGS
        // =========================================

        allowMessageRequests: {
            type: Boolean,
            default: true
        },

        readReceipts: {
            type: Boolean,
            default: true
        },

        allowGroupRequests: {
            type: Boolean,
            default: true
        },


        // =========================================
        // STORY SETTINGS
        // =========================================

        showStoryActivity: {
            type: Boolean,
            default: true
        },

        allowStorySharing: {
            type: Boolean,
            default: true
        },

        allowStoryMessageSharing: {
            type: Boolean,
            default: true
        },


        // =========================================
        // COMMENT SETTINGS
        // =========================================

        hideOffensiveComments: {
            type: Boolean,
            default: true
        },


        // =========================================
        // TAG SETTINGS
        // =========================================

        manualTagApproval: {
            type: Boolean,
            default: false
        },


        // =========================================
        // POST / REELS SETTINGS
        // =========================================

        hideLikeCounts: {
            type: Boolean,
            default: false
        },

        allowRemix: {
            type: Boolean,
            default: true
        },

        allowReelsToStory: {
            type: Boolean,
            default: true
        },


        // =========================================
        // SECURITY SETTINGS
        // =========================================

        twoFactorEnabled: {
            type: Boolean,
            default: false
        },

        loginAlerts: {
            type: Boolean,
            default: true
        },

        savedLoginInformation: {
            type: Boolean,
            default: true
        },


        // =========================================
        // ACCOUNT STATUS
        // =========================================

        isDeactivated: {
            type: Boolean,
            default: false
        },

        deactivatedAt: {
            type: Date,
            default: null
        }

    },

    {
        timestamps: true
    }
);


// ==========================================
// MODEL
// ==========================================

const User = mongoose.model(
    "User",
    userSchema
);


export default User;