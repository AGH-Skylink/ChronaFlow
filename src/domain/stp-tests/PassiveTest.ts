import { ExposureBasedResult } from "@models/ExposureBasedResult";
import { ExposureBasedTest, ExposureBasedPhase } from "./ExposureBasedTest";

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
    const result = ExposureBasedResult.create(
      this._targetExposure,
      this._userExposure!,
      this.sessionId
    );
    this._state = ExposureBasedPhase.RESULTS;
    return result;
  }

  reset(): void {
    super.reset();
    this._sliderValue = 1000;
  }
}
