import { useState } from "react";
import { 
  Card, CardMedia, Box, Dialog, IconButton, Tooltip, Chip 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

type Props = {
  imagePath: string;
  confidence?: number | null;
};


export default function FaceDetectionCard({ imagePath, confidence }: Props) {
  const [open, setOpen] = useState(false);

  const fullImageUrl = imagePath;

  return (
    <>
      <Card 
        onClick={() => setOpen(true)}
        sx={{ 
          width: "100%", 
          borderRadius: 3, 
          overflow: "hidden", 
          boxShadow: 1,
          cursor: "pointer", 
          position: "relative", 
          border: "1px solid", 
          borderColor: "divider",
          "&:hover": { boxShadow: 4, transform: 'translateY(-2px)' },
          transition: 'all 0.2s'
        }}
      >
        <Box sx={{
          position: "absolute", 
          top: 8, 
          left: 8, 
          zIndex: 2, 
          display: "flex",
          alignItems: "center", 
          justifyContent: "center", 
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%", 
          p: 0.5, 
          color: "white", 
          backdropFilter: "blur(4px)"
        }}>
          <FullscreenIcon sx={{ fontSize: 16 }} />
        </Box>

        {confidence !== undefined && confidence !== null && (
           <Chip 
            label={`${(confidence * 100).toFixed(0)}%`}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              zIndex: 2, 
              height: 20, 
              fontSize: 10, 
              fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.9)', 
              color: '#30364F'
            }}
           />
        )}

        <CardMedia
          component="img"
          height="140"
          image={fullImageUrl}
          sx={{ objectFit: "cover", bgcolor: '#f0f0f0' }}
          // Fallback if image fails to load
          onError={(e: any) => { 
            e.target.src = "https://via.placeholder.com/150?text=No+Image"; 
          }}
        />
      </Card>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md"
        PaperProps={{ 
          sx: { 
            bgcolor: "rgba(0,0,0,0.9)", 
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
              right: { xs: 10, md: -40 }, 
              top: { xs: 10, md: -40 }, 
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        
        <Box 
          component="img" 
          src={fullImageUrl} 
          sx={{ 
            width: "100%", 
            maxHeight: "80vh", 
            objectFit: "contain",
            borderRadius: 1
          }} 
        />
      </Dialog>
    </>
  );
}