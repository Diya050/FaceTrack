import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
  TablePagination,
} from "@mui/material";

import {
  ExpandMore,
  ExpandLess,
  Add,
  Edit,
  Delete,
  Groups,
  AccessTime,
  QueryStats,
  Settings,
} from "@mui/icons-material";

/*  Types  */

interface Department {
  id: string;
  name: string;
  level: "ORG" | "BRANCH" | "FLOOR" | "ZONE";
  parentId?: string;
  users: number;
  cameras: number;
  shiftRule: string;
  attendanceRate: number;
  lateRate: number;
  efficiency: number;
}

interface DepartmentNode extends Department {
  children?: DepartmentNode[];
}

/*  Mock Data  */

const mockDepartments: Department[] = [
  { id: "1", name: "Head Office", level: "ORG", users: 240, cameras: 48, shiftRule: "General Shift", attendanceRate: 94, lateRate: 6, efficiency: 91 },
  { id: "4", name: "Delhi Office", level: "ORG", users: 210, cameras: 45, shiftRule: "Night Shift", attendanceRate: 89, lateRate: 11, efficiency: 91 },
  { id: "2", name: "Block A", level: "BRANCH", parentId: "1", users: 120, cameras: 20, shiftRule: "Morning Shift", attendanceRate: 92, lateRate: 8, efficiency: 88 },
  { id: "3", name: "Floor 1", level: "FLOOR", parentId: "2", users: 60, cameras: 10, shiftRule: "Flexible Shift", attendanceRate: 95, lateRate: 5, efficiency: 93 },
  { id: "5", name: "Block B", level: "BRANCH", parentId: "4", users: 50, cameras: 8, shiftRule: "Night Shift", attendanceRate: 93, lateRate: 7, efficiency: 92 },
];

/*  Helpers  */

const buildTree = (list: Department[], parentId?: string): DepartmentNode[] =>
  list
    .filter((d) => d.parentId === parentId)
    .map((d) => ({ ...d, children: buildTree(list, d.id) }));

/*  Main Component  */

const Departments: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<Department | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tree = useMemo(() => buildTree(mockDepartments), []);

  const paginatedRoots = useMemo(() => {
    const start = page * rowsPerPage;
    return tree.slice(start, start + rowsPerPage);
  }, [tree, page, rowsPerPage]);

  return (
    <Box sx={{ mt: { xs: 6, md: 8 }, p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={3} mt={3}>
        <Typography variant="h5" fontWeight={600}>
          Manage Departments
        </Typography>

        <Button startIcon={<Add />} variant="contained" onClick={() => setOpenModal(true)} fullWidth={isMobile}>
          Add Department
        </Button>
      </Box>

      {/* Analytics */}
      <Grid container spacing={2} mb={3}>
        <StatCard title="Total Departments" value={mockDepartments.length} icon={<Groups />} />
        <StatCard title="Avg Attendance %" value="93%" icon={<AccessTime />} />
        <StatCard title="Shift Efficiency" value="90%" icon={<QueryStats />} />
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
                  <TableCell>Level</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Cameras</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell align="right">Controls</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRoots.map((d) => (
                  <DeptRow key={d.id} dept={d} level={0} onEdit={(x) => { setSelected(x); setOpenModal(true); }} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tree.length}
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

      <DepartmentModal open={openModal} onClose={() => setOpenModal(false)} department={selected} fullScreen={isMobile} />
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

/*  Recursive Row  */

interface DeptRowProps {
  dept: DepartmentNode;
  level: number;
  onEdit: (d: DepartmentNode) => void;
}

const DeptRow: React.FC<DeptRowProps> = ({ dept, level, onEdit }) => {
  const [open, setOpen] = useState(true);
  const hasChildren = Boolean(dept.children?.length);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: { xs: level * 12, md: level * 28 } }} />
            {hasChildren && (
              <IconButton size="small" onClick={() => setOpen(!open)}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            <Typography fontWeight={500}>{dept.name}</Typography>
          </Box>
        </TableCell>

        <TableCell><Chip label={dept.level} size="small" /></TableCell>
        <TableCell>{dept.users}</TableCell>

        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{dept.cameras}</TableCell>

        <TableCell>
          <Chip label={`${dept.attendanceRate}%`} size="small" color={dept.attendanceRate > 90 ? "success" : "warning"} />
        </TableCell>

        <TableCell align="right">
          <Tooltip title="Settings"><IconButton size="small"><Settings fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(dept)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small"><Delete fontSize="small" /></IconButton></Tooltip>
        </TableCell>
      </TableRow>

      {hasChildren && (
        <TableRow>
          <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
            <Collapse in={open}>
              <Table size="small">
                <TableBody>
                  {dept.children!.map((c) => (
                    <DeptRow key={c.id} dept={c} level={level + 1} onEdit={onEdit} />
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

/*  Modal  */

const DepartmentModal = ({ open, onClose, department, fullScreen }: any) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
    <DialogTitle>{department ? "Edit Department" : "Create Department"}</DialogTitle>

    <DialogContent>
      <Stack spacing={2} mt={1}>
        <TextField label="Department Name" fullWidth />
        <TextField label="Hierarchy Level" select fullWidth>
          <MenuItem value="ORG">Organization</MenuItem>
          <MenuItem value="BRANCH">Branch</MenuItem>
          <MenuItem value="FLOOR">Floor</MenuItem>
          <MenuItem value="ZONE">Zone</MenuItem>
        </TextField>
        <TextField label="Parent Department" select fullWidth>
          <MenuItem value="1">Head Office</MenuItem>
          <MenuItem value="2">Block A</MenuItem>
        </TextField>
        <TextField label="Shift Rule" fullWidth />
      </Stack>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained">Save</Button>
    </DialogActions>
  </Dialog>
);