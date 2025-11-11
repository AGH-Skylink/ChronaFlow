import { Session as SessionData, SessionBlock } from "@/types/session";

export class Session {
  constructor(
    public id: string,
    public name: string,
    public createdAt: number,
    public blocks: SessionBlock[]
  ) {}

  static fromData(data: SessionData): Session {
    return new Session(data.id, data.name, data.createdAt, data.blocks);
  }

  toData(): SessionData {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      blocks: this.blocks,
    };
  }
}
