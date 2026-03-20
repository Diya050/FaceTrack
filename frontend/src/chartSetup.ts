// src/chartSetup.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register all chart types you use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,   // for WeeklyAttendanceBar
  LineElement,  // for MonthlyTrendLine
  PointElement, // for line chart points
  ArcElement,   // for DepartmentDonut (Doughnut chart)
  Title,
  Tooltip,
  Legend
);
