import * as React from "react";

import { ChatControls } from "./chat-controls/chat-controls";
import { Page } from "../../lib/page/page";
import { MsgsList } from "./msgs-list/msgs-list";
import { useChatHistory } from "../../hooks/use-chat-history";
import { useDeleteMessage } from "../../hooks/use-delete-message";
import { useCreateMessageWSEvent } from "../../hooks/websocket/use-create-message-ws-event";
import { useDeleteMessageWSEvent } from "../../hooks/websocket/use-delete-message-ws-event";

import "./chat.scss";

interface Props {
  isStreamOnline: boolean;
}

function PagesChat(props: Props): React.ReactElement {
  const { messages, addMessage, deleteMessage } = useChatHistory();

  useCreateMessageWSEvent(addMessage);
  useDeleteMessageWSEvent(deleteMessage);
  const handleDeleteMessage = useDeleteMessage(deleteMessage);

	//

	function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView();
  }
  const messagesEndRef = React.useRef<any>(null);
	React.useEffect(scrollToBottom, [messages]);

	//

  return (
    <Page className="chat-page">
      <MsgsList messages={messages} handleDeleteMessage={handleDeleteMessage} />
			<div className="scroll-to" ref={messagesEndRef} />
      <ChatControls
        isStreamOnline={props.isStreamOnline}
        handleAddMessage={addMessage}
      />
    </Page>
  );
}

export { PagesChat };
