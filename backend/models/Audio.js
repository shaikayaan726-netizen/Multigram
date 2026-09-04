import mongoose from "mongoose";


const audioSchema =
    new mongoose.Schema(

        {

            title: {

                type: String,

                required: true

            },


            artist: {

                type: String,

                default: ""

            },


            thumbnail: {

                type: String,

                default: ""

            },


            audioUrl: {

                type: String,

                required: true

            },


            duration: {

                type: Number,

                required: true,

                min: 0

            },


            category: {

                type: String,

                enum: [
                    "For you",
                    "Trending",
                    "Saved",
                    "Original audio"
                ],

                default: "For you"

            },


            plays: {

                type: Number,

                default: 0

            }

        },

        {

            timestamps: true

        }

    );


const Audio =
    mongoose.models.Audio ||
    mongoose.model(
        "Audio",
        audioSchema
    );


export default Audio;