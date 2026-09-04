import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiX,
  FiSettings,
  FiMusic,
  FiZap,
  FiClock,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";


function ReelCamera({
  onClose,
  onGallery,
  onSettings,
  onMusic,
  onEffects,
  onCapture,

  duration = 90,
  timer = 0,
  muted = false,
}) {

  const video = useRef(null);
  const stream = useRef(null);
  const rec = useRef(null);
  const chunks = useRef([]);
  const interval = useRef(null);
  const countdownTimer = useRef(null);

  const [ready, setReady] =
    useState(false);

  const [facing, setFacing] =
    useState("environment");

  const [recording, setRecording] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [count, setCount] =
    useState(0);

  const [soundMuted, setSoundMuted] =
    useState(muted);


  // ===============================
  // CAMERA
  // ===============================

  useEffect(() => {

    start();

    return () => {
      stop();
    };

  }, [facing]);


  // ===============================
  // MAX DURATION
  // ===============================

  useEffect(() => {

    if (
      recording &&
      seconds >= duration
    ) {
      stopRecording();
    }

  }, [
    seconds,
    duration,
    recording,
  ]);


  async function start() {

    stop();

    try {

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
          },

          audio: true,
        });


      stream.current =
        mediaStream;


      if (video.current) {
        video.current.srcObject =
          mediaStream;
      }


      setReady(true);

    } catch (error) {

      console.error(error);

      setReady(false);

    }
  }


  function stop() {

    stream.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    stream.current = null;

    clearInterval(
      interval.current
    );

    clearInterval(
      countdownTimer.current
    );
  }


  // ===============================
  // START RECORDING
  // ===============================

  function startRec() {

    if (
      !stream.current ||
      recording
    ) {
      return;
    }


    chunks.current = [];


    let mimeType =
      "video/webm";


    if (
      MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp9,opus"
      )
    ) {

      mimeType =
        "video/webm;codecs=vp9,opus";

    }


    const recorder =
      new MediaRecorder(
        stream.current,
        {
          mimeType,
        }
      );


    recorder.ondataavailable =
      (event) => {

        if (event.data.size) {

          chunks.current.push(
            event.data
          );

        }

      };


    recorder.onstop = () => {

      const blob =
        new Blob(
          chunks.current,
          {
            type:
              recorder.mimeType ||
              "video/webm",
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      onCapture({
        file: new File(
          [blob],
          "reel-video.webm",
          {
            type: blob.type,
          }
        ),

        url,

        type: "video",
      });


      setRecording(false);
      setSeconds(0);

    };


    rec.current =
      recorder;


    recorder.start(200);


    setRecording(true);
    setSeconds(0);


    interval.current =
      setInterval(() => {

        setSeconds(
          (value) =>
            value + 1
        );

      }, 1000);

  }


  // ===============================
  // STOP RECORDING
  // ===============================

  function stopRecording() {

    clearInterval(
      interval.current
    );


    if (
      rec.current &&
      rec.current.state !==
        "inactive"
    ) {

      rec.current.stop();

    }

  }


  // ===============================
  // SHUTTER
  // ===============================

  function handlePointerDown(
    event
  ) {

    event.preventDefault();

    if (recording) return;


    if (!timer) {

      startRec();

      return;

    }


    setCount(timer);


    let remaining =
      timer;


    countdownTimer.current =
      setInterval(() => {

        remaining -= 1;

        setCount(
          remaining
        );


        if (remaining <= 0) {

          clearInterval(
            countdownTimer.current
          );

          setCount(0);

          startRec();

        }

      }, 1000);

  }


  function handlePointerUp(
    event
  ) {

    event.preventDefault();


    clearInterval(
      countdownTimer.current
    );


    setCount(0);


    if (recording) {

      stopRecording();

    }

  }


  function flipCamera() {

    if (recording) return;

    setFacing(
      (value) =>
        value === "environment"
          ? "user"
          : "environment"
    );

  }


  return (
    <div className="reel-camera-page">

      {/* CAMERA */}

      {ready ? (

        <video
          ref={video}
          autoPlay
          muted
          playsInline
        />

      ) : (

        <div className="camera-error">

          <p>
            Camera unavailable
          </p>

          <button
            type="button"
            onClick={onGallery}
          >
            Open gallery
          </button>

        </div>

      )}


      {/* TOP */}

      <div className="camera-top">

        <button
          type="button"
          onClick={onClose}
        >
          <FiX />
        </button>


        <div>

          <button
            type="button"
            onClick={() =>
              setSoundMuted(
                (value) => !value
              )
            }
          >

            {soundMuted
              ? <FiVolumeX />
              : <FiVolume2 />
            }

          </button>


          <b>1×</b>


          <button
            type="button"
            onClick={onSettings}
          >
            <FiClock />
          </button>

        </div>


        <button
          type="button"
          onClick={onSettings}
        >
          <FiSettings />
        </button>

      </div>


      {/* AUDIO */}

      <button
        type="button"
        className="add-audio"

        onClick={() =>
          onMusic?.({
            title:
              "Original audio",

            artist:
              "Your reel",
          })
        }
      >

        <FiMusic />

        Add audio

      </button>


      {/* TOOLS */}

      <div className="camera-tools">

        <button
          type="button"
          onClick={() =>
            onMusic?.({
              title:
                "Trending audio",

              artist:
                "Instagram music",
            })
          }
        >

          <FiMusic />

          <small>
            Music
          </small>

        </button>


        <button
          type="button"
          onClick={() =>
            onEffects?.()
          }
        >

          <FiZap />

          <small>
            Effects
          </small>

        </button>


        <button
          type="button"
          onClick={onSettings}
        >

          <FiClock />

          <small>
            Timer
          </small>

        </button>

      </div>


      {/* COUNTDOWN */}

      {count > 0 && (

        <strong className="countdown">
          {count}
        </strong>

      )}


      {/* BOTTOM */}

      <div className="camera-bottom">

        <button
          type="button"
          onClick={onGallery}
          className="gallery-preview"
        />


        <button
          type="button"

          className={
            recording
              ? "record recording"
              : "record"
          }

          onPointerDown={
            handlePointerDown
          }

          onPointerUp={
            handlePointerUp
          }

          onPointerCancel={
            handlePointerUp
          }

          onContextMenu={(event) =>
            event.preventDefault()
          }
        >

          <span />

        </button>


        <button
          type="button"
          className="flip"
          onClick={flipCamera}
        >

          <FiRotateCcw />

        </button>

      </div>

    </div>
  );
}


export default ReelCamera;