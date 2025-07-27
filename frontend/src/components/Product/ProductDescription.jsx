import { Paper, Typography, Box } from '@mui/material';

const ProductDescription = ({ descripcionLarga }) => {
  // Si no hay descripción larga, no renderizar nada
  if (!descripcionLarga) return null;

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
              >
                {line.replace(/^\s*[-*•]\s*/, '').replace(/^\s*\d+\.\s*/, '')}
              </Typography>
            ))}
          </Box>
        );
      }

      return (
        <Typography 
          key={index}
          variant="body1" 
          paragraph
          sx={{ 
            lineHeight: 1.7,
            color: '#495057',
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
      elevation={1}
      sx={{ 
        p: 4,
        borderRadius: 3,
        background: 'white',
        border: '1px solid #e9ecef',
        height: 'fit-content'
      }}
    >
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          fontWeight: 600,
          color: '#2c3e50',
          mb: 3,
          borderBottom: '2px solid #e9ecef',
          pb: 2
        }}
      >
        Descripción del Producto
      </Typography>
      
      <Box>
        {processDescription(descripcionLarga)}
      </Box>
    </Paper>
  );
};

export default ProductDescription;