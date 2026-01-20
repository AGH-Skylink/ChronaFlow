import { Session } from "@/src/domain/session/Session";
import { SessionBlock } from "@/types/session";
import { IResultExporter } from "./IResultExporter";

export class SessionExporter implements IResultExporter<Session> {
  getSheetName(): string {
    return "Sessions";
  }

  toWorksheetData(sessions: Session[]): any[] {
    return sessions.map((session) => ({
      "Session ID": session.id,
      Name: session.name,
      "Created At": new Date(session.createdAt).toLocaleString(),
      "Test Blocks": session.blocks.map((block: SessionBlock) => block.type).join(", "),
    }));
  }
}
