import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import StarIcon from "@mui/icons-material/Star";

import type {
    AdminOverviewResponse,
    KpiSummaryResponse,
} from "../../types/adminAnalytics.types";
import { getAdminOverview, getKpiSummary } from "../../services/adminAnalyticsService";

const statusColor: Record<string, "success" | "error" | "warning" | "info"> = {
    present: "success",
    absent: "error",
    late: "warning",
    early_leave: "info",
};

const toLabel = (status: string) =>
    status
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const toPercent = (value: number) => `${Math.max(0, Math.min(100, value)).toFixed(1)}%`;

const downloadBlob = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const ReportsPage = () => {
    const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
    const [kpi, setKpi] = useState<KpiSummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
    const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

    useEffect(() => {
        setLoading(true);
        Promise.all([getAdminOverview(), getKpiSummary()])
            .then(([overviewData, kpiData]) => {
                setOverview(overviewData);
                setKpi(kpiData);
            })
            .catch(() => {
                setError("Unable to load report insights right now. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const topDept = useMemo(() => {
        if (!overview?.department_summary?.length) return null;
        return [...overview.department_summary].sort((a, b) => b.percentage - a.percentage)[0];
    }, [overview]);

    const detections = kpi?.recent_detections ?? [];
    const totalDetectedToday = (kpi?.stats.present_today ?? 0) + (kpi?.stats.early_leave_today ?? 0);

    const handleDownloadDetections = () => {
        if (!detections.length) return;
        const header = "Name,Department,Status,Confidence,Time In,Time Out";
        const lines = detections.map((row) => [
            row.full_name, row.department, toLabel(row.status),
            (row.confidence_score ?? 0).toFixed(2), row.time_in ?? "-", row.time_out ?? "-"
        ].map(f => `"${String(f).replace(/"/g, '""')}"`).join(","));
        downloadBlob([header, ...lines].join("\n"), `detections-${Date.now()}.csv`, "text/csv");
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ mt: 8, px: 4 }}><Alert severity="error">{error}</Alert></Box>;
    if (!overview || !kpi) return null;

    return (
        <Stack spacing={4} sx={{ mt: 10, px: { xs: 2, md: 4 }, pb: 6 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#343B55", mb: 0.5 }}>Admin Reports Center</Typography>
                <Typography variant="body2" color="text.secondary">Real-time attendance analytics and operational tracking.</Typography>
            </Box>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="subtitle2" color="text.secondary">Attendance Rate</Typography><AnalyticsIcon color="primary" /></Stack>
                            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{toPercent(kpi.stats.attendance_rate)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="subtitle2" color="text.secondary">Total Detected</Typography><GroupIcon color="success" /></Stack>
                            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{totalDetectedToday}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="subtitle2" color="text.secondary">Early Leaves</Typography><ExitToAppIcon color="info" /></Stack>
                            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{kpi.stats.early_leave_today}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="subtitle2">Top Department</Typography><StarIcon /></Stack>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {topDept ? topDept.department : "N/A"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Monthly Attendance Rate Trend</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 0.5 }}>
                                {overview.monthly_trend.rate.map((rate, i) => (
                                    <Tooltip key={i} title={`${overview.monthly_trend.labels[i]}: ${rate}%`}>
                                        <Box sx={{ flex: 1, position: 'relative', height: '100%' }}>
                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '2px' }} />
                                            <Box sx={{ 
                                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                                bgcolor: rate > 80 ? 'primary.main' : 'primary.light', 
                                                height: `${rate}%`, borderRadius: '2px'
                                            }} />
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                            <Stack direction="row" justifyContent="space-between" mt={1}>
                                <Typography variant="caption">{overview.monthly_trend.labels[0]}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>System Activity (30 Days)</Typography>
                                <Typography variant="caption">{overview.monthly_trend.labels[overview.monthly_trend.labels.length - 1]}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Department Distribution</Typography>
                            <Stack spacing={2.5}>
                                {overview.department_summary.map((dept) => (
                                    <Box key={dept.department_id}>
                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                            <Typography variant="body2">{dept.department}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{toPercent(dept.percentage)}</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={dept.percentage} sx={{ height: 6, borderRadius: 3 }} />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Detections Snapshot</Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>In</TableCell>
                                    <TableCell>Out</TableCell>
                                    <TableCell align="right">Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detections.map((row) => (
                                    <TableRow key={row.attendance_id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.full_name}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={toLabel(row.status)} color={statusColor[row.status] || "default"} sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.time_in || "--:--"}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.time_out || "--:--"}</TableCell>
                                        <TableCell align="right">{(row.confidence_score ?? 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Data Export</Typography>
                            <Typography variant="body2" color="text.secondary">Download reports for offline analysis.</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Range</InputLabel>
                                <Select value={timeframe} label="Range" onChange={(e) => setTimeframe(e.target.value as any)}>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Type</InputLabel>
                                <Select value={exportFormat} label="Type" onChange={(e) => setExportFormat(e.target.value as any)}>
                                    <MenuItem value="csv">CSV</MenuItem>
                                    <MenuItem value="json">JSON</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Button fullWidth variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadDetections}>Export</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default ReportsPage;