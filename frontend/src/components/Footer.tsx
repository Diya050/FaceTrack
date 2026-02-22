import React from "react";
import {
  Box,
  Container,
  Link as MuiLink,
  Typography,
  IconButton,
  Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme, alpha } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

interface FooterLink {
  label: string;
  path: string;
}

const footerLinks: FooterLink[] = [
  { label: "Meet Our Team", path: "/team" },
  { label: "Contact Us", path: "/contact" },
  { label: "Features", path: "/features" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "About Technology", path: "/about-technology" },
  { label: "FAQs", path: "/faqs" },
  { label: "Help Center", path: "/help-center" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of Use", path: "/terms-of-use" }
];

const Footer: React.FC = () => {
  const theme = useTheme();
  const contrastText = theme.palette.getContrastText(
    theme.palette.primary.main
  );

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main} 0%, 
          ${theme.palette.primary.dark} 100%)`,
        color: contrastText,
        pt: 8,
        pb: 4,
        boxShadow: theme.shadows[6]
      }}
    >
      <Container maxWidth="lg">

        {/* ===== TOP SECTION ===== */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr"
            },
            gap: 6
          }}
        >

          {/* Links */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr"
              },
              gap: 2
            }}
          >
            {footerLinks.map((link) => (
              <MuiLink
                key={link.path}
                component={Link}
                to={link.path}
                underline="none"
                sx={{
                  color: alpha(contrastText, 0.85),
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: contrastText,
                    transform: "translateX(4px)"
                  }
                }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Box>

          {/* Brand + Social */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-end" },
              gap: 3
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none"
              }}
            >
            <Box
              component="img"
              src="/logo.svg"
              alt="FaceTrack Logo"
              sx={{
                height: 60,
                filter: "brightness(0) invert(1)" // ensures white logo on primary bg
              }}
            />
            </Box>

            <Box>
              {[FacebookIcon, TwitterIcon, InstagramIcon].map(
                (Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: alpha(contrastText, 0.8),
                      "&:hover": {
                        color: contrastText,
                        backgroundColor: alpha(contrastText, 0.1)
                      }
                    }}
                  >
                    <Icon />
                  </IconButton>
                )
              )}
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            my: 5,
            borderColor: alpha(contrastText, 0.25)
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: alpha(contrastText, 0.8) }}>
            © {new Date().getFullYear()} FaceTrack. All rights reserved.
          </Typography>

          <Typography variant="body2" sx={{ color: alpha(contrastText, 0.8) }}>
            Enterprise Facial Recognition Platform
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;