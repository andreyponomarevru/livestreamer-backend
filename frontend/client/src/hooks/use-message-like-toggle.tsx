import * as React from "react";

import { useAuthN } from "./use-authn";
import { API_ROOT_URL } from "../config/env";
import { useFetch } from "./use-fetch";
import { ChatMsg } from "../types";

function useMessageLikeToggle(messageLikes: ChatMsg["likedByUserId"]) {
  function isLiked(likes: Set<number>) {
    return !!auth.user && likes.has(auth.user.id);
  }

  const auth = useAuthN();

  const [likes, setLikes] = React.useState(new Set(messageLikes));

  function toggleLike(messageId: number) {
    if (isLiked(likes)) {
      sendUnlikeMsgRequest(`${API_ROOT_URL}/chat/messages/${messageId}/like`, {
        method: "DELETE",
      });
    } else {
      sendLikeMsgRequest(`${API_ROOT_URL}/chat/messages/${messageId}/like`, {
        method: "POST",
      });
    }
  }

  const { state: likeMsgResponse, fetchNow: sendLikeMsgRequest } = useFetch();
  React.useEffect(() => {
    if (auth.user && likeMsgResponse.response) {
      setLikes(new Set([...likes, auth.user!.id]));
    }
  }, [likeMsgResponse]);

  const { state: unlikeMsgResponse, fetchNow: sendUnlikeMsgRequest } =
    useFetch();
  React.useEffect(() => {
    if (auth.user && unlikeMsgResponse.response) {
      setLikes(
        (prev) => new Set([...prev].filter((id) => id !== auth.user!.id))
      );
    }
  }, [unlikeMsgResponse]);

  return { likes, toggleLike, setLikes, isLiked };
}

export { useMessageLikeToggle };
