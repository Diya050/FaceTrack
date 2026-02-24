import { Box, Typography, Button} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function HeroSection() {
    const theme = useTheme();
  return (
    // <h1>Hero Section</h1>
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "75vh", md: "85vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 0 },
        backgroundImage: `url("/hero.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            90deg,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.4) 50%,
            rgba(0,0,0,0.7) 100%
          )`,
        }}
      />

      {/* <Container sx={{ position: "relative", zIndex: 1 }}> */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            backgroundColor: theme.palette.background.paper,
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            boxShadow: 6,
            textAlign: "center"
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Empower Your Workforce with Seamless Attendance Tracking
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mb={3}
            sx={{
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Transform attendance management with secure facial recognition
            technology designed for modern organizations.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Get Started
          </Button>
        </Box>
      {/* </Container> */}
    </Box>
  );
}

{/* <Box
      sx={{
        position: "relative",
        height: { xs: "70vh", md: "80vh" },
        display: "flex",
        alignItems: "center",
        backgroundImage: `url("/hero.jpg")`, // put hero image in public/images
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      {/* Overlay */}
//       <Box
//         sx={{
//           position: "absolute",
//           inset: 0,
//           bgcolor: "rgba(0,0,0,0.6)",
//         }}
//       />

//       <Container sx={{ position: "relative", zIndex: 1 }}>
//         <Box
//           sx={{
//             maxWidth: 600,
//             bgcolor: "rgba(255,255,255,0.9)",
//             p: 4,
//             borderRadius: 2,
//             color: "text.primary",
//           }}
//         >
//           <Typography variant="h3" fontWeight={700} gutterBottom>
//             Empower Your Workforce with Seamless Attendance Tracking
//           </Typography>

//           <Typography variant="body1" color="text.secondary" mb={3}>
//             Transform attendance management with FaceTrack’s secure,
//             accurate facial recognition solution.
//           </Typography>

//           <Button variant="contained" size="large">
//             Get Started
//           </Button>
//         </Box>
//       </Container>
// </Box> */}