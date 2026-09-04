import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import {
    FiArrowLeft,
    FiSearch,
    FiCheck,
    FiUser
} from "react-icons/fi";

const BACKEND_URL = "http://localhost:3000";
const TAGGED_USERS_KEY = "instagram_createpost_tagged_users";

function getProfileImage(profilePicture) {
    if (!profilePicture) {
        return null;
    }

    const value = String(profilePicture);

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    if (value.startsWith("/")) {
        return BACKEND_URL + value;
    }

    return BACKEND_URL + "/" + value;
}

function DefaultAvatar() {
    return (
        <div
            className="tag-default-avatar"
            aria-label="Profile"
        >
            <FiUser />
        </div>
    );
}

function ProfileAvatar({
    profilePicture,
    username
}) {
    const image =
        getProfileImage(profilePicture);

    const [failed, setFailed] =
        useState(false);

    useEffect(function () {
        setFailed(false);
    }, [image]);

    if (!image || failed) {
        return <DefaultAvatar />;
    }

    return (
        <img
            src={image}
            alt={username || "Profile"}
            onError={function () {
                setFailed(true);
            }}
        />
    );
}

function TagPeople() {
    const navigate = useNavigate();
    const location = useLocation();

    const [search, setSearch] =
        useState("");

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [selectedUsers, setSelectedUsers] =
        useState(function () {
            let routeUsers = [];

            if (
                location.state &&
                Array.isArray(
                    location.state.taggedUsers
                )
            ) {
                routeUsers =
                    location.state.taggedUsers;
            }
            else if (
                location.state &&
                location.state.taggedUser
            ) {
                routeUsers = [
                    location.state.taggedUser
                ];
            }

            if (routeUsers.length > 0) {
                return routeUsers;
            }

            try {
                const saved =
                    localStorage.getItem(
                        TAGGED_USERS_KEY
                    );

                const parsed =
                    saved
                        ? JSON.parse(saved)
                        : [];

                return Array.isArray(parsed)
                    ? parsed
                    : [];
            }
            catch (error) {
                return [];
            }
        });

    useEffect(function () {
        try {
            localStorage.setItem(
                TAGGED_USERS_KEY,
                JSON.stringify(selectedUsers)
            );
        }
        catch (error) {
            console.warn(
                "TAGGED USERS SAVE ERROR:",
                error
            );
        }
    }, [selectedUsers]);

    useEffect(function () {
        const query =
            search.trim();

        if (!query) {
            setUsers([]);
            setLoading(false);
            return;
        }

        const timer =
            setTimeout(async function () {
                try {
                    setLoading(true);

                    const data =
                        await api(
                            "/search-user?username=" +
                            encodeURIComponent(query)
                        );

                    console.log(
                        "TAG PEOPLE SEARCH:",
                        data
                    );

                    if (Array.isArray(data)) {
                        setUsers(data);
                    }
                    else if (
                        data &&
                        Array.isArray(data.users)
                    ) {
                        setUsers(data.users);
                    }
                    else if (
                        data &&
                        data.user
                    ) {
                        setUsers([data.user]);
                    }
                    else {
                        setUsers([]);
                    }
                }
                catch (error) {
                    console.error(
                        "TAG PEOPLE SEARCH ERROR:",
                        error
                    );

                    setUsers([]);
                }
                finally {
                    setLoading(false);
                }
            }, 400);

        return function () {
            clearTimeout(timer);
        };
    }, [search]);

    function handleSelectUser(user) {
        const userId =
            user._id ||
            user.id;

        if (!userId) {
            return;
        }

        const selectedUser = {
            _id: userId,
            username:
                user.username || "",
            fullName:
                user.fullName || "",
            profilePicture:
                user.profilePicture || "",
            image:
                user.profilePicture || ""
        };

        setSelectedUsers(
            function (previousUsers) {
                const alreadySelected =
                    previousUsers.some(
                        function (item) {
                            return (
                                String(
                                    item._id ||
                                    item.id
                                ) ===
                                String(userId)
                            );
                        }
                    );

                if (alreadySelected) {
                    return previousUsers.filter(
                        function (item) {
                            return (
                                String(
                                    item._id ||
                                    item.id
                                ) !==
                                String(userId)
                            );
                        }
                    );
                }

                return [
                    ...previousUsers,
                    selectedUser
                ];
            }
        );
    }

    function handleDone() {
        const previousState =
            location.state || {};

        navigate(
            previousState.returnTo ||
            "/createpost",
            {
                state: {
                    ...previousState,

                    taggedUsers:
                        selectedUsers,

                    taggedUser:
                        selectedUsers[0] ||
                        null
                }
            }
        );
    }

    function handleBack() {
        navigate(-1);
    }

    return (
        <div className="tag-people-page">

            <style>
                {`
                    .tag-people-page .tag-people-selected-users {
                        width: 100%;
                        background: #fff;
                        border-bottom: 1px solid #dbdbdb;
                    }

                    .tag-people-page .tag-people-selected-user {
                        width: 100%;
                        min-height: 58px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 9px 15px;
                        border-bottom: 1px solid #efefef;
                        box-sizing: border-box;
                        background: #fff;
                    }

                    .tag-people-page .tag-people-selected-user:last-child {
                        border-bottom: none;
                    }

                    .tag-people-page .tag-people-selected-user img,
                    .tag-people-page .tag-people-selected-user .tag-default-avatar {
                        width: 38px;
                        height: 38px;
                        min-width: 38px;
                        border-radius: 50%;
                        object-fit: cover;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .tag-people-page .tag-people-selected-user-info {
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }

                    .tag-people-page .tag-people-selected-user-info strong {
                        font-size: 14px;
                        line-height: 18px;
                        font-weight: 600;
                    }

                    .tag-people-page .tag-people-selected-user-info p {
                        margin: 1px 0 0;
                        font-size: 12px;
                        line-height: 16px;
                        color: #8e8e8e;
                    }

                    .tag-people-page .tag-user {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .tag-people-page .selected-tag-user-row {
                        background: #fafafa;
                    }

                    .tag-people-page .tag-user > img,
                    .tag-people-page .tag-user > .tag-default-avatar {
                        width: 44px;
                        height: 44px;
                        min-width: 44px;
                        border-radius: 50%;
                        object-fit: cover;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .tag-people-page .tag-user-info {
                        flex: 1;
                        min-width: 0;
                    }
                `}
            </style>

            <div className="tag-people-nav">

                <button
                    className="icon-btn"
                    onClick={handleBack}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Tag people
                </h1>

                <button
                    className="icon-btn"
                    onClick={handleDone}
                    disabled={
                        selectedUsers.length === 0
                    }
                >
                    <FiCheck />
                </button>

            </div>

            <div className="tag-search">

                <FiSearch />

                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={function (event) {
                        setSearch(
                            event.target.value
                        );
                    }}
                />

            </div>

            {selectedUsers.length > 0 && (
                <div className="tag-people-selected-users">

                    {selectedUsers.map(
                        function (user) {
                            return (
                                <div
                                    className="tag-people-selected-user"
                                    key={
                                        user._id ||
                                        user.id
                                    }
                                >

                                    <ProfileAvatar
                                        profilePicture={
                                            user.profilePicture ||
                                            user.image
                                        }
                                        username={
                                            user.username
                                        }
                                    />

                                    <div className="tag-people-selected-user-info">

                                        <strong>
                                            {user.username}
                                        </strong>

                                        <p>
                                            Selected
                                        </p>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

            <div className="tag-user-list">

                {loading && (
                    <p className="no-tag-user">
                        Searching...
                    </p>
                )}

                {!loading &&
                    users.map(function (user) {

                        const userId =
                            user._id ||
                            user.id;

                        const isSelected =
                            selectedUsers.some(
                                function (
                                    selectedUser
                                ) {
                                    return (
                                        String(
                                            selectedUser._id ||
                                            selectedUser.id
                                        ) ===
                                        String(userId)
                                    );
                                }
                            );

                        return (
                            <div
                                className={
                                    isSelected
                                        ? "tag-user selected-tag-user-row"
                                        : "tag-user"
                                }
                                key={userId}
                                onClick={function () {
                                    handleSelectUser(
                                        user
                                    );
                                }}
                            >

                                <ProfileAvatar
                                    profilePicture={
                                        user.profilePicture
                                    }
                                    username={
                                        user.username
                                    }
                                />

                                <div className="tag-user-info">

                                    <strong>
                                        {user.username}
                                    </strong>

                                    <p>
                                        {user.fullName}
                                    </p>

                                </div>

                                {isSelected && (
                                    <FiCheck />
                                )}

                            </div>
                        );
                    })
                }

                {!loading &&
                    search.trim() &&
                    users.length === 0 && (
                        <p className="no-tag-user">
                            No users found
                        </p>
                    )}

            </div>

        </div>
    );
}

export default TagPeople;
