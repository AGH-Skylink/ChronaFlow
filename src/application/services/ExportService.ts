import * as XLSX from "xlsx-js-style";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { ActiveResultExporter } from "./export/ActiveResultExporter";
import { PassiveResultExporter } from "./export/PassiveResultExporter";
import { RegularityResultExporter } from "./export/RegularityResultExporter";
import { SessionExporter } from "./export/SessionExporter";
import { FileShareMode, IFileSharer } from "@/src/application/ports/IFileSharer";
import { IResultExporter } from "./export/IResultExporter";
import { Result, success, failure } from "@/src/domain/types/Result";
import { NoResultsError, ExportFailedError } from "@/src/application/errors/ExportErrors";

export class ExportService {
  private readonly activeRepo: ResultsRepository;
  private readonly passiveRepo: ResultsRepository;
  private readonly regularityRepo: RegularityResultsRepository;
  private readonly sessionRepo: SessionRepository;
  private readonly fileSharer: IFileSharer;

  constructor(
    activeRepo: ResultsRepository,
    passiveRepo: ResultsRepository,
    regularityRepo: RegularityResultsRepository,
    sessionRepo: SessionRepository,
    fileSharer: IFileSharer
  ) {
    this.activeRepo = activeRepo;
    this.passiveRepo = passiveRepo;
    this.regularityRepo = regularityRepo;
    this.sessionRepo = sessionRepo;
    this.fileSharer = fileSharer;
  }

  async exportAllResults(
    mode: FileShareMode = "share"
  ): Promise<Result<void, NoResultsError | ExportFailedError>> {
    try {
      const workbook = await this.createWorkbook();
      
      if (!this.hasAnySheets(workbook)) {
        return failure(new NoResultsError());
      }

      const fileName = this.generateFileName();
      const shareResult = await this.fileSharer.shareWorkbook(
        workbook,
        fileName,
        mode
      );
      
      if (!shareResult.success) {
        return failure(new ExportFailedError(shareResult.error));
      }

      return success(undefined);
    } catch (error) {
      console.error("Error exporting all results:", error);
      return failure(new ExportFailedError(error));
    }
  }

  private async createWorkbook(): Promise<XLSX.WorkBook> {
    const workbook = XLSX.utils.book_new();

    await this.addSheetIfHasData(
      workbook,
      this.activeRepo,
      new ActiveResultExporter()
    );

    await this.addSheetIfHasData(
      workbook,
      this.passiveRepo,
      new PassiveResultExporter()
    );

    await this.addSheetIfHasData(
      workbook,
      this.regularityRepo,
      new RegularityResultExporter()
    );

    await this.addSessionSheet(workbook);

    return workbook;
  }

  private async addSheetIfHasData<T>(
    workbook: XLSX.WorkBook,
    repository: { loadAll: () => Promise<T[]> },
    exporter: IResultExporter<T>
  ): Promise<void> {
    const results = await repository.loadAll();
    
    if (results.length > 0) {
      const data = exporter.toWorksheetData(results);
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, exporter.getSheetName());
    }
  }

  private async addSessionSheet(workbook: XLSX.WorkBook): Promise<void> {
    const sessions = await this.sessionRepo.getAll();
    
    if (sessions.length > 0) {
      const exporter = new SessionExporter();
      const sessionModels = sessions.map(s => ({
        id: s.id,
        name: s.name,
        createdAt: s.createdAt,
        blocks: s.blocks,
      }));
      
      const data = exporter.toWorksheetData(sessionModels as any);
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, exporter.getSheetName());
    }
  }

  private hasAnySheets(workbook: XLSX.WorkBook): boolean {
    return workbook.SheetNames.length > 0;
  }

  private generateFileName(): string {
    const fileDate = new Date().toISOString().replace(/[:.]/g, "-");
    return `all_test_results_${fileDate}.xlsx`;
  }
}
