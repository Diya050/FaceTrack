import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { Groups, Search as SearchIcon } from "@mui/icons-material";
import { isAxiosError } from "axios";

import {
	listOrganizationUsers,
	type OrganizationUser,
	type UserStatus,
} from "../../services/userService";
import { listDepartments } from "../../services/departmentService";

const statusOptions: Array<{ label: string; value: "all" | UserStatus }> = [
	{ label: "All Status", value: "all" },
	{ label: "Pending", value: "pending" },
	{ label: "Approved", value: "approved" },
	{ label: "Rejected", value: "rejected" },
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
];

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

const getErrorMessage = (error: unknown, fallback: string) => {
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

type ViewOrganizationUsersProps = {
	embedded?: boolean;
};

const ViewOrganizationUsers = ({ embedded = false }: ViewOrganizationUsersProps) => {
	const [users, setUsers] = useState<OrganizationUser[]>([]);
	const [departmentNames, setDepartmentNames] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState<"all" | UserStatus>("all");

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			setError(null);

			try {
				const [organizationUsers, departments] = await Promise.all([
					listOrganizationUsers(selectedStatus === "all" ? undefined : selectedStatus),
					listDepartments(),
				]);

				setUsers(organizationUsers);
				setDepartmentNames(
					departments
						.map((department) => department.name)
						.filter((name): name is string => Boolean(name))
						.sort((a, b) => a.localeCompare(b))
				);
			} catch (loadError: unknown) {
				setError(getErrorMessage(loadError, "Failed to fetch organization users."));
			} finally {
				setLoading(false);
			}
		};

		void loadData();
	}, [selectedStatus]);

	const filteredUsers = useMemo(() => {
		const searchText = search.trim().toLowerCase();

		return users.filter((user) => {
			if (selectedDepartment !== "all" && (user.department ?? "") !== selectedDepartment) {
				return false;
			}

			if (!searchText) {
				return true;
			}

			return (
				user.full_name.toLowerCase().includes(searchText) ||
				user.email.toLowerCase().includes(searchText) ||
				(user.department ?? "").toLowerCase().includes(searchText) ||
				(user.role ?? "").toLowerCase().includes(searchText)
			);
		});
	}, [users, search, selectedDepartment]);

	const paginatedUsers = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredUsers.slice(start, start + rowsPerPage);
	}, [filteredUsers, page, rowsPerPage]);

	const handleDepartmentChange = (department: string) => {
		setSelectedDepartment(department);
		setPage(0);
	};

	const handleStatusChange = (status: "all" | UserStatus) => {
		setSelectedStatus(status);
		setPage(0);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: embedded ? 240 : "60vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				p: { xs: 2, md: 4 },
				bgcolor: "#F8F9FA",
				minHeight: embedded ? "auto" : "100vh",
			}}
		>
			<Stack spacing={3}>
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={2}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", md: "center" }}
				>
					<Stack direction="row" spacing={1.2} alignItems="center">
						<Groups color="primary" />
						<Typography variant="h5" fontWeight={700}>
							Organization Users
						</Typography>
					</Stack>

					<Chip
						color="primary"
						variant="outlined"
						label={`${filteredUsers.length} users`}
					/>
				</Stack>

				{error && (
					<Alert severity="error" onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				<Card elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
					<CardContent>
						<Stack direction={{ xs: "column", md: "row" }} spacing={2}>
							<TextField
								fullWidth
								size="small"
								label="Search Users"
								value={search}
								onChange={(event) => {
									setSearch(event.target.value);
									setPage(0);
								}}
								placeholder="Name, email, role, department"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon fontSize="small" />
										</InputAdornment>
									),
								}}
							/>

							<FormControl size="small" sx={{ minWidth: { xs: "100%", md: 220 } }}>
								<InputLabel id="users-department-filter-label">Department</InputLabel>
								<Select
									labelId="users-department-filter-label"
									value={selectedDepartment}
									label="Department"
									onChange={(event) => handleDepartmentChange(String(event.target.value))}
								>
									<MenuItem value="all">All Departments</MenuItem>
									{departmentNames.map((department) => (
										<MenuItem key={department} value={department}>
											{department}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl size="small" sx={{ minWidth: { xs: "100%", md: 220 } }}>
								<InputLabel id="users-status-filter-label">Status</InputLabel>
								<Select
									labelId="users-status-filter-label"
									value={selectedStatus}
									label="Status"
									onChange={(event) =>
										handleStatusChange(event.target.value as "all" | UserStatus)
									}
								>
									{statusOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>
					</CardContent>
				</Card>

				<Card elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
					<CardContent sx={{ p: 0 }}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Face</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{paginatedUsers.map((user) => (
										<TableRow key={user.user_id} hover>
											<TableCell>{user.full_name}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.department ?? "-"}</TableCell>
											<TableCell>{formatLabel(user.role)}</TableCell>
											<TableCell>
												<Chip
													size="small"
													label={formatLabel(user.status)}
													color={user.status === "active" ? "success" : "default"}
												/>
											</TableCell>
											<TableCell>
												<Chip
													size="small"
													label={user.face_enrolled ? "Enrolled" : "Not Enrolled"}
													color={user.face_enrolled ? "success" : "warning"}
													variant={user.face_enrolled ? "filled" : "outlined"}
												/>
											</TableCell>
											<TableCell>{formatDateTime(user.last_login)}</TableCell>
										</TableRow>
									))}

									{!paginatedUsers.length && (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
													No users found for the selected filters.
												</Typography>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<TablePagination
							component="div"
							count={filteredUsers.length}
							page={page}
							onPageChange={(_, nextPage) => setPage(nextPage)}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={(event) => {
								setRowsPerPage(parseInt(event.target.value, 10));
								setPage(0);
							}}
							rowsPerPageOptions={[5, 10, 25, 50]}
						/>
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
};

export default ViewOrganizationUsers;
