import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {
  cameraId: string;
};

const API_BASE = "http://localhost:8000/api/v1";

const CameraStream: React.FC<Props> = ({ cameraId }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [retry, setRetry] = useState(0);

  const token = localStorage.getItem("token");
  const streamUrl = token
    ? `${API_BASE}/cameras/${cameraId}/stream?token=${encodeURIComponent(token)}`
    : `${API_BASE}/cameras/${cameraId}/stream`;

  /* Handle stream load */

  const handleLoad = () => {
    setLoading(false);
    setOffline(false);
  };

  const handleError = () => {
    setOffline(true);

    setTimeout(() => {
      setRetry((r) => r + 1);
      setLoading(true);
    }, 3000);
  };

  /* Pause streams when tab hidden */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (imgRef.current) imgRef.current.src = "";
      } else {
        setRetry((r) => r + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        bgcolor: "#0E1320",
      }}
    >
      {loading && !offline && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {offline && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8F9AA6",
            fontSize: 13,
          }}
        >
          <Typography>Camera Offline</Typography>
        </Box>
      )}

      <img
        key={retry}
        ref={imgRef}
        src={streamUrl}
        onLoad={handleLoad}
        onError={handleError}
        alt="camera stream"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: offline ? "none" : "block",
        }}
      />
    </Box>
  );
};

export default CameraStream;