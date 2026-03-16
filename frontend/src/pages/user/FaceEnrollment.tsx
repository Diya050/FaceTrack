import { useRef, useState, useEffect } from "react";
import api from "../../services/api";
import * as faceapi from "face-api.js";

const MAX_IMAGES = 7;
const MIN_IMAGES = 5;
// const MAX_SIZE = 5 * 1024 * 1024;
const BLUR_THRESHOLD = 150;

export default function FaceEnrollment() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [faceValid, setFaceValid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Loading models...");

  const detectionIntervalRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<faceapi.WithFaceLandmarks<any> | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setStatusMessage("Models loaded. Start camera.");
      } catch (err) {
        console.error(err);
        setStatusMessage("Error loading models.");
      }
    };
    loadModels();
    return () => { if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current); };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => runDetection();
      }
    } catch (err) {
      console.error(err);
      alert("Could not access camera.");
    }
  };

  const stopCamera = () => {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
  }

  if (detectionIntervalRef.current) {
    clearInterval(detectionIntervalRef.current);
    detectionIntervalRef.current = null;
  }
};

  const detectBlur = (imageData: ImageData) => {
    const data = imageData.data;
    const gray = [];
    for (let i = 0; i < data.length; i += 4) {
      gray.push((data[i] + data[i + 1] + data[i + 2]) / 3);
    }
    const mean = gray.reduce((a, b) => a + b, 0) / gray.length;
    return gray.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gray.length;
  };

  const validatePose = (landmarks: faceapi.FaceLandmarks68) => {
    const nose = landmarks.getNose()[3];
    const leftEye = landmarks.getLeftEye()[0];
    const rightEye = landmarks.getRightEye()[3];
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    return Math.abs(nose.x - eyeCenterX) < 35;
  };

  const runDetection = () => {
    if (!videoRef.current || !overlayRef.current) return;

    const video = videoRef.current;
    const canvas = overlayRef.current;
    const ctx = canvas.getContext("2d");

    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

    detectionIntervalRef.current = window.setInterval(async () => {
      if (video.paused || video.ended) return;

      // FIX 1: Set canvas internal size to match displayed CSS size
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (!detection) {
        setFaceValid(false);
        setStatusMessage("No face detected");
        lastDetectionRef.current = null;
        return;
      }

      // FIX 2: Resize results so the box coordinates match the canvas scale
      const resized = faceapi.resizeResults(detection, { width: canvas.width, height: canvas.height });
      lastDetectionRef.current = resized;

      const { box } = resized.detection;
      const isValid = box.width > 80 && validatePose(resized.landmarks);

      if (ctx) {
        ctx.strokeStyle = isValid ? "#2e7d32" : "#d32f2f";
        ctx.lineWidth = 4;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      }

      setFaceValid(isValid);
      setStatusMessage(isValid ? "Perfect! Capture now." : "Align face properly");
    }, 150);
  };

  const captureImage = () => {
    // If lastDetectionRef is null, the loop hasn't found a face yet
    if (!lastDetectionRef.current) {
      alert("Face not detected yet. Please wait a moment.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    if (detectBlur(imageData) < BLUR_THRESHOLD) {
      alert("Image is too blurry.");
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `face-${Date.now()}.jpg`, { type: "image/jpeg" });
        setImages(prev => (prev.length < MAX_IMAGES ? [...prev, file] : prev));
      }
    }, "image/jpeg", 0.9);
  };

  const submitEnrollment = async () => {
    if (images.length < MIN_IMAGES) return alert(`Need ${MIN_IMAGES} images.`);

    const formData = new FormData();
    // Ensure the key 'files' matches exactly what your FastAPI route expects
    images.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);
      stopCamera();

      // Note: If using axios, don't manually set Content-Type header, 
      // let the browser set it with the boundary string.
      await api.post("/face-enrollment/capture", formData);
      alert("Success!");
      setImages([]);
    } catch (err: any) {
      // Look at the console to see the ACTUAL error message from the backend
      console.error(err.response?.data);
      alert(err.response?.data?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20, textAlign: "center", fontFamily: "sans-serif", paddingTop: 60 }}>
      <h1 style={{ color: "#30364F" }}>Face Enrollment</h1>

      <button onClick={startCamera} style={{ background: "#30364F", color: "white", padding: "10px 20px", marginBottom: 20, border: "none", borderRadius: 5 }}>
        Start Camera
      </button>

      {/* FIX 3: Container with explicit size and relative positioning */}
      <div style={{ position: "relative", width: "480px", height: "360px", margin: "auto", background: "#000", borderRadius: 12, overflow: "hidden" }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <canvas ref={overlayRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      </div>

      <div style={{ marginTop: 15 }}>
        <p style={{ color: faceValid ? "#2e7d32" : "#d32f2f", fontWeight: "bold" }}>{statusMessage}</p>
        <button disabled={!faceValid} onClick={captureImage} style={{ padding: "12px 24px", background: faceValid ? "#2e7d32" : "#ccc", color: "white", border: "none", borderRadius: 5 }}>
          Capture ({images.length}/{MAX_IMAGES})
        </button>
        <button onClick={() => setImages([])} style={{ marginLeft: 10, padding: "12px 24px", background: "#6c757d", color: "white", border: "none", borderRadius: 5 }}>Reset</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20, justifyContent: "center" }}>
        {images.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img)} width={70} height={70} style={{ borderRadius: 8, border: "2px solid #30364F" }} />
        ))}
      </div>

      <button disabled={loading || images.length < MIN_IMAGES} onClick={submitEnrollment} style={{ marginTop: 30, width: "100%", padding: "15px", background: "#30364F", color: "white", border: "none", borderRadius: 8 }}>
        {loading ? "Uploading..." : "Submit Enrollment"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}