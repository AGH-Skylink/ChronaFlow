import { useCallback, useMemo } from "react";
import { BaseResultsRepository, IResult } from "@/src/domain/repositories/BaseResultsRepository";

/**
 * Generic hook for result persistence across test types
 * Accepts a repository instance for full DDD compliance
 * Generic type T represents any result type that extends IResult
 */
export function useResultPersistence<T extends IResult>(
  repository: BaseResultsRepository<T>
) {
  const saveResult = useCallback(
    async (result: T) => {
      try {
        await repository.save(result);
      } catch (error) {
        console.error("Failed to save result", error);
      }
    },
    [repository]
  );

  return { saveResult };
}
