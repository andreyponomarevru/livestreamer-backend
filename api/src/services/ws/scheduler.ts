import { logger } from "../../../src/config/logger";

interface Scheduler {
  // eslint-disable-next-line no-unused-vars
  start: (callback: () => void, interfval: number) => void;
  stop: () => void;
  timerId?: NodeJS.Timeout;
}

class IntervalScheduler implements Scheduler {
  timerId?: NodeJS.Timeout;

  start(callback: () => void, interval: number): NodeJS.Timeout {
    this.timerId = setInterval(callback, interval);

    return this.timerId;
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
