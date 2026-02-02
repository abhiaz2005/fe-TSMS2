import React, { useEffect, useState } from "react";
import { studentFees } from "../data/student";
import Layout from "../components/layout/Layout";
import "../styles/FeesStyles.css";

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
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";


const StudentFees = () => {
  const [openIndex, setOpenIndex] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [feeForm, setFeeForm] = useState({
    studentId: "",
    month: "",
    year: 2026,
    amount: "",
    mode: "",
  });

  const [feesData, setFeesData] = useState(studentFees);
  const [error, setError] = useState("");
  useEffect(() => {
    console.log("UPDATED FEES DATA", feesData);
  }, [feesData]);

  const handleAddFees = () => {
    const student = feesData.find((s) => s.studentId === feeForm.studentId);

    if (!student) {
      setError("Select student");
      return;
    }

    const isDuplicate = student.fees.some(
      (f) => f.month === feeForm.month && f.year === feeForm.year,
    );

    if (isDuplicate) {
      setError("Fees already added for this month");
      return;
    }

    const updatedData = feesData.map((s) =>
      s.studentId === feeForm.studentId
        ? {
            ...s,
            fees: [
              ...s.fees,
              {
                month: feeForm.month,
                year: feeForm.year,
                amount: Number(feeForm.amount),
                paymentDate: new Date().toISOString().slice(0, 10),
                mode: feeForm.mode,
              },
            ],
          }
        : s,
    );

    setFeesData(updatedData);

    setAddDialogOpen(false);
    setFeeForm({
      studentId: "",
      month: "",
      year: 2026,
      amount: "",
      mode: "",
    });
    setError("");
  };

  return (
    <Layout>
      <Box sx={{ my: 10, p: 2, color: "white" }}>
        {/* PAGE TITLE */}
        <div className="addButton">
          <Typography variant="h5" sx={{ mb: 2 }}>
            Add New Fee
          </Typography>
          <IconButton
            sx={{ color: "#67686e", ml: 1, mb: 2 }}
            onClick={() => setAddDialogOpen(!addDialogOpen)}
          >
            <AddCircleIcon />
          </IconButton>
        </div>
        <List>
           
        </List>
      </Box>

      {/* Dialog for Add new Fee */}
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
          <DialogTitle>Edit Marks</DialogTitle>
          <IconButton
            onClick={() => {
              setAddDialogOpen(false);
            }}
          >
            <CloseIcon sx={{ color: "#e11212" }} />
          </IconButton>
        </Box>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Student</InputLabel>
            <Select
              label="Student"
              value={feeForm.studentId}
              onChange={(e) =>
                setFeeForm({ ...feeForm, studentId: e.target.value })
              }
            >
              {feesData.map((s) => (
                <MenuItem key={s.studentId} value={s.studentId}>
                  {s.studentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* MONTH */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Month</InputLabel>
            <Select
              label="Month"
              value={feeForm.month}
              onChange={(e) =>
                setFeeForm({ ...feeForm, month: e.target.value })
              }
            >
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "July",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
              ].map((s, i) => (
                <MenuItem key={i} value={s}>
                  {s}
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
            onChange={(e) => setFeeForm({ ...feeForm, year: e.target.value })}
          />
          {/* AMOUNT */}
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="dense"
            value={feeForm.amount}
            onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
          />
          {/* PAYMENT MODE */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Mode</InputLabel>
            <Select
              label="Payment Mode"
              value={feeForm.mode}
              onChange={(e) => setFeeForm({ ...feeForm, mode: e.target.value })}
            >
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="BANK">Bank</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddFees}>
            Add Fees
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default StudentFees;
