import { Box } from "@mui/material";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

     
      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          backgroundColor:'#2F313A'
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
