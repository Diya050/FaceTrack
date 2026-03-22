import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import * as faceapi from "face-api.js";
import { useAuth } from "../../context/AuthContext";
import { 
  CameraAlt, Replay, 
  Close as CloseIcon,
  VideocamOff,
  AutoFixHigh,
  TouchApp
} from "@mui/icons-material";
import { 
  Typography, Box, Alert, AlertTitle, Collapse, 
  IconButton, Stack, Grid, Button, LinearProgress,
  FormControlLabel, Switch, Tooltip 
} from "@mui/material";

/**
 * CONFIGURATION & THEME
 */
const POSE_REQUIREMENTS = { CENTER: 3, LEFT: 2, RIGHT: 2 };
const MAX_IMAGES = 7;
const MIN_IMAGES = 7;
const THEME_NAVY = "#30364F";

type Pose = "CENTER" | "LEFT" | "RIGHT" | "UNKNOWN";

const BADGE_MAP: Record<string, { bg: string; color: string; text: string }> = {
  active: { bg: "#E8F5E9", color: "#2E7D32", text: "Active" },
  pending: { bg: "#FFF3E0", color: "#EF6C00", text: "Pending Approval" },
  default: { bg: "#FFEBEE", color: "#D32F2F", text: "Required" }
};

export default function FaceEnrollment() {
  const navigate = useNavigate();
  const { status, role } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const overlayRef = useRef<HTMLCanvasElement>(null); 
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<faceapi.WithFaceLandmarks<any> | null>(null);
  
  const countsRef = useRef({ CENTER: 0, LEFT: 0, RIGHT: 0 });
  const autoCaptureRef = useRef(false);
  const lastCaptureTimeRef = useRef(0);

  const [images, setImages] = useState<File[]>([]);
  const [capturedCounts, setCapturedCounts] = useState({ CENTER: 0, LEFT: 0, RIGHT: 0 });
  const [currentPose, setCurrentPose] = useState<Pose>("UNKNOWN");
  const [loading, setLoading] = useState(false);
  const [faceValid, setFaceValid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Initializing biometrics...");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAutoCapture, setIsAutoCapture] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  useEffect(() => {
    autoCaptureRef.current = isAutoCapture;
  }, [isAutoCapture]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const res = await api.get("/notifications/");
        const rejection = res.data.find((n: any) => n.event_type === "FACE_ENROLLMENT_REJECTED" && !n.is_read);
        if (rejection) { 
          setRejectionReason(rejection.message); 
          setShowBanner(true); 
        }
      } catch (err) { console.error("Notification check failed", err); }

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models")
        ]);
        setStatusMessage("Ready to begin");
      } catch (err) { setStatusMessage("Error: AI models failed to load"); }
    };
    initialize();
    return () => stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCapturing(false);
    setFaceValid(false);
    setStatusMessage("Camera Stopped");
  }, []);

  const getPose = (landmarks: faceapi.FaceLandmarks68): Pose => {
    const nose = landmarks.positions[27].x;
    const leftJaw = landmarks.positions[0].x;
    const rightJaw = landmarks.positions[16].x;
    const ratio = (nose - leftJaw) / (rightJaw - nose);
    if (ratio > 2.2) return "RIGHT";
    if (ratio < 0.45) return "LEFT";
    return "CENTER";
  };

  const captureImage = useCallback(() => {
    if (!lastDetectionRef.current || !videoRef.current || !canvasRef.current) return;
    
    const pose = getPose(lastDetectionRef.current.landmarks);
    if (pose === "UNKNOWN") return;

    const currentCount = countsRef.current[pose as keyof typeof POSE_REQUIREMENTS];
    if (currentCount >= POSE_REQUIREMENTS[pose as keyof typeof POSE_REQUIREMENTS]) return;

    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `face-${pose}-${Date.now()}.jpg`, { type: "image/jpeg" });
        setImages(prev => [...prev, file]);
        const next = { ...countsRef.current, [pose]: countsRef.current[pose as keyof typeof POSE_REQUIREMENTS] + 1 };
        countsRef.current = next;
        setCapturedCounts(next);
        lastCaptureTimeRef.current = Date.now();
      }
    }, "image/jpeg", 0.95);
  }, []);

  const runDetection = () => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    faceapi.matchDimensions(overlay, displaySize);

    detectionIntervalRef.current = window.setInterval(async () => {
      if (video.paused || video.ended) return;

      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const ctx = overlay.getContext("2d");
      ctx?.clearRect(0, 0, overlay.width, overlay.height);

      if (!detection) {
        setFaceValid(false);
        setCurrentPose("UNKNOWN");
        setStatusMessage("Searching for face...");
        return;
      }

      const resized = faceapi.resizeResults(detection, displaySize);
      lastDetectionRef.current = resized;
      
      const pose = getPose(resized.landmarks);
      setCurrentPose(pose);

      const isLargeEnough = resized.detection.box.width > 120;
      const stillNeedsPose = countsRef.current[pose as keyof typeof POSE_REQUIREMENTS] < POSE_REQUIREMENTS[pose as keyof typeof POSE_REQUIREMENTS];
      const isValid = isLargeEnough && stillNeedsPose;
      
      setFaceValid(isValid);

      if (isValid && autoCaptureRef.current && (Date.now() - lastCaptureTimeRef.current > 1500)) {
        captureImage();
      }

      setStatusMessage(!isLargeEnough ? "Move closer" : !stillNeedsPose ? `${pose} done. Turn head.` : `Perfect! ${autoCaptureRef.current ? 'Capturing...' : ''}`);

      if (ctx) {
        ctx.strokeStyle = isValid ? "#4CAF50" : "#F44336";
        ctx.lineWidth = 3;
        const { x, y, width, height } = resized.detection.box;
        ctx.strokeRect(x, y, width, height);
      }
    }, 150);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCapturing(true);
          runDetection();
        };
      }
    } catch (err) { alert("Camera access denied."); }
  };

  const handleReset = () => {
    setImages([]);
    countsRef.current = { CENTER: 0, LEFT: 0, RIGHT: 0 };
    setCapturedCounts({ CENTER: 0, LEFT: 0, RIGHT: 0 });
    lastCaptureTimeRef.current = 0;
  };

  const submitEnrollment = async () => {
    setLoading(true);
    const formData = new FormData();
    images.forEach(img => formData.append("files", img));
    try {
      stopCamera();
      await api.post("/face-enrollment/capture", formData);
      alert("Biometric Data Securely Uploaded.");
      navigate(role === "USER" ? "/dashboard" : "/admin/dashboard");
    } catch (err) { alert("Upload failed."); } finally { setLoading(false); }
  };

  const badge = BADGE_MAP[(status || "default").toLowerCase()] || BADGE_MAP.default;

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", padding: "80px 24px", color: THEME_NAVY }}>
      <Collapse in={showBanner}>
        <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: "12px" }} action={<IconButton color="inherit" onClick={() => setShowBanner(false)}><CloseIcon /></IconButton>}>
          <AlertTitle sx={{ fontWeight: 800 }}>Enrollment Rejected</AlertTitle>
          {rejectionReason}
        </Alert>
      </Collapse>

      {/* HEADER WITH STATUS BADGE */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4, borderBottom: "1px solid #eee", pb: 2, pl:4, pr:4, mt: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Biometric Enrollment</Typography>
          <Typography color="text.secondary">Register your face for the FaceTrack platform.</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#999", display: 'block', mr:1, mb:0.5, fontSize: 15 }}>STATUS</Typography>
          <Box sx={{ bgcolor: badge.bg, color: badge.color, px: 2, py: 0.5, borderRadius: 2, fontWeight: 700 }}>
            {badge.text}
          </Box>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ bgcolor: "#F8F9FB", borderRadius: "24px", p: 3, border: '1px solid #E0E4EC' }}>
            
            {/* TOOLBAR WITH TOGGLES AND STOP BUTTON */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <FormControlLabel
                control={<Switch checked={isAutoCapture} onChange={(e) => setIsAutoCapture(e.target.checked)} color="primary" />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    {isAutoCapture ? <AutoFixHigh fontSize="small" color="primary"/> : <TouchApp fontSize="small"/>}
                    <Typography variant="body2" fontWeight={700}>
                      {isAutoCapture ? "Auto-Capture Mode" : "Manual Capture"}
                    </Typography>
                  </Stack>
                }
              />
              {isCapturing && (
                <Button size="small" color="error" variant="outlined" startIcon={<VideocamOff />} onClick={stopCamera} sx={{ fontWeight: 700, borderRadius: '8px' }}>
                  Stop Camera
                </Button>
              )}
            </Stack>

            <Box sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", bgcolor: "#111", aspectRatio: "4/3", border: `4px solid ${faceValid ? "#4CAF50" : "#ddd"}` }}>
              {!isCapturing && (
                <Stack sx={{ position: "absolute", inset: 0, zIndex: 5 }} alignItems="center" justifyContent="center">
                  <Button variant="contained" startIcon={<CameraAlt />} onClick={startCamera} sx={{ bgcolor: "white", color: THEME_NAVY, fontWeight: 800 }}>
                    Initialize Camera
                  </Button>
                </Stack>
              )}
              <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <canvas ref={overlayRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />
            </Box>
            
            <Typography sx={{ textAlign: "center", mt: 2, fontWeight: 700, color: faceValid ? "success.main" : "text.secondary" }}>
              {statusMessage}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button fullWidth variant="contained" disabled={!faceValid || isAutoCapture || images.length >= MAX_IMAGES} onClick={captureImage} sx={{ bgcolor: THEME_NAVY, py: 1.5, fontWeight: 800 }}>
                {isAutoCapture ? "Auto-Capture Active" : `Capture ${currentPose !== "UNKNOWN" ? currentPose : ""} Pose`}
              </Button>
              <Tooltip title="Reset All Images">
                <Button variant="outlined" onClick={handleReset} sx={{ minWidth: "56px" }}><Replay /></Button>
              </Tooltip>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: "24px", border: "1px solid #eee", height: "100%" }}>
            <Typography variant="h6" fontWeight={800} mb={2}>Enrollment Requirements</Typography>
            <Stack spacing={2} mb={4}>
              <PoseProgress label="Front View" current={capturedCounts.CENTER} total={POSE_REQUIREMENTS.CENTER} />
              <PoseProgress label="Left View" current={capturedCounts.LEFT} total={POSE_REQUIREMENTS.LEFT} />
              <PoseProgress label="Right View" current={capturedCounts.RIGHT} total={POSE_REQUIREMENTS.RIGHT} />
            </Stack>
            <Grid container spacing={1}>
              {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <Grid size={{ xs: 4 }} key={i}>
                  <Box sx={{ aspectRatio: "1/1", borderRadius: 2, bgcolor: "#F0F2F5", border: "2px dashed #ccc", overflow: "hidden" }}>
                    {images[i] && <img src={URL.createObjectURL(images[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="face" />}
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button fullWidth variant="contained" color="success" disabled={loading || images.length < MIN_IMAGES} onClick={submitEnrollment} sx={{ mt: 3, py: 2, borderRadius: 4, fontWeight: 800 }}>
              {loading ? "Processing..." : "Complete Enrollment"}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Box>
  );
}

const PoseProgress = ({ label, current, total }: { label: string, current: number, total: number }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between" mb={0.5}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      <Typography variant="caption" fontWeight={700}>{current}/{total}</Typography>
    </Stack>
    <LinearProgress variant="determinate" value={(current / total) * 100} sx={{ height: 8, borderRadius: 4 }} color={current === total ? "success" : "primary"} />
  </Box>
);