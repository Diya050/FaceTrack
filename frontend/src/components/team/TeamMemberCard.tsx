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
        borderRadius: 7,
        overflow: "hidden",
        backgroundColor: "#F0F0DB",
        boxShadow: "0 18px 40px -15px rgba(0,0,0,0.35)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 28px 55px -18px rgba(0,0,0,0.45)",
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
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 3,
            px: 2.5,
            py: 0.85,
            minWidth: "75%",
            textAlign: "center",
            border: "1px solid #ACBAC4",
          }}
        >
          <Typography fontWeight={600} color="#30364F">
            {name}
          </Typography>

          <Typography
            variant="caption"
            color="#30364F"
            sx={{ opacity: 0.95 }}
            display="block"
          >
            {role}
          </Typography>

          <Box display="flex" justifyContent="center" gap={1} mt={0.5}>
            <Tooltip title="LinkedIn">
              <IconButton
                size="small"
                component="a"
                href={linkedin}
                target="_blank"
                sx={{ color: "#0A66C2" }}
              >
                <LinkedInIcon fontSize="medium" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Email">
              <IconButton
                size="small"
                component="a"
                href={`mailto:${email}`}
                sx={{ color: "#30364F" }}
              >
                <EmailIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}