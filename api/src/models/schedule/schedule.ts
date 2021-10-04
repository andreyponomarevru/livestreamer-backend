import { Schedule } from "../../types";

export class ScheduledBroadcast {
  readonly id?: number;
  readonly title: string;
  readonly startAt: string;
  readonly endAt: string;

  constructor(schedule: Schedule) {
    this.id = schedule.id;
    this.title = schedule.title;
    this.startAt = schedule.startAt;
    this.endAt = schedule.endAt;
  }
}
