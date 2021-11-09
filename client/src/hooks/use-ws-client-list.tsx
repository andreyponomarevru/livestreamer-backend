import { useState, useEffect } from "react";

import { IWebSocketClient } from "../ws-client";
import { SanitizedWSChatClient } from "../types";

function useWSClientList(ws: IWebSocketClient): SanitizedWSChatClient[] {
  const [clientList, setClientList] = useState<SanitizedWSChatClient[]>([]);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) ws.bindToServerEvents("chat:client_list", setClientList);

    return () => {
      isMounted = false;
      ws.unbindFromServerEvents("chat:client_list", setClientList);
    };
  }, []);

  return clientList;
}

export { useWSClientList };
