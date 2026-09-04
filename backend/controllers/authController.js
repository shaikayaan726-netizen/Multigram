import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";


// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET =
    process.env.JWT_SECRET || "ayaan123";


// ==========================================
// CREATE JWT
// ==========================================

function createToken(userId) {

    return jwt.sign(
        {
            id: userId.toString()
        },
        JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );

}


// ==========================================
// PUBLIC USER DATA
// Password kabhi frontend ko nahi bhejna
// ==========================================

function userResponse(user) {

    return {

        id:
            user._id,

        fullName:
            user.fullName,

        username:
            user.username,

        email:
            user.email,

        phone:
            user.phone,

        profilePicture:
            user.profilePicture || "",

        bio:
            user.bio || "",

        gender:
            user.gender || "",


        // ==========================================
        // ACCOUNT PRIVACY
        // ==========================================

        isPrivate:
            Boolean(user.isPrivate),

        followers:
            user.followers || [],

        following:
            user.following || [],


        // ==========================================
        // ACTIVITY
        // ==========================================

        isOnline:
            Boolean(user.isOnline),

        lastSeen:
            user.lastSeen || null,

        showActivityStatus:
            user.showActivityStatus !== false,


        // ==========================================
        // MESSAGE SETTINGS
        // ==========================================

        allowMessageRequests:
            user.allowMessageRequests !== false,

        readReceipts:
            user.readReceipts !== false,

        allowGroupRequests:
            user.allowGroupRequests !== false,


        // ==========================================
        // STORY SETTINGS
        // ==========================================

        showStoryActivity:
            user.showStoryActivity !== false,

        allowStorySharing:
            user.allowStorySharing !== false,

        allowStoryMessageSharing:
            user.allowStoryMessageSharing !== false,


        // ==========================================
        // COMMENT SETTINGS
        // ==========================================

        hideOffensiveComments:
            user.hideOffensiveComments !== false,


        // ==========================================
        // TAG SETTINGS
        // ==========================================

        manualTagApproval:
            Boolean(user.manualTagApproval),


        // ==========================================
        // POST / REELS SETTINGS
        // ==========================================

        hideLikeCounts:
            Boolean(user.hideLikeCounts),

        allowRemix:
            user.allowRemix !== false,

        allowReelsToStory:
            user.allowReelsToStory !== false,


        // ==========================================
        // SECURITY SETTINGS
        // ==========================================

        twoFactorEnabled:
            user.twoFactorEnabled !== false,

        loginAlerts:
            user.loginAlerts !== false,

        savedLoginInformation:
            user.savedLoginInformation !== false,


        // ==========================================
        // ACCOUNT STATUS
        // ==========================================

        isDeactivated:
            Boolean(user.isDeactivated),

        deactivatedAt:
            user.deactivatedAt || null

    };

}


// ==========================================
// REGISTER
// ==========================================

export async function register(req, res) {

    try {

        const {
            fullName,
            username,
            login,
            password
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !fullName ||
            !username ||
            !login ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "All fields are required"

            });

        }


        const cleanFullName =
            String(fullName).trim();

        const cleanUsername =
            String(username)
                .trim()
                .toLowerCase();

        const cleanLogin =
            String(login)
                .trim()
                .toLowerCase();


        if (
            cleanUsername.length < 3
        ) {

            return res.status(400).json({

                message:
                    "Username must contain at least 3 characters"

            });

        }


        if (
            password.length < 6
        ) {

            return res.status(400).json({

                message:
                    "Password must contain at least 6 characters"

            });

        }


        // ==========================================
        // EMAIL / PHONE
        // ==========================================

        let email = "";

        let phone = "";


        if (
            cleanLogin.includes("@")
        ) {

            email =
                cleanLogin;

        }
        else {

            phone =
                cleanLogin;

        }


        // ==========================================
        // USERNAME CHECK
        // ==========================================

        const existingUsername =
            await User.findOne({

                username:
                    cleanUsername

            });


        if (existingUsername) {

            return res.status(409).json({

                message:
                    "Username Already Exists"

            });

        }


        // ==========================================
        // EMAIL CHECK
        // ==========================================

        if (email) {

            const existingEmail =
                await User.findOne({

                    email

                });


            if (existingEmail) {

                return res.status(409).json({

                    message:
                        "Email Already Exists"

                });

            }

        }


        // ==========================================
        // PHONE CHECK
        // ==========================================

        if (phone) {

            const existingPhone =
                await User.findOne({

                    phone

                });


            if (existingPhone) {

                return res.status(409).json({

                    message:
                        "Phone Number Already Exists"

                });

            }

        }


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ==========================================
        // CREATE USER
        // ==========================================

        const user =
            await User.create({

                fullName:
                    cleanFullName,

                username:
                    cleanUsername,

                email,

                phone,

                password:
                    hashedPassword,


                // ==================================
                // PROFILE
                // ==================================

                profilePicture:
                    "",

                bio:
                    "",

                gender:
                    "",


                // ==================================
                // PRIVACY
                // ==================================

                isPrivate:
                    false,


                // ==================================
                // FOLLOWERS / FOLLOWING
                // ==================================

                followers:
                    [],

                following:
                    [],


                // ==================================
                // ACTIVITY
                // ==================================

                showActivityStatus:
                    true,

                isOnline:
                    false,

                lastSeen:
                    null,


                // ==================================
                // MESSAGE SETTINGS
                // ==================================

                allowMessageRequests:
                    true,

                readReceipts:
                    true,

                allowGroupRequests:
                    true,


                // ==================================
                // STORY SETTINGS
                // ==================================

                showStoryActivity:
                    true,

                allowStorySharing:
                    true,

                allowStoryMessageSharing:
                    true,


                // ==================================
                // COMMENT SETTINGS
                // ==================================

                hideOffensiveComments:
                    true,


                // ==================================
                // TAG SETTINGS
                // ==================================

                manualTagApproval:
                    false,


                // ==================================
                // POST / REELS SETTINGS
                // ==================================

                hideLikeCounts:
                    false,

                allowRemix:
                    true,

                allowReelsToStory:
                    true,


                // ==================================
                // SECURITY SETTINGS
                // ==================================

                twoFactorEnabled:
                    false,

                loginAlerts:
                    true,

                savedLoginInformation:
                    true,


                // ==================================
                // ACCOUNT STATUS
                // ==================================

                isDeactivated:
                    false,

                deactivatedAt:
                    null

            });


        // ==========================================
        // JWT
        // ==========================================

        const token =
            createToken(
                user._id
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            message:
                "Account Created Successfully",

            token,

            user:
                userResponse(user)

        });

    }
    catch (error) {

        console.error(
            "REGISTER CONTROLLER ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Registration failed"

        });

    }

}


// ==========================================
// LOGIN
// Email / Username / Phone
// ==========================================

export async function login(req, res) {

    try {

        const {
            login,
            password
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !login ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Login and password are required"

            });

        }


        const cleanLogin =
            String(login)
                .trim()
                .toLowerCase();


        // ==========================================
        // FIND USER
        // ==========================================

        const user =
            await User.findOne({

                $or: [

                    {
                        email:
                            cleanLogin
                    },

                    {
                        username:
                            cleanLogin
                    },

                    {
                        phone:
                            cleanLogin
                    }

                ]

            });


        if (!user) {

            return res.status(401).json({

                message:
                    "User Doesn't Exist"

            });

        }


        // ==========================================
        // CHECK DEACTIVATED ACCOUNT
        // ==========================================

        if (
            user.isDeactivated
        ) {

            return res.status(403).json({

                message:
                    "This account is deactivated"

            });

        }


        // ==========================================
        // PASSWORD
        // ==========================================

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isMatch) {

            return res.status(401).json({

                message:
                    "Incorrect Password"

            });

        }


        // ==========================================
        // ONLINE
        // ==========================================

        user.isOnline =
            true;

        user.lastSeen =
            new Date();


        await user.save();


        // ==========================================
        // JWT
        // ==========================================

        const token =
            createToken(
                user._id
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Login Successful",

            token,

            user:
                userResponse(user)

        });

    }
    catch (error) {

        console.error(
            "LOGIN CONTROLLER ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Login failed"

        });

    }

}


// ==========================================
// CURRENT USER
// GET /api/auth/me
// ==========================================

export async function getMe(req, res) {

    try {

        // ==========================================
        // USER ID
        // ==========================================

        const userId =
            req.user.id;


        // ==========================================
        // FIND USER
        // ==========================================

        const user =
            await User.findById(
                userId
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User Not Found"

            });

        }


        // ==========================================
        // DEACTIVATED
        // ==========================================

        if (
            user.isDeactivated
        ) {

            return res.status(403).json({

                message:
                    "This account is deactivated"

            });

        }


        // ==========================================
        // ONLINE
        // ==========================================

        user.isOnline =
            true;

        user.lastSeen =
            new Date();


        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            user:
                userResponse(user)

        });

    }
    catch (error) {

        console.error(
            "GET ME ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Could not get current user"

        });

    }

}


// ==========================================
// UPDATE PROFILE
// ==========================================

export async function updateProfile(req, res) {

    try {

        const userId =
            req.user.id;


        const {
            fullName,
            username,
            bio,
            gender
        } = req.body;


        // ==========================================
        // FIND CURRENT USER
        // ==========================================

        const currentUser =
            await User.findById(
                userId
            );


        if (!currentUser) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ==========================================
        // CLEAN USERNAME
        // ==========================================

        const cleanUsername =
            username !== undefined
                ? String(username)
                    .trim()
                    .toLowerCase()
                : currentUser.username;


        // ==========================================
        // USERNAME VALIDATION
        // ==========================================

        if (
            cleanUsername.length < 3
        ) {

            return res.status(400).json({

                message:
                    "Username must contain at least 3 characters"

            });

        }


        // ==========================================
        // USERNAME DUPLICATE CHECK
        // ==========================================

        if (
            cleanUsername !==
            currentUser.username
        ) {

            const existingUser =
                await User.findOne({

                    username:
                        cleanUsername,

                    _id: {
                        $ne:
                            userId
                    }

                });


            if (existingUser) {

                return res.status(409).json({

                    message:
                        "Username Already Exists"

                });

            }

        }


        // ==========================================
        // UPDATE
        // ==========================================

        currentUser.fullName =
            fullName !== undefined
                ? String(fullName).trim()
                : currentUser.fullName;


        currentUser.username =
            cleanUsername;


        currentUser.bio =
            bio !== undefined
                ? String(bio)
                : currentUser.bio;


        currentUser.gender =
            gender !== undefined
                ? gender
                : currentUser.gender;


        await currentUser.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                "Profile updated successfully",

            user:
                userResponse(currentUser)

        });

    }
    catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );


        if (
            error.code === 11000
        ) {

            return res.status(409).json({

                message:
                    "Username or email already exists"

            });

        }


        return res.status(500).json({

            message:
                "Failed to update profile"

        });

    }

}


// ==========================================
// UPDATE PROFILE PICTURE
// ==========================================

export async function updateProfilePicture(req, res) {

    try {

        // ==========================================
        // CHECK FILE
        // ==========================================

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Please select a profile picture"

            });

        }


        // ==========================================
        // USER ID
        // ==========================================

        const userId =
            req.user.id;


        // ==========================================
        // IMAGE PATH
        // ==========================================

        const profilePicture =
            "/uploads/profile/" +
            req.file.filename;


        // ==========================================
        // UPDATE USER
        // ==========================================

        const user =
            await User.findByIdAndUpdate(

                userId,

                {

                    profilePicture:
                        profilePicture

                },

                {

                    new:
                        true

                }

            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                "Profile picture updated successfully",

            user:
                userResponse(user)

        });

    }
    catch (error) {

        console.error(
            "PROFILE PICTURE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to update profile picture"

        });

    }

}


// ==========================================
// UPDATE PRIVACY SETTINGS
// ==========================================

export async function updatePrivacySettings(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


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


        // ==========================================
        // ALLOWED SETTINGS
        // ==========================================

        const allowedSettings = [

            "isPrivate",

            "showActivityStatus",

            "allowMessageRequests",

            "readReceipts",

            "allowGroupRequests",

            "showStoryActivity",

            "allowStorySharing",

            "allowStoryMessageSharing",

            "hideOffensiveComments",

            "manualTagApproval",

            "hideLikeCounts",

            "allowRemix",

            "allowReelsToStory"

        ];


        // ==========================================
        // UPDATE ONLY BOOLEAN SETTINGS
        // ==========================================

        allowedSettings.forEach(
            function(setting) {

                if (
                    typeof req.body[setting] ===
                    "boolean"
                ) {

                    user[setting] =
                        req.body[setting];

                }

            }
        );


        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Privacy settings updated successfully",

            user:
                userResponse(user)

        });

    }
    catch (error) {

        console.error(
            "UPDATE PRIVACY SETTINGS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to update privacy settings"

        });

    }

}


// ==========================================
// UPDATE SECURITY SETTINGS
// ==========================================

export async function updateSecuritySettings(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


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


        // ==========================================
        // ALLOWED SETTINGS
        // ==========================================

        const allowedSettings = [

            "twoFactorEnabled",

            "loginAlerts",

            "savedLoginInformation"

        ];


        // ==========================================
        // UPDATE ONLY PROVIDED SETTINGS
        // ==========================================

        allowedSettings.forEach(
            function(setting) {

                if (
                    typeof req.body[setting] ===
                    "boolean"
                ) {

                    user[setting] =
                        req.body[setting];

                }

            }
        );


        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Security settings updated successfully",

            user:
                userResponse(user)

        });

    }
    catch (error) {

        console.error(
            "UPDATE SECURITY SETTINGS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to update security settings"

        });

    }

}


// ==========================================
// CHANGE PASSWORD
// ==========================================

export async function changePassword(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        const {
            currentPassword,
            newPassword
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                message:
                    "Current password and new password are required"

            });

        }


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                message:
                    "New password must contain at least 6 characters"

            });

        }


        // ==========================================
        // FIND USER
        // ==========================================

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


        // ==========================================
        // CHECK CURRENT PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Current password is incorrect"

            });

        }


        // ==========================================
        // HASH NEW PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        user.password =
            hashedPassword;


        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Password changed successfully"

        });

    }
    catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to change password"

        });

    }

}


// ==========================================
// TEMPORARILY DEACTIVATE ACCOUNT
// ==========================================

export async function deactivateAccount(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        // ==========================================
        // FIND USER
        // ==========================================

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


        // ==========================================
        // DEACTIVATE
        // ==========================================

        user.isDeactivated =
            true;

        user.deactivatedAt =
            new Date();

        user.isOnline =
            false;

        user.lastSeen =
            new Date();


        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Account deactivated successfully"

        });

    }
    catch (error) {

        console.error(
            "DEACTIVATE ACCOUNT ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to deactivate account"

        });

    }

}


// ==========================================
// PERMANENTLY DELETE ACCOUNT
// ==========================================

export async function deleteAccount(
    req,
    res
) {

    try {

        const userId =
            req.user.id;


        // ==========================================
        // FIND USER
        // ==========================================

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


        // ==========================================
        // DELETE USER
        // ==========================================

        await User.findByIdAndDelete(
            userId
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Account deleted permanently"

        });

    }
    catch (error) {

        console.error(
            "DELETE ACCOUNT ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to delete account"

        });

    }

}