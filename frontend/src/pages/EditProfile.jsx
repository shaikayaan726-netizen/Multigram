import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


function EditProfile() {

    const navigate = useNavigate();


    // ==========================================
    // FILE INPUT REF
    // ==========================================

    const fileInputRef =
        useRef(null);


    // ==========================================
    // PROFILE
    // ==========================================

    const [
        profile,
        setProfile
    ] = useState(null);


    // ==========================================
    // SELECTED IMAGE
    // ==========================================

    const [
        selectedImage,
        setSelectedImage
    ] = useState(null);

    const [fullName, setFullName] = useState("");
const [username, setUsername] = useState("");
const [bio, setBio] = useState("");
const [gender, setGender] = useState("");

    // ==========================================
    // PREVIEW
    // ==========================================

    const [
        preview,
        setPreview
    ] = useState("");


    // ==========================================
    // LOADING
    // ==========================================

    const [
        loading,
        setLoading
    ] = useState(true);


    // ==========================================
    // SAVING
    // ==========================================

    const [
        saving,
        setSaving
    ] = useState(false);


    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

    useEffect(function () {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            navigate("/login");

            return;

        }


        fetch(
            "http://localhost:3000/api/auth/me",
            {

                method: "GET",

                headers: {

                    Authorization:
                        "Bearer " + token

                }

            }
        )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Could not load profile"
                    );

                }

                return response.json();

            })

            .then(function (data) {

                console.log(
                    "CURRENT USER:",
                    data
                );


                const user = data.user || data;

setProfile(user);

setFullName(
    user.fullName || ""
);

setUsername(
    user.username || ""
);

setBio(
    user.bio || ""
);

setGender(
    user.gender || ""
);

setLoading(false);
            })

            .catch(function (error) {

                console.log(
                    "PROFILE ERROR:",
                    error
                );

                setLoading(false);

            });

    }, [navigate]);


    // ==========================================
    // PROFILE IMAGE URL
    // ==========================================

    function getProfileImage() {

    // Newly selected image
    if (preview) {

        return preview;

    }


    // Already uploaded profile picture
    if (
        profile &&
        profile.profilePicture
    ) {

        if (
            profile.profilePicture.startsWith(
                "http"
            )
        ) {

            return profile.profilePicture;

        }

        return (
            "http://localhost:3000" +
            profile.profilePicture
        );

    }


    // Default profile picture
    return "/default-avatar.jpg";

}


    // ==========================================
    // CHANGE PROFILE PHOTO
    // ==========================================

    function handleChangePhoto() {

        fileInputRef.current.click();

    }


    // ==========================================
    // FILE SELECT
    // ==========================================

    function handleFileChange(event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        // ==========================================
        // IMAGE TYPE CHECK
        // ==========================================

        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            );

            return;

        }


        // ==========================================
        // FILE SIZE CHECK
        // ==========================================

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Image size must be less than 5 MB"
            );

            return;

        }


        // ==========================================
        // SAVE SELECTED FILE
        // ==========================================

        setSelectedImage(file);


        // ==========================================
        // CREATE PREVIEW
        // ==========================================

        const imageURL =
            URL.createObjectURL(
                file
            );


        setPreview(
            imageURL
        );

    }


    // ==========================================
    // DONE
    // ==========================================

   async function handleDone() {

    try {

        setSaving(true);


        // ==========================================
        // TOKEN
        // ==========================================

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;

        }


        // ==========================================
        // UPDATE PROFILE INFORMATION
        // ==========================================

        const profileResponse =
            await fetch(
                "http://localhost:3000/api/auth/profile",
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body: JSON.stringify({

                        fullName:
                            fullName.trim(),

                        username:
                            username.trim(),

                        bio:
                            bio.trim(),

                        gender:
                            gender

                    })

                }
            );


        const profileData =
            await profileResponse.json();


        console.log(
            "UPDATE PROFILE RESPONSE:",
            profileData
        );


        if (!profileResponse.ok) {

            throw new Error(
                profileData.message ||
                "Profile update failed"
            );

        }


        // ==========================================
        // UPDATE PROFILE PICTURE
        // ==========================================

        if (selectedImage) {

            const formData =
                new FormData();


            formData.append(
                "profilePicture",
                selectedImage
            );


            const imageResponse =
                await fetch(
                    "http://localhost:3000/api/auth/profile-picture",
                    {
                        method: "PUT",

                        headers: {

                            "Authorization":
                                "Bearer " + token

                        },

                        body: formData

                    }
                );


            const imageData =
                await imageResponse.json();


            console.log(
                "PROFILE PICTURE RESPONSE:",
                imageData
            );


            if (!imageResponse.ok) {

                throw new Error(
                    imageData.message ||
                    "Profile picture update failed"
                );

            }

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        navigate(
            "/profile",
            {
                replace: true
            }
        );

    }

    catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );


        alert(
            error.message ||
            "Failed to update profile"
        );

    }

    finally {

        setSaving(false);

    }

}


    // ==========================================
    // CANCEL
    // ==========================================

    function handleCancel() {

        navigate(-1);

    }


    // ==========================================
    // LOADING UI
    // ==========================================

    if (loading) {

        return (

            <div className="editprofile-page">

                <p>
                    Loading...
                </p>

            </div>

        );

    }


    return (

        <div className="editprofile-page">


            {/* =================================
                NAVBAR
            ================================= */}

            <div className="edit-nav">

                <button
                    type="button"
                    className="edit-cancel"
                    onClick={
                        handleCancel
                    }
                >

                    Cancel

                </button>


                <h1>
                    Edit Profile
                </h1>


                <button
                    type="button"
                    className="edit-done"
                    onClick={
                        handleDone
                    }
                    disabled={
                        saving
                    }
                >

                    {saving
                        ? "Saving..."
                        : "Done"
                    }

                </button>

            </div>


            {/* =================================
                PROFILE PHOTO
            ================================= */}

            <div className="edit-profile-pic">

                <img
                    src={
                        getProfileImage()
                    }
                    alt="Profile"
                />


                {/* =================================
                    HIDDEN FILE INPUT
                ================================= */}

                <input
                    ref={
                        fileInputRef
                    }
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                        handleFileChange
                    }
                    style={{
                        display: "none"
                    }}
                />


                <button
                    type="button"
                    className="change-profile-photo"
                    onClick={
                        handleChangePhoto
                    }
                >

                    Change profile photo

                </button>

            </div>


            {/* =================================
                PROFILE INFORMATION
            ================================= */}

            <div className="edit-profile-box">

                <input
    type="text"
    placeholder="Name"
    value={fullName}
    onChange={function (event) {

        setFullName(
            event.target.value
        );

    }}
/>


               <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={function (event) {

        setUsername(
            event.target.value
        );

    }}
/>

               <input
    type="text"
    placeholder="Bio"
    value={bio}
    onChange={function (event) {

        setBio(
            event.target.value
        );

    }}
/>


               <select
    value={gender}
    onChange={function (event) {

        setGender(
            event.target.value
        );

    }}
>

    <option value="">
        Gender
    </option>

    <option value="male">
        Male
    </option>

    <option value="female">
        Female
    </option>

    <option value="other">
        Other
    </option>

</select>

            </div>


            {/* =================================
                PUBLIC BUSINESS INFORMATION
            ================================= */}

            <div className="edit-profile-public">

                <h1>
                    Public Business Information
                </h1>


                <div className="public-info">

                    <p>
                        Page
                    </p>

                    <span>
                        Connect or create
                    </span>

                </div>


                <div className="public-info">

                    <p>
                        Category
                    </p>

                    <span>
                        Writer
                    </span>

                </div>


                <div className="public-info">

                    <p>
                        Contact Options
                    </p>

                    <span>
                        Email-address
                    </span>

                </div>


                <div className="public-info">

                    <p>
                        Action Buttons
                    </p>

                    <span>
                        None-Active
                    </span>

                </div>

            </div>

        </div>

    );

}


export default EditProfile;