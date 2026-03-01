import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Stack,
  LinearProgress,
  Grid,
  Chip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderIcon from "@mui/icons-material/Folder";
import ArchiveIcon from "@mui/icons-material/Archive";

export default function BulkUpload() {
  const [tab, setTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });

  const handleUpload = () => {
    setProgress(10);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStats({ total: 500, success: 460, failed: 40 });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <Box p={3} mt={5}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Bulk Upload System
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab icon={<UploadFileIcon />} label="CSV / Excel Upload" />
            <Tab icon={<FolderIcon />} label="Folder Upload" />
            <Tab icon={<ArchiveIcon />} label="ZIP Dataset Import" />
          </Tabs>

          <Box mt={3}>
            {tab === 0 && <UploadPanel title="Upload CSV / Excel" />}
            {tab === 1 && <UploadPanel title="Upload Face Folder" />}
            {tab === 2 && <UploadPanel title="Upload ZIP Dataset" />}
          </Box>

          <Stack spacing={2} mt={3}>
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
            >
              Start Import
            </Button>

            {progress > 0 && (
              <>
                <LinearProgress variant="determinate" value={progress} />
                <Typography>{progress}% completed</Typography>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2} mt={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard label="Total Records" value={stats.total} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard label="Successful" value={stats.success} color="success" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard label="Failed" value={stats.failed} color="error" />
        </Grid>
      </Grid>
    </Box>
  );
}

function UploadPanel({ title }: { title: string }) {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>{title}</Typography>
      <Button variant="outlined" component="label">
        Select File / Folder
        <input type="file" hidden />
      </Button>
    </Stack>
  );
}

function StatCard({ label, value, color = "primary" }: any) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h6">{label}</Typography>
          <Chip
            label={value}
            color={color}
            sx={{ fontSize: 18, px: 2, py: 2 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
