import { Session, TestType } from "@/types/session";
import { SessionBlockOrderService } from "@/src/domain/services/SessionBlockOrderService";
import { SessionValidator } from "@/src/domain/models/SessionValidator";

export class SessionBlockManagementService {
  addBlockToSession(session: Session, type: TestType): Session {
    if (!SessionValidator.canAddBlock(session.blocks.length)) {
      throw new Error("Maximum number of blocks reached");
    }

    const updatedBlocks = SessionBlockOrderService.addBlock(session.blocks, type);

    return {
      ...session,
      blocks: updatedBlocks,
    };
  }

  removeBlockFromSession(session: Session, blockId: string): Session {
    if (!SessionValidator.canRemoveBlock(session.blocks, blockId)) {
      throw new Error("Block not found in session");
    }

    const updatedBlocks = SessionBlockOrderService.removeBlock(session.blocks, blockId);

    return {
      ...session,
      blocks: updatedBlocks,
    };
  }

  moveBlockUp(session: Session, index: number): Session {
    if (!SessionValidator.canMoveBlockUp(session.blocks, index)) {
      throw new Error("Cannot move block up");
    }

    const updatedBlocks = SessionBlockOrderService.moveBlockUp(session.blocks, index);

    return {
      ...session,
      blocks: updatedBlocks,
    };
  }

  moveBlockDown(session: Session, index: number): Session {
    if (!SessionValidator.canMoveBlockDown(session.blocks, index)) {
      throw new Error("Cannot move block down");
    }

    const updatedBlocks = SessionBlockOrderService.moveBlockDown(session.blocks, index);

    return {
      ...session,
      blocks: updatedBlocks,
    };
  }

  getBlockCount(session: Session): number {
    return SessionBlockOrderService.getBlockCount(session.blocks);
  }

  canAddMoreBlocks(session: Session): boolean {
    return SessionValidator.canAddBlock(session.blocks.length);
  }
}
