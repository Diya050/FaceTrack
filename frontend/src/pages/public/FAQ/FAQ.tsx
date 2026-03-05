import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  InputAdornment, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Button 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // MUI Accordions work best tracking the expanded panel index
  const [expanded, setExpanded] = useState<number | false>(false);

  // Changes the browser tab title when the page loads
  useEffect(() => {
    document.title = "FAQ | FaceTrack";
  }, []);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqData = [
    {
      question: "How does FaceTrack handle attendance?",
      answer: "FaceTrack uses a live video stream to identify faces and cross-reference them with the database in real-time, automatically logging attendance with timestamps."
    },
    {
      question: "What should I do if my face isn't recognized?",
      answer: "Ensure you are in a well-lit area and looking directly at the camera. If issues persist, you can update your profile photo or submit a query to our support team."
    },
    {
      question: "Can FaceTrack recognize multiple people at once?",
      answer: "Yes! Our system is designed to detect and process multiple faces simultaneously within the camera's field of view, making group attendance seamless."
    },
    {
      question: "How can I view my attendance history?",
      answer: "You can view your personal attendance history, including timestamps and total days present, by logging into your user dashboard and navigating to the 'My Records' tab."
    },
    {
      question: "How do I register my face in the system for the first time?",
      answer: "During your initial onboarding, an administrator will capture a short video or multiple photos of your face from different angles to create your unique, secure biometric profile."
    },
    {
      question: "What should I do if I am incorrectly marked absent?",
      answer: "If you believe the system missed you, please contact your instructor or administrator. They have manual override privileges to review and correct attendance records."
    },
    {
      question: "Can I use FaceTrack on my mobile device?",
      answer: "Yes, the FaceTrack frontend is fully responsive and can be accessed via any mobile browser with camera permissions enabled."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We encrypt all biometric data and do not store raw images, only numerical facial embeddings for recognition purposes."
    }
  ];

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F0DB', fontFamily: 'sans-serif', pb: 10 }}>
      
      {/* Enhanced Hero Section */}
      <Box sx={{ 
        position: 'relative',
        background: 'linear-gradient(to bottom right, #1e2336, #30364F, #424a6b)',
        py: 12, 
        px: 2, 
        textAlign: 'center', 
        overflow: 'hidden' 
      }}>
        
        {/* Decorative Background Blurs mapped to MUI sx */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <Box sx={{ 
            position: 'absolute', top: -128, left: -128, width: 384, height: 384, 
            borderRadius: '50%', bgcolor: '#ACBAC4', opacity: 0.1, filter: 'blur(64px)' 
          }} />
          <Box sx={{ 
            position: 'absolute', bottom: 0, right: 0, width: 320, height: 320, 
            borderRadius: '50%', bgcolor: '#F0F0DB', opacity: 0.1, filter: 'blur(64px)' 
          }} />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Typography variant="h2" sx={{ 
            color: '#F0F0DB', fontWeight: 800, mb: 3, 
            letterSpacing: '-0.02em', textShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            FAQs
          </Typography>
          <Typography variant="h6" sx={{ color: '#ACBAC4', maxWidth: '600px', mx: 'auto', mb: 6, fontWeight: 500 }}>
            How can the FaceTrack team help you?
          </Typography>
          
          {/* Styled Search Bar */}
          <Box sx={{ maxWidth: '600px', mx: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', borderRadius: 4 }}>
            <TextField
              fullWidth
              placeholder="Search for answers..."
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: '#F0F0DB',
                borderRadius: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  py: 1,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#30364F',
                  '& fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '4px solid #ACBAC4' },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 2 }}>
                    <SearchIcon sx={{ color: '#30364F', opacity: 0.5 }} fontSize="large" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* FAQ List */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <Accordion 
                key={index}
                expanded={expanded === index}
                onChange={handleChange(index)}
                disableGutters
                sx={{ 
                  borderRadius: '12px !important', 
                  border: '1px solid #ACBAC4', 
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                  '&:before': { display: 'none' }, // Removes default MUI dividing line
                  transition: 'all 0.3s ease'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon sx={{ color: '#30364F' }} />}
                  sx={{ p: 3, '&:hover': { bgcolor: '#fafafa' }, borderRadius: '12px' }}
                >
                  <Typography sx={{ fontWeight: 'bold', color: '#30364F', fontSize: '1.125rem' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3, pt: 0, borderTop: '1px solid #f3f4f6' }}>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
              No matching questions found.
            </Typography>
          )}
        </Box>

        {/* Support Section */}
        <Box sx={{ 
          mt: 8, 
          bgcolor: 'rgba(172, 186, 196, 0.3)', 
          borderRadius: 4, 
          p: 4, 
          textAlign: 'center', 
          border: '2px dashed #30364F' 
        }}>
          <ChatBubbleOutlineIcon sx={{ color: '#30364F', fontSize: 40, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#30364F', mb: 1 }}>
            Still have questions?
          </Typography>
          <Typography sx={{ color: '#30364F', opacity: 0.8, mb: 3 }}>
            If you can't find the answer you're looking for, please submit a detailed query.
          </Typography>
          <Button
            onClick={() => navigate('/query')}
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: '#30364F', 
              color: '#F0F0DB', 
              fontWeight: 'bold', 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': { 
                bgcolor: '#1e2336',
                transform: 'scale(1.05)'
              }
            }}
          >
            Submit a Query
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;