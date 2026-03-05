import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../../services/userService";

export const formatDateTime = (date: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRole = (role?: string) => {
  if (!role) return "—";

  return role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch {
      console.error("Profile fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateCurrentUser(user);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchUser();
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box maxWidth={1000} mx="auto" px={2} py={3}>

      {/* PROFILE HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          textAlign={{ xs: "center", sm: "left" }}
        >
          <Avatar
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              fontSize: { xs: 36, sm: 50 },
              bgcolor: "primary.main",
            }}
          >
            {user.full_name?.charAt(0)}
          </Avatar>

          <Box flex={1}>
            <Typography fontSize={{ xs: 26, sm: 35 }} fontWeight={600}>
              {user.full_name}
            </Typography>

            <Typography fontSize={15} color="text.secondary">
              {user.email}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={1.5}
              flexWrap="wrap"
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              <Chip label={formatRole(user.role)} size="small" color="primary" />

              {user.department && (
                <Chip label={user.department} size="small" />
              )}

              {user.organization && (
                <Chip label={user.organization} size="small" />
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* ACCOUNT STATUS */}
      <Card elevation={0} sx={{ border: "1px solid #E5E7EB", mb: 3 }}>
        <CardContent>

          <Typography fontSize={20} fontWeight={800} mb={2}>
            Account Status
          </Typography>

          <Grid container spacing={3}>

            <Grid size={{ xs: 16, md: 4 }}>
              <Typography fontSize={14} fontWeight={550} variant="caption" color="text.secondary" pr={1}>
                Status
              </Typography>

              <Chip
                label={formatRole(user.status)}
                color={user.status === "approved" ? "success" : "warning"}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography fontSize={14} fontWeight={550} variant="caption" color="text.secondary" pr={1}>
                Account Active
              </Typography>

              <Chip
                label={user.is_active ? "Active" : "Disabled"}
                color={user.is_active ? "success" : "error"}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography fontSize={14} fontWeight={550} variant="caption" color="text.secondary" pr={1}>
                Face Enrolled
              </Typography>

              <Chip
                label={user.face_enrolled ? "Enrolled" : "Not Enrolled"}
                color={user.face_enrolled ? "success" : "default"}
                size="small"
              />
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* ORGANIZATION INFO */}
      <Card elevation={0} sx={{ border: "1px solid #E5E7EB", mb: 3 }}>
        <CardContent>

          <Typography fontSize={20} fontWeight={600} mb={2}>
            Organization Details
          </Typography>

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption">Organization</Typography>
              <Typography >{user.organization || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption">Department</Typography>
              <Typography>{user.department || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption">Role</Typography>
              <Typography>{formatRole(user.role) || "—"}</Typography>
            </Grid>

          </Grid>

        </CardContent>
      </Card>

      {/* PERSONAL INFORMATION */}
      <Card elevation={0} sx={{ border: "1px solid #E5E7EB", mb: 3 }}>
        <CardContent>

          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 2, sm: 0 }}
            mb={3}
          >
            <Typography fontSize={20} fontWeight={600}>
              Personal Information
            </Typography>

            {!editing && (
              <Button
                variant="contained"
                size="medium"
                onClick={() => setEditing(true)}
              >
                Edit Details
              </Button>
            )}
          </Stack>

          {/* Fields */}
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              value={user.full_name || ""}
              disabled={!editing}
              onChange={(e) =>
                setUser({ ...user, full_name: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Phone Number"
              value={user.phone_number || ""}
              disabled={!editing}
              onChange={(e) =>
                setUser({ ...user, phone_number: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Email"
              value={user.email || ""}
              disabled
              fullWidth
            />
          </Stack>

          {/* Actions */}
          {editing && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="flex-end"
              mt={3}
            >
              <Button
                variant="outlined"
                fullWidth
                sx={{ maxWidth: { sm: 140 } }}
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                disabled={saving}
                fullWidth
                sx={{ maxWidth: { sm: 160 } }}
                onClick={handleUpdate}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          )}

        </CardContent>
      </Card>

      {/* ACCOUNT ACTIVITY */}
      <Card elevation={0} sx={{ border: "1px solid #E5E7EB", mb: 3 }}>
        <CardContent>

          <Typography fontSize={20} fontWeight={600} mb={2}>
            Account Activity
          </Typography>

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption">Created At</Typography>
              <Typography>{formatDateTime(user.created_at) || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption">Last Login</Typography>
              <Typography>{formatDateTime(user.last_login) || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption">Last Updated</Typography>
              <Typography>{formatDateTime(user.updated_at) || "—"}</Typography>
            </Grid>

          </Grid>

        </CardContent>
      </Card>

      {/* APPROVAL METADATA */}
      <Card elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
        <CardContent>

          <Typography fontSize={20} fontWeight={600} mb={2}>
            Approval Metadata
          </Typography>

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption">Approved By</Typography>
              <Typography>{user.approved_by || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption">Approved At</Typography>
              <Typography>{formatDateTime(user.approved_at) || "—"}</Typography>
            </Grid>

          </Grid>

        </CardContent>
      </Card>

    </Box>
  );
}