import React, { useEffect, useState } from "react";
import { studentFees } from "../data/student";
import "../styles/FeesStyles.css";
import { useParams } from 'react-router-dom'
import StudentFeeDetail from '../components/commons/StudentFeeDetail'

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
import { url } from "../config/apiConfig";
import { months } from "../data/month";
import { toast } from "react-toastify";
import { api } from "../api/axios";


const StudentFees = () => {
  const { id } = useParams();
  const studentIdNumber = Number(id);
  const studentData = id
    ? studentFees.find((s) => s.studentId === studentIdNumber)
    : null;

  const [students, setStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [expandOpen, setExpandOpen] = useState(null);

  // ✅ feeForm - single entry being filled right now
  const [feeForm, setFeeForm] = useState({
    studentId: "",
    month: "",
    year: 2026,
    amount: "",
    mode: "",
  });

  // ✅ stagedFees - locally stored entries before bulk submit
  const [stagedFees, setStagedFees] = useState([]);

  // ✅ paidMonths - months already paid by selected student
  const [paidMonths, setPaidMonths] = useState([]);

  const [feesData, setFeesData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // ─── Fetch all students ───────────────────────────────────────────────────
  const fetchStudents = async () => {
    try {
      const res = await api.get(url.getAllStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Fetch all fees ───────────────────────────────────────────────────────
  const fetchFees = async () => {
    try {
      const res = await api.get(url.getAllFees, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeesData(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load fees");
    }
  };

  // ─── When student changes in form → find their paid months ───────────────
  const handleStudentChange = (studentId) => {
    setFeeForm({ ...feeForm, studentId, month: "" });

    // Find already paid months for this student from feesData
    const studentFeeRecord = feesData.find((f) => f.user?.id === studentId);
    if (studentFeeRecord) {
      // Store as "month-year" strings for easy lookup
      const paid = studentFeeRecord.fees?.map(
        (f) => `${f.month}-${f.year}`
      ) || [];
      setPaidMonths(paid);
    } else {
      setPaidMonths([]);
    }
  };

  // ─── Also check staged fees for same student to disable those months too ─
  const isMonthDisabled = (monthValue) => {
    const year = feeForm.year;
    // Already paid in DB
    if (paidMonths.includes(`${monthValue}-${year}`)) return true;
    // Already staged locally
    if (
      stagedFees.some(
        (f) =>
          f.student.id === feeForm.studentId &&
          f.month === Number(monthValue) &&
          f.year === Number(year)
      )
    )
      return true;
    return false;
  };

  // ─── Add to local staged list (NO API call here) ─────────────────────────
  const handleAddToStaged = () => {
    if (!feeForm.studentId) { toast.error("Select Student"); return; }
    if (!feeForm.month)     { toast.error("Select Month");   return; }
    if (!feeForm.year)      { toast.error("Enter Year");     return; }
    if (!feeForm.amount)    { toast.error("Enter Amount");   return; }
    if (!feeForm.mode)      { toast.error("Select Payment Mode"); return; }

    const newEntry = {
      student: { id: feeForm.studentId },
      month: Number(feeForm.month),
      year: Number(feeForm.year),
      amount: Number(feeForm.amount),
      paymentDate: new Date().toISOString().split("T")[0],
      mode: feeForm.mode,
      // extra info just for display in staged list
      _studentName: students.find((s) => s.id === feeForm.studentId)?.name || "",
      _monthLabel: months.find((m) => m.value === feeForm.month)?.label || "",
    };

    setStagedFees((prev) => [...prev, newEntry]);

    toast.success("Entry staged! Add more or click Submit.");

    // Reset form but keep studentId so user can add another month easily
    setFeeForm((prev) => ({ ...prev, month: "", amount: "", mode: "" }));

    // Update paidMonths check immediately so just-staged month disables
    setPaidMonths((prev) => [
      ...prev,
      `${newEntry.month}-${newEntry.year}`,
    ]);
  };

  // ─── Remove a staged entry ────────────────────────────────────────────────
  const handleRemoveStaged = (index) => {
    const removed = stagedFees[index];
    setStagedFees((prev) => prev.filter((_, i) => i !== index));
    // Also un-disable that month
    setPaidMonths((prev) =>
      prev.filter((m) => m !== `${removed.month}-${removed.year}`)
    );
  };

  // ─── Submit all staged entries as bulk API call ───────────────────────────
  const handleBulkSubmit = async () => {
    if (stagedFees.length === 0) {
      toast.error("No fees staged. Add at least one entry first.");
      return;
    }

    // Strip display-only fields before sending
    const payload = stagedFees.map(({ _studentName, _monthLabel, ...rest }) => rest);

    setIsSubmitting(true);
    try {
      const res = await api.post(url.addFees, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data.message || "Fees added successfully!");
      await fetchFees();

      // Reset everything
      setStagedFees([]);
      setPaidMonths([]);
      setAddDialogOpen(false);
      setFeeForm({ studentId: "", month: "", year: 2026, amount: "", mode: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add fees");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Edit handler ─────────────────────────────────────────────────────────
  const handleEdit = (fee) => {
    setFeeForm({
      studentId: fee.studentId,
      month: fee.month,
      year: fee.year,
      amount: fee.amount,
      mode: fee.mode,
    });
    setDialogOpen(true);
  };

  // ─── On mount ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      await fetchFees();
      await fetchStudents();
    };
    loadData();
  }, []);


  return (
    <Box>
      {!id ? (
        <>
          <Box sx={{ my: 10, p: 2, color: "white" }}>
            {/* PAGE TITLE */}
            <div className="addButton">
              <Typography variant="h5" sx={{ mb: 2 }}>
                Add New Fee
              </Typography>
              <IconButton
                sx={{ color: "#67686e", ml: 1, mb: 2 }}
                onClick={() => {
                  setStagedFees([]);
                  setPaidMonths([]);
                  setFeeForm({ studentId: "", month: "", year: 2026, amount: "", mode: "" });
                  setAddDialogOpen(true);
                }}
              >
                <AddCircleIcon />
              </IconButton>
            </div>

            {/* Fees List */}
            {feesData.map((fees, index) => (
              <List key={index}>
                <ListItem
                  sx={{
                    color: "white",
                    mb: 0.5,
                    borderRadius: 2,
                    bgcolor: "#404147",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={fees.user?.image} alt={fees.user?.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "white", fontWeight: "bold" }}>
                        {fees.user?.name}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: "gray" }} variant="body2">
                        {fees.user?.email}
                      </Typography>
                    }
                  />
                  <IconButton
                    onClick={() =>
                      setExpandOpen(expandOpen === index ? null : index)
                    }
                  >
                    {expandOpen === index ? (
                      <ExpandLess sx={{ color: "white" }} />
                    ) : (
                      <ExpandMore sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </ListItem>

                <Collapse in={expandOpen === index} timeout={150} unmountOnExit>
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
                          sx={{ "& th": { fontWeight: 800, color: "white" } }}
                        >
                          <TableCell>Month</TableCell>
                          <TableCell align="right" sx={{ color: "white", pr: 4 }}>
                            Payment
                          </TableCell>
                          <TableCell align="right" sx={{ color: "white", pr: 4 }} />
                        </TableRow>
                      </TableHead>
                      {fees.fees?.map((fee, key) => (
                        <TableBody key={key}>
                          <TableRow>
                            <TableCell sx={{ color: "gray" }}>
                              {months.find((m) => m.value === fee.month)?.label} / {fee.year}
                            </TableCell>
                            <TableCell align="right" sx={{ color: "gray", pr: 5 }}>
                              ₹ {fee.amount}
                            </TableCell>
                            <TableCell align="right" sx={{ color: "gray", pr: 4 }}>
                              <IconButton>
                                <CreateIcon
                                  sx={{ color: "#989994" }}
                                  onClick={() =>
                                    handleEdit({
                                      id: fee.id,
                                      studentId: fees.user?.id,
                                      month: fee.month,
                                      year: fee.year,
                                      amount: fee.amount,
                                      mode: fee.mode,
                                    })
                                  }
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

          {/* ── Dialog: Add new Fee ───────────────────────────────────────── */}
          <Dialog open={addDialogOpen} fullWidth maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                pt: 2,
              }}
            >
              <DialogTitle>Add Fee</DialogTitle>
              <IconButton onClick={() => setAddDialogOpen(false)}>
                <CloseIcon sx={{ color: "#e11212" }} />
              </IconButton>
            </Box>

            <DialogContent>
              {/* Student */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Student</InputLabel>
                <Select
                  label="Student"
                  value={feeForm.studentId}
                  onChange={(e) => handleStudentChange(e.target.value)}
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Month — paid months disabled */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Month</InputLabel>
                <Select
                  label="Month"
                  value={feeForm.month}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, month: Number(e.target.value) })
                  }
                >
                  {months.map((m) => (
                    <MenuItem
                      key={m.value}
                      value={m.value}
                      disabled={isMonthDisabled(m.value)}
                    >
                      {m.label}
                      {isMonthDisabled(m.value) && (
                        <Chip
                          label="Paid"
                          size="small"
                          color="success"
                          sx={{ ml: 1, height: 18, fontSize: 10 }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Year */}
              <TextField
                label="Year"
                fullWidth
                margin="dense"
                value={feeForm.year}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, year: e.target.value })
                }
              />

              {/* Amount */}
              <TextField
                label="Amount"
                type="number"
                fullWidth
                margin="dense"
                value={feeForm.amount}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, amount: e.target.value })
                }
              />

              {/* Payment Mode */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  label="Payment Mode"
                  value={feeForm.mode}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, mode: e.target.value })
                  }
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CARD">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </Select>
              </FormControl>

              {/* ── Staged Entries Preview ─────────────────────────────── */}
              {stagedFees.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "gray" }}>
                    Staged Entries ({stagedFees.length})
                  </Typography>
                  {stagedFees.map((entry, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#2e2f34",
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {entry._studentName} — {entry._monthLabel} {entry.year} — ₹{entry.amount} ({entry.mode})
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveStaged(i)}
                      >
                        <DeleteIcon sx={{ color: "#e11212", fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>

              {/* ✅ Add Fee → only stages, no API call */}
              <Button variant="outlined" onClick={handleAddToStaged}>
                + Add Fee
              </Button>

              {/* ✅ Submit → bulk API call */}
              <Button
                variant="contained"
                onClick={handleBulkSubmit}
                disabled={stagedFees.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : `Submit (${stagedFees.length})`}
              </Button>
            </DialogActions>
          </Dialog>

          {/* ── Dialog: Edit Payment ──────────────────────────────────────── */}
          <Dialog open={dialogOpen} fullWidth maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                pt: 2,
              }}
            >
              <DialogTitle>Edit Payment</DialogTitle>
              <IconButton onClick={() => setDialogOpen(false)}>
                <CloseIcon sx={{ color: "#e11212" }} />
              </IconButton>
            </Box>
            <DialogContent>
              <TextField
                label="Month"
                fullWidth
                margin="dense"
                value={feeForm.month}
                disabled
              />
              <TextField
                label="Amount"
                type="number"
                fullWidth
                margin="dense"
                value={feeForm.amount}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, amount: e.target.value })
                }
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  label="Payment Mode"
                  value={feeForm.mode}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, mode: e.target.value })
                  }
                >
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
          {studentData ? (
            <StudentFeeDetail student={studentData} />
          ) : (
            <Typography sx={{ color: "white", p: 2 }}>
              Student not found 😕
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StudentFees;