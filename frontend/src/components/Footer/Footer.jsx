import { Paper, Container, Box, Typography, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

const Footer = () => (
  <Paper component="footer" elevation={3} sx={{ py: 4 }}>
    <Container maxWidth="lg">
      <TextField
        fullWidth
        placeholder="Buscar en el sitio..."
        slotProps={{ input: { startAdornment: <Search /> } }}
        sx={{ mb: 3 }}
      />
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 4 
      }}>
        <Box>
          <Typography variant="h6">Sobre Nosotros</Typography>
          <Typography variant="body2" color="text.secondary">
            Tu tienda online confiable desde 2025.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6">Contacto</Typography>
          <Typography variant="body2" color="text.secondary">
            Email: contacto@salomarket.com<br />
            Teléfono: +54 123 456 789
          </Typography>
        </Box>
      </Box>
    </Container>
  </Paper>
);

export default Footer;