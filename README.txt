VOICE CALL FIX

Replace these files in your project:
frontend/src/pages/VoiceCall.jsx
frontend/src/pages/IncomingVoiceCall.jsx
frontend/src/pages/ActiveVoiceCall.jsx
frontend/src/pages/callClient.js
frontend/src/utils/socket.js
frontend/src/Call.css

Voice flow:
caller -> accept -> receiver ready -> offer -> answer -> ICE -> remote audio.
Includes a fallback Enable audio button for browser autoplay restrictions.
