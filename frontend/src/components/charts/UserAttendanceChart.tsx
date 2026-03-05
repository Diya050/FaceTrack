import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserAttendanceChart = () => {
  const data = {
    labels: ["On Time", "Late", "Early Out", "Absent"],
    datasets: [
      {
        data: [15, 3, 2, 1],
        backgroundColor: [
          "#4CAF50",
          "#FFC107",
          "#FF7043",
          "#F44336",
        ],
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default UserAttendanceChart;