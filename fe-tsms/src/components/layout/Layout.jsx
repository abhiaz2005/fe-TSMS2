import { Box } from "@mui/material";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
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
      <div style={{ flex: 1 ,backgroundColor:'#2F313A'}}>{children}</div>

      <Footer />
    </Box>
  );
};

export default Layout;
