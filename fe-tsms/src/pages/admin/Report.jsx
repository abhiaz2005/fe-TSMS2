import React, { useEffect, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../../api/axios.js";
import { url } from "../../config/apiConfig.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authcontext/AuthContext.jsx";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Report = () => {
  const [open, setOpen] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ── Listing ─────────────────────────────────────────────────
  const [marksData, setMarksData] = useState([]);
  const [students, setStudents] = useState([]);
  const [examList, setExamList] = useState([]); // new structure: [{id, examName, className, classId, subjects:[{classSubjectId, subjectName, fullMark}]}]
  const [classList, setClassList] = useState([]);

  // ── Filters ──────────────────────────────────────────────────
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ── Add dialog ───────────────────────────────────────────────
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");       // exam.id
  const [selectedSubjectId, setSelectedSubjectId] = useState(""); // classSubjectId → examSubjectId in payload
  const [securedMark, setSecuredMark] = useState("");
  const [stagedEntries, setStagedEntries] = useState([]);

  // ── Edit dialog ──────────────────────────────────────────────
  const [editForm, setEditForm] = useState({ id: null, examName: "", fullMark: "", securedMark: "" });

  // ── Delete ───────────────────────────────────────────────────
  const [selectedMark, setSelectedMark] = useState(null);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "error" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ── Auth error ───────────────────────────────────────────────
  const handleErr = (err, fallback) => {
    if (err.response?.status === 401) {
      logout(); localStorage.setItem("isLog", false); navigate("/");
      toast.error(err.response?.data?.responseDescription || "Please login again");
    } else {
      toast.error(err.response?.data?.responseDescription || fallback);
    }
  };

  // ── Fetch ────────────────────────────────────────────────────
  const fetchMarks = async (year = selectedYear, className = selectedClass) => {
    try {
      let endpoint = `${url.getAllMarks}?year=${year}`;
      if (className) endpoint += `&className=${className}`;
      const res = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      setMarksData(res.data.data || []);
    } catch (err) { handleErr(err, "Failed to load marks"); }
  };
  const fetchStudents = async () => {
    try {
      const res = await api.get(url.getAllStudent, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data.data || []);
    } catch (err) { handleErr(err, "Failed to load students"); }
  };

  const fetchExams = async () => {
    try {
      const res = await api.get(url.getAllExam, { headers: { Authorization: `Bearer ${token}` } });
      setExamList(res.data.data || []);
    } catch (err) { handleErr(err, "Failed to load exams"); }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get(url.getAllClass, { headers: { Authorization: `Bearer ${token}` } });
      setClassList(res.data.data || []);
    } catch (err) { handleErr(err, "Failed to load classes"); }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMarks();
      await fetchStudents();
      await fetchExams();
      await fetchClasses();
    };
    load();
  }, []);

  // ── Derived: selected exam's subjects ───────────────────────
  const selectedExamObj = examList.find((e) => e.id === selectedExamId);
  const subjectList = selectedExamObj?.subjects || [];

  // ── Selected subject fullMark ────────────────────────────────
  const selectedSubjectObj = subjectList.find((s) => s.id === selectedSubjectId);

  // ── Filter ───────────────────────────────────────────────────
  const filteredData = marksData;

  // ── Already staged examSubjectIds for selected student ───────
  const stagedSubjectIds = stagedEntries
    .filter((e) => e.studentId === selectedStudentId)
    .map((e) => e.examSubjectId);

  // ── Add to staged ────────────────────────────────────────────
  const handleAddToStaged = () => {
    if (!selectedStudentId) { setSnack({ open: true, message: "Select student", severity: "warning" }); return; }
    if (!selectedExamId) { setSnack({ open: true, message: "Select exam", severity: "warning" }); return; }
    if (!selectedSubjectId) { setSnack({ open: true, message: "Select subject", severity: "warning" }); return; }
    if (!securedMark) { setSnack({ open: true, message: "Enter secured marks", severity: "warning" }); return; }

    if (Number(securedMark) > selectedSubjectObj?.fullMark) {
      setSnack({ open: true, message: `Secured marks cannot exceed full marks (${selectedSubjectObj.fullMark})`, severity: "error" });
      return;
    }

    const isDuplicate = stagedEntries.some(
      (e) => e.studentId === selectedStudentId && e.examSubjectId === selectedSubjectId
    );
    if (isDuplicate) { setSnack({ open: true, message: "Already added", severity: "error" }); return; }

    const student = students.find((s) => s.id === selectedStudentId);

    setStagedEntries((prev) => [...prev, {
      studentId: selectedStudentId,
      examSubjectId: selectedSubjectId,
      securedMark: Number(securedMark),
      // display only
      _studentName: student?.name || "",
      _examName: selectedExamObj?.examName || "",
      _subjectName: selectedSubjectObj?.subjectName || "",
      _fullMark: selectedSubjectObj?.fullMark || "",
    }]);

    setSelectedSubjectId("");
    setSecuredMark("");
  };

  const handleRemoveStaged = (index) => {
    setStagedEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkSubmit = async () => {
    if (stagedEntries.length === 0) { toast.error("No entries staged"); return; }
    try {
      const payload = stagedEntries.map(({ _studentName, _examName, _subjectName, _fullMark, ...rest }) => rest);

      const res = await api.post(url.addMarks, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      const data = res.data.data;
      const saved = data?.saved ?? 0;
      const skipped = data?.skipped ?? 0;
      const failed = data?.failed ?? 0;

      // ── Sirf EK summary toast ────────────────────────────────
      if (saved > 0 && failed === 0 && skipped === 0) {
        toast.success(`${saved} marks saved successfully!`);
      } else if (saved > 0) {
        toast.success(`${saved} saved, ${skipped} skipped, ${failed} failed`);
      } else {
        toast.error(`0 saved — ${skipped} skipped, ${failed} failed`);
      }

      // ── Error details ────────────────────────────────────────
      data?.errorDetails?.forEach((msg) => toast.error(msg, { autoClose: 6000 }));

      // ── Skipped details ──────────────────────────────────────
      data?.skippedDetails?.forEach((msg) => toast.warning(msg, { autoClose: 5000 }));

      await fetchMarks();
      closeAddDialog();

    } catch (err) { handleErr(err, "Failed to add marks"); }
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedStudentId("");
    setSelectedExamId("");
    setSelectedSubjectId("");
    setSecuredMark("");
    setStagedEntries([]);
  };

  // ── Edit ─────────────────────────────────────────────────────
  const handleEditOpen = (mark) => {
    setEditForm({
      id: mark.id,
      examName: mark.exam?.classSubject?.subject?.name || "",
      fullMark: mark.exam?.fullMark || "",
      securedMark: mark.securedMark,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(url.editMark, { id: editForm.id, securedMark: Number(editForm.securedMark) }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      toast.success("Mark updated!");
      await fetchMarks();
      setEditDialogOpen(false);
    } catch (err) { handleErr(err, "Failed to update mark"); }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDeleteSubmit = async () => {
    try {
      await api.delete(`${url.deleteMark}/${selectedMark.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mark deleted!");
      await fetchMarks();
      setDeleteDialogOpen(false);
      setSelectedMark(null);
    } catch (err) { handleErr(err, "Failed to delete mark"); }
  };

  // Student ka class nikalo
  const selectedStudentObj = students.find((s) => s.id === selectedStudentId);
  const studentClassName = selectedStudentObj?.section?.studentClass || null;

  // Sirf usi class ke exams
  const filteredExamList = studentClassName
    ? examList.filter((e) => e.className === studentClassName)
    : examList;

  const handleGenerateReport = async (studentId) => {
    try {
      const res = await api.get(`${url.generateReport}?studentId=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const base64 = res.data.data?.pdf;
      if (!base64) { toast.error("PDF not received"); return; }

      // base64 → blob → open in new tab
      const byteChars = atob(base64);
      const byteNumbers = Array.from(byteChars).map((c) => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

    } catch (err) { handleErr(err, "Failed to generate report"); }
  };

  return (
    <Box>
      <Box sx={{ my: 10, mx: { md: 2 }, textAlign: "center", p: 2, color: "white", "@media (max-width:600px)": { mt: 10 } }}>

        {/* Header + Filters */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h5">Reports</Typography>
            <IconButton sx={{ color: "#67686e" }} onClick={() => setAddDialogOpen(true)}>
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Class Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedClass}
                displayEmpty
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  fetchMarks(selectedYear, e.target.value);
                }}
                sx={{ color: "white", bgcolor: "#404147", borderRadius: 2, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "white" } }}
              >
                <MenuItem value="">All Classes</MenuItem>
                {classList.map((cls) => (
                  <MenuItem key={cls.id} value={cls.studentClass}>{cls.studentClass}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Year Filter */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                value={dayjs().year(selectedYear)}
                onChange={(val) => {
                  setSelectedYear(val.year());
                  fetchMarks(val.year(), selectedClass);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: 110,
                      bgcolor: "#404147",
                      borderRadius: 2,
                      "& .MuiInputBase-input": {
                        color: "#4fc3f7",      // ← year text light blue
                        fontWeight: 600,
                        fontSize: 14,
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "& .MuiSvgIcon-root": { color: "#888888" },  // ← icon grey
                    },
                  },
                  desktopPaper: {
                    sx: {
                      bgcolor: "#2e2f34",
                      border: "1px solid #555",
                      borderRadius: 2,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      "& .MuiPickersYear-yearButton": {
                        color: "#cccccc",
                        borderRadius: 1,
                        fontSize: 13,
                        fontWeight: 500,
                        "&:hover": { bgcolor: "#404147", color: "white" },
                      },
                      "& .MuiPickersYear-yearButton.Mui-selected": {
                        bgcolor: "#4fc3f7",
                        color: "#1a1a1a",
                        fontWeight: 700,
                        "&:hover": { bgcolor: "#29b6f6" },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Marks Listing */}
        {filteredData.length === 0 && (
          <Typography sx={{ color: "#a39d9d", mt: 4 }}>No marks found.</Typography>
        )}

        {filteredData.map((item, index) => (
          <List key={item.user?.id}>
            <Box>
              <ListItem sx={{ color: "white", mb: 0.5, borderRadius: 2, bgcolor: "#404147" }}>
                <ListItemAvatar>
                  <Avatar src={item.user?.image} alt={item.user?.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ color: "white", fontWeight: "bold" }}>{item.user?.name}</Typography>}
                  secondary={<Typography sx={{ color: "gray" }} variant="body2">{item.user?.section?.studentClass || "-"}</Typography>}
                />
                <IconButton onClick={() => handleGenerateReport(item.user?.id)}>
                  <PictureAsPdfIcon sx={{ color: "#ff5252" }} />
                </IconButton>
                <IconButton onClick={() => navigate(`/students/report/${item.user?.id}`)}>
                  <VisibilityIcon sx={{ color: "#4fc3f7" }} />
                </IconButton>
                <IconButton onClick={() => setOpen(open === index ? null : index)}>
                  {open === index ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
                </IconButton>
              </ListItem>

              <Collapse in={open === index} timeout={150} unmountOnExit>
                <Box sx={{ bgcolor: "#404147", ml: 0.5, mb: 2, borderRadius: 2 }}>
                  {(() => {
                    const termExams = {};
                    const subjectTests = {};

                    item.marks?.forEach((mark) => {
                      const examName = mark.exam?.examMasterDto?.examName;
                      const examType = mark.exam?.examMasterDto?.examType;
                      if (examType === "TERM_EXAM") {
                        if (!termExams[examName]) termExams[examName] = [];
                        termExams[examName].push(mark);
                      } else {
                        if (!subjectTests[examName]) subjectTests[examName] = [];
                        subjectTests[examName].push(mark);
                      }
                    });

                    return (
                      <>
                        {/* ── TERM EXAMs ── */}
                        {Object.keys(termExams).length > 0 && (
                          <Box sx={{ p: 1.5 }}>
                            <Typography sx={{
                              color: "#4fc3f7", fontSize: 11, fontWeight: 700,
                              letterSpacing: 1.5, textTransform: "uppercase", mb: 1,
                            }}>
                              Term Exams
                            </Typography>

                            {Object.entries(termExams).map(([examName, examMarks]) => {
                              const tFull = examMarks.reduce((s, m) => s + m.exam.fullMark, 0);
                              const tSecured = examMarks.reduce((s, m) => s + m.securedMark, 0);
                              const pct = tFull > 0 ? (tSecured / tFull) * 100 : 0;

                              return (
                                <Box key={examName} sx={{ mb: 2 }}>
                                  <Typography sx={{
                                    color: "white", fontWeight: 700,
                                    fontSize: 12, mb: 0.5, pl: 1,
                                    borderLeft: "3px solid #4fc3f7",
                                  }}>
                                    {examName}
                                  </Typography>

                                  <TableContainer>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow sx={{ "& th": { color: "gray", fontWeight: 700, fontSize: 11 } }}>
                                          <TableCell>Subject</TableCell>
                                          <TableCell align="center">Full</TableCell>
                                          <TableCell align="center">Obtained</TableCell>
                                          <TableCell align="center">%</TableCell>
                                          <TableCell align="center"></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {examMarks.map((mark) => {
                                          const full = mark.exam.fullMark;
                                          const secured = mark.securedMark;
                                          const p = full > 0 ? (secured / full) * 100 : 0;
                                          return (
                                            <TableRow key={mark.id}>
                                              <TableCell sx={{ color: "white" }}>
                                                {mark.exam?.classSubject?.subject?.name}
                                              </TableCell>
                                              <TableCell align="center" sx={{ color: "gray" }}>{full}</TableCell>
                                              <TableCell align="center" sx={{ color: "gray" }}>{secured}</TableCell>
                                              <TableCell align="center" sx={{ color: "gray" }}>{p.toFixed(1)}%</TableCell>
                                              <TableCell align="center">
                                                <IconButton size="small" onClick={() => handleEditOpen(mark)}>
                                                  <CreateIcon sx={{ color: "#989994", fontSize: 16 }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => { setSelectedMark(mark); setDeleteDialogOpen(true); }}>
                                                  <DeleteIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                                                </IconButton>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}

                                        {/* ── Total row ── */}
                                        <TableRow sx={{ borderTop: "1px solid #555" }}>
                                          <TableCell sx={{ color: "white", fontWeight: 700 }}>Total</TableCell>
                                          <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>{tFull}</TableCell>
                                          <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>{tSecured}</TableCell>
                                          <TableCell align="center" sx={{ color: "#4fc3f7", fontWeight: 700 }}>{pct.toFixed(1)}%</TableCell>
                                          <TableCell />
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Box>
                              );
                            })}
                          </Box>
                        )}

                        {/* ── SUBJECT TESTs ── */}
                        {Object.keys(subjectTests).length > 0 && (
                          <Box sx={{ p: 1.5, borderTop: "1px solid #555" }}>
                            <Typography sx={{
                              color: "#ffb74d", fontSize: 11, fontWeight: 700,
                              letterSpacing: 1.5, textTransform: "uppercase", mb: 1,
                            }}>
                              Subject Tests
                            </Typography>

                            {Object.entries(subjectTests).map(([examName, examMarks]) => (
                              <Box key={examName} sx={{ mb: 2 }}>
                                <Typography sx={{
                                  color: "white", fontWeight: 700,
                                  fontSize: 12, mb: 0.5, pl: 1,
                                  borderLeft: "3px solid #ffb74d",
                                }}>
                                  {examName}
                                </Typography>

                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow sx={{ "& th": { color: "gray", fontWeight: 700, fontSize: 11 } }}>
                                        <TableCell>Subject</TableCell>
                                        <TableCell align="center">Full</TableCell>
                                        <TableCell align="center">Obtained</TableCell>
                                        <TableCell align="center">%</TableCell>
                                        <TableCell align="center"></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {examMarks.map((mark) => {
                                        const full = mark.exam.fullMark;
                                        const secured = mark.securedMark;
                                        const p = full > 0 ? (secured / full) * 100 : 0;
                                        return (
                                          <TableRow key={mark.id}>
                                            <TableCell sx={{ color: "white" }}>
                                              {mark.exam?.classSubject?.subject?.name}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "gray" }}>{full}</TableCell>
                                            <TableCell align="center" sx={{ color: "gray" }}>{secured}</TableCell>
                                            <TableCell align="center" sx={{ color: "gray" }}>{p.toFixed(1)}%</TableCell>
                                            <TableCell align="center">
                                              <IconButton size="small" onClick={() => handleEditOpen(mark)}>
                                                <CreateIcon sx={{ color: "#989994", fontSize: 16 }} />
                                              </IconButton>
                                              <IconButton size="small" onClick={() => { setSelectedMark(mark); setDeleteDialogOpen(true); }}>
                                                <DeleteIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                                              </IconButton>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              </Collapse>
            </Box>
          </List>
        ))}
      </Box>

      {/* ── Add Marks Dialog ── */}
      <Dialog open={addDialogOpen} slots={{ transition: Transition }} fullWidth maxWidth="sm" keepMounted disableRestoreFocus>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 2 }}>
          <DialogTitle>Add Marks</DialogTitle>
          <IconButton onClick={closeAddDialog}><CloseIcon sx={{ color: "#e11212" }} /></IconButton>
        </Box>

        <DialogContent sx={{ mt: 1 }}>
          {/* Student */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Student</InputLabel>
            <Select
              value={selectedStudentId}
              label="Student"
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setSelectedExamId("");
                setSelectedSubjectId("");
                setSecuredMark("");
              }}
            >
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} ({s.section?.studentClass || "-"})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Exam */}
          {/* Exam */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Exam</InputLabel>
            <Select
              value={selectedExamId}
              label="Exam"
              onChange={(e) => {
                setSelectedExamId(e.target.value);
                setSelectedSubjectId("");
                setSecuredMark("");
              }}
              disabled={!selectedStudentId}  // ← student pehle select karo
            >
              {filteredExamList.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.examName} — {e.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subject — only show after exam selected */}
          {selectedExamId && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedSubjectId}
                label="Subject"
                onChange={(e) => {
                  console.log(e.target.value)
                  setSelectedSubjectId(e.target.value); setSecuredMark("");
                }}
              >
                {subjectList.map((s) => {
                  const disabled = stagedSubjectIds.includes(s.id);
                  return (
                    <MenuItem key={s.id} value={s.id} disabled={disabled}>
                      {s.subjectName} (Full: {s.fullMark})
                      {disabled && <Typography variant="caption" sx={{ ml: 1, color: "gray" }}>(added)</Typography>}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          {/* Secured Mark */}
          <TextField
            label="Secured Marks"
            type="number"
            fullWidth
            margin="dense"
            value={securedMark}
            onChange={(e) => setSecuredMark(e.target.value)}
            helperText={selectedSubjectObj ? `Full Mark: ${selectedSubjectObj.fullMark}` : ""}
            disabled={!selectedSubjectId}
          />

          {/* Add to staged button */}
          <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleAddToStaged}>
            + Add
          </Button>

          {/* Staged list */}
          {stagedEntries.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "gray" }}>
                Staged ({stagedEntries.length})
              </Typography>
              {stagedEntries.map((entry, i) => (
                <Box key={i} sx={{ bgcolor: "#2e2f34", p: 1, borderRadius: 1, mb: 0.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {entry._studentName} — {entry._examName} / {entry._subjectName} — {entry.securedMark}/{entry._fullMark}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemoveStaged(i)}>
                    <DeleteIcon sx={{ color: "#e11212", fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={closeAddDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleBulkSubmit} disabled={stagedEntries.length === 0}>
            Submit All ({stagedEntries.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Mark Dialog ── */}
      <Dialog open={editDialogOpen} slots={{ transition: Transition }} keepMounted disableRestoreFocus>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 2 }}>
          <DialogTitle>Edit Mark</DialogTitle>
          <IconButton onClick={() => setEditDialogOpen(false)}><CloseIcon sx={{ color: "#e11212" }} /></IconButton>
        </Box>
        <DialogContent sx={{ mt: 1 }}>
          {/* {console.log(editForm)} */}
          <TextField label="Exam" fullWidth margin="dense" value={editForm.examName} disabled />
          <TextField
            label="Secured Marks" type="number" fullWidth margin="dense"
            value={editForm.securedMark}
            onChange={(e) => setEditForm({ ...editForm, securedMark: e.target.value })}
            helperText={`Full Mark: ${editForm.fullMark}`}
          />
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false); setSelectedMark(null); }}>
        <DialogTitle>Delete Mark</DialogTitle>
        <DialogContent>
          <Typography>Delete <strong>{selectedMark?.exam?.examName}</strong> mark?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDialogOpen(false); setSelectedMark(null); }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteSubmit}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Report;