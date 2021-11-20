import * as React from "react";

type Player = { isPlaying: boolean; togglePlay: () => void };

function usePlayer(url: string): Player {
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  function togglePlay() {
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
