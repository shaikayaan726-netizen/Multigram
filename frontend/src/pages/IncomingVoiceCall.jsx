import React, {
  useEffect,
  useRef
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  getCallSocket,
  getMyUserId,
  getUserIdFromUser,
  getUserAvatar,
  getUserName
} from "./callClient";


export default function IncomingVoiceCall() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user || null;
  const callId = location.state?.callId || "";

  const socketRef = useRef(null);
  const handledRef = useRef(false);


  useEffect(() => {

    const socket = getCallSocket();
    socketRef.current = socket;


    function handleCallEnded(data) {

      if (
        data?.callId &&
        data.callId !== callId
      ) {
        return;
      }

      if (handledRef.current) {
        return;
      }

      handledRef.current = true;

      navigate(
        "/chat",
        {
          replace: true,
          state: { user }
        }
      );
    }


    socket.on(
      "call:ended",
      handleCallEnded
    );


    return () => {
      socket.off(
        "call:ended",
        handleCallEnded
      );
    };

  }, [callId, user?.id, user?._id]);


  function accept() {

    if (handledRef.current) {
      return;
    }

    const socket = socketRef.current;
    const callerId = getUserIdFromUser(user);
    const myId = getMyUserId();

    if (!socket || !callId || !callerId || !myId) {
      return;
    }

    handledRef.current = true;

    console.log(
      "VOICE CALL ACCEPT:",
      {
        callId,
        from: myId,
        to: callerId
      }
    );

    socket.emit(
      "call:accept",
      {
        callId,
        from: myId,
        to: callerId,
        type: "voice"
      }
    );

    navigate(
      "/voice-call/active",
      {
        replace: true,
        state: {
          user,
          callId,
          isCaller: false
        }
      }
    );
  }


  function reject() {

    if (handledRef.current) {
      return;
    }

    const callerId = getUserIdFromUser(user);

    handledRef.current = true;

    socketRef.current?.emit(
      "call:reject",
      {
        callId,
        from: getMyUserId(),
        to: callerId,
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

    <div className="call-page incoming-call-page">

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

      <p>Incoming voice call</p>

      <div className="call-actions">

        <button
          type="button"
          className="call-reject"
          onClick={reject}
          aria-label="Reject call"
        >
          ✕
        </button>

        <button
          type="button"
          className="call-accept"
          onClick={accept}
          aria-label="Accept call"
        >
          📞
        </button>

      </div>

    </div>
  );
}
