// ==========================================
// IMPORTS
// ==========================================

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import FollowRequest from "../models/FollowRequest.js";


// ==========================================
// EXPRESS ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// CURRENT USER ID
// ==========================================

function getUserId(req) {

    const authHeader =
        req.headers.authorization;


    if (!authHeader) {

        return null;

    }


    const parts =
        authHeader.trim().split(/\s+/);


    if (
        parts.length !== 2 ||
        parts[0].toLowerCase() !== "bearer" ||
        !parts[1]
    ) {

        return null;

    }


    const token =
        parts[1];


    const decoded =
        jwt.verify(
            token,
            process.env.JWT_SECRET || "ayaan123"
        );


    return decoded.id;

}


// ==========================================
// GET PROFILE BY USERNAME
// ==========================================

router.get(
    "/profile/:username",
    async function(req, res) {

        try {

            const username =
                req.params.username;


            const user =
                await User.findOne({

                    username:
                        username.toLowerCase()

                })
                .select(
                    "fullName username bio profilePicture profession followers following"
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            return res.json({

                user:
                    user

            });

        }
        catch(error) {

            console.log(
                "PROFILE ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not load profile"

            });

        }

    }
);


// ==========================================
// SEARCH USER BY USERNAME
// ==========================================

// ==========================================
// SEARCH USER BY USERNAME
// WITH MUTUAL FOLLOWERS
// ==========================================

router.get(
    "/search-user",
    async function(req, res) {

        try {

            const username =
                req.query.username;


            if (!username) {

                return res.json([]);

            }


            const currentUserId =
                getUserId(req);


            const users =
                await User.find({

                    username: {

                        $regex:
                            username,

                        $options:
                            "i"

                    }

                })
                .select(
                    "fullName username profilePicture followers following"
                );


            const result =
                await Promise.all(

                    users.map(
                        async function(user) {

                            let requestStatus =
                                null;


                            // ==================================
                            // MUTUAL FOLLOWERS
                            // ==================================

                            let mutualFollowers = [];


                            if (
                                currentUserId &&
                                user._id.toString() !==
                                currentUserId.toString()
                            ) {

                                const currentUser =
                                    await User.findById(
                                        currentUserId
                                    )
                                    .select(
                                        "followers"
                                    );


                                if (currentUser) {

                                    const currentUserFollowers =
                                        currentUser.followers
                                            .map(function(id) {

                                                return id.toString();

                                            });


                                    const otherUserFollowers =
                                        user.followers
                                            .map(function(id) {

                                                return id.toString();

                                            });


                                    const mutualIds =
                                        currentUserFollowers.filter(

                                            function(id) {

                                                return otherUserFollowers.includes(
                                                    id
                                                );

                                            }

                                        );


                                    if (
                                        mutualIds.length > 0
                                    ) {

                                        mutualFollowers =
                                            await User.find({

                                                _id: {
                                                    $in:
                                                        mutualIds
                                                }

                                            })
                                            .select(
                                                "fullName username profilePicture"
                                            );

                                    }

                                }

                            }


                            // ==================================
                            // FOLLOW STATUS
                            // ==================================

                            if (
                                currentUserId &&
                                user._id.toString() !==
                                currentUserId.toString()
                            ) {

                                const request =
                                    await FollowRequest.findOne({

                                        sender:
                                            currentUserId,

                                        receiver:
                                            user._id,

                                        status: {

                                            $in: [

                                                "pending",

                                                "accepted"

                                            ]

                                        }

                                    });


                                if (request) {

                                    requestStatus =
                                        request.status;

                                }

                            }


                            // ==================================
                            // RESULT
                            // ==================================

                            return {

                                _id:
                                    user._id,

                                fullName:
                                    user.fullName,

                                username:
                                    user.username,

                                profilePicture:
                                    user.profilePicture,

                                followers:
                                    user.followers,

                                following:
                                    user.following,

                                requestStatus:
                                    requestStatus,

                                mutualFollowers:
                                    mutualFollowers

                            };

                        }
                    )

                );


            return res.json(
                result
            );

        }
        catch(error) {

            console.log(
                "SEARCH USER ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "User search failed"

            });

        }

    }
);


// ==========================================
// SEND FOLLOW REQUEST
// ==========================================

router.post(
    "/follow/:userId",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


            const receiverId =
                req.params.userId;


            // ==================================
            // PREVENT SELF FOLLOW
            // ==================================

            if (
                currentUserId.toString() ===
                receiverId.toString()
            ) {

                return res.status(400).json({

                    message:
                        "You cannot follow yourself"

                });

            }


            // ==================================
            // RECEIVER CHECK
            // ==================================

            const receiver =
                await User.findById(
                    receiverId
                );


            if (!receiver) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            // ==================================
            // CURRENT USER
            // ==================================

            const currentUser =
                await User.findById(
                    currentUserId
                );


            if (!currentUser) {

                return res.status(404).json({

                    message:
                        "Current User Not Found"

                });

            }


            // ==================================
            // ALREADY FOLLOWING
            // ==================================

            const alreadyFollowing =
                currentUser.following.some(

                    function(id) {

                        return (
                            id.toString() ===
                            receiverId.toString()
                        );

                    }

                );


            if (alreadyFollowing) {

                return res.json({

                    message:
                        "Already Following"

                });

            }


            // ==================================
            // CHECK EXISTING REQUEST
            // ==================================

            const existingRequest =
                await FollowRequest.findOne({

                    sender:
                        currentUserId,

                    receiver:
                        receiverId

                });


            // ==================================
            // PENDING REQUEST ALREADY EXISTS
            // ==================================

            if (
                existingRequest &&
                existingRequest.status ===
                "pending"
            ) {

                return res.json({

                    message:
                        "Follow Request Already Sent"

                });

            }


            // ==================================
            // ACCEPTED REQUEST
            // ==================================

          // ==================================
// ACCEPTED REQUEST
// ==================================

if (
    existingRequest &&
    existingRequest.status ===
    "accepted"
) {

    // ==================================
    // REPAIR FOLLOWING
    // ==================================

    if (
        !currentUser.following.some(
            function(id) {

                return (
                    id.toString() ===
                    receiver._id.toString()
                );

            }
        )
    ) {

        currentUser.following.push(
            receiver._id
        );

    }


    // ==================================
    // REPAIR FOLLOWER
    // ==================================

    if (
        !receiver.followers.some(
            function(id) {

                return (
                    id.toString() ===
                    currentUser._id.toString()
                );

            }
        )
    ) {

        receiver.followers.push(
            currentUser._id
        );

    }


    await currentUser.save();
    await receiver.save();


    return res.json({

        message:
            "Already Following",

        followersCount:
            receiver.followers.length,

        followingCount:
            currentUser.following.length

    });

}


            // ==================================
            // OLD REJECTED REQUEST
            // ==================================

            if (
                existingRequest &&
                existingRequest.status ===
                "rejected"
            ) {

                existingRequest.status =
                    "pending";


                await existingRequest.save();


                return res.json({

                    message:
                        "Follow Request Sent"

                });

            }


            // ==================================
            // CREATE NEW REQUEST
            // ==================================

            const newRequest =
                await FollowRequest.create({

                    sender:
                        currentUserId,

                    receiver:
                        receiverId,

                    status:
                        "pending"

                });


            console.log(
                "FOLLOW REQUEST:",
                newRequest
            );


            return res.json({

                message:
                    "Follow Request Sent"

            });

        }
        catch(error) {

            console.log(
                "FOLLOW ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Follow request failed"

            });

        }

    }
);


// ==========================================
// GET MY FOLLOW REQUESTS
// ==========================================

router.get(
    "/follow-requests",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


          const requests =
    await FollowRequest.find({
        receiver:
            currentUserId,

        status:
            "pending"

    })
    .populate(
        "sender",
        "fullName username profilePicture"
    );


            return res.json(
                requests
            );

        }
        catch(error) {

            console.log(
                "FOLLOW REQUEST ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not get follow requests"

            });

        }

    }
);


// ==========================================
// ACCEPT FOLLOW REQUEST
// ==========================================

router.post(
    "/follow-requests/:requestId/accept",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


            const request =
                await FollowRequest.findById(
                    req.params.requestId
                );


            if (!request) {

                return res.status(404).json({

                    message:
                        "Follow Request Not Found"

                });

            }


            // ==================================
            // ONLY RECEIVER CAN ACCEPT
            // ==================================

            if (
                request.receiver.toString() !==
                currentUserId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You cannot accept this request"

                });

            }


            // ==================================
            // ALREADY ACCEPTED
            // ==================================

            if (
                request.status ===
                "accepted"
            ) {

                return res.json({

                    message:
                        "Request Already Accepted"

                });

            }


            // ==================================
            // UPDATE REQUEST
            // ==================================

            request.status =
                "accepted";


            await request.save();


            // ==================================
            // GET USERS
            // ==================================

            const sender =
                await User.findById(
                    request.sender
                );


            const receiver =
                await User.findById(
                    request.receiver
                );


            if (!sender || !receiver) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            // ==================================
            // ADD FOLLOWING
            // ==================================

            if (
                !sender.following.some(

                    function(id) {

                        return (
                            id.toString() ===
                            receiver._id.toString()
                        );

                    }

                )
            ) {

                sender.following.push(
                    receiver._id
                );

            }


            // ==================================
            // ADD FOLLOWER
            // ==================================

            if (
                !receiver.followers.some(

                    function(id) {

                        return (
                            id.toString() ===
                            sender._id.toString()
                        );

                    }

                )
            ) {

                receiver.followers.push(
                    sender._id
                );

            }


            await sender.save();

            await receiver.save();


            return res.json({

                message:
                    "Follow Request Accepted",

                followersCount:
                    receiver.followers.length,

                followingCount:
                    sender.following.length

            });

        }
        catch(error) {

            console.log(
                "ACCEPT REQUEST ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not accept request"

            });

        }

    }
);


// ==========================================
// REJECT FOLLOW REQUEST
// ==========================================

router.post(
    "/follow-requests/:requestId/reject",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


            const request =
                await FollowRequest.findById(
                    req.params.requestId
                );


            if (!request) {

                return res.status(404).json({

                    message:
                        "Follow Request Not Found"

                });

            }


            if (
                request.receiver.toString() !==
                currentUserId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You cannot reject this request"

                });

            }


            request.status =
                "rejected";


            await request.save();


            return res.json({

                message:
                    "Follow Request Rejected"

            });

        }
        catch(error) {

            console.log(
                "REJECT REQUEST ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not reject request"

            });

        }

    }
);



// ==========================================
// GET USER FOLLOWERS
// ==========================================

router.get(
    "/followers/:userId",
    async function(req, res) {

        try {

            const userId =
                req.params.userId;


            // ==================================
            // GET PROFILE USER
            // ==================================

            const user =
                await User.findById(
                    userId
                )
                .populate(
                    "followers",
                    "fullName username profilePicture"
                );


            // ==================================
            // USER NOT FOUND
            // ==================================

            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            // ==================================
            // RESPONSE
            // ==================================

            return res.json({

                followers:
                    user.followers

            });

        }
        catch(error) {

            console.log(
                "GET USER FOLLOWERS ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not get followers"

            });

        }

    }
);

// ==========================================
// GET USER FOLLOWING
// ==========================================

router.get(
    "/following/:userId",
    async function(req, res) {

        try {

            const userId =
                req.params.userId;


            // ==================================
            // GET PROFILE USER
            // ==================================

            const user =
                await User.findById(
                    userId
                )
                .populate(
                    "following",
                    "fullName username profilePicture"
                );


            // ==================================
            // USER NOT FOUND
            // ==================================

            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            // ==================================
            // RESPONSE
            // ==================================

            return res.json({

                following:
                    user.following

            });

        }
        catch(error) {

            console.log(
                "GET USER FOLLOWING ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not get following"

            });

        }

    }
);
// ==========================================
// UNFOLLOW
// ==========================================

router.delete(
    "/unfollow/:userId",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


            const otherUserId =
                req.params.userId;


            const currentUser =
                await User.findById(
                    currentUserId
                );


            const otherUser =
                await User.findById(
                    otherUserId
                );


            if (
                !currentUser ||
                !otherUser
            ) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            // ==================================
            // REMOVE FROM FOLLOWING
            // ==================================

            currentUser.following =
                currentUser.following.filter(

                    function(id) {

                        return (
                            id.toString() !==
                            otherUserId.toString()
                        );

                    }

                );


            // ==================================
            // REMOVE FROM FOLLOWERS
            // ==================================

            otherUser.followers =
                otherUser.followers.filter(

                    function(id) {

                        return (
                            id.toString() !==
                            currentUserId.toString()
                        );

                    }

                );


          await currentUser.save();

await otherUser.save();


// ==================================
// REMOVE FOLLOW REQUEST
// ==================================

await FollowRequest.deleteMany({

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

});


return res.json({

    message:
        "Unfollow Successful",

    followersCount:
        otherUser.followers.length,

    followingCount:
        currentUser.following.length

});

        }
        catch(error) {

            console.log(
                "UNFOLLOW ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Unfollow failed"

            });

        }

    }
);
// ===========================
// GET MY FOLLOWERS
// ===========================

router.get(
    "/followers",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


            const user =
                await User.findById(
                    currentUserId
                )
                .populate(
                    "followers",
                    "fullName username profilePicture"
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            return res.json({

                followers:
                    user.followers

            });

        }
        catch(error) {

            console.log(
                "GET FOLLOWERS ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not get followers"

            });

        }

    }
);
// ===========================
// GET MY FOLLOWING
// ===========================

router.get(
    "/following",
    async function(req, res) {

        try {

            const currentUserId =
                getUserId(req);


            if (!currentUserId) {

                return res.status(401).json({

                    message:
                        "Token Missing"

                });

            }


            const user =
                await User.findById(
                    currentUserId
                )
                .populate(
                    "following",
                    "fullName username profilePicture"
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            return res.json({

                following:
                    user.following

            });

        }
        catch(error) {

            console.log(
                "GET FOLLOWING ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "Could not get following"

            });

        }

    }
);


export default router;