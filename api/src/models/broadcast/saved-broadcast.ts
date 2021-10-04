import { Broadcast } from "../../types";

class SavedBroadcast {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly startAt: string;
  readonly endAt: string;
  readonly listenerPeakCount: number;
  readonly downloadUrl?: string;
  readonly listenUrl?: string;
  readonly isVisible: boolean;
  readonly likesCount: number;

  constructor(broadcast: Broadcast) {
    this.id = broadcast.id;
    this.title = broadcast.title;
    this.description = broadcast.description;
    this.startAt = broadcast.startAt;
    this.endAt = broadcast.endAt;
    this.listenerPeakCount = broadcast.listenerPeakCount;
    this.downloadUrl = broadcast.downloadUrl;
    this.listenUrl = broadcast.listen_url;
    this.isVisible = broadcast.isVisible;
    this.likesCount = broadcast.likesCount;
  }
}
