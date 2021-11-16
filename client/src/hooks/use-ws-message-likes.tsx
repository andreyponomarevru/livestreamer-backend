import * as React from "react";

import { useIsMounted } from "./use-is-mounted";
import { useWebSocketEvents } from "./use-ws-stream-like";
import { ChatMsgLike, ChatMsg, ChatMsgUnlike } from "../types";
import { useAuthN } from "./use-authn";
import { API_ROOT_URL } from "../config/env";
import { useFetch } from "./use-fetch";
import { useNavigate } from "react-router";
import { ROUTES } from "../config/routes";

// TODO: commit all changes before editing the code !!!

// TODO: refactor in redux-like state

// Hook 1
// POST like + add like in state
// Hook 2
// DELETE like + delete like from state
// Hook 3
// Subscribe to msg_like/unlike event in upper component and pass down as props new set of likes (recall, WS msg contains *full* set of likes, not only a new like so we don't have to care about managing likes manually)

/*
function useLikeToggle(
  message: Message,
  setLikes: React.Dispatch<React.SetStateAction<Set<number>>>
): UseWSMessageLikes {
  const auth = useAuthN();
  const isMounted = useIsMounted();

  return { likes, toggleLike };
}

export { useLikeToggle };
*/
