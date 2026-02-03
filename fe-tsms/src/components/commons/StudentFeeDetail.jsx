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

const StudentFeesDetail = ({student}) => {
 

 

  if (!student) {
    return <Typography color="white">Student not found 😕</Typography>;
  }

  return (
    <Box sx={{ p: 2, color: "white" }}>
      <Grid container spacing={2}>
        {/* LEFT SIDE – STUDENT INFO */}
        <Grid  item xs={12} md={4}>
          <Paper
            sx={{
              bgcolor: "#404147",
              p: 3,
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            <Avatar
              src={student.img}
              sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
            />
            <Typography variant="h6">{student.studentName}</Typography>
            <Typography color="gray">
              Class {student.class}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={`Total Payments: ${student.fees.length}`}
                color="primary"
              />
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SIDE – PAYMENTS */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              bgcolor: "#404147",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography color="white" variant="h6" sx={{ mb: 2 }}>
              💰 Fee Payments
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Month</TableCell>
                    <TableCell sx={{ color: "white" }}>Year</TableCell>
                    <TableCell sx={{ color: "white" }}>Amount</TableCell>
                    <TableCell sx={{ color: "white" }}>Mode</TableCell>
                    <TableCell sx={{ color: "white" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {student.fees.map((fee, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: "gray" }}>
                        {fee.month}
                      </TableCell>
                      <TableCell sx={{ color: "gray" }}>
                        {fee.year}
                      </TableCell>
                      <TableCell sx={{ color: "gray" }}>
                        ₹ {fee.amount}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={fee.mode}
                          color={
                            fee.mode === "CASH"
                              ? "warning"
                              : fee.mode === "UPI"
                              ? "success"
                              : "info"
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ color: "gray" }}>
                        {fee.paymentDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentFeesDetail;
