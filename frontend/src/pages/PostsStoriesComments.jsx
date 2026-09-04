import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function PostsStoriesComments() {

    const navigate = useNavigate();

    const [likes, setLikes] = useState("everyone");
    const [likeMilestones, setLikeMilestones] = useState("on");
    const [likesCommentsPhotos, setLikesCommentsPhotos] = useState("following");
    const [photosOfYou, setPhotosOfYou] = useState("everyone");
    const [comments, setComments] = useState("everyone");
    const [commentLikesPins, setCommentLikesPins] = useState("on");
    const [stickerResponses, setStickerResponses] = useState("on");


    function RadioOption({ value, selected, onClick }) {

        return (
            <button
                className="psc-radio-option"
                onClick={function () {
                    onClick(value);
                }}
            >

                <span>
                    {value === "off" && "Off"}
                    {value === "following" && "From profiles I follow"}
                    {value === "everyone" && "From everyone"}
                    {value === "on" && "On"}
                </span>

                <span
                    className={
                        selected === value
                            ? "psc-radio selected"
                            : "psc-radio"
                    }
                >
                    <span></span>
                </span>

            </button>
        );
    }


    return (

        <div className="psc-page">

            <div className="psc-nav">

                <button
                    className="psc-back"
                    onClick={function () {
                        navigate(-1);
                    }}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Posts, stories and comments
                </h1>

            </div>


            {/* LIKES */}

            <section className="psc-section">

                <h2>Likes</h2>

                <RadioOption
                    value="off"
                    selected={likes}
                    onClick={setLikes}
                />

                <RadioOption
                    value="following"
                    selected={likes}
                    onClick={setLikes}
                />

                <RadioOption
                    value="everyone"
                    selected={likes}
                    onClick={setLikes}
                />

                <p className="psc-example">
                    John Appleseed liked your photo.
                </p>

            </section>


            {/* LIKE MILESTONES */}

            <section className="psc-section">

                <h2>Like milestones</h2>

                <RadioOption
                    value="off"
                    selected={likeMilestones}
                    onClick={setLikeMilestones}
                />

                <RadioOption
                    value="on"
                    selected={likeMilestones}
                    onClick={setLikeMilestones}
                />

                <p className="psc-example">
                    Your post has 100 likes.
                </p>

            </section>


            {/* LIKES AND COMMENTS ON PHOTOS */}

            <section className="psc-section">

                <h2>
                    Likes and comments on photos of you
                </h2>

                <RadioOption
                    value="off"
                    selected={likesCommentsPhotos}
                    onClick={setLikesCommentsPhotos}
                />

                <RadioOption
                    value="following"
                    selected={likesCommentsPhotos}
                    onClick={setLikesCommentsPhotos}
                />

                <RadioOption
                    value="everyone"
                    selected={likesCommentsPhotos}
                    onClick={setLikesCommentsPhotos}
                />

                <p className="psc-example">
                    John Appleseed commented on a post you're tagged in.
                </p>

            </section>


            {/* PHOTOS OF YOU */}

            <section className="psc-section">

                <h2>
                    Photos of you
                </h2>

                <RadioOption
                    value="off"
                    selected={photosOfYou}
                    onClick={setPhotosOfYou}
                />

                <RadioOption
                    value="following"
                    selected={photosOfYou}
                    onClick={setPhotosOfYou}
                />

                <RadioOption
                    value="everyone"
                    selected={photosOfYou}
                    onClick={setPhotosOfYou}
                />

                <p className="psc-example">
                    John Appleseed tagged you in a photo.
                </p>

            </section>


            {/* COMMENTS */}

            <section className="psc-section">

                <h2>
                    Comments
                </h2>

                <RadioOption
                    value="off"
                    selected={comments}
                    onClick={setComments}
                />

                <RadioOption
                    value="following"
                    selected={comments}
                    onClick={setComments}
                />

                <RadioOption
                    value="everyone"
                    selected={comments}
                    onClick={setComments}
                />

                <p className="psc-example">
                    John Appleseed commented: "Nice shot!"
                </p>

            </section>


            {/* COMMENT LIKES */}

            <section className="psc-section">

                <h2>
                    Comment likes and pins
                </h2>

                <RadioOption
                    value="off"
                    selected={commentLikesPins}
                    onClick={setCommentLikesPins}
                />

                <RadioOption
                    value="on"
                    selected={commentLikesPins}
                    onClick={setCommentLikesPins}
                />

                <p className="psc-example">
                    John Appleseed liked your comment.
                </p>

            </section>


            {/* STICKER RESPONSES */}

            <section className="psc-section">

                <h2>
                    Sticker responses
                </h2>

                <RadioOption
                    value="off"
                    selected={stickerResponses}
                    onClick={setStickerResponses}
                />

                <RadioOption
                    value="on"
                    selected={stickerResponses}
                    onClick={setStickerResponses}
                />

                <p className="psc-example">
                    Someone responded to your story with a sticker.
                </p>

            </section>

        </div>
    );
}

export default PostsStoriesComments;