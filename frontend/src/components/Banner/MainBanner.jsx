import { Paper, Typography } from "@mui/material";

const MainBanner = () => (
  <Paper elevation={2} sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
    <Typography variant="h4" color="text.secondary">
      Banner Promocional
    </Typography>
  </Paper>
);
export default MainBanner;