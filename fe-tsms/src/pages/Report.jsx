import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateIcon from "@mui/icons-material/Create";
import { studentMarks } from "../data/student.js";

const Report = () => {
  const [open, setOpen] = useState(null);

  return (
    <Layout>
      <Box
        sx={{
          my: 10,
          // mx: 5,
          textAlign: "center",
          p: 2,
          color: "white",
          "@media (max-width:600px)": {
            mt: 10,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <Typography variant="h5">Upload New</Typography>
          <IconButton sx={{ color: "#67686e", ml: 1 }}>
            <AddCircleIcon />
          </IconButton>
        </Box>
        {studentMarks.map((mark, index) => (
          <List key={index}>
            <Box>
              <ListItem
                sx={{
                  color: "white",
                  mb: 0.5,
                  borderRadius: 2,
                  bgcolor: "#404147",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`${mark.image}?w=80&h=80&fit=crop`}
                    alt={mark.name}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography sx={{ color: "white", fontWeight: "bold" }}>
                      {mark.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: "gray" }} variant="body2">
                      {mark.class}
                    </Typography>
                  }
                />

                {/* PDF ICON */}
                <IconButton>
                  <PictureAsPdfIcon sx={{ color: "#ff5252" }} />
                </IconButton>

                {/* EXPAND ICON */}
                <IconButton onClick={() => setOpen(open===index?null:index)}>
                  {open === index ? (
                    <ExpandLess sx={{ color: "white" }} />
                  ) : (
                    <ExpandMore sx={{ color: "white" }} />
                  )}
                </IconButton>
              </ListItem>

              <Collapse in={open ===index} timeout={150} unmountOnExit>
                <TableContainer
                  sx={{
                    bgcolor: "#404147",
                    ml: 0.5,
                    mb: 2,
                    borderRadius: 2,
                    maxWidth: "95vw",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          "& th": {
                            fontWeight: 800,
                            color: "white",
                          },
                        }}
                      >
                        <TableCell>Exam</TableCell>
                        <TableCell align="right" sx={{ color: "white", pr: 4 }}>
                          Marks
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "white", pr: 4 }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {mark.exams.map((e, i) => (
                        <TableRow>
                          <TableCell sx={{ color: "gray" }}>{e.examName}</TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: "gray", pr: 4 }}
                          >
                            {`${e.securedMark}/${e.fullMark}`}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: "gray", pr: 4 }}
                          >
                            <IconButton>
                              <CreateIcon sx={{ color: "#989994" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </Box>
          </List>
        ))}
      </Box>
    </Layout>
  );
};

export default Report;
