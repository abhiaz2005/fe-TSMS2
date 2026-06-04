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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/authcontext/AuthContext";
import { useNavigate } from "react-router-dom";
import { url } from "../config/apiConfig";

const Exams = () => {
  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [examList, setExamList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // ── Subject → ClassSubject cascade ─────────────────────────
  const [groupedSubjects, setGroupedSubjects] = useState([]); // [{subject, classSubjects}]
  const [classSubjectsForSelected, setClassSubjectsForSelected] = useState([]);

  const [form, setForm] = useState({
    examName: "",
    subjectId: "",
    classSubjectId: "",
    fullMark: "",
  });

  // ── Auth error ──────────────────────────────────────────────
  const handleErr = (err, fallback) => {
    if (err.response?.status === 401) {
      logout();
      localStorage.setItem("isLog", false);
      navigate("/");
      toast.error(err.response?.data?.responseDescription || "Please login again");
    } else {
      toast.error(err.response?.data?.responseDescription || fallback);
    }
  };

  // ── Fetch ───────────────────────────────────────────────────
  const fetchExams = async () => {
    try {
      const res = await api.get(url.getAllExam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const exams = (res.data.data || []).map((item) => ({
        id: item.id,
        examName: item.examName,
        fullMark: item.fullMark,
        subjectName: item.classSubject?.subject?.name || "-",
        className: item.classSubject?.studentClass?.studentClass || "-",
        classSubjectId: item.classSubject?.id,
      }));
      setExamList(exams);
    } catch (err) { handleErr(err, "Failed to load exams"); }
  };



  const fetchGroupedSubjects = async () => {
    try {
      const res = await api.get(url.getAllSubject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupedSubjects(res.data.data || []);
    } catch (err) { handleErr(err, "Failed to load subjects"); }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchExams();
      await fetchGroupedSubjects();
    }
    loadData();
  }, []);

  // ── When subject changes → load its classSubjects ───────────
  const handleSubjectChange = async (subjectId) => {
    setForm((prev) => ({ ...prev, subjectId, classSubjectId: "" }));
    setClassSubjectsForSelected([]);
    try {
      const res = await api.get(`${url.getClassSubjectBySubject}/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassSubjectsForSelected(res.data.data || []);
    } catch (err) { handleErr(err, "Failed to load classes"); }
  };

  // ── Dialog open/close ───────────────────────────────────────
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditingId(null);
    setClassSubjectsForSelected([]);
    setForm({ examName: "", subjectId: "", classSubjectId: "", fullMark: "" });
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.examName) { toast.error("Enter exam name"); return; }
    if (!form.classSubjectId) { toast.error("Select subject & class"); return; }
    if (!form.fullMark) { toast.error("Enter full mark"); return; }
    try {
      const payload = {
        examName: form.examName,
        classSubjectId: form.classSubjectId,
        fullMark: Number(form.fullMark),
      };
      await api.post(url.addExam, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      toast.success("Exam added successfully!");
      await fetchExams();
      handleClose();
    } catch (err) { handleErr(err, "Failed to add exam"); }
  };

  // ── Edit open ───────────────────────────────────────────────
  const handleEdit = async (exam) => {
    setEditMode(true);
    setEditingId(exam.id);
    setForm({
      examName: exam.examName,
      subjectId: "",
      classSubjectId: exam.classSubjectId || "",
      fullMark: exam.fullMark,
    });

    // find subjectId from examList data
    const subjectId = groupedSubjects.find(
      (s) => s.name === exam.subjectName
    )?.id;

    if (subjectId) {
      await handleSubjectChange(subjectId);
      setForm((prev) => ({ ...prev, subjectId, classSubjectId: exam.classSubjectId }));
    }
    setOpen(true);
  };

  // ── Update ──────────────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      const payload = {
        id: editingId,
        examName: form.examName,
        classSubjectId: form.classSubjectId || null,
        fullMark: Number(form.fullMark),
      };
      await api.put(url.editExam, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      toast.success("Exam updated successfully!");
      await fetchExams();
      handleClose();
    } catch (err) { handleErr(err, "Failed to update exam"); }
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDeleteClick = (exam) => { setSelectedExam(exam); setDeleteOpen(true); };

  const handleDelete = async () => {
    try {
      await api.delete(`${url.deleteExam}/${selectedExam.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Exam deleted successfully!");
      await fetchExams();
      setDeleteOpen(false);
      setSelectedExam(null);
    } catch (err) { handleErr(err, "Failed to delete exam"); }
  };

  return (
    <Box sx={{ mt: 10, position: "relative" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mx: 4, mt: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>Exams</Typography>
        <IconButton onClick={handleOpen} sx={{ bgcolor: "#1976d2", color: "white", "&:hover": { bgcolor: "#1565c0" } }}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Table */}
      <Box sx={{ px: 5 }}>
        <TableContainer component={Paper} sx={{ mt: 2, bgcolor: "#404147", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#494e6b" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Exam Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subject</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Class</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Full Mark</TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold", pr: 5 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examList.map((exam) => (
                <TableRow key={exam.id} sx={{ "&:hover": { bgcolor: "#4a4c54" }, borderBottom: "1px solid #555" }}>
                  <TableCell sx={{ color: "white" }}>{exam.examName}</TableCell>
                  <TableCell sx={{ color: "white" }}>{exam.subjectName}</TableCell>
                  <TableCell sx={{ color: "white" }}>{exam.className}</TableCell>
                  <TableCell sx={{ color: "white" }}>{exam.fullMark}</TableCell>
                  <TableCell align="right" sx={{ pr: 4 }}>
                    <IconButton onClick={() => handleEdit(exam)}>
                      <CreateIcon sx={{ color: "#989994" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(exam)}>
                      <DeleteIcon sx={{ color: "#d32f2f" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {examList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: "#a39d9d", textAlign: "center", py: 4 }}>
                    No exams found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── Dialog: Add/Edit Exam ── */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Exam" : "Add Exam"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, pt: "20px !important" }}>

          <TextField
            label="Exam Name"
            value={form.examName}
            onChange={(e) => setForm({ ...form, examName: e.target.value })}
            fullWidth
          />

          {/* Subject Select */}
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              label="Subject"
              value={form.subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {groupedSubjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Class Select — depends on subject */}
          <FormControl fullWidth disabled={!form.subjectId}>
            <InputLabel>Class</InputLabel>
            <Select
              label="Class"
              value={form.classSubjectId}
              onChange={(e) => setForm({ ...form, classSubjectId: e.target.value })}
            >
              {classSubjectsForSelected.map((cs) => (
                <MenuItem key={cs.id} value={cs.id}>
                  {cs.studentClass?.studentClass}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Full Mark"
            type="number"
            value={form.fullMark}
            onChange={(e) => setForm({ ...form, fullMark: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Cancel</Button>
          <Button variant="contained" onClick={editMode ? handleUpdate : handleSubmit}>
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Delete Confirm ── */}
      <Dialog open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedExam(null); }}>
        <DialogTitle>Delete Exam</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedExam?.examName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteOpen(false); setSelectedExam(null); }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exams;