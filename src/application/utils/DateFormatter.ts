/**
 * Utility functions for date formatting
 */
export class DateFormatter {
  /**
   * Format a date value (string or timestamp) to a localized string
   */
  static format(dateValue: string | number): string {
    try {
      const date = typeof dateValue === "string" ? new Date(dateValue) : new Date(dateValue);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  }

  /**
   * Format a date to ISO string for file names
   */
  static toFileName(date: Date = new Date()): string {
    return date.toISOString().replace(/[:.]/g, "-");
  }
}
