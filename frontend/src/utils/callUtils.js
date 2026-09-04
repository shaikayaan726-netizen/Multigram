export function stopStream(stream) {

  if (!stream) return;

  stream.getTracks().forEach((track) => {

    try {
      track.stop();
    } catch (error) {
      console.error("Unable to stop track:", error);
    }

  });

}