import { Card, CardContent } from "@mui/material";
import SectionLabel from "../shared/SectionLabel";
import AttendanceRateBox from "./AttendanceRateBox";
import AvgConfidenceBox from "./AvgConfidenceBox";

export default function TodaySummaryCard() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <SectionLabel>Today at a glance</SectionLabel>
        <AttendanceRateBox />
        <AvgConfidenceBox />
      </CardContent>
    </Card>
  );
}