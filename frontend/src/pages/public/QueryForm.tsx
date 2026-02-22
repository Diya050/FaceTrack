import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  MenuItem, 
  Button, 
  Dialog, 
  DialogContent 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const QueryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/'); 
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(to bottom right, #30364F, #ACBAC4)',
      p: 3
    }}>
      
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, color: '#F0F0DB' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Submit a Query
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Fill out the form below and our FaceTrack team will assist you.
        </Typography>
      </Box>

      {/* THE FORM CARD */}
      <Paper 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          width: '100%', 
          maxWidth: 600, 
          bgcolor: '#F0F0DB', 
          p: 5, 
          borderRadius: 5, 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          border: '2px solid #0c0c0c'
        }}
      >
        <TextField
          label="Full Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          InputLabelProps={{ sx: { color: '#30364F', fontWeight: 'bold' } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <TextField
          label="Email Address"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          InputLabelProps={{ sx: { color: '#30364F', fontWeight: 'bold' } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <TextField
          select
          label="Subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          variant="outlined"
          InputLabelProps={{ sx: { color: '#30364F', fontWeight: 'bold' } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
        >
          <MenuItem value="" disabled>Select a topic</MenuItem>
          <MenuItem value="attendance">Attendance Issue</MenuItem>
          <MenuItem value="recognition">Face Recognition Problem</MenuItem>
          <MenuItem value="account">Account & Profile Settings</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Message"
          name="message"
          multiline
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          variant="outlined"
          placeholder="How can we help?"
          InputLabelProps={{ sx: { color: '#30364F', fontWeight: 'bold' } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ 
              width: '40%', 
              py: 1.5, 
              bgcolor: '#E1D9BC', 
              color: '#30364F', 
              fontWeight: 'bold', 
              border: '2px solid #30364F', 
              borderRadius: 2, 
              '&:hover': { bgcolor: '#d1c8a8' } 
            }}
          >
            Submit
          </Button>
          
          <Button 
            type="button"
            onClick={() => navigate('/')}
            variant="outlined"
            sx={{ 
              width: '40%', 
              py: 1.5, 
              color: '#30364F', 
              fontWeight: 'bold', 
              border: '2px solid #30364F', 
              borderRadius: 2, 
              '&:hover': { border: '2px solid #30364F', bgcolor: 'rgba(48, 54, 79, 0.05)' } 
            }}
          >
            Back
          </Button>
        </Box>
      </Paper>

      {/* THE CUSTOM POPUP (DIALOG) */}
      <Dialog 
        open={showPopup} 
        onClose={handleClosePopup}
        PaperProps={{
          sx: {
            bgcolor: '#F0F0DB', 
            borderRadius: 5,
            p: 3,
            textAlign: 'center',
            border: '3px solid #30364F',
            minWidth: 300
          }
        }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 70, color: '#30364F' }} />
            <Typography variant="h5" sx={{ color: '#30364F', fontWeight: 900 }}>
              Success!
            </Typography>
            <Typography sx={{ color: '#30364F', fontSize: '1.1rem', fontWeight: 500 }}>
              Your query has been submitted.<br/>We'll get back to you soon.
            </Typography>
            <Button 
              onClick={handleClosePopup}
              variant="contained"
              sx={{
                mt: 1,
                px: 5,
                py: 1.5,
                bgcolor: '#30364F',
                color: '#F0F0DB',
                fontWeight: 'bold',
                borderRadius: 2,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#1e2336' }
              }}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QueryForm;