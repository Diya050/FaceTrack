// src/pages/admin/dashboard/shared/ChartConstants.ts
export const getChartScales = () => ({
  x: {
    grid: { display: false },
    ticks: { color: "#94A3B8", font: { size: 11 } },
  },
  y: {
    grid: { color: "#F1F5F9", drawBorder: false },
    ticks: { color: "#94A3B8", font: { size: 11 } },
    border: { display: false },
  },
});

export const getChartTooltip = () => ({
  backgroundColor: "#1F2937",
  titleColor: "#F9FAFB",
  bodyColor: "#D1D5DB",
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
});