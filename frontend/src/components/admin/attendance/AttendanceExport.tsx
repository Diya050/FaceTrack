import { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { COLORS } from "../../../theme/dashboardTheme";

export default function AttendanceExport() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (type: string) => {
    setLoading(true);
    setAnchorEl(null);

    setTimeout(() => {
      setLoading(false);
      alert(`Admin export started: ${type}`);
    }, 1500);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: COLORS.navy, mb: 2 }}
      >
        Export Attendance Reports
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Download organization-level attendance data for reporting and audits.
      </Typography>

      <Button
        variant="contained"
        onClick={handleOpen}
        startIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <FileDownloadIcon />
          )
        }
        disabled={loading}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 3,
          bgcolor: COLORS.navy,
          "&:hover": { bgcolor: COLORS.navy },
        }}
      >
        {loading ? "Generating..." : "Export Reports"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 300,
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" fontWeight={800}>
            PDF Reports
          </Typography>
        </Box>

        <MenuItem onClick={() => handleExport("Daily Attendance PDF")}>
          <ListItemIcon>
            <PictureAsPdfIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Daily Attendance"
            secondary="Employee-wise attendance"
          />
        </MenuItem>

        <MenuItem onClick={() => handleExport("Monthly Summary PDF")}>
          <ListItemIcon>
            <AssignmentIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Monthly Summary"
            secondary="Working hours & status overview"
          />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" fontWeight={800}>
            Raw Data Export
          </Typography>
        </Box>

        <MenuItem onClick={() => handleExport("Attendance CSV")}>
          <ListItemIcon>
            <TableChartIcon color="success" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Attendance Records"
            secondary="CSV spreadsheet"
          />
        </MenuItem>

        <MenuItem onClick={() => handleExport("Corrections CSV")}>
          <ListItemIcon>
            <TableChartIcon color="success" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Correction Requests"
            secondary="CSV spreadsheet"
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}