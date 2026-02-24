import {
  Container,
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';

// Custom color palette
const colors = {
  primary: '#30364F',
  secondary: '#ACBAC4',
  accent: '#E1D9BC',
  background: '#F0F0DB',
};

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.background,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: colors.primary,
      fontWeight: 600,
      marginBottom: '24px',
    },
    h2: {
      color: colors.primary,
      fontWeight: 600,
      marginTop: '24px',
      marginBottom: '16px',
    },
    body1: {
      color: colors.primary,
      lineHeight: 1.6,
    },
  },
});

export default function PrivacyPolicy() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: colors.background,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              backgroundColor: '#FFFFFF',
              p: { xs: 4, md: 6 },
              width: '100%',
              border: `2px solid ${colors.accent}`,
              borderRadius: '12px',
            }}
          >
            {/* Header Section */}
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '28px', sm: '34px', md: '40px' },
                  color: colors.primary,
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: colors.secondary, fontSize: '15px' }}
              >
                Last updated: February 2026
              </Typography>
            </Box>

            {/* Introduction */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="body1"
                sx={{ color: colors.primary, fontSize: '16px', lineHeight: 1.8 }}
              >
                We are committed to protecting your privacy and ensuring transparency
                about how we collect, use, and manage your personal data. This Privacy
                Policy outlines our practices regarding data collection and use.
              </Typography>
            </Box>

            {/* Data Collection Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                1. Data Collection
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: colors.primary }}>
                We collect the following types of personal data from our users:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 1 }}>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span><strong>Name:</strong> Your full name to identify you within the system</span>
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span><strong>Email:</strong> Your email address for communication and account management</span>
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span><strong>Face Embedding:</strong> A unique digital representation of your facial features for identification and verification purposes</span>
                </Typography>
              </Box>
            </Box>

            {/* Purpose of Data Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                2. Purpose of Data Collection
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, mb: 2 }}>
                We collect your personal data for the following purposes:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 1 }}>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span>To verify your identity and ensure secure access to your account</span>
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span>To provide and maintain the services offered by our organization</span>
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span>To improve and personalize your experience within the platform</span>
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>•</span>
                  <span>To communicate with you regarding your account and services</span>
                </Typography>
              </Box>
            </Box>

            {/* Face Embedding Storage Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                3. Face Embedding Storage
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, mb: 2 }}>
                We prioritize your privacy by storing only face embeddings rather than raw images.
              </Typography>
              <Box
                sx={{
                  backgroundColor: `rgba(${parseInt(colors.accent.slice(1, 3), 16)}, ${parseInt(colors.accent.slice(3, 5), 16)}, ${parseInt(colors.accent.slice(5, 7), 16)}, 0.15)`,
                  p: 3,
                  borderRadius: '8px',
                  border: `1px solid ${colors.secondary}`,
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ color: colors.primary }}>
                  <strong>What are face embeddings?</strong> Face embeddings are compressed,
                  mathematical representations of facial features generated from images during
                  processing. Unlike raw photographs, embeddings cannot be used to reconstruct
                  the original image, providing an additional layer of privacy protection.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.primary, fontStyle: 'italic' }}>
                Raw images are immediately deleted after processing and are never stored on our servers.
              </Typography>
            </Box>

            {/* Data Usage Limitation Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                4. Data Usage Limitations
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, mb: 2 }}>
                We strictly adhere to the following principles regarding data usage:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 1 }}>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>✓</span>
                  <span><strong>Project-Only Use:</strong> Your data is used exclusively for the purposes of this project and the services we provide to your organization</span>
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1 }}>
                  <span>✗</span>
                  <span><strong>No Misuse:</strong> We will never use your data for any purpose outside of the authorized scope without your explicit consent</span>
                </Typography>
              </Box>
            </Box>

            {/* No Third-Party Sharing Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                5. Third-Party Data Sharing
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, mb: 1.5 }}>
                <strong>We do not share your personal data with any third parties.</strong>{' '}
                Your information remains confidential and is accessible only to authorized
                personnel within our organization who require access to perform their duties.
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, fontSize: '14px', fontStyle: 'italic' }}>
                Exception: Data may be disclosed only if required by law, court order, or government authority.
              </Typography>
            </Box>

            {/* Data Deletion Upon Departure Section */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  color: colors.primary,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  mb: 1.5,
                }}
              >
                6. Data Deletion Upon Leaving the Organization
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, mb: 2 }}>
                When a user leaves the organization, we are committed to protecting your
                privacy by managing your data responsibly:
              </Typography>
              <Box
                sx={{
                  backgroundColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.05)`,
                  p: 3,
                  borderRadius: '8px',
                  border: `2px solid ${colors.primary}`,
                }}
              >
                <Typography variant="body1" sx={{ color: colors.primary, fontWeight: 600, mb: 2 }}>
                  📋 Data Retention & Deletion Policy
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1.5 }}>
                    <span>⏱️</span>
                    <span><strong>One-Month Retention Period:</strong> After a user's departure from the organization, all personal data (name, email, and face embeddings) will be retained for a grace period of thirty (30) days.</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1.5 }}>
                    <span>🗑️</span>
                    <span><strong>Permanent Deletion:</strong> Upon completion of the 30-day period, all personal data will be permanently deleted from our systems and cannot be recovered.</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.primary, display: 'flex', gap: 1.5 }}>
                    <span>🔒</span>
                    <span><strong>No Backups:</strong> Deleted data will not be retained in backup systems and cannot be restored under any circumstances.</span>
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                backgroundColor: colors.primary,
                p: 3,
                borderRadius: '8px',
                textAlign: 'center',
                mt: 2,
              }}
            >
              <Typography variant="body1" sx={{ color: colors.background, fontStyle: 'italic' }}>
                For questions or concerns about this Privacy Policy, please contact our support team.
                We take your privacy seriously and are committed to maintaining the highest standards
                of data protection.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
