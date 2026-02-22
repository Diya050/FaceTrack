import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  CheckCircleOutline,
} from "@mui/icons-material";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 10,
      }}
    >
      <Container maxWidth="lg">

        {/* ================= HERO TEXT ================= */}
        <Box textAlign="center" mb={8}>
          <Typography mt={3} variant="h5">
            <strong>CONTACT US</strong>
          </Typography>

          <Typography variant="h3" fontWeight="bold">
            We are always ready to help you and answer your questions
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mt={2}
            maxWidth={650}
            mx="auto"
          >
            Have questions about FaceTrack? Reach out anytime and our team will
            get back to you quickly.
          </Typography>

        </Box>

        {/* ================= INFO CARDS ================= */}
        <Grid container spacing={4} mb={8}>
          {[
            {
              icon: <LocationOn sx={{ fontSize: 35 }} />,
              title: "Our Location",
              subtitle: "Argusoft, India",
            },
            {
              icon: <Phone sx={{ fontSize: 35 }} />,
              title: "Phone Number",
              subtitle: "+91 xxx xxx xx67",
              link: "tel:+91xxxxxxxx67",
            },
            {
              icon: <Email sx={{ fontSize: 35 }} />,
              title: "Email Us",
              subtitle: "facetrack.project@gmail.com",
              link: "mailto:facetrack.project@gmail.com",
            },
            {
              icon: <AccessTime sx={{ fontSize: 35 }} />,
              title: "Working Hours",
              subtitle: "Mon - Sat: 9:00 - 5:00",
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, md: 3 }} key={index}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, #1e2338 0%, #2f3655 100%)",
                  color: "white",
                  textDecoration: "none",
                  cursor: item.link ? "pointer" : "default",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  },
                }}
              >
                {item.icon}
                <Typography variant="h6" mt={2}>
                  {item.title}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {item.subtitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ================= MAP + FORM ================= */}
        <Paper sx={{ borderRadius: 4, p: 5 }}>
          <Grid container spacing={6} alignItems="stretch">

            {/* MAP */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <iframe
                  src="https://www.google.com/maps?q=23.241813,72.627509&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </Box>
            </Grid>

            {/* FORM */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" fontWeight="bold" mb={3}>
                Get In Touch
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  margin="normal"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #2f3655 0%, #1e2338 100%)",
                  }}
                >
                  Send a message
                </Button>
              </Box>
            </Grid>

          </Grid>
        </Paper>

      </Container>

      {/* ================= SUCCESS POPUP ================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: "#eeecd9",
            borderRadius: 6,
            border: "4px solid #2f3655",
            px: 6,
            py: 5,
            textAlign: "center",
            maxWidth: 500,
            width: "90%",
          },
        }}
      >
        <DialogContent>

          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "6px solid #2f3655",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircleOutline
              sx={{
                fontSize: 60,
                color: "#2f3655",
              }}
            />
          </Box>

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: "#2f3655", mb: 2 }}
          >
            Success!
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#2f3655", mb: 4 }}
          >
            Your message has been sent.
            <br />
            We’ll get back to you soon.
          </Typography>

        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 4,
              fontWeight: "bold",
              backgroundColor: "#2f3655",
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#1e2338",
              },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactPage;