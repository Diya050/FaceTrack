import { useEffect, useState } from 'react';
import { 
  Box, Grid, Card, Typography, LinearProgress, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CssBaseline, CircularProgress 
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import VideocamIcon from '@mui/icons-material/Videocam';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';


// Import Types and Service instead of JSON
import { getSystemHealth } from '../../../services/systemHealthService';
import type { SystemHealthResponse } from '../../../types/systemHealth.types';

interface MetricValueProps {
  value: string | number;
  label: string;
  subtext?: string;
  color?: string;
}

// REUSABLE UI COMPONENTS 
const cardStyle = {
  borderRadius: 4,
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  bgcolor: '#ffffff'
};

const SectionHeader = ({ title }: { title: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    <Box sx={{ width: 4, height: 16, bgcolor: '#30364F', borderRadius: 1, mr: 1.5 }} />
    <Typography sx={{ fontWeight: 800, color: '#ACBAC4', fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase' }}>
      {title}
    </Typography>
  </Box>
);

const MetricValue: React.FC<MetricValueProps> = ({ 
  value, 
  label, 
  subtext, 
  color = '#30364F' 
}) => (
  <Box sx={{ flexGrow: 1 }}>
    <Typography sx={{ fontSize: '2rem', fontWeight: 900, color, lineHeight: 1.2 }}>
      {value}
    </Typography>
    <Typography sx={{ fontWeight: 700, color: '#30364F', mt: 0.5 }}>
      {label}
    </Typography>
    {subtext && (
      <Typography sx={{ fontSize: '0.85rem', color: '#ACBAC4', mt: 0.5 }}>
        {subtext}
      </Typography>
    )}
  </Box>
);

const SystemHealth = () => {
  const [data, setData] = useState<SystemHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  // Clean and simple - no manual ID passing
  getSystemHealth()
    .then((res) => {
      setData(res);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load system metrics.");
      setLoading(false);
    });
}, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, bgcolor: '#F4F6F8', minHeight: '100vh' }}>
        <Typography color="error" variant="h6">{error || "No data available"}</Typography>
      </Box>
    );
  }

  // Determine global state
  const isHealthy = data.overview.activeIncidents.length === 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pb: 10, bgcolor: '#F4F6F8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <CssBaseline />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#30364F' }}>System Health</Typography>
        <Typography sx={{ color: '#ACBAC4', fontWeight: 600 }}>Live metrics and infrastructure status</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* OVERVIEW  */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Global Status" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              {isHealthy ? (
                <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50' }} />
              ) : (
                <WarningIcon sx={{ fontSize: 48, color: '#ff9800' }} />
              )}
              <Box>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: isHealthy ? '#4caf50' : '#ff9800' }}>
                  {isHealthy ? 'Operational' : 'Degraded'}
                </Typography>
                <Typography sx={{ color: '#ACBAC4', fontSize: '0.9rem', fontWeight: 500 }}>
                  {isHealthy ? 'All systems nominal' : `${data.overview.activeIncidents.length} Active Warning(s)`}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="System Uptime" />
            <MetricValue value={`${data.overview.uptimePercent}%`} label="Last 30 Days" color="#4caf50" />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            ...cardStyle, 
            bgcolor: isHealthy ? '#f6fff8' : '#fff4e5', 
            border: `1px solid ${isHealthy ? '#4caf50' : '#ff9800'}` 
          }}>
            <SectionHeader title="Active Incidents" />
            {isHealthy ? (
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontWeight: 800, color: '#4caf50', fontSize: '1rem' }}>No Issues</Typography>
                <Typography sx={{ color: '#4caf50', fontSize: '0.9rem' }}>No active incidents reported.</Typography>
              </Box>
            ) : (
              data.overview.activeIncidents.map((inc) => (
                <Box key={inc.id} sx={{ mt: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#ed6c02', fontSize: '0.9rem' }}>{inc.id}</Typography>
                  <Typography sx={{ color: '#ed6c02', fontSize: '0.9rem' }}>{inc.message}</Typography>
                </Box>
              ))
            )}
          </Card>
        </Grid>

        {/* FACETRACK ENGINE  */}
        <Grid size={{ xs: 12 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="FaceTrack Engine Metrics" />
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VideocamIcon sx={{ fontSize: 40, color: '#ACBAC4', opacity: 0.5 }} />
                  <MetricValue value={`${data.faceTrackEngine.averageFps} FPS`} label="Global Processing Rate" subtext="Optimal is > 24 FPS" />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SpeedIcon sx={{ fontSize: 40, color: '#ACBAC4', opacity: 0.5 }} />
                  <MetricValue value={`${data.faceTrackEngine.matchingLatencyMs} ms`} label="Matching Latency" subtext="Time to cross-reference face" />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaceRetouchingNaturalIcon sx={{ fontSize: 40, color: '#ACBAC4', opacity: 0.5 }} />
                  <MetricValue value={data.faceTrackEngine.livenessFailuresToday} label="Spoofing Attempts Blocked" color="#d32f2f" subtext="Failed liveness checks today" />
                </Box>
              </Grid>
            </Grid>

            {/* Camera Nodes Table */}
            <Box sx={{ mt: 5, overflowX: 'auto' }}>
              <Typography sx={{ fontWeight: 800, color: '#30364F', mb: 2 }}>Camera Node Status</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { color: '#ACBAC4', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #F4F6F8' } }}>
                      <TableCell>Camera</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Current FPS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.faceTrackEngine.cameras.map((cam) => (
                      <TableRow key={cam.id} sx={{ '& td': { borderBottom: '1px solid #F4F6F8' }}}>
                        <TableCell sx={{ fontWeight: 700, color: '#30364F' }}>{cam.name} ({cam.id})</TableCell>
                        <TableCell>
                          <Chip 
                            label={cam.status.toUpperCase()} 
                            size="small" 
                            sx={{ 
                              bgcolor: cam.status === 'online' ? '#e8f5e9' : '#fff3e0',
                              color: cam.status === 'online' ? '#2e7d32' : '#ed6c02',
                              fontWeight: 800,
                              borderRadius: 1
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, fontSize: '1.1rem', color: cam.fps < 15 ? '#d32f2f' : '#30364F' }}>
                          {cam.fps}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        </Grid>

        {/* INFRASTRUCTURE  */}
        <Grid size={{ xs: 12 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Infrastructure & Hardware" />
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><MemoryIcon sx={{ mr: 1, color: '#ACBAC4' }}/>CPU Usage</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#30364F' }}>{data.infrastructure.cpu.usagePercent}%</Typography>
                <LinearProgress variant="determinate" value={data.infrastructure.cpu.usagePercent} sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: '#F4F6F8', '& .MuiLinearProgress-bar': { bgcolor: '#30364F' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><StorageIcon sx={{ mr: 1, color: '#ACBAC4' }}/>Memory (RAM)</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#30364F' }}>{data.infrastructure.memory.usedGB} / {data.infrastructure.memory.totalGB} GB</Typography>
                <LinearProgress variant="determinate" value={(data.infrastructure.memory.usedGB / data.infrastructure.memory.totalGB) * 100} sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: '#F4F6F8', '& .MuiLinearProgress-bar': { bgcolor: '#30364F' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><StorageIcon sx={{ mr: 1, color: '#ACBAC4' }}/>Disk Space</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#30364F' }}>{data.infrastructure.disk.usedTB} / {data.infrastructure.disk.totalTB} TB</Typography>
                <LinearProgress variant="determinate" value={(data.infrastructure.disk.usedTB / data.infrastructure.disk.totalTB) * 100} sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: '#F4F6F8', '& .MuiLinearProgress-bar': { bgcolor: '#30364F' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><NetworkCheckIcon sx={{ mr: 1, color: '#ACBAC4' }}/>Network Traffic</Typography>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#4caf50' }}>↓ {data.infrastructure.network.inboundMbps} Mbps</Typography>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#2196f3' }}>↑ {data.infrastructure.network.outboundMbps} Mbps</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* APM, DATABASE, QUEUES  */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Application Metrics" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MetricValue value={`${data.apm.averageResponseTimeMs} ms`} label="Avg Response Time" />
              <MetricValue value={data.apm.requestsPerMinute} label="Throughput" />
              <MetricValue value={`${data.apm.errorRatePercent}%`} label="HTTP Error Rate" color={data.apm.errorRatePercent > 1 ? '#d32f2f' : '#4caf50'} />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Database Health" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#30364F' }}>Status</Typography>
                <Chip icon={<CheckCircleIcon />} label={data.database.status.toUpperCase()} size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 800, mt: 0.5, borderRadius: 1 }} />
              </Box>
              <MetricValue value={data.database.activeConnections} label="Active Connections" subtext={`${data.database.idleConnections} idle`} />
              <MetricValue value={`${data.database.averageQueryTimeMs} ms`} label="Avg Query Time" />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Background Queues" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MetricValue value={data.queues.videoProcessingBacklog} label="Video Processing Backlog" subtext="Frames waiting to be processed" />
              <MetricValue value={data.queues.processingRatePerMinute} label="Clear Rate (per min)" color="#2196f3" />
              <MetricValue value={data.queues.failedJobsToday} label="Failed Tasks Today" color={data.queues.failedJobsToday > 0 ? '#ff9800' : '#4caf50'} />
            </Box>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default SystemHealth;