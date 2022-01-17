interface Scheduler {
  start: (callback: () => void, interfval: number) => void;
  stop: () => void;
  timerId?: NodeJS.Timer;
}

class IntervalScheduler implements Scheduler {
  timerId?: NodeJS.Timer;

  start(callback: () => void, interval: number): void {
    this.timerId = setInterval(callback, interval);
  }

  stop(): void {
    if (!this.timerId) return;

    clearInterval(this.timerId);
    this.timerId = undefined;
    console.log(
      `${__filename} Scheduler stopped, cleare timeerId ${this.timerId}`,
    );
  }
}

export { Scheduler, IntervalScheduler };
