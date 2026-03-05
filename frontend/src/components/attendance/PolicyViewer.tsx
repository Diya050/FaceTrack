import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const policies = [
  {
    title: "Attendance Policy",
    content:
      "Employees must complete a minimum of 8 hours per working day. Attendance is tracked using the FaceTrack facial recognition system."
  },
  {
    title: "Late Penalty Rules",
    content:
      "More than 3 late arrivals in a month may result in salary deductions or leave adjustments."
  },
  {
    title: "Shift Definitions",
    content:
      "General Shift: 9:00 AM – 6:00 PM. Flexible shifts may apply depending on department."
  },
  {
    title: "Overtime Rules",
    content:
      "Overtime is counted after 9 hours of work and must be approved by the department manager."
  },
  {
    title: "Recognition Threshold Policy",
    content:
      "Face recognition confidence must be above 85%. Below this threshold, manual verification may be required."
  },
  {
    title: "Camera Usage Policy",
    content:
      "Cameras are placed at entry gates and critical checkpoints for attendance verification."
  }
];

const PolicyViewer = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Organization Policies
      </Typography>

      {policies.map((policy) => (
        <Accordion key={policy.title}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">
              {policy.title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">
              {policy.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

    </Paper>
  );
};

export default PolicyViewer;