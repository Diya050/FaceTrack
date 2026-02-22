import React from 'react';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EngineeringIcon from '@mui/icons-material/Engineering';
import {  useNavigate } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  const NaviGate = useNavigate();
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 8,
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: '#30364F', mb: 2 }}
        >
          Help & Support Center
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#30364F', maxWidth: 600, mx: 'auto' }}
        >
          Official documentation for the FaceTrack Video Stream
          Attendance Management System.
        </Typography>
      </Box>

      {/* Troubleshooting Section */}
      <Box mb={10}>
        <Alert
          icon={<SettingsSuggestIcon sx={{ color: '#30364F' }} />}
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #30364F',
            mb: 4
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', color: '#30364F' }}>
            System Troubleshooting & Recovery
          </AlertTitle>
          <Typography sx={{ color: '#30364F' }}>
            For critical errors, expect system recovery within 24 hours.
          </Typography>
        </Alert>

        <Accordion
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #30364F',
            mb: 2
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#30364F' }} />}>
            <Typography fontWeight="bold" sx={{ color: '#30364F' }}>
              Handling Recognition Failures
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: '#30364F' }}>
              Recognition performance depends on hardware and lighting.
              Ensure high-quality facial enrollment images.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #30364F'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#30364F' }} />}>
            <Typography fontWeight="bold" sx={{ color: '#30364F' }}>
              Network & Stream Latency
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: '#30364F' }}>
              Network stability affects real-time video transmission.
              Ensure reliable bandwidth for camera streams.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Guides Section */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #30364F',
              textAlign: 'center',
              height: '100%'
            }}
          >
            <CardContent>
              <HelpOutlineIcon sx={{ fontSize: 50, color: '#30364F', mb: 2 }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#30364F', mb: 2 }}
              >
                Getting Started
              </Typography>
              <Typography sx={{ color: '#30364F', mb: 3 }}>
                Quick start guide for attendance marking and camera setup.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: '#30364F',
                  borderColor: '#30364F',
                  '&:hover': {
                    backgroundColor: '#30364F',
                    color: '#ffffff'
                  }
                }}
              >
                View Guide
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #30364F',
              textAlign: 'center',
              height: '100%'
            }}
          >
            <CardContent>
              <EngineeringIcon sx={{ fontSize: 50, color: '#30364F', mb: 2 }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#30364F', mb: 2 }}
              >
                Admin Guide
              </Typography>
              <Typography sx={{ color: '#30364F', mb: 3 }}>
                Manage users, facial data, and role-based access control.
              </Typography>
              <Button
                onClick={() => NaviGate('/adminsguide')}
                variant="outlined"
                sx={{
                  color: '#30364F',
                  borderColor: '#30364F',
                  '&:hover': {
                    backgroundColor: '#30364F',
                    color: '#ffffff'
                  }
                }}
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #30364F',
              textAlign: 'center',
              height: '100%'
            }}
          >
            <CardContent>
              <ContactSupportIcon sx={{ fontSize: 50, color: '#30364F', mb: 2 }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#30364F', mb: 2 }}
              >
                User Guide
              </Typography>
              <Typography sx={{ color: '#30364F', mb: 3 }}>
                Learn to view attendance records and request corrections.
              </Typography>
              <Button
              onClick={() => NaviGate('/usersguide')}
                variant="outlined"
                sx={{
                  color: '#30364F',
                  borderColor: '#30364F',
                  '&:hover': {
                    backgroundColor: '#30364F',
                    color: '#ffffff'
                  }
                }}
              >
                Explore
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HelpCenterPage;