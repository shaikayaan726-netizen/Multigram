import multer from "multer";
import path from "path";
import fs from "fs";


// ==========================================
// AUDIO UPLOAD DIRECTORY
// ==========================================

const uploadDirectory =
    path.join(
        process.cwd(),
        "uploads",
        "messages"
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
                    ).toLowerCase();

                const filename =
                    "voice-" +
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() * 1000000
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
        file.mimetype &&
        file.mimetype.startsWith(
            "audio/"
        )
    ) {

        callback(
            null,
            true
        );

        return;

    }


    callback(
        new Error(
            "Only audio files are allowed"
        ),
        false
    );

}


// ==========================================
// MULTER
// ==========================================

const uploadMessageAudio =
    multer({

        storage:
            storage,

        fileFilter:
            fileFilter,

        limits: {

            fileSize:
                25 * 1024 * 1024

        }

    });


// ==========================================
// EXPORT
// ==========================================

export default uploadMessageAudio;