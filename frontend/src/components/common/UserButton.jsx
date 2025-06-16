import { IconButton, Menu, MenuItem } from "@mui/material";
import { Person } from "@mui/icons-material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserButton = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogin = () => {
    handleClose();
    navigate("/login");
  };

  const handleRegister = () => {
    handleClose();
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/"); 
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile"); 
  };

  return (
    <>
      <IconButton color="inherit" aria-label="Mi cuenta" onClick={handleOpen}>
        <Person />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {!isAuthenticated ? [
          <MenuItem key="login" onClick={handleLogin}>Iniciar Sesión</MenuItem>,
          <MenuItem key="register" onClick={handleRegister}>Registrarse</MenuItem>
        ] : [
          <MenuItem key="profile" onClick={handleProfile}>Mi Perfil</MenuItem>,
          <MenuItem key="logout" onClick={handleLogout}>Cerrar Sesión</MenuItem>
        ]}
      </Menu>
    </>
  );
};

export default UserButton;