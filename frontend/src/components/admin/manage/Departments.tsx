import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow,
  TextField, Typography, IconButton, Tooltip, Card
} from "@mui/material";
import { Add, EditOutlined, DeleteOutline, WarningAmber } from "@mui/icons-material";
import { COLORS } from "../../../theme/dashboardTheme";
import { 
  createDepartment, 
  listDepartments, 
  updateDepartment, 
  deleteDepartment 
} from "../../../services/departmentService";

interface AccessTokenPayload {
  role?: string;
}

const Departments: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await listDepartments();
      setDepartments(data);
    } catch { setError("Failed to load departments"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<AccessTokenPayload>(token);
        setRole(decoded.role ?? null);
      } catch { setError("Invalid session."); }
    }
  }, []);

  useEffect(() => {
    if (role === "HR_ADMIN") fetchDepartments();
  }, [role]);

  // --- Action Handlers ---

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedDept(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (dept: any) => {
    setModalMode("edit");
    setSelectedDept(dept);
    setOpenModal(true);
  };

  const handleOpenDelete = (dept: any) => {
    setSelectedDept(dept);
    setOpenDeleteDialog(true);
  };

  const handleModalSubmit = async (data: any) => {
    try {
      if (modalMode === "create") {
        await createDepartment(data);
      } else {
        await updateDepartment(selectedDept.department_id, data);
      }
      setOpenModal(false);
      fetchDepartments();
    } catch {
      setError(`Failed to ${modalMode} department`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDepartment(selectedDept.department_id);
      setOpenDeleteDialog(false);
      fetchDepartments();
    } catch {
      setError("Failed to delete department");
    }
  };

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return departments.slice(start, start + rowsPerPage);
  }, [departments, page, rowsPerPage]);

  if (role && role !== "HR_ADMIN") {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Alert severity="warning">Access Denied: HR Admin only.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, mt: 8, bgcolor: "#F4F7FA", minHeight: "90vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.navy }}>Departments</Typography>
          <Typography variant="body2" color="text.secondary">Manage organizational structure</Typography>
        </Box>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleOpenCreate}
          sx={{ bgcolor: COLORS.navy, borderRadius: 2, textTransform: "none", px: 3 }}
        >
          New Department
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E0E4E8" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F8F9FB" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: COLORS.navy }}>NAME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.navy }}>DESCRIPTION</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: COLORS.navy }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 5 }}><CircularProgress size={30} /></TableCell></TableRow>
              ) : paginated.map((d) => (
                <TableRow key={d.department_id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                  <TableCell color="text.secondary">{d.description || "-"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenEdit(d)} sx={{ color: COLORS.navy }}>
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleOpenDelete(d)} sx={{ color: "#E53E3E", ml: 1 }}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={departments.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Card>

      {/* Dynamic Create/Edit Modal */}
      <DepartmentModal
        open={openModal}
        mode={modalMode}
        initialData={selectedDept}
        onClose={() => setOpenModal(false)}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <WarningAmber sx={{ color: "#FF9800", fontSize: 50, mb: 1 }} />
          <DialogTitle>Delete Department?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete <strong>{selectedDept?.name}</strong>? 
              This action might affect assigned employees.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: "#718096" }}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: "#E53E3E", "&:hover": { bgcolor: "#C53030" } }}>
              Confirm Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

// --- Modal Component (Updated for Edit Mode) ---
const DepartmentModal = ({ open, onClose, onSubmit, mode, initialData }: any) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // Populate fields when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      setName(initialData.name);
      setDesc(initialData.description || "");
    } else {
      setName("");
      setDesc("");
    }
  }, [initialData, mode, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSubmit({ name, description: desc });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, color: COLORS.navy }}>
        {mode === "create" ? "Create New Department" : "Edit Department"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          <TextField
            fullWidth
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#718096" }}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!name.trim()} sx={{ bgcolor: COLORS.navy }}>
          {mode === "create" ? "Create" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Departments;