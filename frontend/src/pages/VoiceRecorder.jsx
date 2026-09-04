import React, {
  useRef,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { api } from "../utils/api";

export default function VoiceRecorder() {

  const navigate = useNavigate();
  const location = useLocation();

const user =
  location.state?.user || null;

  const recorderRef =
    useRef(null);

const [sending, setSending] =
  useState(false);
  const streamRef =
    useRef(null);

  const chunksRef =
    useRef([]);


  const [recording, setRecording] =
    useState(false);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [error, setError] =
    useState("");


  async function startRecording() {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });


      streamRef.current =
        stream;


      chunksRef.current = [];


      const recorder =
        new MediaRecorder(stream);


      recorderRef.current =
        recorder;


      recorder.ondataavailable =
        (event) => {

          if (event.data.size) {

            chunksRef.current.push(
              event.data
            );

          }

        };


      recorder.onstop = () => {

        const blob =
          new Blob(
            chunksRef.current,
            {
              type:
                recorder.mimeType ||
                "audio/webm"
            }
          );


        const url =
          URL.createObjectURL(blob);


        setAudioUrl(url);


        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

      };


      recorder.start();

      setRecording(true);

      setError("");

    } catch (err) {

      console.error(err);

      setError(
        "Microphone permission denied."
      );

    }

  }


  function stopRecording() {

    if (
      recorderRef.current?.state !==
      "inactive"
    ) {

      recorderRef.current.stop();

    }

    setRecording(false);

  }

async function handleDone() {
  if (!audioUrl) {
    return;
  }

  const receiver =
    location.state?.user?.id ||
    location.state?.user?._id;

  if (!receiver) {
    setError(
      "Receiver information not found."
    );
    return;
  }

  if (sending) {
    return;
  }

  try {
    setSending(true);
    setError("");

    const blob =
      new Blob(
        chunksRef.current,
        {
          type:
            recorderRef.current?.mimeType ||
            "audio/webm"
        }
      );

    const formData =
      new FormData();

    formData.append(
      "audio",
      blob,
      "voice-message.webm"
    );

    formData.append(
      "receiver",
      receiver
    );

    const replyTo =
      location.state?.replyTo;

    if (replyTo) {
      formData.append(
        "replyTo",
        replyTo
      );
    }

    const data =
      await api(
        "/messages/voice",
        {
          method: "POST",
          body: formData
        }
      );

    console.log(
      "VOICE MESSAGE SENT:",
      data
    );

    streamRef.current
      ?.getTracks()
      .forEach(
        (track) =>
          track.stop()
      );

    navigate(-1);

  }
  catch (error) {
    console.error(
      "SEND VOICE MESSAGE ERROR:",
      error
    );

    setError(
      error.message ||
      "Failed to send voice message"
    );
  }
  finally {
    setSending(false);
  }
}



function close() {

  streamRef.current
    ?.getTracks()
    .forEach(
      (track) =>
        track.stop()
    );

  if (user) {
    navigate("/chat", {
      state: {
        user
      }
    });
  } else {
    navigate(-1);
  }

}


  return (

    <div className="voice-recorder-page">

      <button onClick={close}>
        ←
      </button>


      <h1>Voice message</h1>


      {error && (
        <p>{error}</p>
      )}


      <button
        className={
          recording
            ? "recording"
            : ""
        }
        onClick={
          recording
            ? stopRecording
            : startRecording
        }
      >

        {recording
          ? "Stop"
          : "Record"}

      </button>


      {audioUrl && (

        <div>

          <audio
            src={audioUrl}
            controls
          />

          <button
  onClick={handleDone}
  disabled={sending}
>
  {sending ? "Sending..." : "Done"}
</button>

        </div>

      )}

    </div>

  );

}