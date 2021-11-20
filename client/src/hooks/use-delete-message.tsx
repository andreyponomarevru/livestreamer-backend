import * as React from "react";

import { hasPermission } from "../utils/has-permission";
import { API_ROOT_URL } from "../config/env";
import { useAuthN } from "./use-authn";
import { useFetch } from "./use-fetch";

function useDeleteMessage(deleteMessage: (id: number) => void) {
  function handleDeleteMessage(msg: { messageId: number; userId: number }) {
    const hasPermissionToDeleteAnyMsg = hasPermission(
      { resource: "any_chat_message", action: "delete" },
      auth.user
    );
    const hasPermissionToDeleteOwnMsg = hasPermission(
      { resource: "user_own_chat_message", action: "delete" },
      auth.user
    );

    if (hasPermissionToDeleteAnyMsg) {
      sendDeleteMessageReq(
        `${API_ROOT_URL}/moderation/chat/messages/${msg.messageId}?user_id=${msg.userId}`,
        { method: "DELETE" }
      );
      setDeletedMessageId(msg.messageId);
    } else if (hasPermissionToDeleteOwnMsg) {
      sendDeleteMessageReq(`${API_ROOT_URL}/chat/messages/${msg.messageId}`, {
        method: "DELETE",
      });
      setDeletedMessageId(msg.messageId);
    }
  }

  const auth = useAuthN();

  const [deletedMessageId, setDeletedMessageId] = React.useState<number>();
  const { state: deleteMessageRes, fetchNow: sendDeleteMessageReq } =
    useFetch();
  React.useEffect(() => {
    if (deleteMessageRes.response && deletedMessageId) {
      deleteMessage(deletedMessageId);
    }
  }, [deleteMessageRes, deletedMessageId]);

  return handleDeleteMessage;
}

export { useDeleteMessage };
