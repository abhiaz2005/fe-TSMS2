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
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Logo from "../../images/logo.svg";
import { NavLink } from "react-router-dom";
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);

  const mobileDrawer = () => (
    <Box
      sx={{
        textAlign: "center",
        bgcolor: "#33353d",
        width: "100%",
        height: "100%",
        color: "white",
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mx:1
      }}>
        <Avatar sx={{ m: 3 }}>
          <MenuBookOutlinedIcon sx={{color:'black'}} />
        </Avatar>
        <Typography
          color="white"
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontFamily: "cursive",
            fontWeight: "bolder",
            ml: 1
          }}
        >
          Genius Guidelines
        </Typography>
      </Box>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          m: 2,
        }}
      >
        <ListItemButton component={NavLink} to="/">
          <ListItemText
            primary="Home"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: "bold",
              },
            }}
          />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/about">
          <ListItemText
            primary="About"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: "bold",
              },
            }}
          />
        </ListItemButton>
        
        <ListItemButton onClick={() => setStudentOpen(!studentOpen)}>
          <ListItemText
            primary="Student"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: "bold",
              },
            }}
          />
          {studentOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={studentOpen}>

          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/students">
              <ListItemText
                primary="Students"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/">
              <ListItemText
                primary="Reports"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/about">
              <ListItemText
                primary="Attendance"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/about">
              <ListItemText
                primary="Fees"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
  return (
    // Header continue
    <>
      <Box>
        <AppBar component={"nav"} sx={{ bgcolor: "#33353d" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Avatar  >
              <MenuBookOutlinedIcon sx={{color:'black'}}/>
            </Avatar>
            <Typography
              color="white"
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "cursive",
                letterSpacing: "1px",
                fontWeight: "bolder",
                ml: 1
              }}
            >
              Genius Guidelines
            </Typography>
            {/* Options */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ListItemButton component={NavLink} to="/">
                  <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton component={NavLink} to="/about">
                  <ListItemText primary="About" />
                </ListItemButton>
                
                <ListItemButton onClick={() => setStudentOpen(!studentOpen)}>
                  <ListItemText primary="Student" />
                  {studentOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={studentOpen}
                  sx={{
                    position: "absolute",
                    top: "75%",
                    right: 0,
                    bgcolor: "#343541",
                    color: "white",
                    width: "150px",
                    boxShadow: 8,
                    zIndex: 1300,
                  }}
                >
                  <List disablePadding>
                    <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/students">
                      <ListItemText primary="Students" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/">
                      <ListItemText primary="Reports" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      component={NavLink}
                      to="/about"
                    >
                      <ListItemText primary="Attendance" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      component={NavLink}
                      to="/about"
                    >
                      <ListItemText primary="fees" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component={"nav"}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(!mobileOpen)}
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "240px",
              },
            }}
          >
            {mobileDrawer()}
          </Drawer>
        </Box>
      </Box>
    </>
  );
};

export default Header;
