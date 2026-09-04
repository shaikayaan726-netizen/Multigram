import Message from "../models/Message.js";


// ==========================================
// CURRENT USER ID
// ==========================================

function getUserId(req) {

    return (

        req.user?.id ||

        req.user?._id

    );

}


// ==========================================
// SEND TEXT MESSAGE
// POST /api/messages
// ==========================================

export async function sendMessage(
    req,
    res
) {

    try {

        const senderId =
            getUserId(req);


        const receiverId =
            req.body.receiver;


        const text =
            String(
                req.body.text || ""
            ).trim();

            const replyTo =
    req.body.replyTo || null;
        // ======================================
        // AUTH
        // ======================================

        if (!senderId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // RECEIVER
        // ======================================

        if (!receiverId) {

            return res.status(400).json({

                message:
                    "Receiver is required"

            });

        }


        // ======================================
        // TEXT
        // ======================================

        if (!text) {

            return res.status(400).json({

                message:
                    "Message cannot be empty"

            });

        }


        // ======================================
        // CREATE MESSAGE
        // ======================================

       const message =

    await Message.create({

        sender:
            senderId,

        receiver:
            receiverId,

        type:
            "text",

        text:
            text,

        replyTo:
            replyTo,

        read:
            false

    });


        // ======================================
        // POPULATE
        // ======================================
const populatedMessage =

    await Message

        .findById(
            message._id
        )

        .populate(
            "sender",
            "username fullName image profilePicture"
        )

        .populate(
            "receiver",
            "username fullName image profilePicture"
        )

        .populate({
            path: "replyTo",
            populate: [
                {
                    path: "sender",
                    select:
                        "username fullName image profilePicture"
                },
                {
                    path: "receiver",
                    select:
                        "username fullName image profilePicture"
                }
            ]
        });


        return res.status(201).json({

            message:
                populatedMessage

        });

    }

    catch (error) {

        console.error(
            "SEND MESSAGE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to send message",

            error:
                error.message

        });

    }

}

// ==========================================
// SEND IMAGE MESSAGE
// POST /api/messages/image
// ==========================================

export async function sendImageMessage(
    req,
    res
) {
    try {

        const senderId =
            getUserId(req);

        const receiverId =
            req.body.receiver;

        const replyTo =
            req.body.replyTo || null;


        // ======================================
        // AUTH
        // ======================================

        if (!senderId) {
            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }


        // ======================================
        // RECEIVER
        // ======================================

        if (!receiverId) {
            return res.status(400).json({
                message:
                    "Receiver is required"
            });
        }


        // ======================================
        // IMAGE
        // ======================================

        if (!req.file) {
            return res.status(400).json({
                message:
                    "Image file is required"
            });
        }


        // ======================================
        // MEDIA URL
        // ======================================

        const mediaUrl =
            `/uploads/messages/${req.file.filename}`;


        // ======================================
        // CREATE MESSAGE
        // ======================================

        const message =
            await Message.create({

                sender:
                    senderId,

                receiver:
                    receiverId,

                type:
                    "image",

                text:
                    "",

                mediaUrl:
                    mediaUrl,

                replyTo:
                    replyTo,

                read:
                    false

            });


        // ======================================
        // POPULATE
        // ======================================

        const populatedMessage =
            await Message
                .findById(
                    message._id
                )
                .populate(
                    "sender",
                    "username fullName image profilePicture"
                )
                .populate(
                    "receiver",
                    "username fullName image profilePicture"
                )
                .populate({
                    path: "replyTo",
                    populate: [
                        {
                            path: "sender",
                            select:
                                "username fullName image profilePicture"
                        },
                        {
                            path: "receiver",
                            select:
                                "username fullName image profilePicture"
                        }
                    ]
                });


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            message:
                populatedMessage

        });

    }
    catch (error) {

        console.error(
            "SEND IMAGE MESSAGE ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to send image",

            error:
                error.message

        });

    }
}

// ==========================================
// SEND VOICE MESSAGE
// POST /api/messages/voice
// ==========================================

export async function sendVoiceMessage(
    req,
    res
) {
    try {
        const senderId =
            getUserId(req);

        const receiverId =
            req.body.receiver;

        const replyTo =
            req.body.replyTo || null;

        if (!senderId) {
            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }

        if (!receiverId) {
            return res.status(400).json({
                message:
                    "Receiver is required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message:
                    "Audio file is required"
            });
        }

        const mediaUrl =
            `/uploads/messages/${req.file.filename}`;

        const message =
            await Message.create({
                sender:
                    senderId,

                receiver:
                    receiverId,

                type:
                    "audio",

                text:
                    "",

                mediaUrl:
                    mediaUrl,

                replyTo:
                    replyTo,

                read:
                    false
            });

        const populatedMessage =
            await Message
                .findById(
                    message._id
                )
                .populate(
                    "sender",
                    "username fullName image profilePicture"
                )
                .populate(
                    "receiver",
                    "username fullName image profilePicture"
                )
                .populate({
                    path: "replyTo",
                    populate: [
                        {
                            path: "sender",
                            select:
                                "username fullName image profilePicture"
                        },
                        {
                            path: "receiver",
                            select:
                                "username fullName image profilePicture"
                        }
                    ]
                });

        return res.status(201).json({
            message:
                populatedMessage
        });

    }
    catch (error) {
        console.error(
            "SEND VOICE MESSAGE ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to send voice message",

            error:
                error.message
        });
    }
}



// ==========================================
// CREATE CALL
// POST /api/messages/call
// ==========================================
//
// Creates a permanent call-history message.
// ==========================================

export async function createCall(
    req,
    res
) {

    try {

        const senderId =
            getUserId(req);


        const receiverId =
            req.body.receiver;


        const callType =
            req.body.callType;


        // ======================================
        // AUTH
        // ======================================

        if (!senderId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // RECEIVER
        // ======================================

        if (!receiverId) {

            return res.status(400).json({

                message:
                    "Receiver is required"

            });

        }


        // ======================================
        // CALL TYPE
        // ======================================

        if (
            callType !== "voice" &&
            callType !== "video"
        ) {

            return res.status(400).json({

                message:
                    "Invalid call type"

            });

        }


        // ======================================
        // CREATE CALL RECORD
        // ======================================

        const call =

            await Message.create({

                sender:
                    senderId,

                receiver:
                    receiverId,

                type:
                    "call",

                callType:
                    callType,

                callStatus:
                    "calling",

                callDuration:
                    0,

                callStartedAt:
                    new Date(),

                callEndedAt:
                    null,

                read:
                    false

            });


        // ======================================
        // POPULATE
        // ======================================

        const populatedCall =

            await Message

                .findById(
                    call._id
                )

                .populate(
                    "sender",
                    "username fullName image profilePicture"
                )

                .populate(
                    "receiver",
                    "username fullName image profilePicture"
                );


        return res.status(201).json({

            call:
                populatedCall

        });

    }

    catch (error) {

        console.error(
            "CREATE CALL ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to create call",

            error:
                error.message

        });

    }

}


// ==========================================
// UPDATE CALL
// PATCH /api/messages/call/:callId
// ==========================================
//
// Used when:
// calling -> answered
// calling -> missed
// calling -> rejected
// answered -> ended
// ==========================================

export async function updateCall(
    req,
    res
) {

    try {

        const currentUserId =
            getUserId(req);


        const callId =
            req.params.callId;


        const callStatus =
            req.body.callStatus;


        const callDuration =
            Number(
                req.body.callDuration || 0
            );


        // ======================================
        // AUTH
        // ======================================

        if (!currentUserId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // CALL STATUS
        // ======================================

        const allowedStatuses = [

            "calling",

            "answered",

            "missed",

            "rejected",

            "ended"

        ];


        if (
            !allowedStatuses.includes(
                callStatus
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid call status"

            });

        }


        // ======================================
        // FIND CALL
        // ======================================

        const call =

            await Message.findById(
                callId
            );


        if (!call) {

            return res.status(404).json({

                message:
                    "Call not found"

            });

        }


        // ======================================
        // SECURITY
        // ======================================

        const isParticipant =

            String(call.sender) ===
                String(currentUserId) ||

            String(call.receiver) ===
                String(currentUserId);


        if (!isParticipant) {

            return res.status(403).json({

                message:
                    "Not allowed"

            });

        }


        // ======================================
        // UPDATE STATUS
        // ======================================

        call.callStatus =
            callStatus;


        // ======================================
        // DURATION
        // ======================================

        if (
            callStatus === "ended"
        ) {

            call.callDuration =
                Math.max(
                    0,
                    callDuration
                );

            call.callEndedAt =
                new Date();

        }


        // ======================================
        // ANSWERED
        // ======================================

        if (
            callStatus === "answered"
        ) {

            if (!call.callStartedAt) {

                call.callStartedAt =
                    new Date();

            }

        }


        // ======================================
        // MISSED / REJECTED
        // ======================================

        if (
            callStatus === "missed" ||
            callStatus === "rejected"
        ) {

            call.callDuration =
                0;

            call.callEndedAt =
                new Date();

        }


        await call.save();


        // ======================================
        // POPULATE
        // ======================================

        const populatedCall =

            await Message

                .findById(
                    call._id
                )

                .populate(
                    "sender",
                    "username fullName image profilePicture"
                )

                .populate(
                    "receiver",
                    "username fullName image profilePicture"
                );


        return res.json({

            call:
                populatedCall

        });

    }

    catch (error) {

        console.error(
            "UPDATE CALL ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to update call",

            error:
                error.message

        });

    }

}


// ==========================================
// GET CHAT MESSAGES
// GET /api/messages/:userId
// ==========================================

export async function getChatMessages(
    req,
    res
) {

    try {

        const currentUserId =
            getUserId(req);


        const otherUserId =
            req.params.userId;


        // ======================================
        // AUTH
        // ======================================

        if (!currentUserId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // OTHER USER
        // ======================================

        if (!otherUserId) {

            return res.status(400).json({

                message:
                    "User ID is required"

            });

        }


        // ======================================
        // GET CONVERSATION
        // ======================================

        const messages =

            await Message

                .find({

                    $or: [

                        {

                            sender:
                                currentUserId,

                            receiver:
                                otherUserId

                        },

                        {

                            sender:
                                otherUserId,

                            receiver:
                                currentUserId

                        }

                    ]

                })

                .populate(

                    "sender",

                    "username fullName image profilePicture"

                )

                .populate(

                    "receiver",

                    "username fullName image profilePicture"

                )
                .populate({
    path: "replyTo",
    populate: [
        {
            path: "sender",
            select:
                "username fullName image profilePicture"
        },
        {
            path: "receiver",
            select:
                "username fullName image profilePicture"
        }
    ]
})

                .sort({

                    createdAt:
                        1

                });


        // ======================================
        // MARK RECEIVED MESSAGES READ
        // ======================================

        await Message.updateMany(

            {

                sender:
                    otherUserId,

                receiver:
                    currentUserId,

                read:
                    false

            },

            {

                $set: {

                    read:
                        true,

                    readAt:
                        new Date()

                }

            }

        );


        return res.json({

            messages:
                messages

        });

    }

    catch (error) {

        console.error(
            "GET CHAT MESSAGES ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to get messages",

            error:
                error.message

        });

    }

}


// ==========================================
// GET MESSAGE LIST
// GET /api/messages
// ==========================================

export async function getMessageList(
    req,
    res
) {

    try {

        const currentUserId =
            getUserId(req);


        // ======================================
        // AUTH
        // ======================================

        if (!currentUserId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // GET ALL USER MESSAGES
        // ======================================

        const messages =

            await Message

                .find({

                    $or: [

                        {

                            sender:
                                currentUserId

                        },

                        {

                            receiver:
                                currentUserId

                        }

                    ]

                })

                .populate(

                    "sender",

                    "username fullName image profilePicture"

                )

                .populate(

                    "receiver",

                    "username fullName image profilePicture"

                )

                .sort({

                    createdAt:
                        -1

                });


        // ======================================
        // BUILD CHAT LIST
        // ======================================

        const conversations =
            new Map();


        for (
            const message
            of messages
        ) {

            const isSender =

                String(
                    message.sender?._id
                ) ===

                String(
                    currentUserId
                );


            const otherUser =

                isSender

                    ? message.receiver

                    : message.sender;


            if (!otherUser) {

                continue;

            }


            const otherUserId =

                String(
                    otherUser._id
                );


            // ==================================
            // FIRST MESSAGE = LATEST MESSAGE
            // ==================================

            if (
                !conversations.has(
                    otherUserId
                )
            ) {

                conversations.set(

                    otherUserId,

                    {

                        user:
                            otherUser,

                        lastMessage:
                            message,

                        unreadCount:
                            0

                    }

                );

            }


            // ==================================
            // UNREAD COUNT
            // ==================================

            if (

                String(
                    message.receiver?._id
                ) ===

                String(
                    currentUserId
                ) &&

                message.read ===
                    false

            ) {

                const conversation =

                    conversations.get(
                        otherUserId
                    );


                conversation.unreadCount +=
                    1;

            }

        }


        const list =

            Array.from(
                conversations.values()
            );


        return res.json({

            conversations:
                list

        });

    }

    catch (error) {

        console.error(
            "GET MESSAGE LIST ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to get message list",

            error:
                error.message

        });

    }

}


// ==========================================
// MARK CHAT READ
// POST /api/messages/:userId/read
// ==========================================

export async function markChatRead(
    req,
    res
) {

    try {

        const currentUserId =
            getUserId(req);


        const otherUserId =
            req.params.userId;


        if (!currentUserId) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        await Message.updateMany(

            {

                sender:
                    otherUserId,

                receiver:
                    currentUserId,

                read:
                    false

            },

            {

                $set: {

                    read:
                        true,

                    readAt:
                        new Date()

                }

            }

        );


        return res.json({

            message:
                "Messages marked as read"

        });

    }

    catch (error) {

        console.error(
            "MARK MESSAGE READ ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to mark messages as read",

            error:
                error.message

        });

    }

}