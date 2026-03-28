"""
Attendance-specific domain exceptions.

These are raised by the service layer and are NOT HTTP-aware.
The API layer catches them and maps to HTTP responses.
The scheduler layer catches them and logs them — no crash.
"""


class AttendanceBaseException(Exception):
    """Base for all attendance domain errors."""
    pass


class FutureDateError(AttendanceBaseException):
    """Raised when attempting to generate attendance for today or a future date."""
    def __init__(self, target_date):
        super().__init__(f"Cannot generate attendance for today or future date: {target_date}")
        self.target_date = target_date


class OrganizationNotFoundError(AttendanceBaseException):
    """Raised when the organization record does not exist."""
    def __init__(self, organization_id):
        super().__init__(f"Organization not found: {organization_id}")
        self.organization_id = organization_id


class NoActiveUsersError(AttendanceBaseException):
    """Raised (as a soft warning) when an org has zero active users."""
    def __init__(self, organization_id):
        super().__init__(f"No active users found for organization: {organization_id}")
        self.organization_id = organization_id


class AttendanceGenerationError(AttendanceBaseException):
    """Unexpected error during attendance generation — wraps the original."""
    def __init__(self, organization_id, target_date, cause: Exception):
        super().__init__(
            f"Failed to generate attendance for org={organization_id} date={target_date}: {cause}"
        )
        self.organization_id = organization_id
        self.target_date = target_date
        self.__cause__ = cause