import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getCallSocket,
    getMyUserId,
    getUserAvatar,
    getUserName
} from "./callClient";

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]
};

if (
    import.meta.env.VITE_TURN_URL &&
    import.meta.env.VITE_TURN_USERNAME &&
    import.meta.env.VITE_TURN_CREDENTIAL
) {
    ICE_SERVERS.iceServers.push({
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL
    });
}

export default function ActiveVoiceCall() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || null;
    const callId = location.state?.callId || "";
    const isCaller = location.state?.isCaller === true;

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const streamRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const pendingIceRef = useRef([]);
    const mediaPromiseRef = useRef(null);
    const remoteDescriptionSetRef = useRef(false);
    const remoteStreamRef = useRef(null);
    const offerStartedRef = useRef(false);
    const aliveRef = useRef(false);
    const endedRef = useRef(false);
    const startTimeRef = useRef(Date.now());
    const connectedRef = useRef(false);
    const [muted, setMuted] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState("Connecting...");

    const otherUserId = String(user?.id || user?._id || user?.userId || "");

    function cleanupMedia() {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        pendingIceRef.current = [];
        remoteDescriptionSetRef.current = false;
        offerStartedRef.current = false;
        mediaPromiseRef.current = null;

        if (peerRef.current) {
            try { peerRef.current.close(); } catch {}
            peerRef.current = null;
        }

        remoteStreamRef.current = null;

        if (remoteAudioRef.current) {
            remoteAudioRef.current.pause();
            remoteAudioRef.current.srcObject = null;
        }
    }

    async function flushPendingIce() {
        const peer = peerRef.current;
        if (!peer?.remoteDescription) return;
        const candidates = pendingIceRef.current.splice(0);
        for (const candidate of candidates) {
            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.warn("VOICE ICE ERROR:", error);
            }
        }
    }

    function createPeer(socket) {
        if (peerRef.current) return peerRef.current;

        const peer = new RTCPeerConnection(ICE_SERVERS);
        peerRef.current = peer;

        peer.onicecandidate = (event) => {
            if (!event.candidate || !callId || !otherUserId) return;
            socket.emit("webrtc:ice-candidate", {
                callId,
                from: getMyUserId(),
                to: otherUserId,
                type: "voice",
                candidate: event.candidate
            });
        };

        peer.ontrack = async (event) => {
            console.log("VOICE WEBRTC REMOTE TRACK:", event.track?.kind);

            let stream = event.streams?.[0];

            if (!stream) {
                if (!remoteStreamRef.current) {
                    remoteStreamRef.current = new MediaStream();
                }

                const alreadyThere = remoteStreamRef.current
                    .getTracks()
                    .some((track) => track.id === event.track.id);

                if (!alreadyThere) {
                    remoteStreamRef.current.addTrack(event.track);
                }

                stream = remoteStreamRef.current;
            } else {
                remoteStreamRef.current = stream;
            }

            const audio = remoteAudioRef.current;

            if (!audio) return;

            if (audio.srcObject !== stream) {
                audio.srcObject = stream;
            }

            audio.autoplay = true;
            audio.playsInline = true;

            try {
               await audio.play();

if (!connectedRef.current) {
    connectedRef.current = true;
    startTimeRef.current = Date.now();
    setSeconds(0);
}

setStatus("Connected");
console.log("VOICE REMOTE AUDIO PLAYING");
            } catch (error) {
                console.warn("REMOTE AUDIO PLAY ERROR:", error);
                setStatus("Tap to enable audio");
            }
        };

        peer.onconnectionstatechange = () => {
    console.log("VOICE WEBRTC CONNECTION STATE:", peer.connectionState);

    if (peer.connectionState === "connected") {
        if (!connectedRef.current) {
            connectedRef.current = true;
            startTimeRef.current = Date.now();
            setSeconds(0);
        }

        setStatus("Connected");
    } else if (peer.connectionState === "failed") {
        setStatus("Connection failed");
    } else if (peer.connectionState === "disconnected") {
        setStatus("Connection interrupted");
    } else if (
        peer.connectionState === "connecting" ||
        peer.connectionState === "new"
    ) {
        setStatus("Connecting...");
    }
};

        peer.oniceconnectionstatechange = () => {
            console.log("VOICE WEBRTC ICE STATE:", peer.iceConnectionState);
        };

        return peer;
    }

    async function startLocalAudio(socket) {
        if (streamRef.current) return streamRef.current;
        if (mediaPromiseRef.current) return mediaPromiseRef.current;

        if (!navigator.mediaDevices?.getUserMedia) {
            setStatus("Microphone unavailable");
            return null;
        }

        mediaPromiseRef.current = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                if (!aliveRef.current) {
                    stream.getTracks().forEach((track) => track.stop());
                    return null;
                }

                streamRef.current = stream;
                const peer = createPeer(socket);

                for (const track of stream.getTracks()) {
                    if (!peer.getSenders().some((sender) => sender.track?.id === track.id)) {
                        peer.addTrack(track, stream);
                    }
                }

                console.log("VOICE LOCAL MEDIA READY");
                return stream;
            })
            .catch((error) => {
                console.error("VOICE MEDIA ERROR:", error);
                if (error?.name === "NotAllowedError") setStatus("Microphone permission denied");
                else if (error?.name === "NotFoundError") setStatus("Microphone not found");
                else if (error?.name === "NotReadableError") setStatus("Microphone is already in use");
                else if (error?.name === "SecurityError") setStatus("Secure connection required");
                else setStatus("Microphone unavailable");
                return null;
            })
            .finally(() => {
                mediaPromiseRef.current = null;
            });

        return mediaPromiseRef.current;
    }

    useEffect(() => {
        aliveRef.current = true;
        const socket = getCallSocket();
        socketRef.current = socket;

        if (!callId || !otherUserId) {
            setStatus("Invalid call");
            return () => {};
        }

        // Register signaling handlers BEFORE requesting microphone.
        const handleCallReady = async (data) => {
            if (
                data?.callId !== callId ||
                !isCaller ||
                String(data?.to) !== String(getMyUserId())
            ) return;

            if (offerStartedRef.current) return;
            offerStartedRef.current = true;

            try {
                const peer = createPeer(socket);
                const stream = await startLocalAudio(socket);
                if (!stream) {
                    offerStartedRef.current = false;
                    return;
                }

                const offer = await peer.createOffer({ offerToReceiveAudio: true });
                await peer.setLocalDescription(offer);

                socket.emit("webrtc:offer", {
                    callId,
                    from: getMyUserId(),
                    to: otherUserId,
                    type: "voice",
                    offer: peer.localDescription
                });

                console.log("VOICE OFFER SENT:", callId);
            } catch (error) {
                offerStartedRef.current = false;
                console.error("VOICE OFFER ERROR:", error);
                setStatus("Could not start the voice connection");
            }
        };

        const handleOffer = async (data) => {
            if (
                data?.callId !== callId ||
                isCaller ||
                String(data?.to) !== String(getMyUserId()) ||
                !data?.offer
            ) return;

            try {
                const peer = createPeer(socket);
                const stream = await startLocalAudio(socket);
                if (!stream) return;

                await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
                remoteDescriptionSetRef.current = true;
                await flushPendingIce();

                const answer = await peer.createAnswer({ offerToReceiveAudio: true });
                await peer.setLocalDescription(answer);

                socket.emit("webrtc:answer", {
                    callId,
                    from: getMyUserId(),
                    to: otherUserId,
                    type: "voice",
                    answer: peer.localDescription
                });

                console.log("VOICE ANSWER SENT:", callId);
            } catch (error) {
                console.error("VOICE OFFER HANDLE ERROR:", error);
                setStatus("Could not connect the voice call");
            }
        };

        const handleAnswer = async (data) => {
            if (
                data?.callId !== callId ||
                !isCaller ||
                String(data?.to) !== String(getMyUserId()) ||
                !data?.answer
            ) return;

            try {
                const peer = peerRef.current;
                if (!peer) return;
                await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
                remoteDescriptionSetRef.current = true;
                await flushPendingIce();
                console.log("VOICE REMOTE ANSWER SET");
            } catch (error) {
                console.error("VOICE ANSWER ERROR:", error);
                setStatus("Could not complete the voice connection");
            }
        };

        const handleIce = async (data) => {
            if (
                data?.callId !== callId ||
                String(data?.to) !== String(getMyUserId()) ||
                !data?.candidate
            ) return;

            const peer = peerRef.current;
            if (!peer?.remoteDescription) {
                pendingIceRef.current.push(data.candidate);
                return;
            }

            try {
                await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.warn("VOICE ICE ERROR:", error);
            }
        };

        const handleEnded = (data) => {
            if (data?.callId && data.callId !== callId) return;
            if (endedRef.current) return;
            endedRef.current = true;
            cleanupMedia();
            navigate("/chat", { replace: true, state: { user } });
        };

        socket.on("call:ready", handleCallReady);
        socket.on("webrtc:offer", handleOffer);
        socket.on("webrtc:answer", handleAnswer);
        socket.on("webrtc:ice-candidate", handleIce);
        socket.on("call:ended", handleEnded);

        createPeer(socket);

        async function prepare() {
            const stream = await startLocalAudio(socket);
            if (!aliveRef.current || !stream) return;

            if (!isCaller) {
                socket.emit("call:ready", {
                    callId,
                    from: getMyUserId(),
                    to: otherUserId,
                    type: "voice"
                });
                console.log("VOICE CALL READY SENT:", callId);
            }
        }

        prepare();
const timer = setInterval(() => {
    if (!connectedRef.current || !startTimeRef.current) return;

    setSeconds(
        Math.floor((Date.now() - startTimeRef.current) / 1000)
    );
}, 1000);

        return () => {
            aliveRef.current = false;
            clearInterval(timer);
            socket.off("call:ready", handleCallReady);
            socket.off("webrtc:offer", handleOffer);
            socket.off("webrtc:answer", handleAnswer);
            socket.off("webrtc:ice-candidate", handleIce);
            socket.off("call:ended", handleEnded);
            cleanupMedia();
        };
    }, [callId, isCaller, otherUserId]);

    async function enableRemoteAudio() {
        const audio = remoteAudioRef.current;
        if (!audio || !audio.srcObject) return;

        try {
            await audio.play();
            setStatus("Connected");
        } catch (error) {
            console.warn("ENABLE REMOTE AUDIO ERROR:", error);
        }
    }

    function endCall() {
        if (endedRef.current) return;
        endedRef.current = true;
        socketRef.current?.emit("call:end", {
            callId,
            from: getMyUserId(),
            to: otherUserId,
            type: "voice",
            duration: seconds
        });
        cleanupMedia();
        navigate("/chat", { replace: true, state: { user } });
    }

    function toggleMute() {
        const next = !muted;
        streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; });
        setMuted(next);
    }

    const avatar = getUserAvatar(user);
    const name = getUserName(user);
    const minutes = Math.floor(seconds / 60);
    const remaining = String(seconds % 60).padStart(2, "0");

    return (
        <div className="call-page active-call-page">
            <audio ref={remoteAudioRef} autoPlay playsInline />

            <div className="voice-call-content">
                <div className="call-avatar">
                    {avatar ? <img src={avatar} alt={name} /> : <div className="chat-default-avatar">{name.charAt(0).toUpperCase()}</div>}
                </div>

                <h1>{name}</h1>
                <p>{status} · {minutes}:{remaining}</p>

                {status === "Tap to enable audio" && (
                    <button
                        type="button"
                        className="voice-enable-audio"
                        onClick={enableRemoteAudio}
                    >
                        🔊 Enable audio
                    </button>
                )}
            </div>

            <div className="call-controls voice-call-controls">
                <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute microphone" : "Mute microphone"}>
                    {muted ? "🔇" : "🎙"}
                </button>
                <button type="button" className="call-end" onClick={endCall} aria-label="End call">☎</button>
            </div>
        </div>
    );
}
