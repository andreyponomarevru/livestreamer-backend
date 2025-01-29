/* eslint-disable no-unused-vars */

import { logger } from "../../../src/config/logger";

interface Scheduler {
  start: (callback: () => void, interfval: number) => void;
  stop: () => void;
  timerId?: NodeJS.Timeout;
}

class IntervalScheduler implements Scheduler {
  timerId?: NodeJS.Timeout;

  start(callback: () => void, interval: number): void {
    this.timerId = setInterval(callback, interval);
  }

  stop(): void {
    if (!this.timerId) return;

    clearInterval(this.timerId);
    this.timerId = undefined;
    logger.debug(
      `${__filename} Scheduler stopped, cleare timeerId ${this.timerId}`,
    );
  }
}

export { Scheduler, IntervalScheduler };
