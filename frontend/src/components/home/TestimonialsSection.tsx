import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useMediaQuery } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const testimonials = [
  {
    name: "Emily Carter",
    role: "IT Manager, Enterprise Corp",
    text: "The monitoring tools provided have given us confidence in our attendance data.",
  },
  {
    name: "John Smith",
    role: "HR Director, Solutions Inc",
    text: "The system’s user-friendly interface accelerated adoption across departments.",
  },
  {
    name: "Emily Smith",
    role: "IT Manager, Enterprise Corp",
    text: "We reduced manual verification dramatically with FaceTrack.",
  },
  {
    name: "Michael Brown",
    role: "Operations Lead, FinTech Ltd",
    text: "Real-time monitoring significantly improved workforce accountability.",
  },
  {
    name: "Sophia Wilson",
    role: "Admin Manager, Global Systems",
    text: "Implementation was seamless and analytics insights are invaluable.",
  },
];

export default function TestimonialsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const visibleCards = isMobile ? 1 : 3;
  const [index, setIndex] = useState(0);

  const maxIndex = testimonials.length - visibleCards;

  const swipeHandlers = useSwipeable({
  onSwipedLeft: () => {
    if (index < maxIndex) setIndex((prev) => prev + 1);;
  },
  onSwipedRight: () => {
    if (index > 0) setIndex((prev) => prev - 1);;
  },
  trackMouse: true, // allows swipe with mouse too
});

  const handleNext = () => {
    setIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          textAlign="center"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.6rem", md: "2.2rem" },
            mb: { xs: 4, md: 6 },
          }}
        >
          Client Testimonials
        </Typography>

        {/* Carousel Wrapper */}
        <Box position="relative">
          {/* Arrows */}
          <IconButton
            onClick={handlePrev}
            disabled={index === 0}
            sx={{
              position: "absolute",
              top: "50%",
              left: -20,
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 2,
              zIndex: 2,
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={index === maxIndex}
            sx={{
              position: "absolute",
              top: "50%",
              right: -20,
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 2,
              zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Viewport */}
          <Box overflow="hidden" {...swipeHandlers}>
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.5s ease",
                transform: `translateX(-${
                  (100 / visibleCards) * index
                }%)`,
              }}
            >
              {testimonials.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: `0 0 ${100 / visibleCards}%`,
                    p: 2,
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          margin: "0 auto 16px",
                          bgcolor: theme.palette.primary.light,
                          color:
                            theme.palette.primary.contrastText,
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>

                      <Typography
                        sx={{ mb: 2, lineHeight: 1.6 }}
                        color="text.secondary"
                      >
                        "{item.text}"
                      </Typography>

                      <Typography fontWeight={600}>
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}