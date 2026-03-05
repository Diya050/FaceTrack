import { 
  Box, Grid, Card, Typography, LinearProgress, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CssBaseline 
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import VideocamIcon from '@mui/icons-material/Videocam';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import healthData from '../../../data/healthData.json';

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

const MetricValue = ({ value, label, subtext, color = '#30364F' }: any) => (
  <Box sx={{ flexGrow: 1 }}>
    <Typography sx={{ fontSize: '2rem', fontWeight: 900, color, lineHeight: 1.2 }}>
      {value}
    </Typography>
    <Typography sx={{ fontWeight: 700, color: '#30364F', mt: 0.5 }}>{label}</Typography>
    {subtext && <Typography sx={{ fontSize: '0.85rem', color: '#ACBAC4', mt: 0.5 }}>{subtext}</Typography>}
  </Box>
);

// THE MAIN DASHBOARD PAGE
const SystemHealth = () => {
  // TOGGLE THIS VARIABLE 
  // Options: healthData.warningState OR healthData.healthyState
  const currentData = healthData.warningState; 

  // Boolean to check if system is healthy
  const isHealthy = currentData.overview.activeIncidents.length === 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pb: 10, bgcolor: '#F4F6F8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <CssBaseline />

      {/* Page Title */}
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
                  {isHealthy ? 'All systems nominal' : `${currentData.overview.activeIncidents.length} Active Warning(s)`}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="System Uptime" />
            <MetricValue value={`${currentData.overview.uptimePercent}%`} label="Last 30 Days" color="#4caf50" />
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
              // FIX: Added (inc: any) right here to fix the TypeScript 'never' error
              currentData.overview.activeIncidents.map((inc: any) => (
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
                  <MetricValue value={`${currentData.faceTrackEngine.averageFps} FPS`} label="Global Processing Rate" subtext="Optimal is > 24 FPS" />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SpeedIcon sx={{ fontSize: 40, color: '#ACBAC4', opacity: 0.5 }} />
                  <MetricValue value={`${currentData.faceTrackEngine.matchingLatencyMs} ms`} label="Matching Latency" subtext="Time to cross-reference face" />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaceRetouchingNaturalIcon sx={{ fontSize: 40, color: '#ACBAC4', opacity: 0.5 }} />
                  <MetricValue value={currentData.faceTrackEngine.livenessFailuresToday} label="Spoofing Attempts Blocked" color="#d32f2f" subtext="Failed liveness checks today" />
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
                    {currentData.faceTrackEngine.cameras.map((cam) => (
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
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#30364F' }}>{currentData.infrastructure.cpu.usagePercent}%</Typography>
                <LinearProgress variant="determinate" value={currentData.infrastructure.cpu.usagePercent} sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: '#F4F6F8', '& .MuiLinearProgress-bar': { bgcolor: '#30364F' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><StorageIcon sx={{ mr: 1, color: '#ACBAC4' }}/>Memory (RAM)</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#30364F' }}>{currentData.infrastructure.memory.usedGB} / {currentData.infrastructure.memory.totalGB} GB</Typography>
                <LinearProgress variant="determinate" value={(currentData.infrastructure.memory.usedGB / currentData.infrastructure.memory.totalGB) * 100} sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: '#F4F6F8', '& .MuiLinearProgress-bar': { bgcolor: '#30364F' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><StorageIcon sx={{ mr: 1, color: '#ACBAC4' }}/>Disk Space</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#30364F' }}>{currentData.infrastructure.disk.usedTB} / {currentData.infrastructure.disk.totalTB} TB</Typography>
                <LinearProgress variant="determinate" value={(currentData.infrastructure.disk.usedTB / currentData.infrastructure.disk.totalTB) * 100} sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: '#F4F6F8', '& .MuiLinearProgress-bar': { bgcolor: '#30364F' } }} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#30364F', mb: 1, display: 'flex', alignItems: 'center' }}><NetworkCheckIcon sx={{ mr: 1, color: '#ACBAC4' }}/>Network Traffic</Typography>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#4caf50' }}>↓ {currentData.infrastructure.network.inboundMbps} Mbps</Typography>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#2196f3' }}>↑ {currentData.infrastructure.network.outboundMbps} Mbps</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* APM, DATABASE, QUEUES  */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Application Metrics" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MetricValue value={`${currentData.apm.averageResponseTimeMs} ms`} label="Avg Response Time" />
              <MetricValue value={currentData.apm.requestsPerMinute} label="Throughput" />
              <MetricValue value={`${currentData.apm.errorRatePercent}%`} label="HTTP Error Rate" color={currentData.apm.errorRatePercent > 1 ? '#d32f2f' : '#4caf50'} />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Database Health" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#30364F' }}>Status</Typography>
                <Chip icon={<CheckCircleIcon />} label={currentData.database.status.toUpperCase()} size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 800, mt: 0.5, borderRadius: 1 }} />
              </Box>
              <MetricValue value={currentData.database.activeConnections} label="Active Connections" subtext={`${currentData.database.idleConnections} idle`} />
              <MetricValue value={`${currentData.database.averageQueryTimeMs} ms`} label="Avg Query Time" />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardStyle}>
            <SectionHeader title="Background Queues" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MetricValue value={currentData.queues.videoProcessingBacklog} label="Video Processing Backlog" subtext="Frames waiting to be processed" />
              <MetricValue value={currentData.queues.processingRatePerMinute} label="Clear Rate (per min)" color="#2196f3" />
              <MetricValue value={currentData.queues.failedJobsToday} label="Failed Tasks Today" color={currentData.queues.failedJobsToday > 0 ? '#ff9800' : '#4caf50'} />
            </Box>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default SystemHealth;