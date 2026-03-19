import  { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, alpha, useTheme } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { COLORS } from "../../theme/dashboardTheme";
import { downloadAttendanceExport } from '../../services/userAnalyticsService';
import { downloadBlob } from '../../utils/downloadBlob';
import type { ExportParams } from '../../types/userAnalyticsBackend.types';


export default function ExportActions() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = (type: "pdf" | "csv") => {
  setLoading(true);
  setAnchorEl(null);

  // You can pull these from your page state/filters
  const params: ExportParams = { 
    type,
    // organization_id: currentOrgId, 
    // start_date: startDate.toISOString().split('T')[0] 
  };

  downloadAttendanceExport(params)
    .then((blob) => {
      const extension = type === "pdf" ? ".pdf" : ".csv";
      const filename = `Attendance_Report_${new Date().toLocaleDateString()}${extension}`;
      downloadBlob(blob, filename);
    })
    .catch((err) => {
      console.error("Export failed", err);
    })
    .finally(() => {
      setLoading(false);
    });
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
        <MenuItem onClick={() => handleExport('pdf')} sx={{ py: 1.5 }}>
          <ListItemIcon><PictureAsPdfIcon fontSize="small" sx={{ color: COLORS.absent }} /></ListItemIcon>
          <ListItemText primary="Attendance Report" secondary="PDF Document" primaryTypographyProps={{ fontWeight: 700 }} />
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')} sx={{ py: 1.5 }}>
          <ListItemIcon><TableChartIcon fontSize="small" sx={{ color: COLORS.present }} /></ListItemIcon>
          <ListItemText primary="Log Spreadsheet" secondary="CSV Format" primaryTypographyProps={{ fontWeight: 700 }} />
        </MenuItem>
      </Menu>
    </>
  );
}
