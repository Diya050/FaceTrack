import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
    Alert,
    Box,
    Card,
    Chip,
    CardContent,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stack,
    TextField,
    InputAdornment,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Groups, Search as SearchIcon } from "@mui/icons-material";

import { listDepartments } from "../../../services/departmentService";
import { getDepartmentUsers } from "../../../services/userService";

interface DepartmentUser {
    user_id: string;
    full_name: string;
    email: string;
    status: string;
    face_enrolled: boolean;
    last_login: string | null;
    role: string | null;
}

interface AccessTokenPayload {
    role?: string;
}

const formatLabel = (value?: string | null) => {
    if (!value) return "-";
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const DepartmentUsers: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const [department, setDepartment] = useState<any>(null);
    const [users, setUsers] = useState<DepartmentUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Search & Filter State
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [enrollmentFilter, setEnrollmentFilter] = useState("all");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const decoded = jwtDecode<AccessTokenPayload>(token);
            setRole(decoded.role ?? null);
        } catch {
            setError("Invalid session. Please log in again.");
        }
    }, []);

    useEffect(() => {
        if (role !== "ADMIN") return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [deptList, userList] = await Promise.all([
                    listDepartments(),
                    getDepartmentUsers()
                ]);
                setDepartment(deptList[0] || null);
                setUsers(userList);
            } catch (err: any) {
                setError(err?.response?.data?.detail || "Failed to load department data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [role]);

    // Filtering Logic
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || 
                                 u.email.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || u.status === statusFilter;
            const matchesEnrollment = enrollmentFilter === "all" || 
                                     (enrollmentFilter === "enrolled" ? u.face_enrolled : !u.face_enrolled);
            
            return matchesSearch && matchesStatus && matchesEnrollment;
        });
    }, [users, search, statusFilter, enrollmentFilter]);

    // Slice for Pagination
    const paginatedUsers = useMemo(() => {
        return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredUsers, page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (role && role !== "ADMIN") {
        return <Box p={4} mt={8}><Alert severity="error">Access Denied</Alert></Box>;
    }

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
    }

    return (
        <Box p={{ xs: 2, md: 4 }} mt={10} bgcolor="#F8F9FA" minHeight="100vh">
            <Stack spacing={3}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Groups color="primary" />
                        <Typography variant="h5" fontWeight={700}>My Department</Typography>
                    </Stack>
                    <Chip label={`${filteredUsers.length} Members`} color="primary" variant="outlined" />
                </Stack>

                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                {department && (
                    <>
                        <Card elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" fontWeight={600}>{department.name}</Typography>
                                <Typography color="text.secondary" variant="body2">{department.description}</Typography>
                            </CardContent>
                        </Card>

                        <Card elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
                            <CardContent>
                                {/* Filters Row */}
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Search name or email..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                                        sx={{ flexGrow: 1, maxWidth: 400 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={statusFilter}
                                            label="Status"
                                            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                                        >
                                            <MenuItem value="all">All Statuses</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Biometrics</InputLabel>
                                        <Select
                                            value={enrollmentFilter}
                                            label="Biometrics"
                                            onChange={(e) => { setEnrollmentFilter(e.target.value); setPage(0); }}
                                        >
                                            <MenuItem value="all">All Biometrics</MenuItem>
                                            <MenuItem value="enrolled">Enrolled</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Biometrics</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                                        <Typography color="text.secondary">No members found matching these filters.</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginatedUsers.map((u) => (
                                                    <TableRow key={u.user_id} hover>
                                                        <TableCell sx={{ fontWeight: 500 }}>{u.full_name}</TableCell>
                                                        <TableCell>{u.email}</TableCell>
                                                        <TableCell>
                                                            <Chip size="small" label={formatLabel(u.status)} color={u.status === "active" ? "success" : "default"} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip size="small" label={u.face_enrolled ? "Enrolled" : "Pending"} color={u.face_enrolled ? "success" : "warning"} variant={u.face_enrolled ? "filled" : "outlined"} />
                                                        </TableCell>
                                                        <TableCell sx={{ color: "text.secondary", fontSize: '0.875rem' }}>
                                                            {formatDateTime(u.last_login)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                
                                <TablePagination
                                    component="div"
                                    count={filteredUsers.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />
                            </CardContent>
                        </Card>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default DepartmentUsers;