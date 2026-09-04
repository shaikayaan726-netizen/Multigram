
import Message from "./models/Message.js";
// ==========================================
// CALL SOCKET SIGNALING
// ==========================================

export function setupCallSignaling(io) {

    // ======================================
    // CONNECT
    // ======================================

    io.on("connection", (socket) => {

        console.log(
            "CALL SOCKET CONNECTED:",
            socket.id
        );


        // ==================================
        // REGISTER USER
        // ==================================

        socket.on(
            "register",

            (userId) => {

                if (!userId) {
                    console.warn(
                        "CALL REGISTER: User ID missing"
                    );
                    return;
                }

                const room = String(userId);

                socket.join(room);

                // Also keep a namespaced room for compatibility
                // with any older call code.
                socket.join(`user:${room}`);

                socket.data.userId = room;

                console.log(
                    "CALL USER REGISTERED:",
                    room
                );
            }
        );


        // ==================================
        // CALL INITIATE
        // ==================================

        socket.on(
            "call:initiate",

            (data) => {

                const receiverId =
                    data?.receiverId;

                if (!receiverId) {
                    console.warn(
                        "CALL INITIATE: Receiver ID missing"
                    );
                    return;
                }

                const callerId =
                    String(
                        data?.callerId ||
                        socket.data.userId ||
                        ""
                    );

                const receiverRoom =
                    String(receiverId);

                const callData = {
                    ...data,
                    callerId,
                    receiverId: receiverRoom
                };

                console.log(
                    "CALL INITIATE:",
                    {
                        callId: callData.callId,
                        callerId,
                        receiverId: receiverRoom,
                        type: callData.type
                    }
                );

                const receiverSockets =
                    io.sockets.adapter.rooms.get(
                        receiverRoom
                    );

                if (!receiverSockets || receiverSockets.size === 0) {
                    console.warn(
                        "CALL RECEIVER NOT CONNECTED:",
                        receiverRoom
                    );

                    return;
                }

                io.to(receiverRoom).emit(
                    "call:incoming",
                    callData
                );
            }
        );


        // ==================================
        // CALL ACCEPT
        // ==================================

        socket.on(
            "call:accept",

            (data) => {

                const callerId =
                    String(data?.to || "");

                if (!callerId) {
                    console.warn(
                        "CALL ACCEPT: Caller ID missing"
                    );
                    return;
                }

                const acceptData = {
                    ...data,
                    from:
                        String(
                            data?.from ||
                            socket.data.userId ||
                            ""
                        ),
                    to: callerId
                };

                io.to(callerId).emit(
                    "call:accepted",
                    acceptData
                );

                console.log(
                    "CALL ACCEPTED:",
                    acceptData.callId
                );
            }
        );


        // ==================================
        // CALL REJECT
        // ==================================

        socket.on(
            "call:reject",

            (data) => {

                const callerId =
                    String(data?.to || "");

                if (!callerId) {
                    return;
                }

                const rejectData = {
                    ...data,
                    from:
                        String(
                            data?.from ||
                            socket.data.userId ||
                            ""
                        ),
                    to: callerId
                };

                io.to(callerId).emit(
                    "call:rejected",
                    rejectData
                );

                console.log(
                    "CALL REJECTED:",
                    rejectData.callId
                );
            }
        );


        // ==================================
        // CALL READY
        // ==================================
        //
        // The receiver emits this after the Active
        // call screen has mounted. This prevents the
        // caller's WebRTC offer from being emitted
        // before the receiver is listening.
        //

        socket.on(
            "call:ready",

            (data) => {

                const callerId =
                    String(data?.to || "");

                if (!callerId) {
                    return;
                }

                io.to(callerId).emit(
                    "call:ready",
                    {
                        ...data,
                        from:
                            String(
                                data?.from ||
                                socket.data.userId ||
                                ""
                            ),
                        to: callerId
                    }
                );

                console.log(
                    "CALL READY:",
                    data?.callId
                );
            }
        );


        // ==================================
        // CALL END
        // ==================================

       // ==================================
// CALL END
// ==================================

socket.on(
    "call:end",

    async (data) => {

        const receiverId =
            String(data?.to || "");

        const callerId =
            String(
                data?.from ||
                socket.data.userId ||
                ""
            );

        if (!receiverId || !callerId) {
            return;
        }

        // =================================
        // SAVE CALL HISTORY
        // =================================

        try {
const callId = String(data?.callId || "");
const duration = Number(data?.duration || 0);
const isConnected = duration > 0;

            await Message.create({

                sender:
                    callerId,

                receiver:
                    receiverId,

                type:
                    "call",

                text:
                    isConnected
                        ? ""
                        : "Call disconnected",

                callType:
                    data?.type === "video"
                        ? "video"
                        : "voice",

                callStatus:
                    isConnected
                        ? "ended"
                        : "missed",

                callDuration:
                    duration,

                callStartedAt:
                    isConnected
                        ? new Date(
                            Date.now() -
                            duration * 1000
                        )
                        : null,

                callEndedAt:
                    new Date(),

                read:
                    false

            });

            console.log(
                "CALL HISTORY SAVED:",
                {
                    callId:
                        data?.callId,

                    callerId,

                    receiverId,

                    type:
                        data?.type,

                    duration
                }
            );

        } catch (error) {

            console.error(
                "CALL HISTORY SAVE ERROR:",
                error
            );

        }


        // =================================
        // EXISTING CALL FLOW — DON'T CHANGE
        // =================================

        io.to(receiverId).emit(
            "call:ended",
            data
        );


        console.log(
            "CALL ENDED:",
            data?.callId
        );

    }
);

        // ==================================
        // WEBRTC OFFER
        // ==================================

        socket.on(
            "webrtc:offer",

            (data) => {

                const receiverId =
                    String(data?.to || "");

                if (!receiverId) {
                    return;
                }

                io.to(receiverId).emit(
                    "webrtc:offer",
                    data
                );
            }
        );


        // ==================================
        // WEBRTC ANSWER
        // ==================================

        socket.on(
            "webrtc:answer",

            (data) => {

                const receiverId =
                    String(data?.to || "");

                if (!receiverId) {
                    return;
                }

                io.to(receiverId).emit(
                    "webrtc:answer",
                    data
                );
            }
        );


        // ==================================
        // ICE CANDIDATE
        // ==================================

        socket.on(
            "webrtc:ice-candidate",

            (data) => {

                const receiverId =
                    String(data?.to || "");

                if (!receiverId) {
                    return;
                }

                io.to(receiverId).emit(
                    "webrtc:ice-candidate",
                    data
                );
            }
        );


        // ==================================
        // DISCONNECT
        // ==================================

        socket.on(
            "disconnect",

            (reason) => {

                console.log(
                    "CALL SOCKET DISCONNECTED:",
                    socket.id,
                    reason
                );
            }
        );

    });
}
