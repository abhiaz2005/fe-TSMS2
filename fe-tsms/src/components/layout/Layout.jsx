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

      {/* Page content */}
      <div style={{ flex: 1 ,backgroundColor:'#2F313A'}}>
        <Outlet />
      </div>

      <Footer />
    </Box>
  );
};

export default Layout;
