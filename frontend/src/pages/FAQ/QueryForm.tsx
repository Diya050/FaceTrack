import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// MUI Imports for the custom popup
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const QueryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  
  // 1. New state to control the popup
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 2. Open the custom popup instead of the browser alert
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/'); // Redirect back to FAQ after closing
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(to bottom right, #30364F, #ACBAC4)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', color: '#F0F0DB' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 10px 0' }}>Submit a Query</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Fill out the form below and our FaceTrack team will assist you.</p>
      </div>

      {/* THE FORM CARD */}
      <form onSubmit={handleSubmit} style={{ 
        width: '100%', 
        maxWidth: '600px', 
        backgroundColor: '#F0F0DB', 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '2px solid #0c0c0c',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#30364F' }}>Full Name</label>
          <input
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ACBAC4', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#30364F' }}>Email Address</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ACBAC4', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#30364F' }}>Subject</label>
          <select
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ACBAC4', fontSize: '1rem', backgroundColor: 'white' }}
          >
            <option value="" disabled>Select a topic</option>
            <option value="attendance">Attendance Issue</option>
            <option value="recognition">Face Recognition Problem</option>
            <option value="account">Account & Profile Settings</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#30364F' }}>Message</label>
          <textarea
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help?"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ACBAC4', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
          <button
            type="submit"
            style={{ 
              width: '40%', 
              padding: '12px', 
              backgroundColor: '#E1D9BC', 
              color: '#30364F', 
              fontWeight: 'bold', 
              border: '2px solid #30364F', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            Submit
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/')}
            style={{ 
              width: '40%', 
              padding: '12px', 
              backgroundColor: 'transparent', 
              color: '#30364F', 
              fontWeight: 'bold', 
              border: '2px solid #30364F', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            Back
          </button>
        </div>
      </form>

      {/* 3. THE CUSTOM POPUP (DIALOG) */}
      <Dialog 
        open={showPopup} 
        onClose={handleClosePopup}
        PaperProps={{
          style: {
            backgroundColor: '#F0F0DB', 
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'center',
            border: '3px solid #30364F',
            minWidth: '300px'
          },
        }}
      >
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <CheckCircleOutlineIcon style={{ fontSize: '70px', color: '#30364F' }} />
            <h2 style={{ color: '#30364F', margin: 0, fontWeight: '900', fontSize: '1.8rem' }}>Success!</h2>
            <p style={{ color: '#30364F', fontSize: '1.1rem', fontWeight: '500' }}>
              Your query has been submitted.<br/>We'll get back to you soon.
            </p>
            <button 
              onClick={handleClosePopup}
              style={{
                marginTop: '10px',
                padding: '12px 40px',
                backgroundColor: '#30364F',
                color: '#F0F0DB',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueryForm;