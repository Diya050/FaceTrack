import { Bar } from "react-chartjs-2";

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Work Hours",
      data: [7.5, 8, 6.5, 7.8, 8.2],
      backgroundColor: "#3f51b5",
      borderRadius: 6,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
};

const UserWeeklyAttendanceChart = () => {
  return (
    <div style={{ height: 250 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserWeeklyAttendanceChart;