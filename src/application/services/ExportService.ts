import { Alert, Platform } from "react-native";
import * as XLSX from "xlsx";
import { ResultsRepository } from "@/src/domain/repositories/ResultsRepository";
import { RegularityResultsRepository } from "@/src/domain/repositories/RegularityResultsRepository";
import { SessionRepository } from "@/src/domain/repositories/SessionRepository";
import { ActiveResultExporter } from "./export/ActiveResultExporter";
import { PassiveResultExporter } from "./export/PassiveResultExporter";
import { RegularityResultExporter } from "./export/RegularityResultExporter";
import { SessionExporter } from "./export/SessionExporter";
import { IFileSharer } from "./export/IFileSharer";
import { WebFileSharer } from "./export/WebFileSharer";
import { MobileFileSharer } from "./export/MobileFileSharer";
import { IResultExporter } from "./export/IResultExporter";

export class ExportService {
  private readonly activeRepo: ResultsRepository;
  private readonly passiveRepo: ResultsRepository;
  private readonly regularityRepo: RegularityResultsRepository;
  private readonly sessionRepo: SessionRepository;
  private readonly fileSharer: IFileSharer;

  constructor(
    activeRepo?: ResultsRepository,
    passiveRepo?: ResultsRepository,
    regularityRepo?: RegularityResultsRepository,
    sessionRepo?: SessionRepository
  ) {
    this.activeRepo = activeRepo || new ResultsRepository("activeTestResults");
    this.passiveRepo = passiveRepo || new ResultsRepository("passiveTestResults");
    this.regularityRepo = regularityRepo || new RegularityResultsRepository("regularityTestResults");
    this.sessionRepo = sessionRepo || new SessionRepository();
    
    this.fileSharer = Platform.OS === "web" ? new WebFileSharer() : new MobileFileSharer();
  }

  async exportAllResults(): Promise<void> {
    try {
      const workbook = await this.createWorkbook();
      
      if (!this.hasAnySheets(workbook)) {
        Alert.alert("No Results", "There are no test results to export.");
        return;
      }

      const fileName = this.generateFileName();
      await this.fileSharer.shareWorkbook(workbook, fileName);
    } catch (error) {
      console.error("Error exporting all results:", error);
      Alert.alert("Error", `Failed to export results. Please try again. ${error}`);
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
      // Convert session data to Session models for the exporter
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
