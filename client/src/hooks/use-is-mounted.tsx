import { useEffect, useState } from "react";

function useIsMounted(): boolean {
  const [isMounted, setIsMouted] = useState(false);
  useEffect(() => {
    setIsMouted(true);
    return () => setIsMouted(false);
  }, []);
  return isMounted;
}

export { useIsMounted };
