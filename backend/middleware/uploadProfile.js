import multer from "multer";
import path from "path";
import fs from "fs";


// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDirectory =
    "uploads/profile";


// ==========================================
// CREATE DIRECTORY
// ==========================================

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

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            uploadDirectory
        );

    },


    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            );

        const filename =

            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1000000000
            ) +
            extension;


        cb(
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
    cb
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

        cb(
            null,
            true
        );

    }

    else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );

    }

}


// ==========================================
// MULTER
// ==========================================

const uploadProfile =
    multer({

        storage: storage,

        fileFilter: fileFilter,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


export default uploadProfile;