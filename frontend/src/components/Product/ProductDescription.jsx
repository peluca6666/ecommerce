import { Paper, Typography, Box, Divider } from '@mui/material';
import { DescriptionOutlined } from '@mui/icons-material';

const ProductDescription = ({ descripcion }) => {
  // Si no hay descripción, mostrar mensaje por defecto
  if (!descripcion || descripcion.trim() === '') {
    return (
      <Paper 
        elevation={2}
        sx={{ 
          p: 4,
          borderRadius: 3,
          background: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          height: 'fit-content',
          textAlign: 'center'
        }}
      >
        <Box sx={{ color: 'text.secondary' }}>
          <DescriptionOutlined sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">
            No hay descripción disponible para este producto
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Procesar texto para párrafos y listas
  const processDescription = (text) => {
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, index) => {
      const lines = paragraph.split('\n');
      const isList = lines.some(line => 
        /^\s*[-*•]\s/.test(line) || /^\s*\d+\.\s/.test(line)
      );

      if (isList) {
        return (
          <Box 
            key={index} 
            component="ul" 
            sx={{ 
              pl: 3, 
              mb: 3,
              listStyle: 'none',
              '& li': {
                mb: 1.5,
                color: 'text.primary',
                lineHeight: 1.7,
                fontSize: '1rem',
                position: 'relative',
                '&::before': {
                  content: '"•"',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  position: 'absolute',
                  left: '-1.2em',
                  fontSize: '1.2em'
                }
              }
            }}
          >
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
            color: 'text.primary',
            fontSize: '1rem',
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
    <Paper 
      elevation={2}
      sx={{ 
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        height: 'fit-content',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4]
        }
      }}
    >
      {/* Header con icono y título */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '2px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mr: 2,
          boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}25`
        }}>
          <DescriptionOutlined sx={{ fontSize: 20 }} />
        </Box>
        
        <Box>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              lineHeight: 1.2
            }}
          >
            Descripción del Producto
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mt: 0.5
            }}
          >
            Información detallada y características
          </Typography>
        </Box>
      </Box>
      
      {/* Contenido de la descripción */}
      <Box sx={{
        '& p:first-of-type': {
          fontSize: '1.1rem',
          fontWeight: 500,
          color: 'text.primary',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.main}15)`,
          p: 2.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: (theme) => `${theme.palette.primary.main}25`,
          mb: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: 'primary.main',
            borderRadius: '0 2px 2px 0'
          }
        }
      }}>
        {processDescription(descripcion)}
      </Box>

      {/* Footer informativo */}
      <Divider sx={{ my: 3 }} />
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontStyle: 'italic',
            textAlign: 'center'
          }}
        >
          Información proporcionada por el fabricante
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProductDescription;