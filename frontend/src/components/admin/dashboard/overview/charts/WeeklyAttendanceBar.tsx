import { Bar } from "react-chartjs-2";
import { COLORS } from "../../../../../theme/dashboardTheme";
import { getChartScales, getChartTooltip } from "../shared/ChartConstants";
import ChartWrapper from "../shared/ChartWrapper";
import { mockWeeklyReport } from "../../../../../data/dashboard.mock";

export default function WeeklyAttendanceBar() {
  const data = {
    labels: mockWeeklyReport.labels,
    datasets: [
      { 
        label: "Present", 
        data: mockWeeklyReport.present, 
        backgroundColor: COLORS.present, 
        borderRadius: 6, 
        borderSkipped: false as const,
        barThickness: 12,
      },
      { 
        label: "Absent",  
        data: mockWeeklyReport.absent,  
        backgroundColor: COLORS.absent,  
        borderRadius: 6, 
        borderSkipped: false as const,
        barThickness: 12,
      },
      { 
        label: "Late",    
        data: mockWeeklyReport.late,    
        backgroundColor: COLORS.late,    
        borderRadius: 6, 
        borderSkipped: false as const,
        barThickness: 12,
      },
    ],
  };

  return (
    <ChartWrapper 
      label="This Week" 
      title="Weekly Attendance"
    >
      <Bar 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: getChartTooltip() },
          scales: getChartScales(),
        }} 
      />
    </ChartWrapper>
  );
}