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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import { studentMarks } from "../data/student.js";
import { examList } from "../data/exams.js";

// transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Report = () => {
  const [open, setOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [examEvent, setExamEvent] = useState({
    securedMark: Number(0),
    fullMark: Number(0),
    examName: "",
  });
  const [selectedStudentIndex, setSelectedStudentIndex] = useState("");
  const [selectExamName, setSelectExamName] = useState("");

  const [newExam, setNewExam] = useState({
    examName: "",
    securedMark: "",
    fullMark: "",
  });
  const [tempEntries, setTempEntries] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleButtonDuplicateCheck = () => {
    if (
      selectedStudentIndex === "" ||
      newExam.examName === "" ||
      newExam.securedMark === ""
    ) {
      setSnack({
        open: true,
        message: "Please fill all fields",
        severity: "warning",
      });
      return;
    }

    // 🔴 DUPLICATE CHECK
    const isDuplicate = tempEntries.some(
      (item) =>
        item.studentIndex === selectedStudentIndex &&
        item.examName === newExam.examName,
    );

    if (isDuplicate) {
      setSnack({
        open: true,
        message: "This exam is already added for this student",
        severity: "error",
      });

      return;
    }

    // ✅ ADD ENTRY
    setTempEntries([
      ...tempEntries,
      {
        studentIndex: selectedStudentIndex,
        studentName: studentMarks[selectedStudentIndex].name,
        examName: newExam.examName,
        securedMark: newExam.securedMark,
        fullMark: newExam.fullMark,
      },
    ]);

    // 🔄 RESET FORM
    setNewExam({
      examName: "",
      securedMark: "",
      fullMark: "",
    });
    setSelectExamName("");
  };

  const handleExamSelect = (e) => {
    const examIndex = e.target.value;
    const selectedExam = examList[examIndex];

    setSelectExamName(examIndex);

    setNewExam({
      ...newExam,
      examName: selectedExam.name,
      fullMark: selectedExam.fullMark,
    });
  };

  const handleEdit = (exam) => {
    setExamEvent({
      securedMark: exam.securedMark,
      fullMark: exam.fullMark,
      examName: exam.examName,
    });
    setDialogOpen(true);
  };

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
          <IconButton
            sx={{ color: "#67686e", ml: 1 }}
            onClick={() => setAddDialogOpen(!addDialogOpen)}
          >
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
                <IconButton
                  onClick={() => setOpen(open === index ? null : index)}
                >
                  {open === index ? (
                    <ExpandLess sx={{ color: "white" }} />
                  ) : (
                    <ExpandMore sx={{ color: "white" }} />
                  )}
                </IconButton>
              </ListItem>

              <Collapse in={open === index} timeout={150} unmountOnExit>
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
                        <TableRow key={i}>
                          <TableCell sx={{ color: "gray" }}>
                            {e.examName}
                          </TableCell>
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
                              <CreateIcon
                                sx={{ color: "#989994" }}
                                onClick={() => handleEdit(e)}
                              />
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

      {/* Edit the Student mark */}
      <Dialog
        open={dialogOpen}
        slots={{
          transition: Transition,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pt: 2,
          }}
        >
          <DialogTitle>Edit Marks</DialogTitle>
          <IconButton
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            <CloseIcon sx={{ color: "#e11212" }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Exam"
            fullWidth
            margin="dense"
            value={examEvent.examName}
            disabled
          />

          <TextField
            label="Secured Marks"
            type="number"
            fullWidth
            margin="dense"
            value={examEvent.securedMark}
            onChange={(e) =>
              setExamEvent({
                ...examEvent,
                securedMark: e.target.value,
              })
            }
          />

          <TextField
            label="Full Marks"
            type="number"
            fullWidth
            margin="dense"
            value={examEvent.fullMark}
            onChange={(e) =>
              setExamEvent({
                ...examEvent,
                fullMark: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* For Create New Entries */}
      {/* ADD MARKS DIALOG */}
      <Dialog
        open={addDialogOpen}
        slots={{ transition: Transition }}
        fullWidth
        maxWidth="sm"
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pt: 2,
          }}
        >
          <DialogTitle>Add Marks</DialogTitle>
          <IconButton
            onClick={() => {
              setAddDialogOpen(false);
              setTempEntries([]);
            }}
          >
            <CloseIcon sx={{ color: "#e11212" }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ mt: 1 }}>
          {/* STUDENT SELECT */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Student</InputLabel>
            <Select
              value={selectedStudentIndex}
              label="Student"
              onChange={(e) => setSelectedStudentIndex(e.target.value)}
            >
              {studentMarks.map((s, i) => (
                <MenuItem key={i} value={i}>
                  {s.name} ({s.class})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* EXAM SELECT */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Exam</InputLabel>
            <Select
              value={selectExamName}
              label="Exam"
              onChange={(e) => handleExamSelect(e)}
            >
              {examList.map((e, i) => (
                <MenuItem key={i} value={i}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* SECURED MARK */}
          <TextField
            label="Secured Marks"
            type="number"
            fullWidth
            margin="dense"
            value={newExam.securedMark}
            onChange={(e) =>
              setNewExam({ ...newExam, securedMark: e.target.value })
            }
          />

          {/* FULL MARK (AUTO) */}
          <TextField
            label="Full Marks"
            type="number"
            fullWidth
            margin="dense"
            value={newExam.fullMark}
            disabled
          />

          {/* ADD BUTTON */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleButtonDuplicateCheck}
          >
            Add
          </Button>

          {/* ADDED LIST */}
          {tempEntries.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Added Entries
              </Typography>

              {tempEntries.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    bgcolor: "#404147",
                    p: 1,
                    borderRadius: 1,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    color: "white",
                  }}
                >
                  <Typography variant="body2">{item.studentName}</Typography>
                  <Typography variant="body2">{item.examName}</Typography>
                  <Typography variant="body2">
                    {item.securedMark}/{item.fullMark}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        {/* FOOTER */}
        <DialogActions sx={{ mr: 2 }}>
          <Button
            onClick={() => {
              setAddDialogOpen(false);
              setTempEntries([]);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log("FINAL DATA", tempEntries);
              setTempEntries([]);
              setAddDialogOpen(false);
            }}
          >
            Submit All
          </Button>
        </DialogActions>
      </Dialog>
      {/* MUI SNACKBAR ALERT */}
      <Snackbar
        open={snack.open}
        autoHideDuration={1000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Report;
