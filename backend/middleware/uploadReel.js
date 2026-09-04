// ==========================================
// IMPORTS
// ==========================================

import multer from "multer";
import path from "path";
import fs from "fs";


// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDirectory =
    path.join(
        process.cwd(),
        "uploads",
        "reels"
    );


// ==========================================
// CREATE DIRECTORY
// ==========================================

if (
    !fs.existsSync(
        uploadDirectory
    )
) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


// ==========================================
// STORAGE
// ==========================================

const storage =
    multer.diskStorage({

        destination:
            function(
                req,
                file,
                callback
            ) {

                callback(
                    null,
                    uploadDirectory
                );

            },


        filename:
            function(
                req,
                file,
                callback
            ) {

                const extension =
                    path.extname(
                        file.originalname
                    ).toLowerCase();


                const name =
                    "reel-" +
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() * 1000000
                    ) +
                    extension;


                callback(
                    null,
                    name
                );

            }

    });


// ==========================================
// FILE FILTER
// ==========================================

function fileFilter(
    req,
    file,
    callback
) {

    const allowedTypes = [

        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-matroska"

    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        callback(
            null,
            true
        );

    }
    else {

        callback(
            new Error(
                "Only MP4, WEBM, MOV and MKV videos are allowed"
            )
        );

    }

}


// ==========================================
// MULTER
// ==========================================

const uploadReel =
    multer({

        storage:

            storage,

        fileFilter:

            fileFilter,

        limits: {

            fileSize:
                100 * 1024 * 1024

        }

    });


// ==========================================
// EXPORT
// ==========================================

export default uploadReel;