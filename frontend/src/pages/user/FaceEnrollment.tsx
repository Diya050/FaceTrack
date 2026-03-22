import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import * as faceapi from "face-api.js";
import { useAuth } from "../../context/AuthContext";
import { 
  CheckCircle, CameraAlt, Replay, 
  InfoOutlined, VideocamOff, Close as CloseIcon,
  ErrorOutline
} from "@mui/icons-material";
import { 
  Typography, Box, Alert, AlertTitle, Collapse, 
  IconButton, Stack, Grid, Button 
} from "@mui/material";

const MAX_IMAGES = 7;
const MIN_IMAGES = 5;
const THEME_NAVY = "#30364F";

type BadgeStyle = { bg: string; color: string; text: string };
const BADGE_MAP: Record<string, BadgeStyle> = {
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

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [faceValid, setFaceValid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Initializing biometrics...");
  const [isCapturing, setIsCapturing] = useState(false);
  
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);
  const [enrollmentRequestMsg, setEnrollmentRequestMsg] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  const detectionIntervalRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<faceapi.WithFaceLandmarks<any> | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const res = await api.get("/notifications/");
        const rejection = res.data.find((n: any) => 
            n.event_type === "FACE_ENROLLMENT_REJECTED" && !n.is_read
        );

        if (rejection) {
          setActiveNotificationId(rejection.id);
          setRejectionReason(rejection.message);
          setShowBanner(true);
        } else {
          const task = res.data.find((n: any) => 
              n.event_type === "FACE_ENROLLMENT_REQUESTED" && !n.is_read
          );
          if (task) {
            setActiveNotificationId(task.id);
            setEnrollmentRequestMsg(task.message);
            setShowBanner(true);
          }
        }
      } catch (err) {
        console.error("Notification check failed", err);
      }

      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setStatusMessage("Ready to begin");
      } catch (err) {
        setStatusMessage("Error: Failed to load AI models");
      }
    };

    initialize();
    return () => stopCamera();
  }, []);

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
    } catch (err) {
      alert("Please enable camera permissions.");
    }
  };

  const stopCamera = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCapturing(false);
    setFaceValid(false);
  };

  const runDetection = () => {
    if (!videoRef.current || !overlayRef.current) return;
    const video = videoRef.current;
    const canvas = overlayRef.current;
    const ctx = canvas.getContext("2d");

    detectionIntervalRef.current = window.setInterval(async () => {
      if (video.paused || video.ended) return;
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (!detection) {
        setFaceValid(false);
        setStatusMessage("Searching for face...");
        return;
      }

      const resized = faceapi.resizeResults(detection, { width: canvas.width, height: canvas.height });
      lastDetectionRef.current = resized;
      const isValid = resized.detection.box.width > 120;

      if (ctx) {
        ctx.strokeStyle = isValid ? "#4CAF50" : "#F44336";
        ctx.lineWidth = 3;
        ctx.strokeRect(resized.detection.box.x, resized.detection.box.y, resized.detection.box.width, resized.detection.box.height);
      }

      setFaceValid(isValid);
      setStatusMessage(isValid ? "Perfect alignment" : "Move closer to camera");
    }, 150);
  };

  const captureImage = () => {
    if (!lastDetectionRef.current || !videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `face-${Date.now()}.jpg`, { type: "image/jpeg" });
        setImages(prev => prev.length < MAX_IMAGES ? [...prev, file] : prev);
      }
    }, "image/jpeg", 0.95);
  };

  const submitEnrollment = async () => {
    setLoading(true);
    const formData = new FormData();
    images.forEach(img => formData.append("files", img));

    try {
      stopCamera();
      await api.post("/face-enrollment/capture", formData);

      if (activeNotificationId) {
        await api.patch(`/notifications/${activeNotificationId}/read`);
      }

      alert("Biometric Data Securely Uploaded.");
      navigate(role === "USER" ? "/dashboard" : "/admin/dashboard");
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = (status || "default").toLowerCase();
  const badge = BADGE_MAP[currentStatus] || BADGE_MAP.default;

  return (
    <Box sx={{ maxWidth: 950, margin: "auto", padding: "100px 24px", color: THEME_NAVY }}>
      <Collapse in={showBanner}>
        <Alert
          severity={rejectionReason ? "error" : "info"}
          variant="filled"
          sx={{ mb: 4, borderRadius: "12px", bgcolor: rejectionReason ? "#D32F2F" : THEME_NAVY }}
          icon={rejectionReason ? <ErrorOutline fontSize="large" /> : <InfoOutlined fontSize="large" />}
          action={<IconButton color="inherit" size="small" onClick={() => setShowBanner(false)}><CloseIcon /></IconButton>}
        >
          <AlertTitle sx={{ fontWeight: 800 }}>
            {rejectionReason ? "Enrollment Rejected" : "Enrollment Task"}
          </AlertTitle>
          {rejectionReason || enrollmentRequestMsg || "Your biometric profile needs to be set up."}
        </Alert>
      </Collapse>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4, borderBottom: "1px solid #eee", pb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Biometric Enrollment</Typography>
          <Typography color="text.secondary">Register your face for the FaceTrack platform.</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#999", display: 'block' }}>STATUS</Typography>
          <Box sx={{ bgcolor: badge.bg, color: badge.color, px: 2, py: 0.5, borderRadius: 2, fontWeight: 700 }}>
            {badge.text}
          </Box>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        {/* FIXED: Removed item prop, used size instead */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ bgcolor: "#F8F9FB", borderRadius: "24px", p: 3, border: '1px solid #E0E4EC' }}>
            <Box sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", bgcolor: "#111", aspectRatio: "4/3", border: `4px solid ${faceValid ? "#4CAF50" : "#ddd"}` }}>
              {!isCapturing && (
                <Stack sx={{ position: "absolute", inset: 0, zIndex: 2 }} alignItems="center" justifyContent="center">
                  <Button variant="contained" startIcon={<CameraAlt />} onClick={startCamera} sx={{ bgcolor: "white", color: THEME_NAVY, "&:hover": { bgcolor: "#f0f0f0" } }}>
                    Initialize Camera
                  </Button>
                </Stack>
              )}
              <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <canvas ref={overlayRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
            </Box>
            
            <Typography sx={{ textAlign: "center", mt: 2, fontWeight: 600, color: faceValid ? "success.main" : "text.secondary" }}>
              {statusMessage}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button 
                fullWidth variant="contained" disabled={!faceValid || images.length >= MAX_IMAGES} 
                onClick={captureImage} sx={{ bgcolor: THEME_NAVY, py: 1.5 }}
              >
                Capture Frame ({images.length}/{MAX_IMAGES})
              </Button>
              {isCapturing && <Button variant="outlined" color="error" onClick={stopCamera}><VideocamOff /></Button>}
              <Button variant="outlined" onClick={() => setImages([])}><Replay /></Button>
            </Stack>
          </Box>
        </Grid>

        {/* FIXED: Removed item prop, used size instead */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: "24px", border: "1px solid #eee", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircle color={images.length >= MIN_IMAGES ? "success" : "disabled"} /> Assets
            </Typography>
            
            <Grid container spacing={1}>
              {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <Grid size={{ xs: 4 }} key={i}>
                  <Box sx={{ aspectRatio: "1/1", borderRadius: 2, bgcolor: "#F0F2F5", border: "2px dashed #ccc", overflow: "hidden" }}>
                    {images[i] && <img src={URL.createObjectURL(images[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Face ${i}`} />}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ flexGrow: 1 }} />
            
            <Button 
              fullWidth variant="contained" color="success"
              disabled={loading || images.length < MIN_IMAGES} onClick={submitEnrollment}
              sx={{ mt: 3, py: 2, borderRadius: 4, fontWeight: 800 }}
            >
              {loading ? "Processing..." : "Complete Enrollment"}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Box>
  );
}