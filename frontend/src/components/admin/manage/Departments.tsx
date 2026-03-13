import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Add, Groups } from "@mui/icons-material";

import {
  createDepartment,
  listDepartments,
  type Department,
} from "../../../services/departmentService";
import {
  getOrganizations,
  type Organization,
} from "../../../services/orgService";

interface AccessTokenPayload {
  exp: number;
  org_id?: string;
  role?: string;
  sub: string;
}

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const normalizeOrganizationId = (organizationId?: string) => {
  if (!organizationId || organizationId === "None") {
    return "";
  }

  return organizationId;
};

interface DepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  submitting: boolean;
  fullScreen: boolean;
}

/*  Main Component  */

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationLoading, setOrganizationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const requiresOrganizationSelection = currentRole === "SUPER_ADMIN";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      setAuthReady(true);
      return;
    }

    try {
      const decoded = jwtDecode<AccessTokenPayload>(token);
      setCurrentRole(decoded.role ?? null);
      setSelectedOrganizationId(normalizeOrganizationId(decoded.org_id));
    } catch {
      setError("Unable to read authentication token.");
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (!authReady || currentRole !== "SUPER_ADMIN") {
      return;
    }

    const fetchOrganizations = async () => {
      setOrganizationLoading(true);

      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (organizationError: unknown) {
        setError(
          getApiErrorMessage(
            organizationError,
            "Failed to load organizations."
          )
        );
      } finally {
        setOrganizationLoading(false);
      }
    };

    void fetchOrganizations();
  }, [authReady, currentRole]);

  const fetchDepartments = useCallback(async (organizationId?: string) => {
    if (requiresOrganizationSelection && !organizationId) {
      setDepartments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await listDepartments(organizationId);
      setDepartments(data);
      setError(null);
    } catch (fetchError: unknown) {
      setError(getApiErrorMessage(fetchError, "Failed to load departments."));
    } finally {
      setLoading(false);
    }
  }, [requiresOrganizationSelection]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (requiresOrganizationSelection && !selectedOrganizationId) {
      setDepartments([]);
      return;
    }

    void fetchDepartments(selectedOrganizationId || undefined);
  }, [authReady, fetchDepartments, requiresOrganizationSelection, selectedOrganizationId]);

  const handleCreateDepartment = useCallback(
    async (data: { name: string; description: string }) => {
      if (requiresOrganizationSelection && !selectedOrganizationId) {
        setError("Select an organization before creating a department.");
        return;
      }

      setSubmitting(true);

      try {
        await createDepartment({
          name: data.name,
          description: data.description || undefined,
          organization_id: requiresOrganizationSelection
            ? selectedOrganizationId
            : undefined,
        });
        setSuccess(`Department \"${data.name}\" created successfully.`);
        setOpenModal(false);
        await fetchDepartments(selectedOrganizationId || undefined);
      } catch (createError: unknown) {
        setError(getApiErrorMessage(createError, "Failed to create department."));
      } finally {
        setSubmitting(false);
      }
    },
    [fetchDepartments, requiresOrganizationSelection, selectedOrganizationId]
  );

  const paginatedDepartments = useMemo(() => {
    const start = page * rowsPerPage;
    return departments.slice(start, start + rowsPerPage);
  }, [departments, page, rowsPerPage]);

  return (
    <Box sx={{ mt: { xs: 6, md: 8 }, p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={3} mt={3}>
        <Typography variant="h5" fontWeight={600}>
          Manage Departments
        </Typography>

        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => setOpenModal(true)}
          fullWidth={isMobile}
          disabled={requiresOrganizationSelection && !selectedOrganizationId}
        >
          Add Department
        </Button>
      </Box>

      {requiresOrganizationSelection && (
        <Card elevation={0} sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography fontWeight={600}>Organization</Typography>
              <TextField
                select
                label="Select Organization"
                value={selectedOrganizationId}
                onChange={(event) => {
                  setSelectedOrganizationId(event.target.value);
                  setPage(0);
                  setSuccess(null);
                }}
                disabled={organizationLoading}
                fullWidth
              >
                {organizations.map((organization) => (
                  <MenuItem
                    key={organization.organization_id}
                    value={organization.organization_id}
                  >
                    {organization.name}
                  </MenuItem>
                ))}
              </TextField>
              {!selectedOrganizationId && (
                <Alert severity="info">
                  Select an organization to view or create departments.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Analytics */}
      <Grid container spacing={2} mb={3}>
        <StatCard
          title="Total Departments"
          value={departments.length}
          icon={<Groups />}
        />
      </Grid>

      {/* Table */}
      <Card elevation={0}>
        <CardContent>
          <Typography fontWeight={600} mb={2}>
            Organization Hierarchy
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Department</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : paginatedDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      {requiresOrganizationSelection && !selectedOrganizationId
                        ? "Select an organization to view departments."
                        : "No departments found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDepartments.map((department) => (
                    <TableRow key={department.department_id} hover>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.description || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={departments.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      <DepartmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateDepartment}
        submitting={submitting}
        fullScreen={isMobile}
      />
    </Box>
  );
};

export default Departments;

/*  Components  */

const StatCard = ({ title, value, icon }: any) => (
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Card elevation={0}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h6" fontWeight={600}>{value}</Typography>
        </Box>
        <Box sx={{ color: "primary.main" }}>{icon}</Box>
      </CardContent>
    </Card>
  </Grid>
);

/*  Modal  */

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  open,
  onClose,
  onSubmit,
  submitting,
  fullScreen,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setValidationError(null);
    }
  }, [open]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError("Department name is required.");
      return;
    }

    setValidationError(null);
    await onSubmit({
      name: trimmedName,
      description: description.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>Create Department</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {validationError && <Alert severity="error">{validationError}</Alert>}
          <TextField
            label="Department Name"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => void handleSave()} disabled={submitting}>
          {submitting ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};