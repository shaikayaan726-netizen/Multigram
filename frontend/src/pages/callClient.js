import {
    socket,
    connectSocket,
    getUserId,
    getCurrentUser
} from "../utils/socket";


// ==========================================
// CALL SOCKET
// ==========================================

export function getCallSocket() {

    connectSocket();

    return socket;
}


// ==========================================
// MY USER ID
// ==========================================

export function getMyUserId() {

    return getUserId();
}


// ==========================================
// CURRENT USER
// ==========================================

export function getMyUser() {

    return getCurrentUser();
}


// ==========================================
// NORMALIZE USER ID
// ==========================================

export function getUserIdFromUser(user) {

    return String(
        user?.id ||
        user?._id ||
        user?.userId ||
        ""
    );
}


// ==========================================
// USER NAME
// ==========================================

export function getUserName(user) {

    return (
        user?.username ||
        user?.name ||
        user?.fullName ||
        "User"
    );
}


// ==========================================
// USER AVATAR
// ==========================================

export function getUserAvatar(user) {

    return (
        user?.profilePicture ||
        user?.avatar ||
        user?.image ||
        ""
    );
}
