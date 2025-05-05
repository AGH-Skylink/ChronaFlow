import { IResults } from "./IResult";

export class PassiveResult implements IResults {
  constructor(
    public userDuration: number,
    public targetDuration: number,
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
