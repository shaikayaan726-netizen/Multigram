import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// ===============================
// SOCKET
// ===============================

import {
  socket,
  connectSocket,
  disconnectSocket,
  getUserId
} from "./utils/socket";

// ===============================
// MAIN PAGES
// ===============================

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import EditProfile from "./pages/EditProfile";
import Notification from "./pages/Notification";
import Chat from "./pages/Chat";
import Message from "./pages/Message";

import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import AddAudio from "./pages/AddAudio";
import TagPeople from "./pages/TagPeople";
import AddLocation from "./pages/AddLocation";

import Reels from "./pages/Reels";
import Saved from "./pages/Saved";
import CreateStory from "./pages/CreateStory";
import BackgroundMusic from "./components/BackgroundMusic";
import PostGallery from "./pages/PostGallery";
import PostEditor from "./pages/PostEditor";

// ===============================
// SETTINGS
// ===============================

import NotificationSettings from "./pages/NotificationSettings";
import PostsStoriesComments from "./pages/PostsStoriesComments";
import FollowingFollowers from "./pages/FollowingFollowers";
import MessageNotifications from "./pages/MessageNotifications";
import CallNotifications from "./pages/CallNotifications";

import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import About from "./pages/About";

import ActivityStatus from "./pages/ActivityStatus";
import StoryPrivacy from "./pages/StoryPrivacy";
import Comments from "./pages/Comments";
import Mentions from "./pages/Mentions";
import Tags from "./pages/Tags";
import Messages from "./pages/Messages";

import ChangePassword from "./pages/ChangePassword";
import TwoFactor from "./pages/TwoFactor";
import LoginActivity from "./pages/LoginActivity";
import RecentActivity from "./pages/RecentActivity";
import SecurityEmails from "./pages/SecurityEmails";
import Devices from "./pages/Devices";
import Recovery from "./pages/Recovery";
import SecurityCheckup from "./pages/SecurityCheckup";

import Help from "./pages/Help";
import ReportProblem from "./pages/ReportProblem";
import AccountStatus from "./pages/AccountStatus";

import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import Copyright from "./pages/Copyright";
import Licenses from "./pages/Licenses";
import Acknowledgements from "./pages/Acknowledgements";

// ===============================
// REELS
// ===============================

import CreateReel from "./pages/CreateReel";

// ===============================
// MEDIA
// ===============================

import Gallery from "./pages/Gallery";
import MediaEditor from "./pages/MediaEditor";
import Camera from "./pages/Camera";
import VoiceRecorder from "./pages/VoiceRecorder";

// ===============================
// CALLS
// ===============================

import VoiceCall from "./pages/VoiceCall";
import IncomingVoiceCall from "./pages/IncomingVoiceCall";
import ActiveVoiceCall from "./pages/ActiveVoiceCall";

import VideoCall from "./pages/VideoCall";
import IncomingVideoCall from "./pages/IncomingVideoCall";
import ActiveVideoCall from "./pages/ActiveVideoCall";

import FollowRequests from "./pages/FollowRequests.jsx";

// ===============================
// GLOBAL CSS
// ===============================

import "./index.css";
import "./App.css";

import "./Login.css";
import "./Signup.css";
import "./Home.css";
import "./Profile.css";
import "./Search.css";
import "./Settings.css";
import "./Followers.css";
import "./Following.css";
import "./EditProfile.css";
import "./Notification.css";
import "./Message.css";
import "./Chat.css";

import "./CreatePost.css";
import "./EditPost.css";
import "./Post.css";
import "./AddAudio.css";
import "./AddLocation.css";
import "./Reels.css";
import "./Saved.css";
import "./CreateStory.css";

import "./PostGallery.css";
import "./PostEditor.css";
import "./NotificationSetting.css";
import "./PostsStoriesComments.css";
import "./FollowingFollowers.css";
import "./MessageNotifications.css";
import "./CallNotifications.css";

import "./Privacy.css";
import "./Security.css";
import "./About.css";
import "./ActivityStatus.css";
import "./StoryPrivacy.css";
import "./Comments.css";
import "./Mentions.css";
import "./Tags.css";
import "./Messages.css";

import "./ChangePassword.css";
import "./TwoFactor.css";
import "./LoginActivity.css";
import "./RecentActivity.css";
import "./SecurityEmails.css";
import "./Devices.css";
import "./Recovery.css";
import "./SecurityCheckup.css";

import "./Help.css";
import "./ReportProblem.css";
import "./AccountStatus.css";

import "./Terms.css";
import "./PrivacyPolicy.css";
import "./CommunityGuidelines.css";
import "./Copyright.css";
import "./Licenses.css";
import "./Acknowledgements.css";

// ===============================
// REEL CSS
// ===============================

import "./CreateReel.css";
import "./ReelGallery.css";
import "./ReelCamera.css";
import "./ReelEditor.css";
import "./ReelMusic.css";
import "./ReelEffects.css";
import "./ReelText.css";
import "./ReelStickers.css";
import "./ReelSettings.css";
import "./ReelAudio.css";
import "./ReelTimer.css";
import "./ReelShare.css";

// ===============================
// MEDIA / CALL / STORY CSS
// ===============================

import "./Gallery.css";
import "./Camera.css";
import "./MediaEditor.css";
import "./components/EditorComponents.css";
import "./Call.css";
import "./VoiceRecorder.css";
import "./StoryGallery.css";
import "./StoryCamera.css";
import "./StoryEditor.css";
import "./StoryShare.css";
import "./StoryText.css";
import "./StoryStickers.css";
import "./StoryMusic.css";
import "./StorySettings.css";
import "./StoryMention.css";
import "./StoryEffects.css";
import "./FollowRequests.css";


// ==========================================
// GLOBAL APP SOCKET HANDLER
// ==========================================

function GlobalCallListener() {

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {

    // Keep the application-level socket alive.
    connectSocket();


    function handleIncomingCall(data) {

      const currentUserId = getUserId();
      const callerId = String(data?.callerId || "");

      if (!data?.callId || !data?.receiverId) {
        return;
      }

      // Never show our own call as an incoming call.
      if (
        currentUserId &&
        callerId &&
        String(currentUserId) === callerId
      ) {
        return;
      }

      const type =
        data?.type === "video"
          ? "video"
          : "voice";

      const incomingPath =
        type === "video"
          ? "/video-call/incoming"
          : "/voice-call/incoming";

      // If the user is already on this exact incoming screen,
      // do not push another history entry.
      if (location.pathname === incomingPath) {
        return;
      }

      const callerUser = {
        ...(data?.user || {}),
        id: callerId || data?.user?.id || data?.user?._id || ""
      };

      console.log(
        "INCOMING CALL:",
        {
          callId: data.callId,
          callerId,
          receiverId: data.receiverId,
          type
        }
      );

      navigate(
        incomingPath,
        {
          replace: true,
          state: {
            user: callerUser,
            callId: data.callId,
            callerId,
            receiverId: data.receiverId,
            type
          }
        }
      );
    }


    socket.on(
      "call:incoming",
      handleIncomingCall
    );


    return () => {
      socket.off(
        "call:incoming",
        handleIncomingCall
      );
    };

  }, [navigate, location.pathname]);


  return null;
}


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <>

      <GlobalCallListener />

      <BackgroundMusic />

      <Routes>

        {/* =========================
            AUTH
        ========================= */}

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* =========================
            MAIN
        ========================= */}

        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/followers/:userId" element={<Followers />} />
        <Route path="/following/:userId" element={<Following />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/message" element={<Message />} />
        <Route path="/chat" element={<Chat />} />

        {/* =========================
            POST
        ========================= */}

        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editpost" element={<EditPost />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/addaudio" element={<AddAudio />} />
        <Route path="/tagpeople" element={<TagPeople />} />
        <Route path="/addlocation" element={<AddLocation />} />
        <Route path="/postgallery" element={<PostGallery />} />
        <Route path="/posteditor" element={<PostEditor />} />

        {/* =========================
            REELS
        ========================= */}

        <Route path="/reels" element={<Reels />} />
        <Route path="/reelcreate" element={<CreateReel />} />

        {/* =========================
            SAVED
        ========================= */}

        <Route path="/saved" element={<Saved />} />

        {/* =========================
            STORY
        ========================= */}

        <Route path="/createstory" element={<CreateStory />} />

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <Route
          path="/notificationsettings"
          element={<NotificationSettings />}
        />

        <Route
          path="/messagenotifications"
          element={<MessageNotifications />}
        />

        <Route
          path="/callnotifications"
          element={<CallNotifications />}
        />

        {/* =========================
            ACTIVITY
        ========================= */}

        <Route
          path="/postsstoriescomments"
          element={<PostsStoriesComments />}
        />

        <Route
          path="/followingfollowers"
          element={<FollowingFollowers />}
        />

        {/* =========================
            PRIVACY
        ========================= */}

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy/activity" element={<ActivityStatus />} />
        <Route path="/privacy/story" element={<StoryPrivacy />} />
        <Route path="/privacy/comments" element={<Comments />} />
        <Route path="/privacy/mentions" element={<Mentions />} />
        <Route path="/privacy/tags" element={<Tags />} />
        <Route path="/privacy/messages" element={<Messages />} />
        <Route path="/messages" element={<Messages />} />

        {/* =========================
            SECURITY
        ========================= */}

        <Route path="/security" element={<Security />} />
        <Route path="/security/password" element={<ChangePassword />} />
        <Route path="/security/twofactor" element={<TwoFactor />} />
        <Route path="/security/loginactivity" element={<LoginActivity />} />
        <Route path="/security/recentactivity" element={<RecentActivity />} />
        <Route path="/security/securityemails" element={<SecurityEmails />} />
        <Route path="/security/devices" element={<Devices />} />
        <Route path="/security/recovery" element={<Recovery />} />
        <Route path="/security/checkup" element={<SecurityCheckup />} />

        {/* =========================
            HELP / LEGAL
        ========================= */}

        <Route path="/help" element={<Help />} />
        <Route path="/reportproblem" element={<ReportProblem />} />
        <Route path="/accountstatus" element={<AccountStatus />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route
          path="/communityguidelines"
          element={<CommunityGuidelines />}
        />
        <Route path="/copyright" element={<Copyright />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route
          path="/acknowledgements"
          element={<Acknowledgements />}
        />

        {/* =========================
            MEDIA
        ========================= */}

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/media-editor" element={<MediaEditor />} />
        <Route path="/camera" element={<Camera />} />
        <Route
          path="/voice-recorder"
          element={<VoiceRecorder />}
        />

        {/* =========================
            VOICE CALL
        ========================= */}

        <Route
          path="/voice-call"
          element={<VoiceCall />}
        />

        <Route
          path="/voice-call/incoming"
          element={<IncomingVoiceCall />}
        />

        <Route
          path="/voice-call/active"
          element={<ActiveVoiceCall />}
        />

        {/* =========================
            VIDEO CALL
        ========================= */}

        <Route
          path="/video-call"
          element={<VideoCall />}
        />

        <Route
          path="/video-call/incoming"
          element={<IncomingVideoCall />}
        />

        <Route
          path="/video-call/active"
          element={<ActiveVideoCall />}
        />

        {/* =========================
            FOLLOW REQUESTS
        ========================= */}

        <Route
          path="/follow-requests"
          element={<FollowRequests />}
        />

      </Routes>

    </>
  );
}


export default App;
