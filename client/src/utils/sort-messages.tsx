import { ChatMsg } from "../types";

function sortMessages(a: ChatMsg, b: ChatMsg): number {
  return a.id - b.id;
}

export { sortMessages };
