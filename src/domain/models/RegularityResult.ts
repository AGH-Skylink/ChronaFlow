import { IResults } from "./IResult";

const generateId = () => {
  const randomPart = Math.random().toString(36).slice(2).slice(0, 6).padEnd(6, "0");
  return `${Date.now()}-${randomPart}`;
};

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
