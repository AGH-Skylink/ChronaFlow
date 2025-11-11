/**
 * Utility functions for date formatting
 */
export class DateFormatter {
  static format(dateValue: string | number): string {
    try {
      const date = typeof dateValue === "string" ? new Date(dateValue) : new Date(dateValue);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  }

  static toFileName(date: Date = new Date()): string {
    return date.toISOString().replace(/[:.]/g, "-");
  }
}
