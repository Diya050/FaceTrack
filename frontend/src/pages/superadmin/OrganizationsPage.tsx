import {
  Stack,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrganizationTable from "../../components/superadmin/OrganizationTable";

export default function OrganizationsPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      {/* HEADER */}
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Organizations
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Manage and monitor all organizations on the platform
        </Typography>
      </Box>

      {/* ACTION BAR */}
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() =>
            navigate("/super-admin/organizations/create")
          }
        >
          Create Organization
        </Button>
      </Stack>

      {/* TABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          p: 2,
        }}
      >
        <OrganizationTable />
      </Paper>
    </Stack>
  );
}