import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  CircularProgress
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ExportActions: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (type: string) => {
    setLoading(true);
    setAnchorEl(null);
    
    // Simulate API call to FastAPI backend
    setTimeout(() => {
      setLoading(false);
      alert(`Generating ${type}... The download will start shortly.`);
    }, 1500);
  };

  return (
    <Box>
      <Button
        variant="contained"
        id="export-button"
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
        sx={{ 
          textTransform: 'none', 
          borderRadius: 2, 
          px: 3, 
          bgcolor: '#4f46e5',
          '&:hover': { bgcolor: '#4338ca' }
        }}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Export Reports'}
      </Button>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'export-button' }}
        PaperProps={{
          sx: { width: 280, mt: 1, borderRadius: 2, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.disabled" fontWeight="bold">
            Download PDF
          </Typography>
        </Box>
        <MenuItem onClick={() => handleExport('Monthly Attendance PDF')}>
          <ListItemIcon><PictureAsPdfIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Monthly Attendance Report" secondary="PDF Document" />
        </MenuItem>
        <MenuItem onClick={() => handleExport('Recognition Accuracy PDF')}>
          <ListItemIcon><AssessmentIcon fontSize="small" color="primary" /></ListItemIcon>
          <ListItemText primary="Recognition Accuracy" secondary="Detailed AI Metrics" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.disabled" fontWeight="bold">
            Data Export
          </Typography>
        </Box>
        <MenuItem onClick={() => handleExport('Attendance CSV')}>
          <ListItemIcon><TableChartIcon fontSize="small" color="success" /></ListItemIcon>
          <ListItemText primary="Attendance Raw Data" secondary="CSV Spreadsheet" />
        </MenuItem>
        <MenuItem onClick={() => handleExport('Working Hours CSV')}>
          <ListItemIcon><TableChartIcon fontSize="small" color="success" /></ListItemIcon>
          <ListItemText primary="Working Hours Summary" secondary="CSV Spreadsheet" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Helper Divider for the menu
const Divider = ({ sx }: { sx?: object }) => <Box sx={{ height: '1px', bgcolor: 'divider', ...sx }} />;

export default ExportActions;