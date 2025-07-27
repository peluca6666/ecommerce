import { Typography, Box } from '@mui/material';

const ProductDescription = ({ descripcion }) => {
  // Si no hay descripción, no renderizar nada
  if (!descripcion) return null;

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
              lineHeight: 1.6,
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }
          }}>
            {lines.filter(line => line.trim()).map((line, lineIndex) => (
              <Typography 
                key={lineIndex} 
                component="li" 
                variant="body1"
                sx={{ 
                  fontSize: '1.05rem',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
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
            fontSize: '1.05rem',
            mb: 2,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            '&:last-child': { mb: 0 }
          }}
        >
          {paragraph.trim()}
        </Typography>
      );
    });
  };

  return (
    <Box>
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
        {processDescription(descripcion)}
      </Box>
    </Box>
  );
};

export default ProductDescription;