import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/authcontext/AuthContext";
import { useNavigate } from "react-router-dom";
import { url } from "../config/apiConfig";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from '@mui/icons-material/Delete';




const Exams = () => {
  const token = localStorage.getItem("token");

  //useState
  const [open, setOpen] = useState(false);
  const [examList, setExamList] = useState([]);
  const [classList, setClassList] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    examName: "",
    studentClass: "",
    fullMark: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const handleClose = () => {
    setOpen(false);

    setEditMode(false);
    setEditingId(null);

    setForm({
      examName: "",
      studentClass: "",
      fullMark: ""
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchExams = async () => {
    try {
      const res = await api.get(
        url.getAllExam,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const exams = res.data.data.map((item) => ({
        id: item.id,
        name: item.examName,
        fullMark: item.fullMark,
        studentClass: item.studentClass
      }));

      setExamList(exams);

    } catch (err) {
      console.log(err.response);

      toast.error(err.response.data.message);
      if (err.response.status == 401) {
        localStorage.setItem("isLog", false);
        navigate("/");
      }
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get(url.getAllClass, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClassList(res.data.data || []);
    } catch (err) {
      console.log(err);
      if (err.response.status == 401) {
        localStorage.setItem("isLog", false);
        navigate("/");
      }
      toast.error("Failed to load classes");
    }
  };

  useEffect(() => {
    // fetchExams();
    const loadExams = async () => {
      await fetchExams();
      await fetchClasses();

    };

    loadExams();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        examName: form.examName,
        studentClass: form.studentClass || null,
        fullMark: Number(form.fullMark)
      };

      const res = await api.post(url.addExam, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      setForm({
        examName: "",
        studentClass: "",
        fullMark: ""
      });

      await fetchExams();

      handleClose();
      toast.success("Exam added successfully");

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      if (err.response.status == 401) {
        localStorage.setItem("isLog", false);
        navigate("/");
      }
    }
  };

  const handleEdit = (exam) => {
    setEditMode(true);
    setEditingId(exam.id);

    setForm({
      examName: exam.name || "",
      studentClass: exam.studentClass || "",
      fullMark: exam.fullMark || ""
    });

    handleOpen();
  };

  const handleUpdate = async () => {
    try {

      const payload = {
        id: editingId,
        examName: form.examName,
        studentClass: form.studentClass || null,
        fullMark: Number(form.fullMark)
      };

      await api.put(
        url.editExam,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchExams();

      toast.success("Exam updated successfully");

      setEditMode(false);
      setEditingId(null);

      setForm({
        examName: "",
        studentClass: "",
        fullMark: ""
      });

      handleClose();

    } catch (err) {
      if (err.response.status == 401) {
        localStorage.setItem("isLog", false);
        navigate("/");
      }
      toast.error(
        err.response?.data?.message || "Failed to update exam"
      );
    }
  };

  const handleDelete = async (exam) => {
    if (!selectedExam?.id) {
      toast.error("Invalid exam selected");
      return;
    }
    try {
      await api.delete(
        `${url.deleteExam}/${selectedExam.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchExams();
      setDeleteOpen(false);
      toast.success("Exam deleted successfully");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete exam"
      );
    }
  };

  const handleDeleteClick = (exam) => {
    setSelectedExam(exam);
    setDeleteOpen(true);
  };

  return (
    <Box sx={{ mt: 10, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mx: 4,
          mt: 2,
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
          Exams
        </Typography>

        <IconButton
          onClick={handleOpen}
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            boxShadow: 3,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{ px: 5 }}>
        <TableContainer
          component={Paper}
          sx={{ mt: 2, bgcolor: "#404147", borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#494e6b" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Exam Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Full Mark</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Class</TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold", pr: 5 }}
                >
                  Actions
                </TableCell>


              </TableRow>
            </TableHead>

            <TableBody>
              {examList.map((exam, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { bgcolor: "#4a4c54" },
                    borderBottom: "1px solid #555"
                  }}
                >
                  <TableCell sx={{ color: "white" }}>{exam.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>{exam.fullMark}</TableCell>
                  <TableCell sx={{ color: "white" }}>{exam.studentClass !== null ? exam.studentClass : "-"}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "gray", pr: 4 }}
                  >
                    <IconButton>
                      <CreateIcon
                        sx={{ color: "#989994" }}
                        onClick={() => handleEdit(exam)}
                      />
                    </IconButton>

                    <IconButton onClick={() => handleDeleteClick(exam)}>
                      <DeleteIcon sx={{ color: "#d32f2f" }} />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}

              {examList.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ color: "#a39d9d", textAlign: "center", py: 4 }}
                  >
                    No exams found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 🧾 Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {/* <DialogTitle>Add Exam</DialogTitle> */}
        <DialogTitle>
          {editMode ? "Edit Exam" : "Add Exam"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, pt: "20px !important" }}>
          <TextField
            label="Exam Name"
            name="examName"
            value={form.examName}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* <TextField
            label="Class (optional)"
            name="studentClass"
            value={form.studentClass}
            onChange={handleChange}
            fullWidth
          /> */}
          <TextField
            select
            label="Class"
            name="studentClass"
            value={form.studentClass}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {classList.map((cls) => (
              <MenuItem
                key={cls.id}
                value={cls.studentClass}
              >
                {cls.studentClass}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Full Mark"
            name="fullMark"
            type="number"
            value={form.fullMark}
            onChange={handleChange}
            fullWidth
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">Cancel</Button>
          {/* <Button onClick={handleSubmit} variant="contained">Add</Button> */}
          <Button
            onClick={editMode ? handleUpdate : handleSubmit}
            variant="contained"
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete confirm */}
      <Dialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedExam(null);
        }}
      >
        <DialogTitle>
          Delete Exam
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedExam?.name}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpen(false);
              setSelectedExam(null);
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Exams;