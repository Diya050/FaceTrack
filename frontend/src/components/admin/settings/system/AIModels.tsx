import type { ReactNode } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";

interface ModelSpec {
  label: string;
  value: string;
}

interface ModelCardProps {
  icon: ReactNode;
  name: string;
  role: string;
  description: string;
  badge: string;
  badgeColor: "success" | "info" | "warning";
  specs: ModelSpec[];
  accentColor: string;
}

const ModelCard = ({
  icon,
  name,
  role,
  description,
  badge,
  badgeColor,
  specs,
  accentColor,
}: ModelCardProps) => (
  <Paper
    variant="outlined"
    sx={{
      borderRadius: 2,
      borderColor: "divider",
      overflow: "hidden",
      flex: 1,
      minWidth: 0,
    }}
  >
    {/* Coloured top bar */}
    <Box sx={{ height: 4, bgcolor: accentColor }} />

    <Box sx={{ p: 2.5 }}>
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" spacing={1.5} mb={2}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {name}
            </Typography>
            <Chip
              label={badge}
              color={badgeColor}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {role}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.6}>
        {description}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Spec table */}
      <Table size="small" sx={{ "& td": { px: 0, py: 0.6, border: "none" } }}>
        <TableBody>
          {specs.map(({ label, value }) => (
            <TableRow key={label}>
              <TableCell sx={{ width: "45%", verticalAlign: "top" }}>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  {value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Paper>
);

const AIModels = () => {
  return (
    <Box>
      {/* Section header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PsychologyOutlinedIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            AI Models
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Active models powering face detection and recognition
          </Typography>
        </Box>
        <Box flex={1} />
        <Chip
          label="2 Models Active"
          color="success"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Model cards */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="stretch"
      >
        {/* RetinaFace */}
        <ModelCard
          icon={
            <FaceRetouchingNaturalOutlinedIcon
              sx={{ color: "white", fontSize: 22 }}
            />
          }
          name="RetinaFace"
          role="Face Detection"
          description="Single-stage dense face localisation model. Detects faces and predicts five facial landmarks (eyes, nose, mouth corners) used to align faces before embedding extraction."
          badge="Detection"
          badgeColor="info"
          accentColor="#0288D1"
          specs={[
            { label: "Architecture", value: "ResNet-50 backbone" },
            { label: "Landmark points", value: "5-point (eyes, nose, mouth)" },
            { label: "Input resolution", value: "640 × 640 px" },
            { label: "Multi-scale", value: "Yes — FPN feature pyramid" },
            { label: "Output", value: "Bounding box + landmarks" },
          ]}
        />

        {/* ArcFace */}
        <ModelCard
          icon={
            <HubOutlinedIcon sx={{ color: "white", fontSize: 22 }} />
          }
          name="ArcFace"
          role="Face Recognition & Embedding"
          description="State-of-the-art face recognition model using Additive Angular Margin Loss. Produces a 512-dimensional embedding vector per face that is compared against enrolled biometrics for identity verification."
          badge="Recognition"
          badgeColor="warning"
          accentColor="#ED6C02"
          specs={[
            { label: "Architecture", value: "ResNet-100 / MobileNetV2" },
            { label: "Embedding size", value: "512 dimensions" },
            { label: "Loss function", value: "ArcFace (AAM-Softmax)" },
            { label: "Similarity metric", value: "Cosine similarity" },
            { label: "Output", value: "Normalised face embedding" },
          ]}
        />
      </Stack>

      {/* Pipeline note */}
      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="caption" color="text.secondary" lineHeight={1.7}>
          <strong>Pipeline: </strong>
          Video frame → <strong>RetinaFace</strong> detects &amp; aligns faces →
          aligned crop passed to <strong>ArcFace</strong> → 512-d embedding
          compared against enrolled biometrics using cosine similarity →
          attendance recorded or unknown-face alert raised.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AIModels;