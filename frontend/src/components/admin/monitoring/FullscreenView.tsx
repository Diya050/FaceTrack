import React from "react";
import { Box, Card, Typography } from "@mui/material";

const FullscreenView: React.FC = () => {
  return (
    <Box sx={{ p: 4, bgcolor: "#000", minHeight: "100vh" }}>
      <Typography variant="h6" color="white" mb={2}>
        Fullscreen Surveillance Mode
      </Typography>

      <Card sx={{ height: "80vh", bgcolor: "#111" }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
          }}
        >
          Live Fullscreen Stream Placeholder
        </Box>
      </Card>

      {/* Backend integration:
          - WebRTC live feed
          - Bounding box overlays
          - Face zoom panel
          - Re-run recognition trigger
      */}
    </Box>
  );
};

export default FullscreenView;