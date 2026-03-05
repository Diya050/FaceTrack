import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

/* TYPES */
type CameraStatus = "live" | "lag" | "offline";
type StreamType = "rtsp" | "webrtc" | "hls" | "rtmp";

interface Camera {
    id: number;
    name: string;
    identifier: string;
    location: string;
    model: string;
    streamType: StreamType;
    streamUrl: string;
    status: CameraStatus;
    enabled: boolean;
}

/* MOCK DATA */
const INITIAL_CAMERAS: Camera[] = [
    {
        id: 1,
        name: "Lobby Gate",
        identifier: "CAM-001",
        location: "Main Entrance",
        model: "Hikvision DS-2CD",
        streamType: "rtsp",
        streamUrl: "rtsp://10.0.0.10:554",
        status: "live",
        enabled: true,
    },
    {
        id: 2,
        name: "Parking",
        identifier: "CAM-002",
        location: "Basement",
        model: "CP Plus Pro",
        streamType: "rtsp",
        streamUrl: "rtsp://10.0.0.12:554",
        status: "offline",
        enabled: true,
    },
];

/* HELPERS */
const statusColor = (s: CameraStatus) =>
    s === "live" ? "success" : s === "lag" ? "warning" : "error";

/* MAIN */
const CameraManagement: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [rows, setRows] = useState<Camera[]>(INITIAL_CAMERAS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<"all" | CameraStatus>("all");

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [snack, setSnack] = useState({
        open: false,
        msg: "",
        severity: "success" as "success" | "error" | "info",
    });

    const [testing, setTesting] = useState<Record<number, boolean>>({});

    const filtered = useMemo(() => {
        return rows
            .filter((r) =>
                (r.name + r.identifier + r.location + r.model)
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
        { field: "model", headerName: "Model", flex: 1, minWidth: 140 },
        // {
        //     field: "streamType",
        //     headerName: "Stream",
        //     width: 110,
        //     valueFormatter: (params: { value?: string }) =>
        //         params.value ? params.value.toUpperCase() : "",
        // },
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
    const handleTest = async (id: number) => {
        setTesting((t) => ({ ...t, [id]: true }));
        await new Promise((res) => setTimeout(res, 1200));
        const ok = Math.random() > 0.3;

        setRows((r) =>
            r.map((x) =>
                x.id === id ? { ...x, status: ok ? "live" : "offline" } : x
            )
        );

        setTesting((t) => ({ ...t, [id]: false }));
        setSnack({
            open: true,
            msg: ok ? "Connection OK" : "Connection Failed",
            severity: ok ? "success" : "error",
        });
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
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
                        <MenuItem value="live">Live</MenuItem>
                        <MenuItem value="lag">Lag</MenuItem>
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
                    <Box sx={{ height: isMobile ? 520 : 560, gap: 0 }} >
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