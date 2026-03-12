import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, alpha, useTheme } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { COLORS } from "../../theme/dashboardTheme";

export default function ExportActions() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = (type: string) => {
  setLoading(true);
  setAnchorEl(null);

  // Simulation of report generation (PDF/CSV)
  setTimeout(() => {
    setLoading(false);
    
    // In the future, this is where you'd call: 
    // window.location.href = `${API_URL}/export?type=${type}`;
    
    console.log(`Report Generated: ${type}`);
    // Optional: Add a toast notification here if you have a snackbar component
  }, 1200);
};

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FileDownloadIcon />}
        sx={{ 
          bgcolor: COLORS.navy, 
          fontWeight: 900, 
          borderRadius: 2, 
          textTransform: 'none',
          '&:hover': { bgcolor: alpha(COLORS.navy, 0.9) }
        }}
      >
        {loading ? "Generating..." : "Export Reports"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { 
            mt: 1, width: 260, borderRadius: 2, 
            boxShadow: "0px 10px 30px rgba(52, 59, 85, 0.1)",
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <MenuItem onClick={() => handleExport('PDF')} sx={{ py: 1.5 }}>
          <ListItemIcon><PictureAsPdfIcon fontSize="small" sx={{ color: COLORS.absent }} /></ListItemIcon>
          <ListItemText primary="Attendance Report" secondary="PDF Document" primaryTypographyProps={{ fontWeight: 700 }} />
        </MenuItem>
        <MenuItem onClick={() => handleExport('CSV')} sx={{ py: 1.5 }}>
          <ListItemIcon><TableChartIcon fontSize="small" sx={{ color: COLORS.present }} /></ListItemIcon>
          <ListItemText primary="Log Spreadsheet" secondary="CSV Format" primaryTypographyProps={{ fontWeight: 700 }} />
        </MenuItem>
      </Menu>
    </>
  );
}