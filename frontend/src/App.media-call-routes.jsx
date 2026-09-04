// Add these imports to App.jsx
import Gallery from "./pages/Gallery";
import MediaEditor from "./pages/MediaEditor";
import Camera from "./pages/Camera";
import VoiceRecorder from "./pages/VoiceRecorder";
import VoiceCall from "./pages/VoiceCall";
import IncomingVoiceCall from "./pages/IncomingVoiceCall";
import ActiveVoiceCall from "./pages/ActiveVoiceCall";
import VideoCall from "./pages/VideoCall";
import IncomingVideoCall from "./pages/IncomingVideoCall";
import ActiveVideoCall from "./pages/ActiveVideoCall";

// Add these routes inside <Routes>
<Route path="/gallery" element={<Gallery />} />
<Route path="/mediaeditor" element={<MediaEditor />} />
<Route path="/camera" element={<Camera />} />
<Route path="/voicerecorder" element={<VoiceRecorder />} />
<Route path="/voicecall" element={<VoiceCall />} />
<Route path="/incomingvoicecall" element={<IncomingVoiceCall />} />
<Route path="/activevoicecall" element={<ActiveVoiceCall />} />
<Route path="/videocall" element={<VideoCall />} />
<Route path="/incomingvideocall" element={<IncomingVideoCall />} />
<Route path="/activevideocall" element={<ActiveVideoCall />} />
