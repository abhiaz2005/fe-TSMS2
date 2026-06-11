import React from "react";
import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

const MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const StudentFeesDetail = ({ feesData }) => {
  // feesData = array from API
  if (!feesData || feesData.length === 0) {
    return <Typography color="white">No fee records found 😕</Typography>;
  }

  const student = feesData[0].student;  // student info pehle record se

  return (
    <Box
      sx={{
        p: 2,
        color: "white",
        width: "100%",
        gap: 2,
        display: "flex",
        flexWrap: { md: "nowrap", xs: "wrap" },
      }}
    >
      {/* ── Left side ── */}
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          bgcolor: "#404147",
          p: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ width: 150, height: 150 }}
          src={student.image || ""}
          alt={student.name}
        />
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {student.name || "-"}
        </Typography>
        <Typography variant="body1" color="gray">
          Class {student.section?.studentClass || "-"}
        </Typography>
        <Chip label={student.gender || "-"} color="primary" />
        <Chip
          label={`Total Payments: ${feesData.length}`}
          color="success"
          variant="outlined"
        />
      </Box>

      {/* ── Right side ── */}
      <Box
        sx={{
          bgcolor: "#404147",
          width: { xs: "100%", md: "70%" },
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          💰 Fee Payments
        </Typography>
        <TableContainer>
          <Table size="medium">
            <TableHead sx={{ "& th": { color: "white", fontWeight: 600 } }}>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Mode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ "& td": { color: "#bbb6b6", fontWeight: 600 } }}>
              {feesData.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{MONTHS[fee.month] || fee.month}</TableCell>
                  <TableCell>{fee.year}</TableCell>
                  <TableCell>₹ {fee.amount}</TableCell>
                  <TableCell>{formatDate(fee.paymentDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={fee.mode}
                      color={
                        fee.mode === "CASH" ? "warning" :
                        fee.mode === "UPI"  ? "success" : "info"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default StudentFeesDetail;