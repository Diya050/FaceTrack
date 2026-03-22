import { Card, CardContent, Typography, Stack } from "@mui/material";

const activities = [
  "New organization 'Argusoft' created",
  "User approved in TechCorp",
  "Face enrollment completed",
  "Attendance anomaly detected",
];

export default function ActivityFeed() {
  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography fontWeight={700} mb={2}>
          Recent Activity
        </Typography>

        <Stack spacing={1}>
          {activities.map((item, i) => (
            <Typography key={i} variant="body2">
              • {item}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}