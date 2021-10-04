import { ChatCommentConstructor } from "../../types";

export class ChatComment {
  readonly id: number;
  readonly userId: number;
  readonly username: string;
  readonly createdAt: string;
  readonly message: string;

  constructor(comment: ChatCommentConstructor) {
    this.id = comment.id;
    this.userId = comment.userId;
    this.username = comment.username;
    this.createdAt = comment.createdAt;
    this.message = comment.message;
  }
}
