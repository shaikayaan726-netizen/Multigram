import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  getCallSocket,
  getMyUserId,
  getMyUser,
  getUserIdFromUser,
  getUserAvatar,
  getUserName
} from "./callClient";


export default function VoiceCall() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user || null;

  const socketRef = useRef(null);
  const callIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
  );
  const endedRef = useRef(false);
  const redirectTimerRef = useRef(null);

  const [status, setStatus] = useState("Calling...");


  useEffect(() => {

    const receiverId = getUserIdFromUser(user);

    if (!receiverId) {

      console.error(
        "VOICE CALL: Receiver user ID missing",
        user
      );

      setStatus("User information not found");
      return () => {};
    }


    const socket = getCallSocket();
    socketRef.current = socket;


    const callerId = getMyUserId();
    const currentUser = getMyUser() || {};

    if (!callerId) {
      console.error("VOICE CALL: Caller user ID missing");
      setStatus("Login information not found");
      return () => {};
    }


    const callerUser = {
      ...currentUser,
      id: callerId
    };


    const callData = {
      callId: callIdRef.current,
      callerId,
      receiverId,
      type: "voice",
      user: callerUser
    };


    console.log(
      "VOICE CALL INITIATE:",
      callData
    );


    function onAccepted(data) {

      if (
        data?.callId &&
        data.callId !== callIdRef.current
      ) {
        return;
      }

      console.log(
        "VOICE CALL ACCEPTED:",
        data
      );

      navigate(
        "/voice-call/active",
        {
          replace: true,
          state: {
            user,
            callId:
              data?.callId || callIdRef.current,
            isCaller: true
          }
        }
      );
    }


    function onRejected(data) {

      if (
        data?.callId &&
        data.callId !== callIdRef.current
      ) {
        return;
      }

      console.log("VOICE CALL REJECTED");
      setStatus("Call declined");

      redirectTimerRef.current = setTimeout(() => {
        navigate(
          "/chat",
          {
            replace: true,
            state: { user }
          }
        );
      }, 900);
    }


    function onEnded(data) {

      if (
        data?.callId &&
        data.callId !== callIdRef.current
      ) {
        return;
      }

      if (endedRef.current) {
        return;
      }

      endedRef.current = true;

      navigate(
        "/chat",
        {
          replace: true,
          state: { user }
        }
      );
    }


    socket.on("call:accepted", onAccepted);
    socket.on("call:rejected", onRejected);
    socket.on("call:ended", onEnded);


    function initiateCall() {

      if (endedRef.current) {
        return;
      }

      console.log(
        "VOICE SOCKET READY:",
        socket.id
      );

      socket.emit(
        "call:initiate",
        callData
      );
    }


    if (socket.connected) {
      initiateCall();
    } else {
      socket.once("connect", initiateCall);
    }


    return () => {

      socket.off("call:accepted", onAccepted);
      socket.off("call:rejected", onRejected);
      socket.off("call:ended", onEnded);
      socket.off("connect", initiateCall);

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };

  }, [user?.id, user?._id]);


  function endCall() {

    if (endedRef.current) {
      return;
    }

    endedRef.current = true;

    const receiverId = getUserIdFromUser(user);

    socketRef.current?.emit(
      "call:end",
      {
        callId: callIdRef.current,
        from: getMyUserId(),
        to: receiverId,
        type: "voice"
      }
    );

    navigate(
      "/chat",
      {
        replace: true,
        state: { user }
      }
    );
  }


  const avatar = getUserAvatar(user);
  const name = getUserName(user);


  return (

    <div className="call-page">

      <div className="call-avatar">

        {avatar ? (

          <img
            src={avatar}
            alt={name}
          />

        ) : (

          <div className="chat-default-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

        )}

      </div>

      <h1>{name}</h1>

      <p>{status}</p>

      <button
        type="button"
        className="call-end"
        onClick={endCall}
        aria-label="End call"
      >
        ☎
      </button>

    </div>
  );
}
