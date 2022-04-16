import { useState, useEffect } from "react";

function useStreamTimer(startedAt: string): string {
  function formatTime(ms: number) {
    return new Date(ms).toISOString().substr(11, 8);
  }

  function getPassedTime(startedAt: number): string {
    const now = Date.now();
    const msTimePassed = now - startedAt;
    return formatTime(msTimePassed);
  }

  const streamStartedAt = new Date(startedAt).getTime();
  const [time, setTime] = useState<string>(getPassedTime(streamStartedAt));

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(getPassedTime(streamStartedAt));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  return time;
}

export { useStreamTimer };
