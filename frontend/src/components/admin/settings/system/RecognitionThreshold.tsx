import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Stack,
  Chip,
  Divider,
  Button,
  Alert,
  Tooltip,
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import api from "../../../../services/api";

//  Defaults 
const DEFAULTS = {
  recognitionConfidence: 0.75,
  unknownFaceThreshold: 0.45,
  livenessThreshold: 0.8,
  minFaceSize: 60,
};

//  Helpers 
const confidenceLabel = (value: number) => `${Math.round(value * 100)}%`;

const getConfidenceChip = (
  value: number
): { label: string; color: "success" | "warning" | "error" } => {
  if (value >= 0.8) return { label: "High Accuracy", color: "success" };
  if (value >= 0.6) return { label: "Moderate", color: "warning" };
  return { label: "Low Accuracy", color: "error" };
};

//  ThresholdRow 
interface ThresholdRowProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabelFormat: (v: number) => string;
  onChange: (v: number) => void;
  marks?: { value: number; label: string }[];
}

const ThresholdRow = ({
  label,
  description,
  value,
  min,
  max,
  step,
  valueLabelFormat,
  onChange,
  marks,
}: ThresholdRowProps) => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
      <Typography variant="subtitle2" fontWeight={600} color="text.primary">
        {label}
      </Typography>
      <Tooltip title={description} placement="right" arrow>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "pointer" }} />
      </Tooltip>
      <Box flex={1} />
      <Typography variant="body2" fontWeight={700} color="primary.main">
        {valueLabelFormat(value)}
      </Typography>
    </Stack>
    <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
      {description}
    </Typography>
    <Slider
      value={value}
      min={min}
      max={max}
      step={step}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
      marks={marks}
      onChange={(_, v) => onChange(v as number)}
      sx={{
        color: "primary.main",
        "& .MuiSlider-thumb": {
          width: 18,
          height: 18,
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0 0 0 8px rgba(52, 59, 85, 0.12)",
          },
        },
        "& .MuiSlider-markLabel": { fontSize: "0.7rem" },
      }}
    />
  </Box>
);

const RecognitionThreshold = () => {
  const [values, setValues] = useState({ ...DEFAULTS });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadThresholds = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/organizations/me");

        setValues({
          recognitionConfidence:
            data.recognition_confidence ?? DEFAULTS.recognitionConfidence,
          unknownFaceThreshold:
            data.unknown_face_threshold ?? DEFAULTS.unknownFaceThreshold,
          livenessThreshold: data.liveness_threshold ?? DEFAULTS.livenessThreshold,
          minFaceSize: data.min_face_size ?? DEFAULTS.minFaceSize,
        });
      } catch {
        setError("Failed to load threshold settings from backend.");
      } finally {
        setLoading(false);
      }
    };

    loadThresholds();
  }, []);

  const set = (key: keyof typeof DEFAULTS) => (v: number) => {
    setSaved(false);
    setError("");
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await api.put("/organizations/me", {
        recognition_confidence: values.recognitionConfidence,
        unknown_face_threshold: values.unknownFaceThreshold,
        liveness_threshold: values.livenessThreshold,
        min_face_size: values.minFaceSize,
      });

      setSaved(true);
    } catch {
      setError("Failed to save threshold settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setValues({ ...DEFAULTS });
    setSaved(false);
    setError("");
  };

  const chip = getConfidenceChip(values.recognitionConfidence);

  return (
    <Box>
      {/* Header */}
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
          <TuneIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Recognition Threshold
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Fine-tune face recognition accuracy and sensitivity
          </Typography>
        </Box>
        <Box flex={1} />
        <Chip
          label={chip.label}
          color={chip.color}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {/* Threshold Cards */}
      <Stack spacing={2.5} sx={{ width: "100%" }}>
        {/* Recognition Confidence */}
        <Box>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, borderColor: "divider" }}
          >
            <ThresholdRow
              label="Recognition Confidence"
              description="Minimum confidence score required to identify a known face. Higher values reduce false positives but may miss matches."
              value={values.recognitionConfidence}
              min={0.4}
              max={1}
              step={0.01}
              valueLabelFormat={confidenceLabel}
              onChange={set("recognitionConfidence")}
              marks={[
                { value: 0.4, label: "40%" },
                { value: 0.7, label: "70%" },
                { value: 1.0, label: "100%" },
              ]}
            />
          </Paper>
        </Box>

        {/* Unknown Face Threshold */}
        <Box>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, borderColor: "divider" }}
          >
            <ThresholdRow
              label="Unknown Face Threshold"
              description="Faces with confidence below this value are flagged as unknown. Lower values increase unknown detections."
              value={values.unknownFaceThreshold}
              min={0.2}
              max={0.8}
              step={0.01}
              valueLabelFormat={confidenceLabel}
              onChange={set("unknownFaceThreshold")}
              marks={[
                { value: 0.2, label: "20%" },
                { value: 0.5, label: "50%" },
                { value: 0.8, label: "80%" },
              ]}
            />
          </Paper>
        </Box>

        {/* Liveness Detection */}
        <Box>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, borderColor: "divider" }}
          >
            <ThresholdRow
              label="Liveness Detection"
              description="Minimum liveness score to accept a face as genuine (anti-spoofing). Raise to prevent photo/video attacks."
              value={values.livenessThreshold}
              min={0.5}
              max={1}
              step={0.01}
              valueLabelFormat={confidenceLabel}
              onChange={set("livenessThreshold")}
              marks={[
                { value: 0.5, label: "50%" },
                { value: 0.75, label: "75%" },
                { value: 1.0, label: "100%" },
              ]}
            />
          </Paper>
        </Box>

        {/* Minimum Face Size */}
        <Box>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, borderColor: "divider" }}
          >
            <ThresholdRow
              label="Minimum Face Size (px)"
              description="Faces smaller than this pixel size are ignored. Increase to filter out distant or blurry detections."
              value={values.minFaceSize}
              min={20}
              max={200}
              step={5}
              valueLabelFormat={(v) => `${v}px`}
              onChange={set("minFaceSize")}
              marks={[
                { value: 20, label: "20px" },
                { value: 100, label: "100px" },
                { value: 200, label: "200px" },
              ]}
            />
          </Paper>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Info alert */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Changes take effect on the next recognition cycle. Lowering thresholds
        improves recall but may increase false identifications. Test in a
        controlled environment before deploying to production.
      </Alert>

      {/* Save / Reset */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<RestartAltOutlinedIcon />}
          onClick={handleReset}
          disabled={loading || saving}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          disabled={loading || saving}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          {loading ? "Loading..." : saving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>

      {saved && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          Threshold settings saved successfully.
        </Alert>
      )}
    </Box>
  );
};

export default RecognitionThreshold;