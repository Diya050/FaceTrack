import { Card, CardContent } from "@mui/material";
import SectionLabel from "../shared/SectionLabel";
import AttendanceRateBox from "./AttendanceRateBox";
import AvgConfidenceBox from "./AvgConfidenceBox";
import type { KpiStats } from "../../../../../types/adminAnalytics.types";

export default function TodaySummaryCard({ stats }: { stats: KpiStats }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <SectionLabel>Today at a glance</SectionLabel>
        {/* Pass individual stat values down */}
        <AttendanceRateBox rate={stats.attendance_rate} />
        <AvgConfidenceBox confidence={stats.avg_confidence_score} />
      </CardContent>
    </Card>
  );
}