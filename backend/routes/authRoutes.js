import express from "express";


import {

    register,

    login,

    getMe,

    updateProfile,

    updateProfilePicture,

    updatePrivacySettings,

    updateSecuritySettings,

    changePassword,

    deactivateAccount,

    deleteAccount

} from "../controllers/authController.js";


import auth from "../middleware/auth.js";

import uploadProfile from "../middleware/uploadProfile.js";


const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post(
    "/register",
    register
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    login
);


// ==========================================
// CURRENT USER
// ==========================================

router.get(
    "/me",
    auth,
    getMe
);


// ==========================================
// UPDATE PROFILE
// ==========================================

router.put(
    "/profile",
    auth,
    updateProfile
);


// ==========================================
// UPDATE PROFILE PICTURE
// ==========================================

router.put(
    "/profile-picture",
    auth,
    uploadProfile.single("profilePicture"),
    updateProfilePicture
);


// ==========================================
// UPDATE PRIVACY SETTINGS
// ==========================================

router.put(
    "/privacy",
    auth,
    updatePrivacySettings
);


// ==========================================
// UPDATE SECURITY SETTINGS
// ==========================================

router.put(
    "/security",
    auth,
    updateSecuritySettings
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
    "/change-password",
    auth,
    changePassword
);


// ==========================================
// TEMPORARILY DEACTIVATE ACCOUNT
// ==========================================

router.put(
    "/deactivate",
    auth,
    deactivateAccount
);


// ==========================================
// PERMANENTLY DELETE ACCOUNT
// ==========================================

router.delete(
    "/delete-account",
    auth,
    deleteAccount
);


export default router;