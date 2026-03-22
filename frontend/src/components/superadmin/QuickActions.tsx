import { Card, CardContent, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography fontWeight={700} mb={2}>
          Quick Actions
        </Typography>

        <Stack spacing={1.5}>
          <Button
            variant="contained"
            onClick={() => navigate("/super-admin/organizations/create")}
          >
            Create Organization
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/super-admin/organizations")}
          >
            Manage Organizations
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/super-admin/users")}
          >
            View All Users
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}