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
        "posts"
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
                    "post-" +
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

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

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
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );

    }

}


// ==========================================
// MULTER
// ==========================================

const uploadPost =
    multer({

        storage:

            storage,

        fileFilter:

            fileFilter,

        limits: {

            fileSize:
                10 * 1024 * 1024

        }

    });


// ==========================================
// EXPORT
// ==========================================

export default uploadPost;