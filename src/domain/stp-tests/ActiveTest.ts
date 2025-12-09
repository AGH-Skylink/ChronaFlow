import { ActiveResult } from "@models/ActiveResult";
import { ExposureBasedTest, ExposureBasedPhase } from "./ExposureBasedTest";


export class ActiveTest extends ExposureBasedTest {
  private _holdStart: number | null = null;
  private _holdEnd: number | null = null;

  constructor(public readonly sessionId: string | null) {
    super(sessionId);
  }

  calculateUserExposure(): void {
    if (this._holdStart !== null && this._holdEnd !== null) {
      this._userExposure = this._holdEnd - this._holdStart;
      return
    }
    throw new Error("Cannot calculate user exposure before timer completes.");
  }
 
  startTimer() {
    this.ensureState([ExposureBasedPhase.REPRODUCTION]);
    this._holdStart = Date.now();
    this._holdEnd = null;
  }

  endTimer() {
    this.ensureState([ExposureBasedPhase.REPRODUCTION]);
    if (this._holdStart === null) {
      throw new Error("Hold timer was not started.");
    }
    this._holdEnd = Date.now();
    this.calculateUserExposure();
    const result = this.generateResults();
    this._state = ExposureBasedPhase.RESULTS;
    return result;
  }

  reset(): void {
    super.reset();
    this._holdStart = null;
    this._holdEnd = null;
  }
}




