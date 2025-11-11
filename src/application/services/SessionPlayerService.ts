import { Session } from "@/src/domain/session/Session";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";

export class SessionPlayerService {
  constructor(private repository: SessionRepository) {}

  async loadSession(sessionId: string): Promise<Session | null> {
    return await this.repository.getById(sessionId);
  }

  determineNextAction(session: Session, currentIndex: number): "advance" | "complete" {
    return session.canAdvance(currentIndex) ? "advance" : "complete";
  }
}
