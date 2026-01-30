import React from "react";
import Layout from "../components/layout/Layout";
import { Box, Typography } from "@mui/material";

const About = () => {
  return (
    <>
      <Layout>
        <Box
          sx={{
            my: 15,
            mx: 10,
            textAlign: "center",
            p: 2,
            "& h4": {
              fontWeight: "bold",
              my: 2,
              fontSize: "2rem",
              color: "#E5E7EB",

            },
            "& p": {
              textAlign: "justify",
              color: "#E5E7EB",

            },
            "@media (max-width:600px)": {
              mt: 10,
              "& h4": {
                fontSize: "1.5rem",
              },
            },
            
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Genius Guidelines
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "justify" }} gutterBottom>
            Genius Guidelines is a growing and trusted coaching institute
            located at
            <strong> 42 Mouza, Near Yasoda Garden</strong>. The institute is
            fully focused on providing quality education with a disciplined and
            student-friendly environment. Here, we offer specialized coaching
            exclusively for the
            <strong> CBSE curriculum</strong>, ensuring that students receive
            focused and structured academic guidance.
          </Typography>

          <br />

          <Typography variant="body1" sx={{ textAlign: "justify" }} gutterBottom>
            With experienced faculty members and the best learning facilities,
            Genius Guidelines helps students build strong conceptual clarity and
            confidence. Our students have consistently shown better academic
            results through regular assessments, doubt-clearing sessions, and
            personalized attention. As a continuously growing institute, we are
            committed to nurturing young minds and supporting students in
            achieving their academic goals.
          </Typography>
        </Box>
      </Layout>
    </>
  );
};

export default About;
