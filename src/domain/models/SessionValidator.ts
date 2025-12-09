import { Session, SessionBlock } from "@/types/session";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class SessionValidator {
  private static readonly MIN_NAME_LENGTH = 1;
  private static readonly MAX_NAME_LENGTH = 100;
  private static readonly MAX_BLOCKS = 50;

  static validateSessionName(name: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return {
        isValid: false,
        error: "Please enter a session name",
      };
    }

    if (name.trim().length < this.MIN_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Session name must be at least ${this.MIN_NAME_LENGTH} character`,
      };
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Session name must be less than ${this.MAX_NAME_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  static validateBlockCount(blocks: SessionBlock[]): ValidationResult {
    if (!blocks || blocks.length === 0) {
      return {
        isValid: false,
        error: "Please add at least one test block",
      };
    }

    if (blocks.length > this.MAX_BLOCKS) {
      return {
        isValid: false,
        error: `Session cannot have more than ${this.MAX_BLOCKS} test blocks`,
      };
    }

    return { isValid: true };
  }

  static canAddBlock(currentBlockCount: number): boolean {
    return currentBlockCount < this.MAX_BLOCKS;
  }

  static canRemoveBlock(blocks: SessionBlock[], blockId: string): boolean {
    return blocks.some((block) => block.id === blockId);
  }

  static canMoveBlockUp(blocks: SessionBlock[], index: number): boolean {
    return index > 0 && index < blocks.length;
  }

  static canMoveBlockDown(blocks: SessionBlock[], index: number): boolean {
    return index >= 0 && index < blocks.length - 1;
  }

  static validateSession(session: Session, name: string): ValidationResult {
    const nameValidation = this.validateSessionName(name);
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    const blockValidation = this.validateBlockCount(session.blocks);
    if (!blockValidation.isValid) {
      return blockValidation;
    }

    return { isValid: true };
  }
}
