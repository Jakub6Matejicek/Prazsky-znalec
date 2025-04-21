// src/components/Countdown.tsx

class Countdown {
  private timeLeft: number;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(seconds: number) {
    this.timeLeft = seconds * 100;
  }

  start(onTick: (timeLeft: number) => void, onComplete?: () => void) {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.timeLeft = Math.max(this.timeLeft - 1, 0);
      onTick(this.timeLeft);

      if (this.timeLeft === 0) {
        this.stop();
        onComplete?.();
      }
    }, 10);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(seconds: number) {
    this.stop();
    this.timeLeft = seconds * 100;
  }

  getTimeLeft() {
    return this.timeLeft;
  }
}

export default Countdown;
