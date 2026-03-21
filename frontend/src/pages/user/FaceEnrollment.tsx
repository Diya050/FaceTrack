import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import * as faceapi from "face-api.js";
import { useAuth } from "../../context/AuthContext";
import { 
  CheckCircle, 
  CameraAlt, 
  Replay, 
  CloudUpload, 
  Face, 
  InfoOutlined,
  VideocamOff
} from "@mui/icons-material";
import { Typography } from "@mui/material";

const MAX_IMAGES = 7;
const MIN_IMAGES = 5;
const THEME_NAVY = "#30364F";

export default function FaceEnrollment() {
  const navigate = useNavigate();
  const { face_enrolled, status, role } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [faceValid, setFaceValid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Initializing biometrics...");
  const [isCapturing, setIsCapturing] = useState(false);

  const detectionIntervalRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<faceapi.WithFaceLandmarks<any> | null>(null);

  const getStatusBadge = () => {
    switch (status) {
      case "active": return { bg: "#E8F5E9", color: "#2E7D32", text: "Status: Active" };
      case "pending": return { bg: "#FFF3E0", color: "#EF6C00", text: "Status: Pending Approval" };
      default: return { bg: "#FFEBEE", color: "#D32F2F", text: "Enrollment Required" };
    }
  };

  const badge = getStatusBadge();

  // --- CAMERA AUTO-STOP LOGIC ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setStatusMessage("Ready to begin");
      } catch (err) {
        setStatusMessage("System Error: Failed to load AI models");
      }
    };
    loadModels();

    // The Return function acts as a "Cleanup" when the component unmounts
    return () => {
      stopCamera(); 
    };
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
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Hardware track stopped manually");
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
    setFaceValid(false);
    setStatusMessage("Camera Stopped");
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setStatusMessage("Ready to begin");
      } catch (err) {
        setStatusMessage("System Error: Failed to load AI models");
      }
    };
    loadModels();

    // AUTO-STOP LOGIC: This cleanup runs when navigating away from the page
    return () => {
      console.log("Component unmounting: Cleaning up hardware resources...");
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log("Hardware track stopped via cleanup");
        });
      }
    };
  }, []);

  const validatePose = (landmarks: faceapi.FaceLandmarks68) => {
    const nose = landmarks.getNose()[3];
    const eyeCenterX = (landmarks.getLeftEye()[0].x + landmarks.getRightEye()[3].x) / 2;
    return Math.abs(nose.x - eyeCenterX) < 35;
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
      const isValid = resized.detection.box.width > 100 && validatePose(resized.landmarks);

      if (ctx) {
        ctx.strokeStyle = isValid ? "#4CAF50" : "#F44336";
        ctx.setLineDash(isValid ? [] : [5, 5]);
        ctx.lineWidth = 3;
        ctx.strokeRect(resized.detection.box.x, resized.detection.box.y, resized.detection.box.width, resized.detection.box.height);
      }

      setFaceValid(isValid);
      setStatusMessage(isValid ? "Position Perfect" : "Move closer and center face");
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
      alert("Biometric Data Securely Uploaded.");
      navigate(role === "USER" ? "/dashboard" : "/admin/dashboard");
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "90px 20px", fontFamily: "'Inter', sans-serif", color: THEME_NAVY }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, borderBottom: "2px solid #eee", paddingBottom: 20 }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>Biometric Enrollment</h1>
          <p style={{ margin: "4px 0 0", color: "#666" }}>Enroll your face for recognition.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.90rem", fontWeight: 700, color: "#999", marginBottom: 8 }}>BIOMETRIC: {face_enrolled ? "ENROLLED" : "NOT ENROLLED"}</div>
          <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "6px 16px", borderRadius: 8, fontSize: "0.90rem", fontWeight: 700 }}>
            {badge.text}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 30 }}>
        
        {/* LEFT: CAMERA BOX */}
        <div style={{ background: "#F8F9FB", borderRadius: 24, padding: 25, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#111", aspectRatio: "4/3", border: `4px solid ${faceValid ? "#4CAF50" : THEME_NAVY}` }}>
            {!isCapturing && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", zIndex: 2 }}>
                <Face style={{ fontSize: 80, marginBottom: 15, opacity: 0.2 }} />
                <button onClick={startCamera} style={{ background: "white", color: THEME_NAVY, padding: "12px 30px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <CameraAlt /> Initialize Camera
                </button>
              </div>
            )}
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <canvas ref={overlayRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
             <Typography sx={{ color: faceValid ? "#2E7D32" : "#666", fontWeight: 600, mb: 2 }}>
               {statusMessage}
             </Typography>
             <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
                <button disabled={!faceValid || images.length >= MAX_IMAGES} onClick={captureImage} style={{ flex: 1, padding: "15px", background: faceValid ? THEME_NAVY : "#ccc", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: faceValid ? "pointer" : "not-allowed", transition: "0.3s" }}>
                  Capture Frame ({images.length}/{MAX_IMAGES})
                </button>
                
                {/* STOP CAMERA BUTTON */}
                {isCapturing && (
                  <button onClick={stopCamera} style={{ padding: "0 20px", background: "#f44336", color: "white", border: "none", borderRadius: 12, cursor: "pointer" }}>
                    <VideocamOff />
                  </button>
                )}

                <button onClick={() => setImages([])} style={{ width: 60, height: 50, background: "#eee", color: THEME_NAVY, border: "none", borderRadius: 12, cursor: "pointer" }}>
                  <Replay />
                </button>
             </div>
          </div>
        </div>

        {/* RIGHT: GALLERY & PROGRESS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "white", borderRadius: 24, padding: 25, border: "1px solid #eee", flex: 1 }}>
            <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle style={{ color: images.length >= MIN_IMAGES ? "#4CAF50" : "#ddd" }} /> 
              Captured Assets
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "1/1", borderRadius: 12, background: "#F0F2F5", border: "2px dashed #D1D5DB", overflow: "hidden", position: "relative" }}>
                  {images[i] ? (
                    <img src={URL.createObjectURL(images[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "0.8rem" }}>{i + 1}</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ background: "#F0F4FF", padding: 15, borderRadius: 12, fontSize: "0.85rem", color: "#4A5568", display: "flex", gap: 10 }}>
              <InfoOutlined style={{ fontSize: 18 }} />
              <span>Provide various angles (slight left/right) for best recognition accuracy.</span>
            </div>
          </div>

          <button 
            disabled={loading || images.length < MIN_IMAGES} 
            onClick={submitEnrollment}
            style={{ 
              width: "100%", padding: "20px", background: images.length >= MIN_IMAGES ? "#4CAF50" : "#E5E7EB", 
              color: "white", border: "none", borderRadius: 20, fontSize: "1.1rem", fontWeight: 800, cursor: "pointer",
              boxShadow: images.length >= MIN_IMAGES ? "0 10px 20px rgba(76, 175, 80, 0.2)" : "none"
            }}
          >
            {loading ? "Securing Data..." : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <CloudUpload /> Complete Enrollment
              </div>
            )}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}