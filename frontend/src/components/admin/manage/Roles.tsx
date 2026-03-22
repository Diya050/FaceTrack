import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Security,
  Add,
  Edit,
  Delete,
  AdminPanelSettings,
  ManageAccounts,
  People,
  Warning,
} from "@mui/icons-material";

/*  Types  */

type PermissionKey =
  | "viewAttendance"
  | "editAttendance"
  | "overrideAttendance"
  | "approveEnrollment"
  | "manageUsers"
  | "viewAnalytics"
  | "manageSystem"
  | "viewAuditLogs";

type Role = {
  id: string;
  name: string;
  system: boolean;
  permissions: Record<PermissionKey, boolean>;
};

/*  Mock Data  */

const DEFAULT_ROLES: Role[] = [
  {
    id: "hr",
    name: "HR Admin",
    system: true,
    permissions: {
      viewAttendance: true,
      editAttendance: true,
      overrideAttendance: true,
      approveEnrollment: true,
      manageUsers: true,
      viewAnalytics: true,
      manageSystem: false,
      viewAuditLogs: true,
    },
  },
  {
    id: "manager",
    name: "Manager",
    system: true,
    permissions: {
      viewAttendance: true,
      editAttendance: true,
      overrideAttendance: false,
      approveEnrollment: true,
      manageUsers: false,
      viewAnalytics: true,
      manageSystem: false,
      viewAuditLogs: false,
    },
  },
  {
    id: "employee",
    name: "Employee",
    system: true,
    permissions: {
      viewAttendance: true,
      editAttendance: false,
      overrideAttendance: false,
      approveEnrollment: false,
      manageUsers: false,
      viewAnalytics: false,
      manageSystem: false,
      viewAuditLogs: false,
    },
  },
];

/*  Component  */

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [freeze, setFreeze] = useState(false);

  const togglePermission = (
    roleId: string,
    key: PermissionKey,
    value: boolean
  ) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? { ...r, permissions: { ...r.permissions, [key]: value } }
          : r
      )
    );
  };

  const openEditor = (role?: Role) => {
    setEditing(role ?? null);
    setOpen(true);
  };

  return (
    <Box mt={2}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Security />
              <Typography variant="h5" fontWeight={600}>
                Role & Permission Management
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Define who can access, modify, approve, and control system operations.
            </Typography>

            {/* Emergency Freeze */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: freeze ? "error.main" : "divider",
                borderRadius: 2,
                bgcolor: freeze ? "error.lighter" : "transparent",
              }}
            >
              <Warning color={freeze ? "error" : "disabled"} />
              <Box flex={1}>
                <Typography fontWeight={600}>
                  Emergency Attendance Freeze
                </Typography>
                <Typography variant="caption">
                  Temporarily disables attendance edits & overrides system-wide.
                </Typography>
              </Box>
              <Switch
                checked={freeze}
                onChange={(e) => setFreeze(e.target.checked)}
                color="error"
              />
            </Stack>

            <Divider />

            

            {/* Action Bar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                System Roles
              </Typography>

              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => openEditor()}
              >
                Create Role
              </Button>
            </Stack>


            {/* Roles Table */}
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell align="center">View</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Override</TableCell>
                    <TableCell align="center">Approve</TableCell>
                    <TableCell align="center">Users</TableCell>
                    <TableCell align="center">Analytics</TableCell>
                    <TableCell align="center">System</TableCell>
                    <TableCell align="center">Audit</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {roles.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {r.name.includes("Admin") ? (
                            <AdminPanelSettings />
                          ) : r.name === "Manager" ? (
                            <ManageAccounts />
                          ) : (
                            <People />
                          )}

                          <Typography fontWeight={600}>{r.name}</Typography>

                          {r.system && <Chip label="System" size="small" />}
                        </Stack>
                      </TableCell>

                      {(Object.keys(r.permissions) as PermissionKey[]).map((key) => (
                        <TableCell key={key} align="center">
                          <Switch
                            size="small"
                            checked={r.permissions[key]}
                            disabled={r.system && r.name === "Super Admin"}
                            onChange={(e) =>
                              togglePermission(r.id, key, e.target.checked)
                            }
                          />
                        </TableCell>
                      ))}

                      <TableCell align="right">
                        <Tooltip title="Edit role">
                          <IconButton size="small" onClick={() => openEditor(r)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {!r.system && (
                          <Tooltip title="Delete role">
                            <IconButton size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      <RoleEditor open={open} onClose={() => setOpen(false)} role={editing} />
    </Box>
  );
};

export default Roles;

/*  Role Editor  */

const RoleEditor: React.FC<{
  open: boolean;
  onClose: () => void;
  role: Role | null;
}> = ({ open, onClose, role }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Role Name"
            defaultValue={role?.name ?? ""}
            fullWidth
          />

          <Typography variant="subtitle2">
            Permissions are configured after role creation.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">
          {role ? "Save Changes" : "Create Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};