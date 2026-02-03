import React from "react";
import Layout from "../components/layout/Layout";
import { TeacherList } from "../data/teacher.js";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";

const About = () => {
  return (
    <>
      <Box>
        <Box
          sx={{
            my: 10,
            mx: 5,
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
              color: "#9a9ea7",
            },
            "@media (max-width:600px)": {
              mt: 8,
              "& h4": {
                fontSize: "1.5rem",
              },
            },
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Genius Guidelines
          </Typography>

          <Typography
            variant="body1"
            sx={{ textAlign: "justify" }}
            gutterBottom
          >
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

          <Typography
            variant="body1"
            sx={{ textAlign: "justify" }}
            gutterBottom
          >
            With experienced faculty members and the best learning facilities,
            Genius Guidelines helps students build strong conceptual clarity and
            confidence. Our students have consistently shown better academic
            results through regular assessments, doubt-clearing sessions, and
            personalized attention. As a continuously growing institute, we are
            committed to nurturing young minds and supporting students in
            achieving their academic goals.
          </Typography>
          <Typography variant="h4" sx={{ mt: 3 }} gutterBottom>
            Teachers
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {TeacherList.map((teacher, index) => (
              <Card
                sx={{ minWidth: 300, maxWidth: 330, bgcolor: "#2F313A" }}
                key={index}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="240"
                    image={teacher.image}
                    alt="teacher1"
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="#bec1cb"
                    >
                      {teacher.name}
                    </Typography>
                    <Typography variant="body1">
                      <b>Education:</b> &nbsp; {teacher.education}
                    </Typography>
                    <Typography variant="body1">
                      <b>Experience:</b> &nbsp; {teacher.experience}
                    </Typography>
                    <Typography variant="body1">
                      <b>Position:</b> &nbsp; {teacher.position}
                    </Typography>
                    
                      <Typography variant="body1">
                        <b>Phone Number:</b> &nbsp; {teacher.phoneno?teacher.phoneno:"_"}
                      </Typography>
                    
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default About;
