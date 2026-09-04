import { io } from "socket.io-client";


// ==========================================
// SOCKET URL
// ==========================================

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    `${window.location.protocol}//${window.location.hostname}:3000`;


// ==========================================
// SOCKET
// ==========================================

export const socket = io(
    SOCKET_URL,
    {
        autoConnect: false,

        transports: [
            "polling",
            "websocket"
        ],

        reconnection: true,

        reconnectionAttempts: Infinity,

        reconnectionDelay: 1000,

        auth: {
            token: ""
        }
    }
);


// ==========================================
// GET USER ID
// ==========================================

export function getUserId() {

    const storedId =
        localStorage.getItem("userId");

    if (storedId) {
        return String(storedId);
    }

    try {

        const storedUser =
            JSON.parse(
                localStorage.getItem("user") || "null"
            );

        const userId =
            storedUser?._id ||
            storedUser?.id ||
            storedUser?.userId ||
            "";

        if (userId) {

            localStorage.setItem(
                "userId",
                String(userId)
            );

            return String(userId);
        }

    } catch (error) {

        console.warn(
            "SOCKET: Could not read stored user",
            error
        );

    }

    return "";
}


// ==========================================
// GET CURRENT USER
// ==========================================

export function getCurrentUser() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user") || "null"
            );

        if (!user) {
            return null;
        }

        const userId =
            user._id ||
            user.id ||
            user.userId ||
            getUserId();

        return {
            ...user,
            id: userId ? String(userId) : user.id
        };

    } catch (error) {

        console.warn(
            "SOCKET: Could not parse current user",
            error
        );

        return null;
    }
}


// ==========================================
// REGISTER USER
// ==========================================

function registerUser() {

    const userId =
        getUserId();

    if (!userId) {

        console.warn(
            "SOCKET: User ID not found"
        );

        return false;
    }

    socket.emit(
        "register",
        String(userId)
    );

    console.log(
        "SOCKET USER REGISTERED:",
        String(userId)
    );

    return true;
}


// ==========================================
// CONNECT SOCKET
// ==========================================

export function connectSocket() {

    const token =
        localStorage.getItem("token") || "";

    const userId =
        getUserId();

    if (!token) {

        console.warn(
            "SOCKET: Token not found"
        );

        return false;
    }

    if (!userId) {

        console.warn(
            "SOCKET: User ID not found"
        );

        return false;
    }

    socket.auth = {
        token
    };

    if (socket.connected) {

        registerUser();
        return true;
    }

    socket.connect();
    return true;
}


// ==========================================
// DISCONNECT SOCKET
// ==========================================

export function disconnectSocket() {

    if (socket.connected) {
        socket.disconnect();
    }
}


// ==========================================
// CONNECT EVENT
// ==========================================

socket.on(
    "connect",
    () => {

        console.log(
            "SOCKET CONNECTED:",
            socket.id
        );

        registerUser();
    }
);


// ==========================================
// CONNECTION ERROR
// ==========================================

socket.on(
    "connect_error",
    (error) => {

        console.error(
            "SOCKET CONNECTION ERROR:",
            error.message
        );
    }
);


// ==========================================
// DISCONNECT
// ==========================================

socket.on(
    "disconnect",
    (reason) => {

        console.log(
            "SOCKET DISCONNECTED:",
            reason
        );
    }
);


// ==========================================
// RECONNECT
// ==========================================

socket.io.on(
    "reconnect",
    () => {

        console.log(
            "SOCKET RECONNECTED"
        );

        registerUser();
    }
);
