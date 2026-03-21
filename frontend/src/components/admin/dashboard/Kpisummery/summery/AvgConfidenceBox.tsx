import { Box, Typography, Stack, alpha } from "@mui/material";
import { FaceRetouchingNatural } from "@mui/icons-material";
import { COLORS } from "../../../../../theme/dashboardTheme";


export default function AvgConfidenceBox({ confidence }: { confidence: number }){
  
  const brandColor = COLORS.early || "#7A9FC2";
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        bgcolor: alpha(brandColor, 0.06), 
        border: `1px solid ${alpha(brandColor, 0.15)}`,
        borderRadius: 3,
        mb: 2,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: COLORS.slate,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Avg Face Confidence
      </Typography>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ mt: 0.5 }}
      >
        <FaceRetouchingNatural
          sx={{ color: brandColor, fontSize: 20 }}
        />
        <Typography
          variant="h4"
          sx={{
            color: brandColor,
            fontWeight: 900,
            fontFamily: "monospace",
          }}
        >
          {confidence}%
        </Typography>
      </Stack>
    </Box>
  );
}