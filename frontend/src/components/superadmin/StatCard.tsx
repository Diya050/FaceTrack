import { Card, CardContent, Typography, Stack } from "@mui/material";

export default function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography fontSize={13} color="text.secondary">
            {title}
          </Typography>

          <Typography fontSize={28} fontWeight={700}>
            {value}
          </Typography>

          {subtitle && (
            <Typography fontSize={12} color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}