import { Fab, Zoom, Tooltip, Box } from '@mui/material';
import { WhatsApp } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const WhatsAppFloat = () => {
  const [visible, setVisible] = useState(false);
 const phoneNumber = "5493585182894";
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

 const handleWhatsAppClick = () => {
  const message = "¡Hola! Me interesa conocer más sobre sus productos. ¿Podrían ayudarme?";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

  return (
    <Zoom in={visible}>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 30 },
          zIndex: 1000,
        }}
      >
        <Tooltip 
          title="¡Escribinos por WhatsApp!" 
          placement="left"
          arrow
        >
          <Fab
            onClick={handleWhatsAppClick}
            sx={{
              backgroundColor: '#25D366',
              color: 'white',
              width: { xs: 56, md: 64 },
              height: { xs: 56, md: 64 },
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#128C7E',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(37, 211, 102, 0.6)',
              },
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                },
                '50%': {
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.7)',
                },
                '100%': {
                  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                },
              },
            }}
          >
            <WhatsApp sx={{ fontSize: { xs: 28, md: 32 } }} />
          </Fab>
        </Tooltip>
      </Box>
    </Zoom>
  );
};

export default WhatsAppFloat;