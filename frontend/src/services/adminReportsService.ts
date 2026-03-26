import api from "./api"; // Your pre-configured axios instance
import type { ExportFormat } from "../types/reportsAdmin.types";
import type { WorkingHoursResponse, RecentDetectionsResponse } from "../types/reportsAdmin.types";


export const fetchWorkingHoursAnalytics = async (): Promise<WorkingHoursResponse> => {
  // Backend automatically detects role using JWT and returns either Dept-Data or Date-Data
  const res = await api.get("/analytics/working-hours");
  return res.data;
};

export const fetchRecentDetections = async (): Promise<RecentDetectionsResponse> => {
  const res = await api.get("/analytics/recent-detections");
  return res.data;
};


export const downloadAttendanceExport = async (format: ExportFormat, targetDate?: string): Promise<void> => {
  const response = await api.get("/analytics/export-logs", {
    params: {
      format: format,
      target_date: targetDate, // Optional: defaults to Today in backend if omitted
    },
    responseType: "blob", // 👈 Vital for getting raw binary PDF/CSV files
  });

  // Create client-side simulated hyperlink to force standard browser download UI
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  
  link.href = url;
  link.setAttribute("download", `attendance_report_${targetDate || "today"}.${format}`);
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up memory after trigger
  link.remove();
  window.URL.revokeObjectURL(url);
};