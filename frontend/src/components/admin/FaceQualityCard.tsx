import { useState } from "react";
import {
  Card,
  CardMedia,
  Box,
  Typography,
  Chip,
  Dialog,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

type Props = {
  image: string;
};

export default function FaceQualityCard({ image }: Props) {
  const [open, setOpen] = useState(false);
  
  const API_BASE_URL = "http://localhost:8000";
  const fullImageUrl = `${API_BASE_URL}/uploads/faces/${image}`;

  return (
    <>
      <Card 
        onClick={() => setOpen(true)}
        sx={{ 
          width: 220,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 2,
          cursor: "pointer",
          position: "relative",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          "&:hover": { boxShadow: 4 }
        }}
      >
        {/* Permanent Fullscreen Icon on Top Left */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            p: 0.5,
            color: "white",
            backdropFilter: "blur(4px)",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.1)" }
          }}
        >
          <FullscreenIcon fontSize="small" />
        </Box>

        <CardMedia
          component="img"
          height="180"
          image={fullImageUrl}
          sx={{ objectFit: "cover" }}
        />

        <Box p={1.5}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: "block", 
              fontFamily: "monospace",
              mb: 1
            }}
          >
            ID: ...{image.split('-').pop()}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center">
             <Chip 
               size="small" 
               label="View Full Image" 
               color="primary" 
               variant="outlined"
               sx={{ fontSize: 10, fontWeight: 700, px: 1 }} 
             />
             
          </Box>
        </Box>
      </Card>

      {/* Full Image Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="lg"
        PaperProps={{ 
          sx: { 
            bgcolor: "rgba(0,0,0,0.95)", 
            boxShadow: "none",
            overflow: "visible",
            borderRadius: 2
          } 
        }}
      >
        <Tooltip title="Close">
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: { xs: 10, md: -50 },
              top: { xs: 10, md: -50 },
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "error.main" }
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        
        <Box 
          component="img"
          src={fullImageUrl}
          alt="Full face capture"
          sx={{ 
            width: "100%", 
            maxHeight: "85vh", 
            objectFit: "contain",
            borderRadius: 1
          }}
        />
      </Dialog>
    </>
  );
}