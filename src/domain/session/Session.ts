import { Session as SessionData, SessionBlock } from "@/types/session";

export class Session {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: number,
    public readonly blocks: SessionBlock[]
  ) {}

  static fromData(data: SessionData): Session {
    return new Session(data.id, data.name, data.createdAt, data.blocks);
  }

  get totalBlocks(): number {
    return this.blocks.length;
  }

  getBlockAt(index: number): SessionBlock | null {
    return this.blocks[index] ?? null;
  }

  isLastBlock(index: number): boolean {
    return index === this.blocks.length - 1;
  }

  canAdvance(currentIndex: number): boolean {
    return currentIndex < this.blocks.length - 1;
  }
}
