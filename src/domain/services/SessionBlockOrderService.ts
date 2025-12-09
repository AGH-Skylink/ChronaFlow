import { SessionBlock, TestType } from "@/types/session";

export class SessionBlockOrderService {
  private static generateBlockId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  static addBlock(blocks: SessionBlock[], type: TestType): SessionBlock[] {
    const newBlock: SessionBlock = {
      id: this.generateBlockId(),
      type,
      order: blocks.length,
    };

    return [...blocks, newBlock];
  }

  static removeBlock(blocks: SessionBlock[], blockId: string): SessionBlock[] {
    const filteredBlocks = blocks.filter((block) => block.id !== blockId);
    return this.reorderBlocks(filteredBlocks);
  }

  static moveBlockUp(blocks: SessionBlock[], index: number): SessionBlock[] {
    if (index <= 0 || index >= blocks.length) {
      return blocks;
    }

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;

    return this.reorderBlocks(newBlocks);
  }

  static moveBlockDown(blocks: SessionBlock[], index: number): SessionBlock[] {
    if (index < 0 || index >= blocks.length - 1) {
      return blocks;
    }

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;

    return this.reorderBlocks(newBlocks);
  }

  static reorderBlocks(blocks: SessionBlock[]): SessionBlock[] {
    return blocks.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  static getBlockAtIndex(blocks: SessionBlock[], index: number): SessionBlock | null {
    return blocks[index] || null;
  }

  static getBlockCount(blocks: SessionBlock[]): number {
    return blocks.length;
  }
}
