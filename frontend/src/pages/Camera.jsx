import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

export default function Camera() {

const navigate = useNavigate();
const location = useLocation();

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const recorderRef = useRef(null);

  const chunksRef = useRef([]);

  const timerRef = useRef(null);


  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("none");

  const [recording, setRecording] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [facing, setFacing] =
    useState("user");


  useEffect(() => {

    startCamera();

    return () => {

      clearInterval(timerRef.current);

      stopCamera();

    };

  }, [facing]);


  function stopCamera() {

    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;

  }


  async function startCamera() {

    try {

      if (!navigator.mediaDevices?.getUserMedia) {

        setError(
          "Camera is not supported by this browser."
        );

        return;

      }


      stopCamera();


      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: {
            facingMode: facing
          },

          audio: true

        });


      streamRef.current = stream;


      if (videoRef.current) {

        videoRef.current.srcObject =
          stream;

      }


      setError("");

    } catch (err) {

      console.error(err);

      setError(
        "Camera permission denied. Allow camera and microphone access in Chrome."
      );

    }

  }


  function capturePhoto() {

    if (!videoRef.current) return;


    const video =
      videoRef.current;


    const canvas =
      document.createElement("canvas");


    canvas.width =
      video.videoWidth || 1080;

    canvas.height =
      video.videoHeight || 1920;


    const context =
      canvas.getContext("2d");


    context.filter =
      filter;


    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );


    canvas.toBlob(
      (blob) => {

        if (!blob) return;


        const url =
          URL.createObjectURL(blob);


        const file =
          new File(
            [blob],
            "camera-photo.jpg",
            {
              type: "image/jpeg"
            }
          );


        stopCamera();


        navigate("/media-editor", {

          state: {
            url,
            file
          }

        });

      },
      "image/jpeg",
      0.92
    );

  }


  function startRecording() {

    if (
      !streamRef.current ||
      recording
    ) return;


    chunksRef.current = [];


    let mimeType =
      "video/webm;codecs=vp9";


    if (
      !MediaRecorder.isTypeSupported(
        mimeType
      )
    ) {

      mimeType = "video/webm";

    }


    const recorder =
      new MediaRecorder(
        streamRef.current,
        {
          mimeType
        }
      );


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
              "video/webm"
          }
        );


      const url =
        URL.createObjectURL(blob);


      const file =
        new File(
          [blob],
          "camera-video.webm",
          {
            type: blob.type
          }
        );


      stopCamera();


    const fromChat =
  location.state?.fromChat;

if (fromChat) {

  navigate("/chat", {
    state: {
      user: location.state?.chatUser,
      selectedFiles: [file]
    }
  });

  return;

}

navigate("/media-editor", {

  state: {
    url,
    file
  }

});

    };


    recorder.start();

    setRecording(true);

    setSeconds(0);


    timerRef.current =
      setInterval(() => {

        setSeconds(
          (value) => value + 1
        );

      }, 1000);

  }


  function stopRecording() {

    clearInterval(
      timerRef.current
    );


    if (
      recorderRef.current &&
      recorderRef.current.state !==
        "inactive"
    ) {

      recorderRef.current.stop();

    }


    setRecording(false);

  }


  function handleShutter() {

    if (recording) {

      stopRecording();

    } else {

      capturePhoto();

    }

  }


  function toggleFacing() {

    if (recording) return;

    setFacing(
      (value) =>
        value === "user"
          ? "environment"
          : "user"
    );

  }


  return (

    <div className="camera-page">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-preview"
        style={{
          filter
        }}
      />


      <div className="camera-top">

        <button
          onClick={() => navigate(-1)}
        >
          ×
        </button>

        <button
          onClick={() =>
  navigate("/gallery", {
    state: {
      fromChat: location.state?.fromChat,
      chatUser: location.state?.chatUser
    }
  })
}
        >
          🖼 Gallery
        </button>

        <button
          onClick={toggleFacing}
        >
          🔄
        </button>

      </div>


      {error && (

        <div className="camera-error">

          <p>{error}</p>

          <button
            onClick={startCamera}
          >
            Try again
          </button>

        </div>

      )}


      <div className="camera-bottom">

        <button
  onClick={() =>
    navigate("/gallery", {
      state: {
        fromChat: location.state?.fromChat,
        chatUser: location.state?.chatUser
      }
    })
  }
>
  🖼
</button>


        <button
          className={
            recording
              ? "shutter recording"
              : "shutter"
          }
          onClick={handleShutter}
        >

          {recording
            ? seconds
            : "●"}

        </button>


        <button
          onClick={toggleFacing}
        >
          🔄
        </button>

      </div>

    </div>

  );

}