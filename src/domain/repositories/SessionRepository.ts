import { IKeyValueStore } from "@/src/application/ports/IKeyValueStore";
import { Session as SessionData } from "@/types/session";
import { Session } from "../session/Session";

const SESSIONS_STORAGE_KEY = "savedSessions";

export class SessionRepository {
  constructor(private storage: IKeyValueStore) {}

  async getById(id: string): Promise<Session | null> {
    try {
      const sessions = await this.getAll();
      const sessionData = sessions.find((s) => s.id === id);
      return sessionData ? Session.fromData(sessionData) : null;
    } catch (error) {
      console.error("Error getting session by id:", error);
      return null;
    }
  }

  async getAll(): Promise<SessionData[]> {
    try {
      const sessions = await this.storage.getItem(SESSIONS_STORAGE_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error("Error getting sessions:", error);
      return [];
    }
  }

  async save(session: SessionData): Promise<void> {
    try {
      const sessions = await this.getAll();
      const index = sessions.findIndex((s) => s.id === session.id);

      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }

      await this.storage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const sessions = await this.getAll();
      const filtered = sessions.filter((s) => s.id !== id);
      await this.storage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }
}
