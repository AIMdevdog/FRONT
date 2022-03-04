import { useRef, useEffect } from "react";

const RTCVideo = ({ mediaStream }) => {
  const viewRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (!viewRef.current) return;
    viewRef.current.srcObject = mediaStream ? mediaStream : null;

    // setTimeout(() => {
    //   const tracks = mediaStream.getAudioTracks();
    //   tracks[0].stop();
    // }, 5000);
  }, [mediaStream]);

  return <video ref={viewRef} muted={false} autoPlay controls></video>;
};

export default RTCVideo;
