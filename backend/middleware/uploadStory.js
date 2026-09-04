import multer from "multer";
import path from "path";
import fs from "fs";


// ==========================================
// STORY UPLOAD DIRECTORY
// ==========================================

const uploadDirectory =
    path.join(
        process.cwd(),
        "uploads",
        "stories"
    );


if (!fs.existsSync(uploadDirectory)) {

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
            function (
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
            function (
                req,
                file,
                callback
            ) {

                const extension =
                    path.extname(
                        file.originalname
                    );


                const filename =
                    "story-" +
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() * 1000000000
                    ) +
                    extension;


                callback(
                    null,
                    filename
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

    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
    ) {

        callback(
            null,
            true
        );

        return;

    }


    callback(
        new Error(
            "Only image and video files are allowed"
        ),
        false
    );

}


// ==========================================
// MULTER
// ==========================================

const uploadStory =
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


export default uploadStory;