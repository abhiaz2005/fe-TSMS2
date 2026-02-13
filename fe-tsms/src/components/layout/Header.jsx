import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Drawer,
  Avatar,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authcontext/AuthContext";
import { menuConfig } from "../../config/menuConfig";
import { toast } from "react-toastify";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const userId = user?.id;


  const menuItems =
    typeof menuConfig?.[role] === "function"
      ? menuConfig[role](userId)
      : menuConfig?.[role] || [];

  const closeAll = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
    navigate("/");
    setLogoutOpen(false) ;
    toast.success("Logged out successfully ");
  };

  const handleLogin = () => {
    closeAll();
    navigate("/login");
  };

  /* ================= MOBILE DRAWER ================= */
  const mobileDrawer = () => (
    <Box sx={{ bgcolor: "#33353d", height: "100%", color: "white", p: 2 }}>
      {/* LOGO */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ mr: 1 }}>
          <MenuBookOutlinedIcon sx={{ color: "black" }} />
        </Avatar>
        <Typography fontWeight="bold">Genius Guidelines</Typography>
      </Box>

      <Divider sx={{ bgcolor: "#555", mb: 1 }} />

      <List>
        {menuItems.map((item, index) => {
          if (!item.children) {
            return (
              <ListItemButton
                key={index}
                component={NavLink}
                to={item.path}
                onClick={closeAll}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          }

          return (
            <Box key={index}>
              <ListItemButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                <ListItemText primary={item.label} />
                {dropdownOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={dropdownOpen}>
                <List disablePadding>
                  {item.children.map((child, i) => (
                    <ListItemButton
                      key={i}
                      sx={{ pl: 4 }}
                      component={NavLink}
                      to={child.path}
                      onClick={closeAll}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          );
        })}

        {/* LOGIN / LOGOUT */}
        <Divider sx={{ bgcolor: "#555", my: 1 }} />

        {user ? (
          <ListItemButton onClick={()=>setLogoutOpen(true)}>
            <LogoutIcon sx={{ mr: 1 }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : (
          <ListItemButton onClick={handleLogin}>
            <LoginIcon sx={{ mr: 1 }} />
            <ListItemText primary="Login" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  /* ================= HEADER ================= */
  return (
    <>
      <AppBar sx={{ bgcolor: "#33353d" }}>
        <Toolbar>
          {/* MOBILE MENU */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { md: "none" }, mr: 1 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* LOGO */}
          <Avatar>
            <MenuBookOutlinedIcon sx={{ color: "black" }} />
          </Avatar>

          <Typography
            sx={{
              ml: 1,
              flexGrow: 1,
              fontFamily: "cursive",
              fontWeight: "bold",
            }}
          >
            Genius Guidelines
          </Typography>

          {/* DESKTOP MENU */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <List sx={{ display: "flex", alignItems: "center" }}>
              {menuItems.map((item, index) => {
                if (!item.children) {
                  return (
                    <ListItemButton
                      key={index}
                      component={NavLink}
                      to={item.path}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  );
                }

                return (
                  <Box key={index} sx={{ position: "relative" }}>
                    <ListItemButton
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <ListItemText primary={item.label} />
                      {dropdownOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse
                      in={dropdownOpen}
                      sx={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        bgcolor: "#343541",
                        zIndex: 10,
                        width: 200,
                      }}
                    >
                      <List disablePadding>
                        {item.children.map((child, i) => (
                          <ListItemButton
                            key={i}
                            component={NavLink}
                            to={child.path}
                            onClick={() => setDropdownOpen(false)}
                          >
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                );
              })}

              {/* LOGIN / LOGOUT */}
              {user ? (
                <ListItemButton onClick={()=>setLogoutOpen(true)}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              ) : (
                <ListItemButton onClick={handleLogin}>
                  <LoginIcon sx={{ mr: 1 }} />
                  <ListItemText primary="Login" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        open={mobileOpen}
        onClose={closeAll}
        sx={{ "& .MuiDrawer-paper": { width: 240 } }}
      >
        {mobileDrawer()}
      </Drawer>

      {/* Pop up For logout */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(!logoutOpen)}
        keepMounted
        disableRestoreFocus
      >
        <DialogTitle color="#85838f">Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography >
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button  onClick={()=>setLogoutOpen(!logoutOpen)}>
            Cancel
          </Button>
          <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
