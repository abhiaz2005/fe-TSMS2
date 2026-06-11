import React, { useEffect, useState } from "react";
import { studentFees } from "../../data/student";
import "../../styles/FeesStyles.css";
import { useNavigate, useParams } from 'react-router-dom'
import StudentFeeDetail from '../users/StudentFeeDetail'
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  Avatar,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { url } from "../../config/apiConfig";
import { months } from "../../data/month";
import { toast } from "react-toastify";
import { api } from "../../api/axios";
import { useAuth } from "../../contexts/authcontext/AuthContext";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i); // e.g. 2024–2028

const StudentFees = () => {
  const { id } = useParams();
  const studentIdNumber = Number(id);
  const studentData = id
    ? studentFees.find((s) => s.studentId === studentIdNumber)
    : null;

  const [students, setStudents] = useState([]);
  const [studentSpefic, setStudentSpecific] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [expandOpen, setExpandOpen] = useState(null);
  const { logout } = useAuth();

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR); // ✅ year filter

  const [feeForm, setFeeForm] = useState({
    studentId: "",
    month: "",
    year: CURRENT_YEAR,
    amount: "",
    mode: "",
  });

  const [stagedFees, setStagedFees] = useState([]);
  const [paidMonths, setPaidMonths] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await api.get(url.getAllStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        logout(); localStorage.setItem("isLog", false); navigate("/");
        toast.error(err.response?.data?.responseDescription || "Please login again");
      } else {
        toast.error(err.response?.data?.responseDescription || "Something went wrong");
      }
    }
  };

  const fetchStudentFeeById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`${url.getStudentFeeById}?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.responseCode === 200) {
        setStudentSpecific(res.data.data || []);  // ← array set karo
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout(); localStorage.setItem("isLog", false); navigate("/");
        toast.error(err.response?.data?.responseDescription || "Please login again");
      } else {
        toast.error(err.response?.data?.responseDescription || "Failed to load student");
      }
    }
  };

  // ✅ year param pass ho raha hai
  const fetchFees = async (year = selectedYear) => {
    try {
      const res = await api.get(`${url.getAllFees}?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeesData(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        logout(); localStorage.setItem("isLog", false); navigate("/");
        toast.error(err.response?.data?.responseDescription || "Please login again");
      } else {
        toast.error(err.response?.data?.responseDescription || "Failed to load fees");
      }
    }
  };

  // ✅ year change → refetch
  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchFees(year);
    setExpandOpen(null);
  };

  const handleStudentChange = (studentId) => {
    setFeeForm({ ...feeForm, studentId, month: "" });
    const studentFeeRecord = feesData.find((f) => f.user?.id === studentId);
    if (studentFeeRecord) {
      const paid = studentFeeRecord.fees?.map((f) => `${f.month}-${f.year}`) || [];
      setPaidMonths(paid);
    } else {
      setPaidMonths([]);
    }
  };

  const isMonthDisabled = (monthValue) => {
    const year = feeForm.year;
    if (paidMonths.includes(`${monthValue}-${year}`)) return true;
    if (stagedFees.some(
      (f) => f.student.id === feeForm.studentId && f.month === Number(monthValue) && f.year === Number(year)
    )) return true;
    return false;
  };

  const handleAddToStaged = () => {
    if (!feeForm.studentId) { toast.error("Select Student"); return; }
    if (!feeForm.month) { toast.error("Select Month"); return; }
    if (!feeForm.year) { toast.error("Enter Year"); return; }
    if (!feeForm.amount) { toast.error("Enter Amount"); return; }
    if (!feeForm.mode) { toast.error("Select Payment Mode"); return; }

    const newEntry = {
      student: { id: feeForm.studentId },
      month: Number(feeForm.month),
      year: Number(feeForm.year),
      amount: Number(feeForm.amount),
      paymentDate: new Date().toISOString().split("T")[0],
      mode: feeForm.mode,
      _studentName: students.find((s) => s.id === feeForm.studentId)?.name || "",
      _monthLabel: months.find((m) => m.value === feeForm.month)?.label || "",
    };

    setStagedFees((prev) => [...prev, newEntry]);
    toast.success("Entry staged! Add more or click Submit.");
    setFeeForm((prev) => ({ ...prev, month: "", amount: "", mode: "" }));
    setPaidMonths((prev) => [...prev, `${newEntry.month}-${newEntry.year}`]);
  };

  const handleRemoveStaged = (index) => {
    const removed = stagedFees[index];
    setStagedFees((prev) => prev.filter((_, i) => i !== index));
    setPaidMonths((prev) => prev.filter((m) => m !== `${removed.month}-${removed.year}`));
  };

  const handleBulkSubmit = async () => {
    if (stagedFees.length === 0) { toast.error("No fees staged. Add at least one entry first."); return; }

    const payload = stagedFees.map(({ _studentName, _monthLabel, ...rest }) => rest);
    setIsSubmitting(true);
    try {
      const res = await api.post(url.addFees, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      toast.success(res.data.responseDescription || "Fees added successfully!");
      await fetchFees();
      setStagedFees([]); setPaidMonths([]); setAddDialogOpen(false);
      setFeeForm({ studentId: "", month: "", year: CURRENT_YEAR, amount: "", mode: "" });
    } catch (err) {
      if (err.response?.status === 401) {
        logout(); localStorage.setItem("isLog", false); navigate("/");
        toast.error(err.response?.data?.responseDescription || "Please login again");
      } else {
        toast.error(err.response?.data?.responseDescription || "Failed to add fees");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (fee) => {
    setFeeForm({ studentId: fee.studentId, month: fee.month, year: fee.year, amount: fee.amount, mode: fee.mode });
    setDialogOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await fetchStudentFeeById(id);
      } else {
        await fetchFees(CURRENT_YEAR);
        await fetchStudents();
      }
    };
    loadData();
  }, [id]);


  return (
    <Box>
      {!id ? (
        <>
          <Box sx={{ my: 10, p: 2, color: "white" }}>

            {/* ── Header ── */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5">Fees</Typography>
                <IconButton
                  sx={{ color: "#67686e" }}
                  onClick={() => {
                    setStagedFees([]); setPaidMonths([]);
                    setFeeForm({ studentId: "", month: "", year: CURRENT_YEAR, amount: "", mode: "" });
                    setAddDialogOpen(true);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>

              {/* ✅ Year Filter Dropdown */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year"]}
                  value={dayjs().year(selectedYear)}
                  minDate={dayjs("2004")}
                  // maxDate={dayjs("2028")}
                  onChange={(val) => handleYearChange(val.year())}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: 110,
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "& .MuiSvgIcon-root": { color: "green" },
                        bgcolor: "#8d8e94",
                        borderRadius: 2,
                      },
                    },
                    // ✅ Popup calendar styling
                    desktopPaper: {
                      sx: {
                        bgcolor: "#959597",
                        "& .MuiPickersYear-yearButton": { color: "white" },
                        "& .MuiPickersYear-yearButton.Mui-selected": {
                          bgcolor: "#6a747e",
                          color: "white",
                        },
                        "& .MuiPickersYear-yearButton:hover": {
                          bgcolor: "#978383",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* Fees List */}
            {feesData.map((fees, index) => (
              <List key={index}>
                <ListItem sx={{ color: "white", mb: 0.5, borderRadius: 2, bgcolor: "#404147" }}>
                  <ListItemAvatar>
                    <Avatar src={fees.user?.image} alt={fees.user?.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ color: "white", fontWeight: "bold" }}>{fees.user?.name}</Typography>}
                    secondary={<Typography sx={{ color: "gray" }} variant="body2">{fees.user?.email}</Typography>}
                  />
                  <IconButton onClick={() => setExpandOpen(expandOpen === index ? null : index)}>
                    {expandOpen === index ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
                  </IconButton>
                </ListItem>

                <Collapse in={expandOpen === index} timeout={150} unmountOnExit>
                  <TableContainer sx={{ bgcolor: "#404147", ml: 0.5, mb: 2, borderRadius: 2, maxWidth: "95vw" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: 800, color: "white" } }}>
                          <TableCell>Month</TableCell>
                          <TableCell align="right" sx={{ color: "white", pr: 4 }}>Payment</TableCell>
                          <TableCell align="right" sx={{ color: "white", pr: 4 }} />
                        </TableRow>
                      </TableHead>
                      {fees.fees?.map((fee, key) => (
                        <TableBody key={key}>
                          <TableRow>
                            <TableCell sx={{ color: "gray" }}>
                              {months.find((m) => m.value === fee.month)?.label} / {fee.year}
                            </TableCell>
                            <TableCell align="right" sx={{ color: "gray", pr: 5 }}>₹ {fee.amount}</TableCell>
                            <TableCell align="right" sx={{ color: "gray", pr: 4 }}>
                              <IconButton>
                                <CreateIcon
                                  sx={{ color: "#989994" }}
                                  onClick={() => handleEdit({ id: fee.id, studentId: fees.user?.id, month: fee.month, year: fee.year, amount: fee.amount, mode: fee.mode })}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      ))}
                    </Table>
                  </TableContainer>
                </Collapse>
              </List>
            ))}
          </Box>

          {/* ── Dialog: Add new Fee ── */}
          <Dialog open={addDialogOpen} fullWidth maxWidth="sm">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 2 }}>
              <DialogTitle>Add Fee</DialogTitle>
              <IconButton onClick={() => setAddDialogOpen(false)}>
                <CloseIcon sx={{ color: "#e11212" }} />
              </IconButton>
            </Box>
            <DialogContent>
              <FormControl fullWidth margin="dense">
                <InputLabel>Student</InputLabel>
                <Select label="Student" value={feeForm.studentId} onChange={(e) => handleStudentChange(e.target.value)}>
                  {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Month</InputLabel>
                <Select label="Month" value={feeForm.month} onChange={(e) => setFeeForm({ ...feeForm, month: Number(e.target.value) })}>
                  {months.map((m) => (
                    <MenuItem key={m.value} value={m.value} disabled={isMonthDisabled(m.value)}>
                      {m.label}
                      {isMonthDisabled(m.value) && (
                        <Chip label="Paid" size="small" color="success" sx={{ ml: 1, height: 18, fontSize: 10 }} />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Year" fullWidth margin="dense" value={feeForm.year}
                onChange={(e) => setFeeForm({ ...feeForm, year: e.target.value })} />

              <TextField label="Amount" type="number" fullWidth margin="dense" value={feeForm.amount}
                onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })} />

              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Mode</InputLabel>
                <Select label="Payment Mode" value={feeForm.mode} onChange={(e) => setFeeForm({ ...feeForm, mode: e.target.value })}>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CARD">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </Select>
              </FormControl>

              {stagedFees.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "gray" }}>
                    Staged Entries ({stagedFees.length})
                  </Typography>
                  {stagedFees.map((entry, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#2e2f34", borderRadius: 1, px: 1.5, py: 0.5, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {entry._studentName} — {entry._monthLabel} {entry.year} — ₹{entry.amount} ({entry.mode})
                      </Typography>
                      <IconButton size="small" onClick={() => handleRemoveStaged(i)}>
                        <DeleteIcon sx={{ color: "#e11212", fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button variant="outlined" onClick={handleAddToStaged}>+ Add Fee</Button>
              <Button variant="contained" onClick={handleBulkSubmit} disabled={stagedFees.length === 0 || isSubmitting}>
                {isSubmitting ? "Submitting..." : `Submit (${stagedFees.length})`}
              </Button>
            </DialogActions>
          </Dialog>

          {/* ── Dialog: Edit Payment ── */}
          <Dialog open={dialogOpen} fullWidth maxWidth="sm">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 2 }}>
              <DialogTitle>Edit Payment</DialogTitle>
              <IconButton onClick={() => setDialogOpen(false)}>
                <CloseIcon sx={{ color: "#e11212" }} />
              </IconButton>
            </Box>
            <DialogContent>
              <TextField label="Month" fullWidth margin="dense" value={feeForm.month} disabled />
              <TextField label="Amount" type="number" fullWidth margin="dense" value={feeForm.amount}
                onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })} />
              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Mode</InputLabel>
                <Select label="Payment Mode" value={feeForm.mode} onChange={(e) => setFeeForm({ ...feeForm, mode: e.target.value })}>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="BANK">Bank</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="contained">Save Changes</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Box sx={{ my: 10, p: 2, color: "white" }}>
          {studentSpefic.length > 0 ? (
            <StudentFeeDetail feesData={studentSpefic} />  
          ) : (
            <Typography sx={{ color: "white", p: 2 }}>No fee records found 😕</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StudentFees;