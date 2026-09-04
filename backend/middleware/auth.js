import jwt from "jsonwebtoken";


// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET =
    process.env.JWT_SECRET || "ayaan123";


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

export default function auth(req, res, next) {

    try {

        // ======================================
        // AUTHORIZATION HEADER
        // ======================================

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ======================================
        // BEARER TOKEN
        // ======================================

        const parts =
            authHeader.trim().split(/\s+/);


        if (
            parts.length !== 2 ||
            parts[0].toLowerCase() !== "bearer" ||
            !parts[1]
        ) {

            return res.status(401).json({

                message:
                    "Invalid authorization format"

            });

        }


        const token =
            parts[1];


        // ======================================
        // VERIFY TOKEN
        // ======================================

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        // ======================================
        // CHECK USER ID
        // ======================================

        if (!decoded?.id) {

            return res.status(401).json({

                message:
                    "Invalid token payload"

            });

        }


        // ======================================
        // STORE USER
        // ======================================

        req.user = {

            id:
                decoded.id

        };


        // ======================================
        // NEXT
        // ======================================

        next();

    }
    catch (error) {

        console.error(
            "AUTH ERROR:",
            error.message
        );


        // ======================================
        // EXPIRED TOKEN
        // ======================================

        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                message:
                    "Token expired"

            });

        }


        // ======================================
        // INVALID TOKEN
        // ======================================

        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                message:
                    "Invalid token"

            });

        }


        // ======================================
        // OTHER AUTH ERROR
        // ======================================

        return res.status(401).json({

            message:
                "Authentication failed"

        });

    }

}