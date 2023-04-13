import { AspectRatio } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const Spotlight = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useCamera();

  console.log(mediaStream);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  const play = () => {
    videoRef.current?.play();
  };

  return (
    <AspectRatio w="full" maxW={720} ratio={16 / 9}>
      <video ref={videoRef} onCanPlay={play} autoPlay playsInline muted />
    </AspectRatio>
  );
};

function useCamera() {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
          },
        });
        setMediaStream(stream);
      } catch (err) {
        console.error(err);
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream]);

  return mediaStream;
}

export default Spotlight;
