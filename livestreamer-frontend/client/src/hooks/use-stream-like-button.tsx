import * as React from "react";
import { useNavigate } from "react-router";

import { API_ROOT_URL } from "../config/env";
import { ROUTES } from "../config/routes";
import { useAuthN } from "./use-authn";
import { useFetch } from "./use-fetch";
import { useStreamLikeCount } from "./use-stream-like-count";

type StreamLikeButton = {
  handleBtnClick: () => void;
  isBtnEnabled: boolean;
  setIsBtnEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

function useStreamLikeButton(): StreamLikeButton {
  function handleBtnClick() {
    if (!auth.user) {
      navigate(ROUTES.signIn);
    } else {
      sendLikeBroadcastRequest(`${API_ROOT_URL}/stream/like`, {
        method: "PUT",
      });
    }
  }

  const { setLikeCount } = useStreamLikeCount();
  const {
    state: likeBroadcastResponse,
    fetchNow: sendLikeBroadcastRequest,
    resetState,
  } = useFetch();
  React.useEffect(() => {
    if (likeBroadcastResponse.response) {
      resetState();
      setLikeCount((likeCount) => ++likeCount);
      setIsBtnEnabled(false);
    } else if (likeBroadcastResponse.error?.status === 401) {
      auth.setUser(null);
      navigate(ROUTES.signIn);
    } else if (likeBroadcastResponse.error) {
      console.error(likeBroadcastResponse.error);
    }
  }, [likeBroadcastResponse]);

  const navigate = useNavigate();
  const auth = useAuthN();

  const [isBtnEnabled, setIsBtnEnabled] = React.useState(false);

  return { handleBtnClick, isBtnEnabled, setIsBtnEnabled };
}

export { useStreamLikeButton };
