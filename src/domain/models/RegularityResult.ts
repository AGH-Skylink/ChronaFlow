import { IResults } from "./IResult";

export class RegularityResult implements IResults {
  constructor(
    public avgInterval: number,
    public stdDevInterval: number,
    public date: Date,
    public tapTimestamps: number[],
    public notes: string,
    public sessionId: string,
  ) {}
  export(): void {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    throw new Error("Method not implemented.");
  }
}
