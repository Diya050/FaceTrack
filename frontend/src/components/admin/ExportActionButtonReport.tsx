import { Button, Stack, Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../../services/api";

const ExportActionButtons = () => {
  const triggerDownload = async (format: "csv" | "pdf") => {
    try {
      const res = await api.get("/analytics/export-logs", {
        params: { format },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failure:", err);
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,247,250,0.9))",
      }}
    >
      {/* Title */}
      <Typography
        variant="subtitle2"
        fontWeight={600}
        sx={{ mb: 1, opacity: 0.7 }}
      >
        Export Reports
      </Typography>

      {/* Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={() => triggerDownload("csv")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            boxShadow: "0 4px 12px rgba(25,118,210,0.2)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 6px 18px rgba(25,118,210,0.3)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Export CSV
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={() => triggerDownload("pdf")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(25,118,210,0.06)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Export PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default ExportActionButtons;