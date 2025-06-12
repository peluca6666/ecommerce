import { Paper, Container, Grid, Typography, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

const Footer = () => (
  <Paper component="footer" elevation={3} sx={{ py: 4 }}>
    <Container maxWidth="lg">
      <TextField
        fullWidth
        placeholder="Buscar en el sitio..."
        InputProps={{ startAdornment: <Search /> }}
        sx={{ mb: 3 }}
      />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Sobre Nosotros</Typography>
          <Typography variant="body2" color="text.secondary">
            Tu tienda online confiable desde 2023.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Contacto</Typography>
          <Typography variant="body2" color="text.secondary">
            Email: contacto@solomarket.com<br />
            Teléfono: +54 123 456 789
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Paper>
);
export default Footer;