import { ExposureBasedResult } from "@models/ExposureBasedResult";
import { ExposureBasedTest } from "./ExposureBasedTest";

export class PassiveTest extends ExposureBasedTest {
  private _sliderValue: number = 1000;

  constructor(public readonly sessionId: string | null) {
    super(sessionId);
  }

  setSliderValue(value: number): void {
    this._sliderValue = value;
  }

  get sliderValue(): number {
    return this._sliderValue;
  }

  calculateUserExposure(): void {
    this._userExposure = this._sliderValue;
  }

  generateResults(): ExposureBasedResult {
    if (this._userExposure === null) {
      this.calculateUserExposure();
    }
    return ExposureBasedResult.create(
      this._targetExposure,
      this._userExposure!,
      this.sessionId
    );
  }
}
