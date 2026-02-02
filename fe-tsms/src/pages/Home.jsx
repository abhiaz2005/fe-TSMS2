import React from "react";
import Layout from "../components/layout/Layout";
import Banner from "../images/study.png";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${Banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mx: { xs: 2, md: 8 },
            bgcolor: "rgba(0,0,0,0.6)",
            p: 4,
            borderRadius: 2,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Genius Guidelines
          </Typography>

          <Typography variant="h6" sx={{ my: 2 }}>
            Newly explored coaching
          </Typography>

          <Button
            component={Link}
            to="/courses"
            variant="contained"
            color="warning"
            size="large"
          >
            Visit courses
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
