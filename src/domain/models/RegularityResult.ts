import { IResults } from "./IResult";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class RegularityResult implements IResults {
  constructor(
    public id: string,
    public timestamp: number,
    public avgInterval: number,
    public stdDevInterval: number,
    public tapTimestamps: number[],
    public notes: string = "",
    public sessionId: string | null = null
  ) {}

  static create(
    avgInterval: number,
    stdDevInterval: number,
    tapTimestamps: number[],
    sessionId: string | null
  ) {
    return new RegularityResult(
      generateId(),
      Date.now(),
      avgInterval,
      stdDevInterval,
      tapTimestamps,
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
