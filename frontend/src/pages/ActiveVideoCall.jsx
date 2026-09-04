import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket, connectSocket } from "../utils/socket";

function getMyUserId() {
    try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return String(
            localStorage.getItem("userId") ||
            storedUser?.id ||
            storedUser?._id ||
            storedUser?.userId ||
            ""
        );
    } catch {
        return String(localStorage.getItem("userId") || "");
    }
}

function getUserName(user) {
    return user?.username || user?.name || user?.fullName || "User";
}

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

export default function ActiveVideoCall() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || null;
    const callId = location.state?.callId || "";
    const isCaller = location.state?.isCaller === true;

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const pendingIceRef = useRef([]);
    const remoteDescriptionSetRef = useRef(false);
    const mediaPromiseRef = useRef(null);
    const offerStartedRef = useRef(false);
    const endedRef = useRef(false);
    const aliveRef = useRef(false);

const connectionStartRef =
    useRef(null);

    const [status, setStatus] = useState("Connecting...");
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [remoteConnected, setRemoteConnected] = useState(false);
    
    const [seconds, setSeconds] = useState(0);
    const otherUserId = String(user?.id || user?._id || user?.userId || "");

    async function attachLocalVideo(stream) {
        if (!localVideoRef.current || !stream) return;
        localVideoRef.current.srcObject = stream;
        try {
            await localVideoRef.current.play();
        } catch (error) {
            console.warn("LOCAL VIDEO PLAY ERROR:", error);
        }
    }

    async function attachRemoteVideo(stream) {

    if (
        !remoteVideoRef.current ||
        !stream
    ) {
        return;
    }

    remoteVideoRef.current.srcObject =
        stream;

    if (!connectionStartRef.current) {

        connectionStartRef.current =
            Date.now();

    }

    setRemoteConnected(true);

    setStatus("Connected");
        try {
            await remoteVideoRef.current.play();
        } catch (error) {
            console.warn("REMOTE VIDEO PLAY ERROR:", error);
        }
    }

    function createPeer() {
        if (peerRef.current) return peerRef.current;

        console.log("CREATING RTCPeerConnection");
        const peer = new RTCPeerConnection(ICE_SERVERS);
        peerRef.current = peer;

        peer.ontrack = (event) => {
            console.log("WEBRTC REMOTE TRACK:", event.track?.kind);

            if (!remoteStreamRef.current) {
                remoteStreamRef.current = new MediaStream();
            }

            if (!remoteStreamRef.current.getTracks().some((t) => t.id === event.track.id)) {
                remoteStreamRef.current.addTrack(event.track);
            }

            attachRemoteVideo(remoteStreamRef.current);
        };

        peer.onicecandidate = (event) => {
            if (!event.candidate || !otherUserId || !callId) return;
            socket.emit("webrtc:ice-candidate", {
                callId,
                from: getMyUserId(),
                to: otherUserId,
                type: "video",
                candidate: event.candidate
            });
        };

        peer.onconnectionstatechange = () => {
            console.log("WEBRTC CONNECTION STATE:", peer.connectionState);
            if (peer.connectionState === "connected") setStatus("Connected");
            else if (peer.connectionState === "failed") setStatus("Connection failed");
            else if (peer.connectionState === "disconnected") setStatus("Connection interrupted");
            else if (peer.connectionState === "connecting" || peer.connectionState === "new") setStatus("Connecting...");
        };

        peer.oniceconnectionstatechange = () => {
            console.log("WEBRTC ICE STATE:", peer.iceConnectionState);
        };

        return peer;
    }

    async function startLocalMedia() {
        if (localStreamRef.current) {
            await attachLocalVideo(localStreamRef.current);
            return localStreamRef.current;
        }

        if (mediaPromiseRef.current) return mediaPromiseRef.current;

        if (!navigator.mediaDevices?.getUserMedia) {
            setStatus("Camera/microphone unavailable");
            return null;
        }

        mediaPromiseRef.current = navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30, max: 30 }
            },
            audio: true
        }).then(async (stream) => {
            if (!aliveRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return null;
            }
            localStreamRef.current = stream;
            console.log("LOCAL MEDIA READY:", stream.getTracks().map((track) => ({
                kind: track.kind,
                enabled: track.enabled,
                readyState: track.readyState
            })));
            await attachLocalVideo(stream);
            return stream;
        }).catch((error) => {
            console.error("GET USER MEDIA ERROR:", error);
            if (error?.name === "NotAllowedError") setStatus("Camera / microphone permission denied");
            else if (error?.name === "NotFoundError") setStatus("Camera or microphone not found");
            else if (error?.name === "NotReadableError") setStatus("Camera or microphone is already in use");
            else if (error?.name === "SecurityError") setStatus("Secure connection required");
            else setStatus("Camera or microphone unavailable");
            return null;
        }).finally(() => {
            mediaPromiseRef.current = null;
        });

        return mediaPromiseRef.current;
    }

    function addLocalTracks(peer, stream) {
        if (!peer || !stream) return;
        for (const track of stream.getTracks()) {
            const exists = peer.getSenders().some((sender) => sender.track?.id === track.id);
            if (!exists) {
                console.log("ADDING LOCAL TRACK:", track.kind);
                peer.addTrack(track, stream);
            }
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
                console.warn("ICE CANDIDATE ERROR:", error);
            }
        }
    }

    async function createOffer() {
        if (offerStartedRef.current || !aliveRef.current) return;
        offerStartedRef.current = true;

        try {
            const peer = peerRef.current || createPeer();
            const stream = await startLocalMedia();
            if (!stream) {
                offerStartedRef.current = false;
                return;
            }

            addLocalTracks(peer, stream);

            if (peer.getSenders().length === 0) {
                throw new Error("No local media tracks available");
            }

            console.log("CREATING VIDEO OFFER");
            const offer = await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await peer.setLocalDescription(offer);

            socket.emit("webrtc:offer", {
                callId,
                from: getMyUserId(),
                to: otherUserId,
                type: "video",
                offer: peer.localDescription
            });

            console.log("WEBRTC VIDEO OFFER SENT:", { callId });
        } catch (error) {
            offerStartedRef.current = false;
            console.error("CREATE OFFER ERROR:", error);
            setStatus("Unable to start video");
        }
    }

    async function handleOffer(data) {
        try {
            console.log("WEBRTC VIDEO OFFER RECEIVED:", data);
            const peer = peerRef.current || createPeer();
            const stream = await startLocalMedia();
            if (!stream) return;

            addLocalTracks(peer, stream);
            await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
            remoteDescriptionSetRef.current = true;
            await flushPendingIce();

            const answer = await peer.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await peer.setLocalDescription(answer);

            socket.emit("webrtc:answer", {
                callId,
                from: getMyUserId(),
                to: otherUserId,
                type: "video",
                answer: peer.localDescription
            });
            console.log("WEBRTC VIDEO ANSWER SENT:", { callId });
        } catch (error) {
            console.error("HANDLE OFFER ERROR:", error);
            setStatus("Unable to connect video");
        }
    }

    async function handleAnswer(data) {
        try {
            const peer = peerRef.current;
            if (!peer) return;
            await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
            remoteDescriptionSetRef.current = true;
            await flushPendingIce();
            console.log("REMOTE ANSWER SET");
        } catch (error) {
            console.error("HANDLE ANSWER ERROR:", error);
            setStatus("Unable to connect video");
        }
    }

    async function handleIceCandidate(data) {
        if (!data?.candidate) return;
        const peer = peerRef.current;
        if (!peer?.remoteDescription) {
            pendingIceRef.current.push(data.candidate);
            return;
        }
        try {
            await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
            console.warn("ADD ICE ERROR:", error);
        }
    }

    function cleanupCall() {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        remoteStreamRef.current = null;
        pendingIceRef.current = [];
        remoteDescriptionSetRef.current = false;
        offerStartedRef.current = false;
        mediaPromiseRef.current = null;

        if (peerRef.current) {
            try {
                peerRef.current.close();
            } catch {}
            peerRef.current = null;
        }

        if (localVideoRef.current) {
            localVideoRef.current.pause();
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.pause();
            remoteVideoRef.current.srcObject = null;
        }
        setRemoteConnected(false);
    }

    useEffect(() => {
        aliveRef.current = true;

        if (!callId || !otherUserId) {
            setStatus("Invalid call");
            return () => {};
        }

        connectSocket();
        createPeer();

        // Register every WebRTC listener BEFORE requesting camera/microphone.
        const handleCallReady = (data) => {
            if (
                data?.callId !== callId ||
                !isCaller ||
                String(data?.to) !== String(getMyUserId())
            ) return;

            console.log("VIDEO CALL READY RECEIVED:", data);
            createOffer();
        };

        const handleOfferEvent = (data) => {
            if (
                data?.callId !== callId ||
                String(data?.to) !== String(getMyUserId()) ||
                !data?.offer
            ) return;
            handleOffer(data);
        };

        const handleAnswerEvent = (data) => {
            if (
                data?.callId !== callId ||
                String(data?.to) !== String(getMyUserId()) ||
                !data?.answer
            ) return;
            handleAnswer(data);
        };

        const handleIceEvent = (data) => {
            if (
                data?.callId !== callId ||
                String(data?.to) !== String(getMyUserId())
            ) return;
            handleIceCandidate(data);
        };

        const handleEnded = (data) => {
            if (data?.callId && data.callId !== callId) return;
            if (endedRef.current) return;
            endedRef.current = true;
            cleanupCall();
            navigate("/chat", { replace: true, state: { user } });
        };

        socket.on("call:ready", handleCallReady);
        socket.on("webrtc:offer", handleOfferEvent);
        socket.on("webrtc:answer", handleAnswerEvent);
        socket.on("webrtc:ice-candidate", handleIceEvent);
        socket.on("call:ended", handleEnded);

        async function prepare() {
            const stream = await startLocalMedia();
            if (!aliveRef.current || !stream) return;
            addLocalTracks(peerRef.current, stream);

            if (!isCaller) {
                socket.emit("call:ready", {
                    callId,
                    from: getMyUserId(),
                    to: otherUserId,
                    type: "video"
                });
                console.log("VIDEO CALL READY SENT:", { callId, from: getMyUserId(), to: otherUserId });
            }
        }

        prepare();

return () => {
            aliveRef.current = false;
            socket.off("call:ready", handleCallReady);
            socket.off("webrtc:offer", handleOfferEvent);
            socket.off("webrtc:answer", handleAnswerEvent);
            socket.off("webrtc:ice-candidate", handleIceEvent);
            socket.off("call:ended", handleEnded);
            cleanupCall();
        };
    }, [callId, isCaller, otherUserId]);

    useEffect(() => {
        if (!remoteConnected || !connectionStartRef.current) return;

        const timer = setInterval(() => {
            if (!connectionStartRef.current) return;

            setSeconds(
                Math.floor(
                    (Date.now() - connectionStartRef.current) / 1000
                )
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [remoteConnected]);

    function endCall() {
        if (endedRef.current) return;
        endedRef.current = true;
       socket.emit("call:end", {

    callId,

    from:
        getMyUserId(),

    to:
        otherUserId,

    type:
        "video",

    duration:
        connectionStartRef.current
            ? Math.floor(
                (
                    Date.now() -
                    connectionStartRef.current
                ) / 1000
            )
            : 0

});
        cleanupCall();
        navigate("/chat", { replace: true, state: { user } });
    }

    function toggleMute() {
        const next = !muted;
        localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; });
        setMuted(next);
    }

    function toggleCamera() {
        const next = !cameraOff;
        localStreamRef.current?.getVideoTracks().forEach((track) => { track.enabled = !next; });
        setCameraOff(next);
    }

    const name = getUserName(user);

    return (
        <div className="call-page active-video-call">
            <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline />

            {!remoteConnected && (
                <div className="remote-video-placeholder">
                    <div className="call-avatar">
                        <div className="chat-default-avatar">{name.charAt(0).toUpperCase()}</div>
                    </div>
                    <h1>{name}</h1>
                    <p>{status}</p>
                </div>
            )}

            <video ref={localVideoRef} className="local-video" autoPlay muted playsInline />

         <div className="video-call-status">

    {status}

    {remoteConnected && (
        <>
            {" · "}
            {Math.floor(seconds / 60)}:
            {String(
                seconds % 60
            ).padStart(2, "0")}
        </>
    )}

</div>

            <div className="call-actions video-call-actions">
                <button className="call-control" type="button" onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
                    {muted ? "🔇" : "🎙️"}
                </button>
                <button className="call-control" type="button" onClick={toggleCamera} title={cameraOff ? "Turn camera on" : "Turn camera off"}>
                    {cameraOff ? "🚫" : "📹"}
                </button>
                <button className="call-end" type="button" onClick={endCall} title="End call">☎</button>
            </div>
        </div>
    );
}
