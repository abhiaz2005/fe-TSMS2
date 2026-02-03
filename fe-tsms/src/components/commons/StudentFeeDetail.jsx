import React from "react";
import {
  Avatar,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

const StudentFeesDetail = ({ student }) => {
  if (!student) {
    return <Typography color="white">Student not found 😕</Typography>;
  }

  return (
    <Box
      sx={{
        p: 2,
        color: "white",
        width: "100%",
        gap: 2,
        display: "flex",
        flexWrap: {
          md: "nowrap",
          xs: "wrap",
        },
      }}
    >
      {/* left side */}
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          bgcolor: "#404147",
          p: 3,
          borderRadius: 2,
          // textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Avatar sx={{ width: 150, height: 150 }} src={student.img} />
        <Typography variant="h4">{student.studentName}</Typography>
        <Typography variant="h6" color="gray">
          {" "}
          Class {student.class}{" "}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Total Payments: ${student.fees.length}`}
            color="primary"
          />
        </Box>
      </Box>

      {/* Right side */}
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
            <TableHead
              sx={{
                "& th": {
                  color: "white",
                  fontWeight: 600,
                },
              }}
            >
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Mode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& td": {
                  color: "#bbb6b6",
                  fontWeight: 600,
                },
              }}
            >
              {student.fees.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.month}</TableCell>
                  <TableCell>{s.year}</TableCell>
                  <TableCell>{s.amount}</TableCell>
                  <TableCell>
                    <Chip label={s.mode} color={s.mode==='CASH'?'warning':s.mode=='UPi' ?'success':'info'} />
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
