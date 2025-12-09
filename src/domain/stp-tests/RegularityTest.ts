import { RegularityResult } from "@models/RegularityResult";

export enum RegularityPhase {
  INACTIVE = 0,
  COUNTDOWN = 1,
  TAPPING = 2,
  RESULTS = 3,
  COMPLETED = 4,
}

export const TAP_COUNT = 25;

export class RegularityTest {
  private _state: RegularityPhase = RegularityPhase.INACTIVE;
  private _tapCount: number = 0;
  private _tapTimestamps: number[] = [];
  private _avgInterval: number = 0;
  private _stdDevInterval: number = 0;

  constructor(public readonly sessionId: string | null) {}

  get state() {
    return this._state;
  }

  get tapCount() {
    return this._tapCount;
  }

  get avgInterval() {
    return this._avgInterval;
  }

  get stdDevInterval() {
    return this._stdDevInterval;
  }

  get tapTimestamps() {
    return [...this._tapTimestamps];
  }

  get isComplete() {
    return this._tapCount >= TAP_COUNT;
  }

  startTest(): void {
    this.ensureState([RegularityPhase.INACTIVE, RegularityPhase.COMPLETED]);
    this.reset();
    this._state = RegularityPhase.COUNTDOWN;
  }

  beginTapping(): void {
    this.ensureState([RegularityPhase.COUNTDOWN]);
    this._state = RegularityPhase.TAPPING;
  }

  recordTap(): void {
    this.ensureState([RegularityPhase.TAPPING]);
    const timestamp = Date.now();
    this._tapTimestamps.push(timestamp);
    this._tapCount++;

    if (this.isComplete) {
      this._state = RegularityPhase.RESULTS;
    }
  }

  analyzeResults(): RegularityResult {
    this.ensureState([RegularityPhase.RESULTS, RegularityPhase.COMPLETED]);

    if (this._tapTimestamps.length < 2) {
      throw new Error("Not enough taps to analyze results");
    }

    const intervals: number[] = [];
    for (let i = 1; i < this._tapTimestamps.length; i++) {
      intervals.push(this._tapTimestamps[i] - this._tapTimestamps[i - 1]);
    }

    const sum = intervals.reduce((prev, curr) => prev + curr, 0);
    const avgIntervalMs = sum / intervals.length;
    this._avgInterval = avgIntervalMs / 1000;

    const squaredDiffs = intervals.map((interval) => {
      const diff = interval - avgIntervalMs;
      return diff * diff;
    });
    const squaredDiffSum = squaredDiffs.reduce((prev, curr) => prev + curr, 0);
    this._stdDevInterval = Math.sqrt(squaredDiffSum / intervals.length) / 1000;

    const relativeTapTimestamps = this._tapTimestamps.map(
      (t) => t - this._tapTimestamps[0]
    );

    return RegularityResult.create(
      this._avgInterval,
      this._stdDevInterval,
      relativeTapTimestamps,
      this.sessionId
    );
  }

  complete(): void {
    this.ensureState([RegularityPhase.RESULTS]);
    this._state = RegularityPhase.COMPLETED;
  }

  reset(): void {
    this._state = RegularityPhase.INACTIVE;
    this._tapCount = 0;
    this._tapTimestamps = [];
    this._avgInterval = 0;
    this._stdDevInterval = 0;
  }

  private ensureState(expected: RegularityPhase[]): void {
    if (!expected.includes(this._state)) {
      throw new Error(
        `Invalid state: ${this._state}. Expected one of ${expected.join(", ")}`
      );
    }
  }
}
