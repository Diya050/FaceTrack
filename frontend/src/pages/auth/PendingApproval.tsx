import { Typography, Box } from "@mui/material";
import AuthLayout from "../../layouts/AuthLayout";

export default function PendingApproval() {
  return (
    <AuthLayout>
      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Registration Submitted
        </Typography>

        <Typography color="text.secondary">
          Your account is pending admin approval.
          You will be notified once approved.
        </Typography>
      </Box>
    </AuthLayout>
  );
}
