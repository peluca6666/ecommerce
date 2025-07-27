import { Paper, Typography, Box, Divider } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

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
            pl: 2, 
            mb: 2,
            '& li': {
              mb: 0.5,
              color: '#495057',
              lineHeight: 1.6
            }
          }}>
            {lines.filter(line => line.trim()).map((line, lineIndex) => (
              <Typography 
                key={lineIndex} 
                component="li" 
                variant="body1"
                sx={{ fontSize: '1.05rem' }}
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
            lineHeight: 1.7,
            color: '#495057',
            fontSize: '1.05rem',
            mb: 2,
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
      elevation={0}
      sx={{ 
        p: { xs: 4, md: 5 },
        borderRadius: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        border: '1px solid #e9ecef',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header con icono */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 4 
      }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <InfoOutlined />
        </Box>
        
        <Box>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              mb: 0.5
            }}
          >
            Descripción Detallada
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            Información completa sobre este producto
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ 
        mb: 4, 
        background: 'linear-gradient(90deg, #FF8C00, #FF6B35)',
        height: 2,
        border: 'none'
      }} />
      
      {/* Contenido procesado */}
      <Box sx={{
        '& p:first-of-type': {
          fontSize: '1.15rem',
          fontWeight: 500,
          color: '#2c3e50'
        }
      }}>
        {processDescription(descripcionLarga)}
      </Box>

      {/* Decoración sutil */}
      <Box sx={{
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255,140,0,0.05), rgba(255,107,53,0.05))',
        pointerEvents: 'none'
      }} />
    </Paper>
  );
};

export default ProductDescription;