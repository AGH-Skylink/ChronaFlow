import { Session } from "@/types/session";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { SessionValidator } from "@/src/domain/models/SessionValidator";
import { SessionResultCleanupService } from "@/src/domain/services/SessionResultCleanupService";

export class SessionManagementService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly cleanupService: SessionResultCleanupService
  ) {}

  async loadAllSessions(): Promise<Session[]> {
    try {
      return await this.sessionRepository.getAll();
    } catch (error) {
      console.error("Error loading sessions:", error);
      throw new Error("Failed to load sessions");
    }
  }

  createNewSession(): Session {
    return {
      id: Date.now().toString(),
      name: "",
      createdAt: Date.now(),
      blocks: [],
    };
  }

  async saveSession(session: Session, name: string): Promise<void> {
    const validation = SessionValidator.validateSession(session, name);
    
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const sessionToSave = {
      ...session,
      name: name.trim(),
    };

    try {
      await this.sessionRepository.save(sessionToSave);
    } catch (error) {
      console.error("Error saving session:", error);
      throw new Error("Failed to save session");
    }
  }

  async deleteSession(sessionId: string, deleteResults: boolean = false): Promise<void> {
    try {
      await this.sessionRepository.delete(sessionId);

      if (deleteResults) {
        await this.cleanupService.deleteSessionResults(sessionId);
      } else {
        await this.cleanupService.nullifySessionResultReferences(sessionId);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Failed to delete session");
    }
  }

  async getSessionById(sessionId: string): Promise<Session | null> {
    try {
      const sessions = await this.sessionRepository.getAll();
      return sessions.find(s => s.id === sessionId) || null;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  validateSessionName(name: string): { isValid: boolean; error?: string } {
    return SessionValidator.validateSessionName(name);
  }
}
