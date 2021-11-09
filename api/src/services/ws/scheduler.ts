interface Scheduler {
  start: (callback: () => void, interfval: number) => void;
  stop: () => void;
  timerId?: NodeJS.Timer;
}

class IntervalScheduler implements Scheduler {
  timerId?: NodeJS.Timer;

  start(callback: () => void, interval: number): void {
    console.log(`${__filename} Scheduler started`);
    this.timerId = setInterval(callback, interval);
  }

  stop(): void {
    clearInterval(this.timerId as NodeJS.Timer);
    this.timerId = undefined;
    console.log(
      `${__filename} Scheduler stopped, cleare timeerId ${this.timerId}`,
    );
  }
}

export { Scheduler, IntervalScheduler };
