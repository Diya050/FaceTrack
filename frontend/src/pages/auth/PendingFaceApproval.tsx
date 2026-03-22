import { 
  Typography, 
  Stack, 
  Container, 
  Box, 
  Paper, 
  Button,
  Alert,
  Divider,
  keyframes 
} from "@mui/material";
import { 
  HourglassEmpty, 
  CheckCircleOutline, 
  ContactSupportOutlined,
  ArrowBackIosNew,
  Sync
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const THEME_NAVY = "#30364F";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function PendingFaceApproval() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        width: "100%",
        display: "flex", 
        alignItems: "center", // Vertical center
        justifyContent: "center", // Horizontal center
        bgcolor: "#F8F9FB",
        p: 3,
        mt: 8,
        mb: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 8 },
            borderRadius: "32px",
            border: "1px solid #E0E4EC",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centers children horizontally
            textAlign: "center",
            boxShadow: "0px 20px 40px rgba(48, 54, 79, 0.04)"
          }}
        >
          {/* Centered Icon */}
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              bgcolor: "rgba(48, 54, 79, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              animation: `${pulse} 3s infinite ease-in-out`,
            }}
          >
            <HourglassEmpty sx={{ fontSize: 45, color: THEME_NAVY }} />
          </Box>

          <Stack spacing={2} mb={5} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: THEME_NAVY,
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                letterSpacing: "-0.5px"
              }}
            >
              Review in Progress
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, maxWidth: 380 }}
            >
              We’ve received your biometric samples. Our team is currently 
              verifying your identity to ensure the security of your account.
            </Typography>
          </Stack>

          {/* Status Tracker */}
          <Box 
            sx={{ 
              width: "100%",
              maxWidth: 350,
              bgcolor: "#fff", 
              borderRadius: "20px", 
              p: 2.5, 
              border: "1px solid #F0F2F5",
              mb: 4
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <CheckCircleOutline sx={{ color: "#4CAF50", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={700} color="text.primary">
                  Samples Captured
                </Typography>
              </Stack>
              
              <Divider sx={{ borderStyle: 'dashed', width: "80%", mx: "auto" }} />

              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Sync sx={{ 
                  color: THEME_NAVY, 
                  animation: `${rotate} 4s linear infinite`,
                  fontSize: 20 
                }} />
                <Typography variant="body2" fontWeight={700} color={THEME_NAVY}>
                  Pending Admin Approval
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: "16px", 
              mb: 5,
              width: "100%",
              maxWidth: 400,
              bgcolor: "rgba(2, 136, 209, 0.04)",
              border: "1px solid rgba(2, 136, 209, 0.1)",
              "& .MuiAlert-message": { textAlign: "left" }
            }}
          >
            Please allow up to <strong>2 business days</strong>. You'll be 
            notified as soon as your profile is activated.
          </Alert>

          <Stack spacing={2} width="100%" maxWidth={300}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ArrowBackIosNew sx={{ fontSize: 14 }} />}
              onClick={() => navigate("/dashboard")}
              sx={{
                bgcolor: THEME_NAVY,
                py: 1.8,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                "&:hover": { bgcolor: "#1e2336" }
              }}
            >
              Return to Dashboard
            </Button>
            
            <Button
              variant="text"
              startIcon={<ContactSupportOutlined />}
              sx={{ 
                color: "text.secondary", 
                textTransform: "none",
                fontWeight: 600
              }}
              onClick={() => navigate("/user/support")}
            >
              Need help? Contact Support
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}