import { 
  Typography, 
  Stack,
  Container 
} from "@mui/material";
import AuthLayout from "../../layouts/AuthLayout";

export default function PendingApproval() {
  return (
    <AuthLayout>
      <Container
        maxWidth="sm"
        sx={{
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack
          spacing={{ xs: 2, sm: 3 }}
          alignItems="center"
          textAlign="center"
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
              },
              fontWeight: 600,
            }}
          >
            Registration Submitted
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 420,
            }}
          >
            Your account is pending admin approval.
            You will be notified once approved.
          </Typography>
        </Stack>
      </Container>
    </AuthLayout>
  );
}
