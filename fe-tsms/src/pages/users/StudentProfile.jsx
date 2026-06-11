import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import InfoRow from '../../components/commons/InfoRow';

const StudentProfile = ({ student }) => {

  if (!student) {
    return <Typography color="white">Student not found 😕</Typography>;
  }

  // ── Address format helper ────────────────────────────────
  const formatAddress = (addr) => {
    if (!addr) return "-";
    return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  };

  // ── Date format helper ───────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

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
          label={student.role || "-"}
          sx={{ bgcolor: "#2e2f34", color: "white" }}
        />
      </Box>

      {/* ── Right side ── */}
      <Box
        sx={{
          bgcolor: "#404147",
          width: { xs: "100%", md: "70%" },
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Details:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <InfoRow label="Age"               value={student.age ?? "-"} />
          <InfoRow label="Email"             value={student.email || "-"} />
          <InfoRow label="Phone"             value={student.phoneNo || "-"} />
          <InfoRow label="Date of Birth"     value={formatDate(student.dob)} />
          <InfoRow label="Father's Name"     value={student.fatherName || "-"} />
          <InfoRow label="Mother's Name"     value={student.motherName || "-"} />
          <InfoRow label="Studied From"      value={formatDate(student.studiedFrom)} />
          <InfoRow label="Present Address"   value={formatAddress(student.presentAddress)} />
          <InfoRow label="Permanent Address" value={formatAddress(student.permanentAddress)} />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentProfile;