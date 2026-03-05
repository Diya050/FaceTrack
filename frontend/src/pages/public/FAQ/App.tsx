import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import FAQ from './faq';
import QueryForm from './QueryForm';

// Create a central FaceTrack theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#30364F', // Navy Blue
    },
    background: {
      default: '#F0F0DB', // Cream background applied globally
    },
    text: {
      primary: '#30364F',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline automatically applies the background color and resets margins */}
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<FAQ />} /> 
          <Route path="/query" element={<QueryForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;