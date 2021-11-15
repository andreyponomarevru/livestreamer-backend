import * as React from "react";
import { useNavigate } from "react-router";

import { API_ROOT_URL } from "../config/env";
import { ROUTES } from "../config/routes";
import { useAuthN } from "./use-authn";
import { useFetch } from "./use-fetch";

function useStreamLikeButton() {
  function handleBtnClick() {
    if (!auth.user) {
      navigate(ROUTES.signIn);
    } else {
      sendBroadcastLikeRequest(`${API_ROOT_URL}/stream/like`, {
        method: "PUT",
      });
    }
  }

  const { state: broadcastLikeResponse, fetchNow: sendBroadcastLikeRequest } =
    useFetch();
  React.useEffect(() => {
    if (broadcastLikeResponse.response) {
      // TODO: here, update stream like count+1 in Context
      setIsEnabled(false);
    } else if (broadcastLikeResponse.error) {
      console.log(broadcastLikeResponse.error);
    }
  }, [broadcastLikeResponse]);

  const navigate = useNavigate();
  const auth = useAuthN();
  // TODO: you need to persist state between component mount/unmount, solution: Store it in Context. The state is not persisted because when you first open the page, the server sends {isOnline: true}, but when component unmounts and mounts back, by default is has set {isOnline: false} is useState hook above
  const [isEnabled, setIsEnabled] = React.useState(false);

  return { handleBtnClick, isEnabled, setIsEnabled };
}

export { useStreamLikeButton };
