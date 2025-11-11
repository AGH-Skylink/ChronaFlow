import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";

export class SessionResultCleanupService {
  constructor(
    private readonly activeResultsRepo: ResultsRepository,
    private readonly passiveResultsRepo: ResultsRepository,
    private readonly regularityResultsRepo: RegularityResultsRepository
  ) {}

  async deleteSessionResults(sessionId: string): Promise<void> {
    try {
      await Promise.all([
        this.deleteResultsForSession(this.activeResultsRepo, sessionId),
        this.deleteResultsForSession(this.passiveResultsRepo, sessionId),
        this.deleteResultsForSession(this.regularityResultsRepo, sessionId),
      ]);
    } catch (error) {
      console.error("Error deleting session results:", error);
      throw new Error("Failed to delete session results");
    }
  }

  async nullifySessionResultReferences(sessionId: string): Promise<void> {
    try {
      await Promise.all([
        this.nullifyResultReferences(this.activeResultsRepo, sessionId),
        this.nullifyResultReferences(this.passiveResultsRepo, sessionId),
        this.nullifyResultReferences(this.regularityResultsRepo, sessionId),
      ]);
    } catch (error) {
      console.error("Error nullifying session result references:", error);
      throw new Error("Failed to nullify session references");
    }
  }

  private async deleteResultsForSession<T extends { sessionId?: string | null }>(
    repository: { loadAll: () => Promise<T[]>; delete: (id: string) => Promise<T[]> },
    sessionId: string
  ): Promise<void> {
    const results = await repository.loadAll();
    const resultsToDelete = results.filter((result) => result.sessionId === sessionId);

    for (const result of resultsToDelete) {
      if ("id" in result) {
        await repository.delete((result as any).id);
      }
    }
  }

  private async nullifyResultReferences<T extends { sessionId?: string | null }>(
    repository: { loadAll: () => Promise<T[]>; updateNote: (id: string, note: string) => Promise<T[]> },
    sessionId: string
  ): Promise<void> {
    const results = await repository.loadAll();
    const resultsToUpdate = results.filter((result) => result.sessionId === sessionId);

    for (const result of resultsToUpdate) {
      if ("id" in result && "notes" in result) {
        await repository.updateNote((result as any).id, (result as any).notes || "");
      }
    }
  }
}
