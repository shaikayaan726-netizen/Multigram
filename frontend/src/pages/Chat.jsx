import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  FiArrowLeft,
  FiPhone,
  FiVideo,
  FiCamera,
  FiMic,
  FiImage,
  FiSmile,
  FiSend,
  FiX
} from "react-icons/fi";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { api } from "../utils/api";


function Chat() {

  const navigate = useNavigate();

  const location = useLocation();
const chatBodyRef =
  useRef(null);

  // =========================================
  // SELECTED USER
  // =========================================

  const user =
    location.state?.user || null;


  // =========================================
  // MESSAGE INPUT
  // =========================================

  const [message, setMessage] =
    useState("");


  // =========================================
  // MESSAGES
  // =========================================

  const [messages, setMessages] =
    useState([]);


  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] =
    useState(true);


  // =========================================
  // SENDING
  // =========================================

  const [sending, setSending] =
    useState(false);

// =========================================
// REPLY
// =========================================

const [replyingTo, setReplyingTo] =
    useState(null);

const [touchStart, setTouchStart] =
    useState(null);
  // =========================================
  // EMOJI
  // =========================================

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);


  // =========================================
  // EMOJI CATEGORY
  // =========================================

  const [emojiCategory, setEmojiCategory] =
    useState("smileys");


  // =========================================
  // EMOJI DATA
  // =========================================

  const emojiData = {

    smileys: [
      "😀","😃","😄","😁","😆",
      "😅","😂","🤣","😊","😇",
      "🙂","🙃","😉","😌","😍",
      "🥰","😘","😗","😙","😚",
      "😋","😛","😝","😜","🤪",
      "🤨","🧐","🤓","😎","🤩",
      "🥳","😏","😒","😞","😔",
      "😟","😕","🙁","☹️","😣",
      "😖","😫","😩","🥺","😢",
      "😭","😤","😠","😡","🤬",
      "🤯","😳","🥵","🥶","😱",
      "😨","😰","😥","😓","🤗",
      "🤔","🫣","🤭","🫢","🫡",
      "🤫","🫠","🤥","😶","🫥",
      "😐","😑","😬","🙄","😯",
      "😦","😧","😮","😲","🥱",
      "😴","🤤","😪","😵","🤐",
      "🥴","🤢","🤮","🤧","😷",
      "🤒","🤕","🤑","🤠","😈",
      "👿","👹","👺","🤡","💩",
      "👻","💀","☠️","👽","👾",
      "🤖","🎃","😺","😸","😹",
      "😻","😼","😽","🙀","😿",
      "😾"
    ],


    people: [
      "👋","🤚","🖐️","✋","🖖",
      "👌","🤏","✌️","🤞","🤟",
      "🤘","🤙","👈","👉","👆",
      "👇","☝️","👍","👎","✊",
      "👊","🤛","🤜","👏","🙌",
      "👐","🤲","🤝","🙏","✍️",
      "💅","🤳","💪","🦾","🦿",
      "🦵","🦶","👂","👃","🧠",
      "🫀","🫁","🦷","🦴","👀",
      "👁️","👅","👄","💋","🫦",
      "👶","🧒","👦","👧","🧑",
      "👱","👨","👩","🧔","👴",
      "👵","🙍","🙎","🙅","🙆",
      "💁","🙋","🧏","🙇","🤦",
      "🤷","👮","👷","💂","🕵️",
      "👩‍⚕️","👨‍⚕️","👩‍🏫","👨‍🏫",
      "👩‍💻","👨‍💻","👩‍🍳","👨‍🍳"
    ],


    animals: [
      "🐶","🐱","🐭","🐹","🐰",
      "🦊","🐻","🐼","🐨","🐯",
      "🦁","🐮","🐷","🐸","🐵",
      "🙈","🙉","🙊","🐒","🐔",
      "🐧","🐦","🐤","🐣","🐥",
      "🦆","🦅","🦉","🦇","🐺",
      "🐗","🐴","🦄","🐝","🪱",
      "🐛","🦋","🐌","🐞","🐜",
      "🪰","🪲","🪳","🕷️","🦂",
      "🐢","🐍","🦎","🦖","🦕",
      "🐙","🦑","🦀","🐠","🐟",
      "🐡","🐬","🐳","🐋","🦈",
      "🐊","🐘","🦏","🦛","🐪",
      "🐫","🦒","🦘","🐃","🐂",
      "🐄","🐎","🐖","🐏","🐑",
      "🦙","🐐","🦌","🐕","🐩",
      "🐈","🐓","🦃","🦚","🦜"
    ],


    food: [
      "🍏","🍎","🍐","🍊","🍋",
      "🍌","🍉","🍇","🍓","🫐",
      "🍈","🍒","🍑","🥭","🍍",
      "🥥","🥝","🍅","🍆","🥑",
      "🥦","🥬","🥒","🌶️","🫑",
      "🌽","🥕","🧄","🧅","🥔",
      "🍞","🥐","🥖","🥨","🧀",
      "🥚","🍳","🧈","🥞","🧇",
      "🥓","🥩","🍗","🍖","🌭",
      "🍔","🍟","🍕","🥪","🌮",
      "🌯","🫔","🥗","🍝","🍜",
      "🍲","🍛","🍣","🍱","🥟",
      "🦪","🍤","🍚","🍙","🍘",
      "🍥","🥠","🍦","🍧","🍨",
      "🍩","🍪","🎂","🍰","🧁",
      "🍫","🍬","🍭","☕","🍵",
      "🧃","🥤","🧋","🍹","🍺"
    ],


    activities: [
      "⚽","🏀","🏈","⚾","🥎",
      "🎾","🏐","🏉","🥏","🎱",
      "🪀","🏓","🏸","🏒","🏑",
      "🥍","🏏","⛳","🏹","🎣",
      "🤿","🥊","🥋","🎽","🛹",
      "🛷","⛸️","🎿","🏂","🏋️",
      "🤼","🤸","⛹️","🤺","🏇",
      "🧘","🏄","🏊","🤽","🚣",
      "🧗","🚵","🚴","🎯","🎮",
      "🕹️","🎲","♟️","🎰","🧩",
      "🎨","🎭","🎪","🎤","🎧",
      "🎼","🎹","🥁","🎷","🎸",
      "🎺","🎻","🎬","🎮","🎟️",
      "🎉","🎊","🎈","🎁","🏆",
      "🥇","🥈","🥉"
    ],


    travel: [
      "🚗","🚕","🚙","🚌","🚎",
      "🏎️","🚓","🚑","🚒","🚐",
      "🛻","🚚","🚛","🚜","🛵",
      "🏍️","🚲","🛴","✈️","🛫",
      "🛬","🚁","🚀","🛸","🚢",
      "⛵","🚤","🛥️","🚂","🚆",
      "🚇","🚊","🚉","🚞","🚝",
      "🏠","🏡","🏢","🏥","🏦",
      "🏨","🏪","🏫","🏭","🏰",
      "🗼","🗽","⛪","🕌","🛕",
      "🌍","🌎","🌏","🌋","🏔️",
      "🏖️","🏝️","🏜️","🌅","🌄"
    ],


    objects: [
      "⌚","📱","💻","⌨️","🖥️",
      "🖨️","🖱️","💽","💾","📷",
      "📸","📹","🎥","📞","☎️",
      "📺","📻","🎙️","🎧","🔋",
      "🔌","💡","🔦","🕯️","🧯",
      "💰","💵","💳","💎","⚖️",
      "🔧","🔨","🔪","🛠️","🔑",
      "🔒","🔓","🔐","🔔","🔕",
      "📢","📣","📌","📍","✏️",
      "📝","📖","📚","📎","✂️",
      "📦","🎁","🎈","⚽","🎸",
      "🎹","🎮","🧸","🪄","🎩"
    ],


    symbols: [
      "❤️","🧡","💛","💚","💙",
      "💜","🖤","🤍","🤎","💔",
      "❣️","💕","💞","💓","💗",
      "💖","💘","💝","💟","☮️",
      "✝️","☪️","🕉️","☯️","💯",
      "🔥","✨","⭐","🌟","💫",
      "⚡","☀️","🌈","☁️","❄️",
      "☃️","💥","💦","💨","🎵",
      "🎶","✅","❌","⭕","❗",
      "❓","‼️","⁉️","⚠️","🚫",
      "🔴","🟠","🟡","🟢","🔵",
      "🟣","⚫","⚪","🟤","🔶",
      "🔷","🔺","🔻","💠","✔️"
    ]

  };


  // =========================================
  // LOAD CHAT
  // =========================================

  useEffect(() => {

    let cancelled = false;


    async function loadMessages() {

      if (!user?.id) {

        setLoading(false);

        return;

      }


      try {

        setLoading(true);


        const data =
          await api(
            `/messages/${user.id}`
          );


        if (!cancelled) {

          setMessages(
            Array.isArray(
              data?.messages
            )
              ? data.messages
              : []
          );

        }

      }

      catch (error) {

        console.error(
          "LOAD CHAT ERROR:",
          error
        );

      }

      finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }


    loadMessages();


    return () => {

      cancelled = true;

    };

   }, [user?.id]);

// =========================================
// REALTIME CHAT MESSAGE REFRESH
// Keeps open chats synced across phone/laptop
// =========================================

useEffect(() => {

    if (!user?.id) {
        return;
    }

    let cancelled = false;

    async function refreshMessages() {

        try {

            const data =
                await api(
                    `/messages/${user.id}`
                );

            if (cancelled) {
                return;
            }

            const latestMessages =
                Array.isArray(
                    data?.messages
                )
                    ? data.messages
                    : [];

            setMessages(
                latestMessages
            );

        }
        catch (error) {

            if (!cancelled) {
                console.error(
                    "REFRESH CHAT ERROR:",
                    error
                );
            }

        }

    }

    const refreshTimer =
        setInterval(
            refreshMessages,
            1500
        );

    return () => {

        cancelled = true;

        clearInterval(
            refreshTimer
        );

    };

}, [user?.id]);
// =========================================
// PRESERVE CHAT SCROLL POSITION
// =========================================

// =========================================
// RESTORE CHAT SCROLL POSITION
// =========================================

useEffect(() => {
  if (
    loading ||
    !user?.id ||
    !chatBodyRef.current
  ) {
    return;
  }

  const savedScroll =
    sessionStorage.getItem(
      `chat-scroll-${user.id}`
    );

  if (savedScroll === null) {
    return;
  }

  const restoreTimer =
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop =
          Number(savedScroll);
      }
    }, 100);

  return () => {
    clearTimeout(restoreTimer);
  };

}, [
  loading,
  messages.length,
  user?.id
]);
// =========================================
// BACK
// =========================================


  // =========================================
  // BACK
  // =========================================

  function handleBack() {

    navigate("/message");

  }
  // =========================================
// REPLY PREVIEW
// =========================================

function getReplyPreview(item) {

    if (!item) {
        return "Message";
    }

    const sharedReel =
        getSharedReelData(item);

    if (sharedReel) {
        return "Reel";
    }

    if (item.type === "image") {
        return "Photo";
    }

    if (item.type === "video") {
        return "Video";
    }

    if (item.type === "audio") {
        return "Voice message";
    }

    if (item.type === "call") {

        if (item.callType === "video") {
            return "Video call";
        }

        return "Voice call";
    }

    if (item.text) {
        return item.text;
    }

    if (item.mediaUrl) {
        return "Media message";
    }

    return "Message";
}


// =========================================
// START REPLY
// =========================================

function handleReply(item) {

    if (!item) {
        return;
    }

    setReplyingTo(item);

}


// =========================================
// TOUCH START
// =========================================

function handleTouchStart(event) {

    const touch =
        event.touches?.[0];

    if (!touch) {
        return;
    }

    setTouchStart({

        x: touch.clientX,

        y: touch.clientY

    });

}


// =========================================
// TOUCH END
// =========================================

function handleTouchEnd(
    event,
    item
) {

    if (!touchStart) {
        return;
    }

    const touch =
        event.changedTouches?.[0];

    if (!touch) {
        setTouchStart(null);
        return;
    }

    const deltaX =
        touch.clientX -
        touchStart.x;

    const deltaY =
        touch.clientY -
        touchStart.y;

    const horizontalSwipe =
        Math.abs(deltaX) >= 60 &&
        Math.abs(deltaX) >
            Math.abs(deltaY) * 1.2;

    const currentUserId =
        localStorage.getItem(
            "userId"
        );

    const senderId =
        item?.sender?._id ||
        item?.sender;

    const isOwnMessage =
        String(senderId) ===
        String(currentUserId);

    // =====================================
    // INSTAGRAM STYLE REPLY
    // =====================================

    // Other person's message
    // → SWIPE RIGHT
    if (
        horizontalSwipe &&
        !isOwnMessage &&
        deltaX > 0
    ) {

        handleReply(item);

    }

    // Your own message
    // → SWIPE LEFT
    if (
        horizontalSwipe &&
        isOwnMessage &&
        deltaX < 0
    ) {

        handleReply(item);

    }

    setTouchStart(null);

}

// =========================================
// CANCEL REPLY
// =========================================

function cancelReply() {

    setReplyingTo(null);

}


  // =========================================
  // PARSE SHARED REEL MESSAGE
  // =========================================

  function getSharedReelData(item) {

    const text =
      item?.text || "";

    const prefix =
      "__REEL_SHARE__";

    if (!text.startsWith(prefix)) {
      return null;
    }

    try {

      return JSON.parse(
        decodeURIComponent(
          text.slice(prefix.length)
        )
      );

    }
    catch (error) {

      console.error(
        "PARSE SHARED REEL ERROR:",
        error
      );

      return null;
    }
  }


  // =========================================
  // VOICE CALL
  // =========================================

  function handleVoiceCall() {

    navigate(

      "/voice-call",

      {

        state: {
          user
        }

      }

    );

  }


  // =========================================
  // VIDEO CALL
  // =========================================

  function handleVideoCall() {

    navigate(

      "/video-call",

      {

        state: {
          user
        }

      }

    );

  }


  // =========================================
  // CAMERA
  // =========================================

function handleCamera() {

  navigate("/camera", {
    state: {
      fromChat: true,
      chatUser: user
    }
  });

}


  // =========================================
  // GALLERY
  // =========================================
function handleGallery() {

  navigate("/gallery?fromChat=true", {
    state: {
      fromChat: true,
      chatUser: user
    }
  });

}


  // =========================================
  // VOICE MESSAGE
  // =========================================

 function handleVoiceMessage() {

  navigate("/voice-recorder", {
    state: {
      user
    }
  });

}

  // =========================================
  // SEND MESSAGE
  // =========================================

  async function handleSend() {

    const text =
      message.trim();


    if (!text) {

      return;

    }


    if (!user?.id) {

      alert(
        "User information not found"
      );

      return;

    }


    if (sending) {

      return;

    }


    try {

      setSending(true);


      const data =
        await api(

          "/messages",

          {

            method: "POST",

            body: JSON.stringify({

    receiver:
        user.id,

    text:
        text,

    replyTo:
        replyingTo?._id ||
        replyingTo?.id ||
        null

})
          }

        );


      if (
        data?.message
      ) {

        setMessages(

          function(oldMessages) {

            return [

              ...oldMessages,

              data.message

            ];

          }

        );

      }


    setMessage("");

setReplyingTo(null);

setShowEmojiPicker(false);

    }

    catch (error) {

      console.error(
        "SEND MESSAGE ERROR:",
        error
      );


      alert(

        error.message ||
        "Failed to send message"

      );

    }

    finally {

      setSending(false);

    }

  }


  // =========================================
  // ENTER SEND
  // =========================================

  function handleKeyDown(event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  }


  // =========================================
  // ADD EMOJI
  // =========================================

  function addEmoji(emoji) {

    setMessage(

      function(value) {

        return value + emoji;

      }

    );

  }


  // =========================================
  // TOGGLE EMOJI
  // =========================================

  function toggleEmojiPicker() {

    setShowEmojiPicker(

      function(value) {

        return !value;

      }

    );

  }


  // =========================================
  // USER NOT FOUND
  // =========================================

  if (!user) {

    return (

      <div className="chat-page">

        <div className="chat-nav">

          <button
            type="button"
            className="icon-btn back-btn"
            onClick={handleBack}
          >

            <FiArrowLeft />

          </button>


          <h3>
            Chat
          </h3>

        </div>


        <div
          className="chat-body"
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          User not found

        </div>

      </div>

    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <div className="chat-page">


      {/* =================================
          TOP NAVBAR
      ================================= */}

      <div className="chat-nav">


        {/* BACK */}

        <button

          type="button"

          className="icon-btn back-btn"

          onClick={handleBack}

          aria-label="Back"

        >

          <FiArrowLeft />

        </button>


        {/* PROFILE */}

       <div className="chat-profile">

  {(
    user.profilePicture ||
    user.avatar ||
    user.image
  ) ? (

    <img
      src={
        user.profilePicture ||
        user.avatar ||
        user.image
      }
      alt={
        user.name ||
        user.username ||
        "User"
      }
    />

  ) : (

    <div className="chat-default-avatar">
      {(user.username || user.name || "U")
        .charAt(0)
        .toUpperCase()}
    </div>

  )}

  <div className="chat-user">

    <h3>
      {
        user.name ||
        user.username ||
        "User"
      }
    </h3>

    <p>
      Active now
    </p>

  </div>

</div>

        {/* CALL BUTTONS */}

        <div className="chat-icons">


          {/* VOICE */}

          <button

            type="button"

            className="icon-btn"

            onClick={handleVoiceCall}

            aria-label="Voice call"

          >

            <FiPhone />

          </button>


          {/* VIDEO */}

          <button

            type="button"

            className="icon-btn"

            onClick={handleVideoCall}

            aria-label="Video call"

          >

            <FiVideo />

          </button>

        </div>

      </div>


      {/* =================================
          CHAT BODY
      ================================= */}

     <div
  className="chat-body"
  ref={chatBodyRef}
  onScroll={() => {
    if (!user?.id) {
      return;
    }

    sessionStorage.setItem(
      `chat-scroll-${user.id}`,
      String(
        chatBodyRef.current?.scrollTop || 0
      )
    );
  }}
>

        {loading && (

          <div
            className="chat-loading"
          >

            Loading messages...

          </div>

        )}


        {!loading &&
          messages.length === 0 && (

            <div
              className="chat-empty"
            >

              Start a conversation

            </div>

          )}


        {!loading &&
          messages.map(

            function(item) {

             const currentUserId =
    localStorage.getItem(
        "userId"
    );

const senderId =
    item.sender?._id ||
    item.sender;

const isSender =
    String(senderId) ===
    String(currentUserId);
const sharedReel =
    getSharedReelData(item);

const resolveSharedReelMediaUrl =
    function (url) {
        if (!url) {
            return "";
        }

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            return url;
        }

        if (url.startsWith("/")) {
            return url;
        }

        return "/" + url;
    };

const resolveChatMediaUrl =
    function (url) {
        if (!url) {
            return "";
        }

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            return url;
        }

        return url.startsWith("/")
            ? url
            : "/" + url;
    };

const sharedReelVideoUrl =
    sharedReel?.video
        ? (
            sharedReel.video.startsWith("http://") ||
            sharedReel.video.startsWith("https://")
                ? sharedReel.video
                : "/" + sharedReel.video.replace(/^\/+/, "")
        )
        : "";
const isSharedReelYouTube =
    sharedReel?.video &&
    (
        sharedReel.video.includes("youtube.com/embed/") ||
        sharedReel.video.includes("youtu.be/") ||
        sharedReel.video.includes("youtube.com/shorts/")
    );
const sharedReelProfileUrl =
    sharedReel?.author?.profilePicture
        ? (
            sharedReel.author.profilePicture.startsWith("http://") ||
            sharedReel.author.profilePicture.startsWith("https://")
                ? sharedReel.author.profilePicture
                : "/" + sharedReel.author.profilePicture.replace(/^\/+/, "")
        )
        : "";

const replyTarget =
    item.replyTo;

const replyTargetSenderId =
    replyTarget?.sender?._id ||
    replyTarget?.sender;

const replyLabel =
    replyTarget
        ? String(replyTargetSenderId) ===
          String(currentUserId)
            ? "Replied to yourself"
            : "Replied to you"
        : "";

return (

    <div

        key={
            item._id ||
            item.id
        }

       className={
    sharedReel
        ? "chat-reel-message"
        : isSender
            ? "sender-message"
            : "receiver-message"
}

        onTouchStart={handleTouchStart}

        onTouchEnd={(event) =>
            handleTouchEnd(
                event,
                item
            )
        }

        style={{
            touchAction: "pan-y"
        }}

    >

        {replyTarget && (

            <div
                className="chat-reply-preview"
                style={{
                    padding: "7px 10px",
                    marginBottom: "6px",
                    borderLeft:
                        "3px solid currentColor",
                    borderRadius: "5px",
                    background:
                        "rgba(128,128,128,0.12)",
                    fontSize: "12px"
                }}
            >

                <div
                    style={{
                        fontWeight: "600",
                        marginBottom: "2px"
                    }}
                >
                    {replyLabel}
                </div>

                <div
                    style={{
                        opacity: 0.75,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {getReplyPreview(
                        replyTarget
                    )}
                </div>

            </div>

        )}

        {sharedReel ? (

            <div
                className="chat-shared-reel"
                role="button"
                tabIndex={0}
                onClick={function () {
                    if (!sharedReel.reelId) {
                        return;
                    }

                    navigate("/reels", {
                        state: {
                            reelId: String(sharedReel.reelId)
                        }
                    });
                }}
                onKeyDown={function (event) {
                    if (
                        event.key !== "Enter" &&
                        event.key !== " "
                    ) {
                        return;
                    }

                    event.preventDefault();

                    if (!sharedReel.reelId) {
                        return;
                    }

                    navigate("/reels", {
                        state: {
                            reelId: String(sharedReel.reelId)
                        }
                    });
                }}
            >

                <div className="chat-shared-reel-title">
                    <span>🎬</span>
                    <strong>Shared a reel</strong>
                </div>

                {sharedReelVideoUrl && (
    isSharedReelYouTube ? (
        <iframe
            className="chat-shared-reel-video"
            src={
                sharedReelVideoUrl +
                (sharedReelVideoUrl.includes("?") ? "&" : "?") +
                "autoplay=0" +
                "&playsinline=1" +
                "&rel=0" +
                "&modestbranding=1"
            }
            title={
                sharedReel.caption ||
                "Shared YouTube Reel"
            }
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            onClick={function (event) {
                event.stopPropagation();
            }}
        />
    ) : (
        <video
            className="chat-shared-reel-video"
            src={sharedReelVideoUrl}
            controls
            playsInline
            preload="metadata"
            onClick={function (event) {
                event.stopPropagation();
            }}
        />
    )
)}

                <div className="chat-shared-reel-author">

                    {sharedReelProfileUrl ? (
                        <img
                            src={sharedReelProfileUrl}
                            alt={
                                sharedReel.author?.username ||
                                "User"
                            }
                            onClick={function (event) {
                                event.stopPropagation();
                            }}
                        />
                    ) : (
                        <div className="chat-shared-reel-avatar">
                            {(sharedReel.author?.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <strong>
                        @{sharedReel.author?.username || "user"}
                    </strong>

                </div>

                {sharedReel.caption && (
                    <div className="chat-shared-reel-caption">
                        {sharedReel.caption}
                    </div>
                )}

            </div>

        ) : item.type === "call" ? (
                    <div
                      style={{
                        width: "190px",
                        height: item.callStatus === "missed" ? "108px" : "68px",
                        position: "relative",
                        boxSizing: "border-box",
                        background: "#202638",
                        color: "#fff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "9px"
                      }}
                    >
                      {/* CALL ICON */}
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          borderRadius: "50%",
                          background:
                            item.callStatus === "missed"
                              ? "#ed174c"
                              : "#dfe4ec",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color:
                            item.callStatus === "missed"
                              ? "#fff"
                              : "#202638",
                          fontSize: "16px"
                        }}
                      >
                        {item.callType === "video" ? (
                          <FiVideo />
                        ) : (
                          <FiPhone />
                        )}
                      </div>

                      {/* CALL INFO */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          minWidth: 0,
                          paddingTop: "2px"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            lineHeight: "18px",
                            fontWeight: 600,
                            whiteSpace: "nowrap"
                          }}
                        >
                          {item.callStatus === "missed"
                            ? `Missed ${
                                item.callType === "video"
                                  ? "video"
                                  : "voice"
                              } call`
                            : `${
                                item.callType === "video"
                                  ? "Video"
                                  : "Voice"
                              } call ended`}
                        </div>

                        {item.callStatus !== "missed" &&
                          Number(item.callDuration) > 0 && (
                            <div
                              style={{
                                marginTop: "2px",
                                fontSize: "12px",
                                color: "#d4d8e1"
                              }}
                            >
                              {Math.floor(
                                Number(item.callDuration) / 60
                              )}
                              :
                              {String(
                                Number(item.callDuration) % 60
                              ).padStart(2, "0")}
                            </div>
                          )}
                      </div>

                      {/* CALL BACK — ONLY MISSED CALL */}
                      {item.callStatus === "missed" && (
                        <button
                          type="button"
                          onClick={
                            item.callType === "video"
                              ? handleVideoCall
                              : handleVoiceCall
                          }
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: "100%",
                            height: "36px",
                            margin: 0,
                            padding: 0,
                            border: "none",
                            borderTop:
                              "1px solid rgba(255,255,255,0.14)",
                            borderRadius: 0,
                            background: "#202638",
                            color: "#fff",
                            fontFamily: "inherit",
                            fontSize: "14px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                            outline: "none",
                            boxSizing: "border-box"
                          }}
                        >
                          Call back
                        </button>
                      )}
                    </div>
                  ) : item.type === "audio" && item.mediaUrl ? (
                    <div
                      style={{
                        width: "230px",
                        maxWidth: "100%",
                        overflow: "hidden"
                      }}
                    >
                     <audio
    controls
    preload="metadata"
    src={
        resolveChatMediaUrl(
            item.mediaUrl
        )
    }
    style={{
        width: "100%",
        height: "40px"
    }}
/>
                    </div>
                  ) : item.type === "image" && item.mediaUrl ? (
                    <img
                     src={
    resolveChatMediaUrl(
        item.mediaUrl
    )
}
                      alt="Photo"
                      style={{
                        display: "block",
                        width: "240px",
                        maxWidth: "100%",
                        maxHeight: "320px",
                        objectFit: "cover",
                        borderRadius: "12px"
                      }}
                    />
                  ) : item.type === "text" ? (
                    item.text
                  ) : item.mediaUrl ? (
                    "Media message"
                  ) : (
                    item.text
                  )}
                </div>

              );

            }

          )}

      </div>


      {/* =================================
          EMOJI PICKER
      ================================= */}

      {showEmojiPicker && (

        <div className="emoji-picker">


          {/* HEADER */}

          <div className="emoji-picker-header">

            <button

              type="button"

              className="emoji-close"

              onClick={() =>
                setShowEmojiPicker(false)
              }

            >

              <FiX />

            </button>


            <span>
              Emojis
            </span>

          </div>


          {/* CATEGORIES */}

          <div className="emoji-categories">


            <button

              type="button"

              className={
                emojiCategory === "smileys"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "smileys"
                )
              }

            >
              😊

            </button>


            <button

              type="button"

              className={
                emojiCategory === "people"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "people"
                )
              }

            >
              👋

            </button>


            <button

              type="button"

              className={
                emojiCategory === "animals"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "animals"
                )
              }

            >
              🐶

            </button>


            <button

              type="button"

              className={
                emojiCategory === "food"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "food"
                )
              }

            >
              🍕

            </button>


            <button

              type="button"

              className={
                emojiCategory === "activities"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "activities"
                )
              }

            >
              ⚽

            </button>


            <button

              type="button"

              className={
                emojiCategory === "travel"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "travel"
                )
              }

            >
              🚗

            </button>


            <button

              type="button"

              className={
                emojiCategory === "objects"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "objects"
                )
              }

            >
              💡

            </button>


            <button

              type="button"

              className={
                emojiCategory === "symbols"
                  ? "active"
                  : ""
              }

              onClick={() =>
                setEmojiCategory(
                  "symbols"
                )
              }

            >
              ❤️

            </button>

          </div>


          {/* EMOJI GRID */}

          <div className="emoji-grid">

            {emojiData[
              emojiCategory
            ].map(

              function(
                emoji,
                index
              ) {

                return (

                  <button

                    type="button"

                    className="emoji-item"

                    key={
                      `${emoji}-${index}`
                    }

                    onClick={() =>
                      addEmoji(emoji)
                    }

                  >

                    {emoji}

                  </button>

                );

              }

            )}

          </div>

        </div>

      )}


      {/* =================================
          MESSAGE INPUT
      ================================= */}

      <div className="chat-input-wrapper">

    {replyingTo && (

        <div
            className="chat-reply-bar"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                padding: "8px 12px",
                marginBottom: "6px",
                borderRadius: "10px",
                background:
                    "rgba(128,128,128,0.12)"
            }}
        >

            <div
                style={{
                    minWidth: 0,
                    flex: 1
                }}
            >

                <div
                    style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "2px"
                    }}
                >
                    {(() => {

                        const targetSender =
                            replyingTo?.sender?._id ||
                            replyingTo?.sender;

                        return String(
                            targetSender
                        ) ===
                        String(
                            localStorage.getItem(
                                "userId"
                            )
                        )
                            ? "Replying to yourself"
                            : "Replying to you";

                    })()}
                </div>

                <div
                    style={{
                        fontSize: "13px",
                        opacity: 0.75,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {getReplyPreview(
                        replyingTo
                    )}
                </div>

            </div>

            <button
                type="button"
                className="icon-btn"
                onClick={cancelReply}
                aria-label="Cancel reply"
            >
                <FiX />
            </button>

        </div>

    )}

    <div className="chat-input-box">


          {/* CAMERA */}

          <button

            type="button"

            className="icon-btn camera-btn"

            onClick={handleCamera}

            aria-label="Camera"

          >

            <FiCamera />

          </button>


          {/* INPUT */}

          <input

            type="text"

            value={message}

            placeholder="Message..."

            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }

            onKeyDown={handleKeyDown}

          />


          {/* RIGHT ICONS */}

          <div className="input-right-icons">


            {/* MIC */}

            <button

              type="button"

              className="icon-btn input-icon"

              onClick={
                handleVoiceMessage
              }

              aria-label="Voice message"

            >

              <FiMic />

            </button>


            {/* GALLERY */}

            <button

              type="button"

              className="icon-btn input-icon"

              onClick={handleGallery}

              aria-label="Gallery"

            >

              <FiImage />

            </button>


            {/* EMOJI */}

            <button

              type="button"

              className={

                showEmojiPicker

                  ? "icon-btn input-icon emoji-active"

                  : "icon-btn input-icon"

              }

              onClick={
                toggleEmojiPicker
              }

              aria-label="Emoji"

            >

              <FiSmile />

            </button>


            {/* SEND */}

            {message.trim() && (

              <button

                type="button"

                className="icon-btn input-icon send-icon"

                onClick={handleSend}

                disabled={sending}

                aria-label="Send"

              >

                <FiSend />

              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}


export default Chat;