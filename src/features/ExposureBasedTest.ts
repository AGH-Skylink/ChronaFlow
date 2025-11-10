import { ActiveResult } from "@models/ActiveResult";

export enum ExposureBasedPhase {
  INACTIVE,
  COUNTDOWN,
  EXPOSURE,
  REPRODUCTION,
  RESULTS,
  COMPLETED,
}


export class ExposureBasedTest {
  protected _state: ExposureBasedPhase = ExposureBasedPhase.INACTIVE;
  protected _targetExposure = 0;
  protected _userExposure: number | null = null;
  protected _emoji = this.randomEmoji();

  constructor(public readonly sessionId: string | null) {}

  get state() {
    return this._state;
  }

  get targetExposure() {
    return this._targetExposure;
  }

  get userExposure() {
    if (this._userExposure === null) {
        this.calculateUserExposure();
    }
    return this._userExposure;
  }

  calculateUserExposure() {
    throw new Error("Method not implemented.");
  }

  get emoji() {
    return this._emoji;
  }

  startTest() {
    this.ensureState([ExposureBasedPhase.INACTIVE, ExposureBasedPhase.COMPLETED]);
    this.reset();
    this._targetExposure = this.randomTimeMillis();
    this._state = ExposureBasedPhase.COUNTDOWN;
  }

  beginExposure() {
    this.ensureState([ExposureBasedPhase.COUNTDOWN]);
    this._state = ExposureBasedPhase.EXPOSURE;
  }

  completeExposure() {
    this.ensureState([ExposureBasedPhase.EXPOSURE]);
    this._state = ExposureBasedPhase.REPRODUCTION;
  }

  complete() {
    this.ensureState([ExposureBasedPhase.RESULTS]);
    this._state = ExposureBasedPhase.COMPLETED;
  }

  reset() {
    this._state = ExposureBasedPhase.INACTIVE;
    this._targetExposure = 0;
    this._emoji = this.randomEmoji();
  }

  protected ensureState(expected: ExposureBasedPhase[]) {
    if (!expected.includes(this._state)) {
      throw new Error(
        `Invalid state: ${this._state}. Expected one of ${expected.join(", ")}`
      );
    }
  }

  protected generateResults() {
    if (this._userExposure === null) {
      throw new Error("Cannot generate results before timer completes.");
    }
    return ActiveResult.create(
      this._targetExposure,
      this._userExposure,
      this.sessionId
    );
  }
  
  randomTimeMillis() {
    const min = 1
    const max = 5
    return Math.round((min + Math.random() * (max - min)) * 1000);
  }

  randomEmoji() {
    const emojis = [
    "🌙",
    "🌑",
    "🌓",
    "🌕",
    "🌠",
    "⭐",
    "🌟",
    "🪐",
    "🚀",
    "🛸",
    "🌌",
    "☄️",
  ];
    const index = Math.floor(Math.random() * emojis.length);
    return emojis[index];
  }
}


