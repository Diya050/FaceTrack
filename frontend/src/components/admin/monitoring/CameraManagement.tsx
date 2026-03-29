import React, { useMemo, useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    IconButton,
    Tooltip,
    Stack,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { getCameras, type Camera as BackendCamera } from "../../../services/cameraService";

/* TYPES */
type CameraStatus = "online" | "offline";

interface Camera extends BackendCamera {
    id: string;
    name: string;
    identifier: string;
}

/* HELPERS */
const statusColor = (s: CameraStatus) => (s === "online" ? "success" : "error");

/* MAIN */
const CameraManagement: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [rows, setRows] = useState<Camera[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | CameraStatus>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [snack, setSnack] = useState({
        open: false,
        msg: "",
        severity: "success" as "success" | "error" | "info",
    });

    const [testing, setTesting] = useState<Record<string, boolean>>({});

    // Fetch cameras on mount
    useEffect(() => {
        const fetchCameras = async () => {
            try {
                setLoading(true);
                setError(null);
                const cameras = await getCameras();
                const transformedCameras = cameras.map((cam) => ({
                    ...cam,
                    id: cam.camera_id,
                    name: cam.camera_name,
                    identifier: cam.device_identifier,
                    status: (cam.status.toLowerCase() as CameraStatus) || "offline",
                }));
                setRows(transformedCameras);
            } catch (err) {
                setError("Failed to fetch cameras");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCameras();
    }, []);

    const filtered = useMemo(() => {
        return rows
            .filter((r) =>
                (r.name + r.identifier + (r.location || "") + (r.camera_type || ""))
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
            .filter((r) =>
                statusFilter === "all" ? true : r.status === statusFilter
            );
    }, [rows, search, statusFilter]);

    /* COLUMNS */
    const columns: GridColDef<Camera>[] = [
        { field: "name", headerName: "Camera", flex: 1, minWidth: 110 },
        { field: "identifier", headerName: "ID", width: 110 },
        { field: "location", headerName: "Location", flex: 1, minWidth: 110 },
        { field: "camera_type", headerName: "Model", flex: 1, minWidth: 140 },
        {
            field: "status",
            headerName: "Status",
            width: 110,
            renderCell: (params) => (
                <Chip
                    label={params.value.toUpperCase()}
                    color={statusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 160,
            sortable: false,
            renderCell: (params: GridRenderCellParams<Camera>) => {
                const cam = params.row;
                return (
                    <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Test Connection">
                            <IconButton
                                size="small"
                                disabled={!!testing[cam.id]}
                                onClick={() => handleTest(cam.id)}
                            >
                                {testing[cam.id] ? <StopIcon /> : <PlayArrowIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                            <IconButton size="small">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Snapshot">
                            <IconButton size="small">
                                <CameraAltIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                );
            },
        },
    ];

    /* HANDLERS */
    const handleTest = async (id: string) => {
        setTesting((t) => ({ ...t, [id]: true }));
        await new Promise((res) => setTimeout(res, 1200));
        const ok = Math.random() > 0.3;

        setRows((r) =>
            r.map((x) =>
                x.id === id ? { ...x, status: ok ? "online" : "offline" } : x
            )
        );

        setTesting((t) => ({ ...t, [id]: false }));
        setSnack({
            open: true,
            msg: ok ? "Connection OK" : "Connection Failed",
            severity: ok ? "success" : "error",
        });
    };

    if (loading) {
        return (
            <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Header */}
            <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                justifyContent="space-between"
                alignItems={isMobile ? "stretch" : "center"}
                mb={3}
            >
                <Typography variant="h5" fontWeight={700}>
                    Camera Management
                </Typography>

                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={1.5}
                >
                    <TextField
                        size="small"
                        placeholder="Search cameras..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth={isMobile}
                    />

                    <TextField
                        select
                        size="small"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as CameraStatus | "all")
                        }
                        fullWidth={isMobile}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="offline">Offline</MenuItem>
                    </TextField>

                    <Button variant="contained" fullWidth={isMobile}>
                        Add Camera
                    </Button>
                </Stack>
            </Stack>

            {/* Table */}
            <Card elevation={0}>
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                    <Box sx={{ height: isMobile ? 520 : 560, gap: 0 }}>
                        <DataGrid
                            rows={filtered}
                            columns={columns}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[5, 10, 25]}
                            disableRowSelectionOnClick
                            density={isMobile ? "compact" : "standard"}
                            sx={{
                                "& .MuiDataGrid-row:hover": {
                                    background: "rgba(25,118,210,0.04)",
                                },
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
            >
                <Alert severity={snack.severity}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CameraManagement;