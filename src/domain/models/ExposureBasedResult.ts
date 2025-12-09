import { IResults } from "./IResult";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class ExposureBasedResult implements IResults {
  constructor(
    public id: string,
    public timestamp: number,
    public targetDuration: number,
    public userDuration: number,
    public notes: string = "",
    public sessionId: string | null = null
  ) {}

  static create(
    targetDuration: number,
    userDuration: number,
    sessionId: string | null
  ) {
    return new ExposureBasedResult(
      generateId(),
      Date.now(),
      targetDuration,
      userDuration,
      "",
      sessionId
    );
  }

  export(): void {
    throw new Error("Method not implemented.");
  }
  
  clear(): void {
    throw new Error("Method not implemented.");
  }
}
