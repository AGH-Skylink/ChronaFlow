export class NoResultsError extends Error {
  constructor() {
    super("There are no test results to export.");
    this.name = "NoResultsError";
  }
}

export class ExportFailedError extends Error {
  constructor(cause?: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    super(`Failed to export results: ${message}`);
    this.name = "ExportFailedError";
    this.cause = cause;
  }
}

export class SharingUnavailableError extends Error {
  constructor(public readonly filePath: string) {
    super(`Sharing is not available. File saved to: ${filePath}`);
    this.name = "SharingUnavailableError";
  }
}
