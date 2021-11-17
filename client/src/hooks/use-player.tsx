import * as React from "react";
import { API_ROOT_URL } from "../config/env";
import { useIsMounted } from "./use-is-mounted";

function usePlayer(url: string) {
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  function togglePlay() {
    console.log("toggle");
    setIsPlaying((prev) => !prev);
  }

  React.useEffect(() => {
    if (isPlaying) {
      if (!audio) setAudio(new Audio(url));
      const audioPromise = audio?.play();
      if (audioPromise !== undefined) {
        audioPromise.catch((err) => console.error(err));
      }
    } else {
      audio?.pause();
      setAudio(null);
    }
  }, [audio, isPlaying]);

  React.useEffect(() => {
    if (audio) audio.play();
  }, [audio]);

  return { isPlaying, togglePlay };
}

export { usePlayer };
