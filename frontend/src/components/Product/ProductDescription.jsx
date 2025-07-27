import { Paper, Typography, Box, Divider, Container } from '@mui/material';
import { InfoOutlined, DescriptionOutlined } from '@mui/icons-material';

const ProductDescription = ({ descripcionLarga }) => {
  // Si no hay descripción larga, no renderizar nada
  if (!descripcionLarga) return null;

  // Procesar texto para párrafos y listas
  const processDescription = (text) => {
    // Dividir por párrafos (doble salto de línea)
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, index) => {
      // Detectar si es una lista (líneas que empiezan con -, *, •, o números)
      const lines = paragraph.split('\n');
      const isList = lines.some(line => 
        /^\s*[-*•]\s/.test(line) || /^\s*\d+\.\s/.test(line)
      );

      if (isList) {
        return (
          <Box key={index} component="ul" sx={{ 
            pl: 3, 
            mb: 3,
            '& li': {
              mb: 1,
              color: '#495057',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }
          }}>
            {lines.filter(line => line.trim()).map((line, lineIndex) => (
              <Typography 
                key={lineIndex} 
                component="li" 
                variant="body1"
              >
                {line.replace(/^\s*[-*•]\s*/, '').replace(/^\s*\d+\.\s*/, '')}
              </Typography>
            ))}
          </Box>
        );
      }

      // Párrafo normal
      return (
        <Typography 
          key={index}
          variant="body1" 
          paragraph
          sx={{ 
            lineHeight: 1.8,
            color: '#495057',
            fontSize: '1.1rem',
            mb: 3,
            textAlign: 'justify',
            '&:last-child': { mb: 0 }
          }}
        >
          {paragraph.trim()}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 4, md: 6 },
        position: 'relative'
      }}>
        {/* Icono decorativo */}
        <Box sx={{
          display: 'inline-flex',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 3,
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)'
        }}>
          <DescriptionOutlined sx={{ fontSize: 40 }} />
        </Box>
        
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 800,
            color: '#2c3e50',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Especificaciones Técnicas
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#6c757d',
            fontWeight: 400,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Información completa y detallada sobre este producto
        </Typography>

        {/* Línea decorativa */}
        <Box sx={{
          width: 100,
          height: 4,
          background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
          mx: 'auto',
          mt: 3,
          borderRadius: 2
        }} />
      </Box>

      {/* Contenido principal */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper 
          elevation={8}
          sx={{ 
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            background: 'white',
            border: '1px solid #e9ecef',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 1200,
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}
        >
          {/* Decoración de fondo */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,140,0,0.03), rgba(255,107,53,0.03))',
            pointerEvents: 'none'
          }} />
          
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,140,0,0.05), rgba(255,107,53,0.05))',
            pointerEvents: 'none'
          }} />

          {/* Contenido procesado */}
          <Box sx={{
            position: 'relative',
            zIndex: 1,
            '& p:first-of-type': {
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#2c3e50',
              background: 'linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,107,53,0.1))',
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(255,107,53,0.2)',
              mb: 4
            }
          }}>
            {processDescription(descripcionLarga)}
          </Box>

          {/* Badge informativo */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: 4,
            pt: 3,
            borderTop: '2px solid #f8f9fa'
          }}>
            <InfoOutlined sx={{ color: '#FF6B35', fontSize: 20 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6c757d',
                fontStyle: 'italic'
              }}
            >
              Información proporcionada por el fabricante
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductDescription;