import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

interface Props {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  email: string;
}

export default function TeamMemberCard({
  name,
  role,
  image,
  linkedin,
  email,
}: Props) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box position="relative">
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{
            height: 300,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: 3,
            px: 2,
            py: 1.2,
            minWidth: "78%",
            textAlign: "center",
            boxShadow: 2,
          }}
        >
          <Typography fontWeight={600} fontSize="0.95rem" lineHeight={1.2}>
            {name}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={0.5}
          >
            {role}
          </Typography>

          <Box display="flex" justifyContent="center" gap={1}>
            <Tooltip title="LinkedIn">
              <IconButton
                size="small"
                component="a"
                href={linkedin}
                target="_blank"
                sx={{ color: "#0A66C2" }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Email">
              <IconButton
                size="small"
                component="a"
                href={`mailto:${email}`}
                sx={{ color: "text.primary" }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}