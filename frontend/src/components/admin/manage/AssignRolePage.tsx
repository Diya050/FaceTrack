import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Stack,
  Container,
  Avatar,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { assignRole, getUsers } from "../../../services/roleService";

type RoleType = "USER" | "ADMIN" | "HR_ADMIN";

interface UserRow {
  user_id: string;
  full_name: string;
  email: string;
  role: RoleType;
  status: "APPROVED" | "ACTIVE";
}

const NAVY = "#30364F";
const SUCCESS_GREEN = "#2E7D00";
const WARNING_ORANGE = "#E65100";
const INFO_BLUE = "#1976D2";

export default function AssignRolePage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, RoleType>>({});
  const [loading, setLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
      setUsers(data);
      setPendingChanges({});
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: RoleType) => {
    const original = users.find((u) => u.user_id === userId);
    if (original?.role === newRole) {
      const copy = { ...pendingChanges };
      delete copy[userId];
      setPendingChanges(copy);
    } else {
      setPendingChanges((prev) => ({ ...prev, [userId]: newRole }));
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      await Promise.all(
        Object.entries(pendingChanges).map(([id, role]) =>
          assignRole({ user_id: id, role_name: role })
        )
      );
      alert("Settings Deployed Successfully!");
      fetchUsers();
    } catch (err) {
      alert("Deployment failed");
    } finally {
      setIsDeploying(false);
    }
  };


  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const changeCount = Object.keys(pendingChanges).length;

  return (
    <Box sx={{ minHeight: "60vh", bgcolor: "#f1f3f5", py: 4 }}>
      <Container maxWidth="lg">
        {/* HEADER SECTION */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: NAVY, letterSpacing: "-0.01em" }}>
            Role Management
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={fetchUsers} 
                disabled={loading || isDeploying} 
                sx={{ bgcolor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.08)", border: "1px solid", borderColor: "divider", width: 46, height: 46 }}
              >
                <RefreshIcon sx={{ color: NAVY, fontSize: 24 }} />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              disableElevation
              startIcon={isDeploying ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleDeploy}
              disabled={changeCount === 0 || isDeploying}
              sx={{
                px: 4, height: 46, bgcolor: NAVY, borderRadius: "10px", fontWeight: 800, textTransform: "none", fontSize: "1rem",
                "&:hover": { bgcolor: "#1e2233" }
              }}
            >
              Save {changeCount} {changeCount === 1 ? "Change" : "Changes"}
            </Button>
          </Stack>
        </Box>

        <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid", borderColor: "divider" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 800, py: 3, color: NAVY, fontSize: "0.9rem", textTransform: "uppercase" }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: NAVY, fontSize: "0.9rem", textTransform: "uppercase" }}>Verification Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: NAVY, fontSize: "0.9rem", textTransform: "uppercase" }} align="center">Assigned Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 14 }}>
                      <CircularProgress size={50} thickness={5} sx={{ color: NAVY }} />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 14 }}>
                      <GroupIcon sx={{ fontSize: 60, color: "divider", mb: 2 }} />
                      <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 700 }}>No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => {
                      const isPending = !!pendingChanges[user.user_id];
                      const activeRole = pendingChanges[user.user_id] || user.role;
                      const statusUpper = user.status.toUpperCase();

                      return (
                        <TableRow key={user.user_id} sx={{ "&:hover": { bgcolor: "#fafafa" }, transition: "background 0.2s" }}>
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ 
                                bgcolor: NAVY,
                                width: 45, 
                                height: 45, 
                                fontWeight: 800,
                                transition: "background-color 0.3s ease"
                              }}>
                                {user.full_name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: "1rem" }}>{user.full_name}</Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>{user.email}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={user.status}
                              icon={statusUpper === "ACTIVE" ? <CheckCircleIcon style={{ color: "white" }} /> : <PersonIcon style={{ color: "white" }} />}
                              sx={{
                                fontWeight: 900, fontSize: "0.75rem", borderRadius: "8px", textTransform: "uppercase",
                                bgcolor: statusUpper === "ACTIVE" ? SUCCESS_GREEN : statusUpper === "APPROVED" ? INFO_BLUE : WARNING_ORANGE,
                                color: "white", px: 1, "& .MuiChip-icon": { color: "white", fontSize: 18 }
                              }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Select
                              size="small"
                              value={activeRole}
                              onChange={(e) => handleRoleChange(user.user_id, e.target.value as RoleType)}
                              renderValue={(selected) => (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  {selected === "HR_ADMIN" && <SupervisorAccountIcon sx={{ fontSize: 20, color: NAVY }} />}
                                  {selected === "ADMIN" && <AdminPanelSettingsIcon sx={{ fontSize: 20, color: "primary.main" }} />}
                                  {selected === "USER" && <PersonOutlineIcon sx={{ fontSize: 20, color: "text.secondary" }} />}
                                  <Typography sx={{ fontSize: "0.9rem", fontWeight: selected === "HR_ADMIN" ? 800 : 600 }}>
                                    {selected === "ADMIN" ? "Department Admin" : selected.replace("_", " ")}
                                  </Typography>
                                </Stack>
                              )}
                              sx={{
                                minWidth: 210, borderRadius: "8px", bgcolor: isPending ? "#fffde7" : "white",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: isPending ? WARNING_ORANGE : "divider", borderWidth: isPending ? "2px" : "1px" }
                              }}
                            >
                              <MenuItem value="USER">
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <PersonOutlineIcon fontSize="small" />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>User</Typography>
                                </Stack>
                              </MenuItem>
                              <MenuItem value="ADMIN">
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <AdminPanelSettingsIcon fontSize="small" color="primary" />
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>Department Admin</Typography>
                                </Stack>
                              </MenuItem>
                              <MenuItem value="HR_ADMIN">
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <SupervisorAccountIcon fontSize="small" sx={{ color: NAVY }} />
                                  <Typography variant="body2" sx={{ fontWeight: 800, color: NAVY }}>HR Admin</Typography>
                                </Stack>
                              </MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: "1px solid", borderColor: "divider" }}
          />
        </Paper>
      </Container>
    </Box>
  );
}