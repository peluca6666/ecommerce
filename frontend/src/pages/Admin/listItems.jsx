import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

// ítems del menú lateral para el panel de admin
export const mainListItems = (
  <React.Fragment>
    {/* Dashboard Principal */}
    <ListItemButton component={RouterLink} to="/admin">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>

    {/* Gestión de Usuarios */}
    <ListItemButton component={RouterLink} to="/admin/usuarios">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Usuarios" />
    </ListItemButton>

    {/* Gestión de Productos */}
    <ListItemButton component={RouterLink} to="/admin/productos">
      <ListItemIcon>
        <InventoryIcon />
      </ListItemIcon>
      <ListItemText primary="Productos" />
    </ListItemButton>

    {/* Gestión de Categorías */}
    <ListItemButton component={RouterLink} to="/admin/categorias">
      <ListItemIcon>
        <CategoryIcon />
      </ListItemIcon>
      <ListItemText primary="Categorías" />
    </ListItemButton>

    {/* Gestión de Banners */}
    <ListItemButton component={RouterLink} to="/admin/banners">
      <ListItemIcon>
        <ViewCarouselIcon />
      </ListItemIcon>
      <ListItemText primary="Banners" />
    </ListItemButton>

    {/* Gestión de Ventas */}
    <ListItemButton component={RouterLink} to="/admin/ventas">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Ventas" />
    </ListItemButton>
  </React.Fragment>
);