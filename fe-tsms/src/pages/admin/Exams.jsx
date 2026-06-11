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
import { api } from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authcontext/AuthContext";
import { useNavigate } from "react-router-dom";
import { url } from "../../config/apiConfig";

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

  const [classes, setClasses] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);

  const [form, setForm] = useState({
    examName: "",
    classId: "",
    examType: "TERM_EXAM",
    examSubjects: [],
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

      const res = await api.get(
        url.getAllExam,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setExamList(res.data.data || []);

    } catch (err) {
      handleErr(err, "Failed to load exams");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get(url.getAllClass, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClasses(res.data.data || []);
    } catch (err) {
      handleErr(err, "Failed to load classes");
    }
  };

  const fetchClassSubjects = async (classId) => {
    try {
      const res = await api.get(
        `/api/class-subject/by-class/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClassSubjects(res.data.data || []);
    } catch (err) {
      handleErr(err, "Failed to load subjects");
    }
  };




  useEffect(() => {
    const loadData = async () => {
      await fetchExams();
      await fetchClasses();
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

    setClassSubjects([]);

    setForm({
      examName: "",
      classId: "",
      examType: "TERM_EXAM",
      examSubjects: [],
    });
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {

    if (!form.examName) {
      toast.error("Enter exam name");
      return;
    }

    if (!form.classId) {
      toast.error("Select class");
      return;
    }

    if (!form.examSubjects.length) {
      toast.error("Add at least one subject");
      return;
    }

    try {

      await api.post(
        url.addExam,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Exam added successfully");

      await fetchExams();

      handleClose();

    } catch (err) {
      handleErr(err, "Failed to add exam");
    }
  };

  // ── Edit open ───────────────────────────────────────────────
  const handleEdit = async (exam) => {

    setEditMode(true);

    setEditingId(exam.id);

    await fetchClassSubjects(
      exam.classId
    );

    setForm({
      examName: exam.examName,
      classId: exam.classId,
      examType: exam.examType,
      examSubjects:
        exam.subjects.map(
          s => ({
            classSubjectId:
              s.classSubjectId,
            fullMark:
              s.fullMark
          })
        )
    });

    setOpen(true);
  };





  // ── Update ──────────────────────────────────────────────────
  const handleUpdate = async () => {

    try {

      await api.put(
        url.editExam,
        {
          id: editingId,
          ...form
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Exam updated successfully");

      await fetchExams();

      handleClose();

    } catch (err) {
      handleErr(err, "Failed to update exam");
    }
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
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Exam Name
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Class
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Exam Type
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Subjects
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examList.map((exam) => (
                <TableRow
                  key={exam.id}
                  sx={{
                    "&:hover": { bgcolor: "#4a4c54" },
                    borderBottom: "1px solid #555",
                  }}
                >

                  {/* Exam Name */}
                  <TableCell sx={{ color: "white" }}>
                    {exam.examName}
                  </TableCell>

                  {/* Class */}
                  <TableCell sx={{ color: "white" }}>
                    {exam.className}
                  </TableCell>

                  {/* Exam Type */}
                  <TableCell sx={{ color: "white" }}>
                    {exam.examType}
                  </TableCell>

                  {/* Subjects */}
                  <TableCell sx={{ color: "white" }}>
                    {exam.subjects?.length ? (
                      exam.subjects.map((s) => (
                        <div key={s.classSubjectId}>
                          {s.subjectName} ({s.fullMark})
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* Actions */}
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
            onChange={(e) =>
              setForm({
                ...form,
                examName: e.target.value
              })
            }
          />

          <FormControl fullWidth>

            <InputLabel>Class</InputLabel>

            <Select
              value={form.classId}
              label="Class"
              onChange={(e) => {

                setForm({
                  ...form,
                  classId: e.target.value,
                  examSubjects: []
                });

                fetchClassSubjects(e.target.value);
              }}
            >

              {classes.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                >
                  {c.studentClass}
                </MenuItem>
              ))}

            </Select>

          </FormControl>

          <FormControl fullWidth>

            <InputLabel>Exam Type</InputLabel>

            <Select
              value={form.examType}
              label="Exam Type"
              onChange={(e) =>
                setForm({
                  ...form,
                  examType: e.target.value
                })
              }
            >
              <MenuItem value="TERM_EXAM">
                TERM_EXAM
              </MenuItem>

              <MenuItem value="SUBJECT_TEST">
                SUBJECT_TEST
              </MenuItem>
            </Select>

          </FormControl>
          <Typography variant="subtitle2">
            Subjects
          </Typography>
          {classSubjects.length === 0 && form.classId && (
            <Typography color="error">
              No subjects mapped with this class
            </Typography>
          )}
          {classSubjects.map((cs) => {

            const selected =
              form.examSubjects.find(
                s => s.classSubjectId === cs.id
              );

            return (
              <Box
                key={cs.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mb: 1
                }}
              >

                <Button
                  variant={
                    selected
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {

                    // SUBJECT TEST
                    if (
                      form.examType === "SUBJECT_TEST"
                    ) {

                      setForm({
                        ...form,
                        examSubjects: [
                          {
                            classSubjectId: cs.id,
                            fullMark:
                              selected?.fullMark || 100
                          }
                        ]
                      });

                      return;
                    }

                    // TERM EXAM
                    if (selected) {

                      setForm({
                        ...form,
                        examSubjects:
                          form.examSubjects.filter(
                            x =>
                              x.classSubjectId !== cs.id
                          )
                      });

                    } else {

                      setForm({
                        ...form,
                        examSubjects: [
                          ...form.examSubjects,
                          {
                            classSubjectId: cs.id,
                            fullMark: 100
                          }
                        ]
                      });

                    }

                  }}
                >
                  {cs.subject?.name}
                </Button>

                {selected && (
                  <TextField
                    label="Full Mark"
                    type="number"
                    size="small"
                    value={selected.fullMark}
                    onChange={(e) => {

                      const mark =
                        Number(e.target.value);

                      setForm({
                        ...form,
                        examSubjects:
                          form.examSubjects.map(
                            item =>
                              item.classSubjectId === cs.id
                                ? {
                                  ...item,
                                  fullMark: mark
                                }
                                : item
                          )
                      });

                    }}
                  />
                )}

              </Box>
            );
          })}
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