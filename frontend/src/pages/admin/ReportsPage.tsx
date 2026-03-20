import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type {
	AdminOverviewResponse,
	AttendanceStatus,
	KpiSummaryResponse,
} from "../../types/adminAnalytics.types";
import { getAdminOverview, getKpiSummary } from "../../services/adminAnalyticsService";

const NAVBAR_HEIGHT = 64;

const statusColor: Record<AttendanceStatus, "success" | "error" | "warning" | "info"> = {
	present: "success",
	absent: "error",
	late: "warning",
	early_leave: "info",
};

const toLabel = (status: AttendanceStatus) =>
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
	const { hash } = useLocation();
	const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
	const [kpi, setKpi] = useState<KpiSummaryResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
	const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

	useEffect(() => {
		if (!hash) return;

		const id = hash.replace("#", "");
		const el = document.getElementById(id);

		if (!el) return;

		const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 16;

		window.scrollTo({
			top: y,
			behavior: "smooth",
		});
	}, [hash]);

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

	const weeklyTotals = useMemo(() => {
		if (!overview?.weekly_report) {
			return { present: 0, absent: 0, late: 0 };
		}

		return {
			present: overview.weekly_report.present.reduce((sum, value) => sum + value, 0),
			absent: overview.weekly_report.absent.reduce((sum, value) => sum + value, 0),
			late: overview.weekly_report.late.reduce((sum, value) => sum + value, 0),
		};
	}, [overview]);

	const topDepartment = useMemo(() => {
		if (!overview?.department_summary?.length) return null;
		return [...overview.department_summary].sort((a, b) => b.percentage - a.percentage)[0];
	}, [overview]);

	const detections = kpi?.recent_detections ?? [];

	const handleDownloadDetections = () => {
		if (!detections.length) return;

		if (exportFormat === "json") {
			const payload = JSON.stringify(detections, null, 2);
			downloadBlob(payload, `admin-detections-${Date.now()}.json`, "application/json");
			return;
		}

		const header = "Name,Department,Camera,Status,Confidence,Time In,Time Out";
		const lines = detections.map((row) => {
			const confidence = row.confidence_score ?? 0;
			return [
				row.full_name,
				row.department,
				row.camera_name,
				toLabel(row.status),
				confidence.toFixed(2),
				row.time_in ?? "-",
				row.time_out ?? "-",
			]
				.map((field) => `\"${String(field).replaceAll("\"", "\"\"")}\"`)
				.join(",");
		});

		downloadBlob([header, ...lines].join("\n"), `admin-detections-${Date.now()}.csv`, "text/csv");
	};

	const handleDownloadWeeklySummary = () => {
		if (!overview) return;

		const summaryPayload = {
			generated_at: new Date().toISOString(),
			timeframe,
			weekly_totals: weeklyTotals,
			attendance_rate: kpi?.stats.attendance_rate ?? 0,
			department_summary: overview.department_summary,
			monthly_trend: overview.monthly_trend,
		};

		if (exportFormat === "json") {
			downloadBlob(
				JSON.stringify(summaryPayload, null, 2),
				`admin-summary-${Date.now()}.json`,
				"application/json"
			);
			return;
		}

		const rows = [
			["Metric", "Value"],
			["Present (selected period)", String(weeklyTotals.present)],
			["Absent (selected period)", String(weeklyTotals.absent)],
			["Late (selected period)", String(weeklyTotals.late)],
			["Attendance Rate", toPercent(kpi?.stats.attendance_rate ?? 0)],
			["Top Department", topDepartment?.department ?? "-"],
		];

		const csv = rows
			.map((row) => row.map((field) => `\"${String(field).replaceAll("\"", "\"\"")}\"`).join(","))
			.join("\n");

		downloadBlob(csv, `admin-summary-${Date.now()}.csv`, "text/csv");
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ mt: 8, px: { xs: 2, md: 4 } }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	if (!overview || !kpi) return null;

	return (
		<Stack spacing={4} sx={{ mt: 10, px: { xs: 2, md: 4 }, pb: 6 }}>
			<Box id="summary">
				<Typography variant="h4" sx={{ fontWeight: 800, color: "#343B55", mb: 0.5 }}>
					Admin Reports Center
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Monitor attendance health, compare department trends, and export operational summaries.
				</Typography>
			</Box>

			<Grid container spacing={2.5}>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<Card>
						<CardContent>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle2" color="text.secondary">
									Attendance Rate
								</Typography>
								<AnalyticsIcon color="primary" />
							</Stack>
							<Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
								{toPercent(kpi.stats.attendance_rate)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<Card>
						<CardContent>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle2" color="text.secondary">
									Present (Weekly)
								</Typography>
								<GroupIcon color="success" />
							</Stack>
							<Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
								{weeklyTotals.present}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<Card>
						<CardContent>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle2" color="text.secondary">
									Late Arrivals
								</Typography>
								<AccessTimeIcon color="warning" />
							</Stack>
							<Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
								{weeklyTotals.late}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, lg: 3 }}>
					<Card>
						<CardContent>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle2" color="text.secondary">
									Top Department
								</Typography>
								<TrendingUpIcon color="info" />
							</Stack>
							<Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
								{topDepartment?.department ?? "-"}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{topDepartment ? toPercent(topDepartment.percentage) : "-"}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Grid container spacing={2.5} id="trends">
				<Grid size={{ xs: 12, lg: 7 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
								Monthly Attendance Trend
							</Typography>
							<Stack spacing={2}>
								{overview.monthly_trend.labels.map((label, index) => {
									const value = overview.monthly_trend.rate[index] ?? 0;
									return (
										<Box key={label}>
											<Stack direction="row" justifyContent="space-between" mb={0.5}>
												<Typography variant="body2" color="text.secondary">
													{label}
												</Typography>
												<Typography variant="body2" sx={{ fontWeight: 700 }}>
													{toPercent(value)}
												</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={Math.max(0, Math.min(100, value))} />
										</Box>
									);
								})}
							</Stack>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, lg: 5 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
								Department Attendance Distribution
							</Typography>
							<Stack spacing={2}>
								{overview.department_summary.slice(0, 6).map((dept) => (
									<Box key={dept.department_id}>
										<Stack direction="row" justifyContent="space-between" mb={0.5}>
											<Typography variant="body2" color="text.secondary">
												{dept.department}
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 700 }}>
												{toPercent(dept.percentage)}
											</Typography>
										</Stack>
										<LinearProgress variant="determinate" value={Math.max(0, Math.min(100, dept.percentage))} />
									</Box>
								))}
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Box id="detections">
				<Card>
					<CardContent>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
							Recent Detections Snapshot
						</Typography>
						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Department</TableCell>
										<TableCell>Camera</TableCell>
										<TableCell>Status</TableCell>
										<TableCell align="right">Confidence</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{detections.slice(0, 8).map((row) => (
										<TableRow key={row.attendance_id} hover>
											<TableCell>{row.full_name}</TableCell>
											<TableCell>{row.department}</TableCell>
											<TableCell>{row.camera_name}</TableCell>
											<TableCell>
												<Chip size="small" label={toLabel(row.status)} color={statusColor[row.status]} />
											</TableCell>
											<TableCell align="right">{(row.confidence_score ?? 0).toFixed(2)}</TableCell>
										</TableRow>
									))}
									{!detections.length && (
										<TableRow>
											<TableCell colSpan={5} align="center">
												<Typography variant="body2" color="text.secondary">
													No detection rows available yet.
												</Typography>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</CardContent>
				</Card>
			</Box>

			<Box id="exports">
				<Card>
					<CardContent>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
							Export Reports
						</Typography>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 3 }}>
								<FormControl fullWidth size="small">
									<InputLabel id="report-timeframe">Timeframe</InputLabel>
									<Select
										labelId="report-timeframe"
										value={timeframe}
										label="Timeframe"
										onChange={(event) => setTimeframe(event.target.value as "weekly" | "monthly")}
									>
										<MenuItem value="weekly">Weekly</MenuItem>
										<MenuItem value="monthly">Monthly</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12, md: 3 }}>
								<FormControl fullWidth size="small">
									<InputLabel id="report-format">Format</InputLabel>
									<Select
										labelId="report-format"
										value={exportFormat}
										label="Format"
										onChange={(event) => setExportFormat(event.target.value as "csv" | "json")}
									>
										<MenuItem value="csv">CSV</MenuItem>
										<MenuItem value="json">JSON</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
									<Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadDetections}>
										Download Detections
									</Button>
									<Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadWeeklySummary}>
										Download Summary
									</Button>
								</Stack>
							</Grid>
						</Grid>
						<Divider sx={{ my: 2.5 }} />
						<Typography variant="body2" color="text.secondary">
							Exports are generated from the latest analytics snapshot visible on this page.
						</Typography>
					</CardContent>
				</Card>
			</Box>
		</Stack>
	);
};

export default ReportsPage;
