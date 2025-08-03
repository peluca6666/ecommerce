import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress size={60} />
  </Box>
);
export default LoadingSpinner;