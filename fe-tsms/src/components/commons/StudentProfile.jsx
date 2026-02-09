import React from 'react'
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



const StudentProfile = ({ student }) => {
    const InfoRow = ({ label, value }) => (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #555",
                pb: 1,
            }}
        >
            <Typography sx={{ color: "#bbb", fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography sx={{ color: "white", fontWeight: 600 }}>
                {value || "-"}
            </Typography>
        </Box>
    );
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
                    height: { xs: "100%", md: "30%" },
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
                <Avatar sx={{ width: 150, height: 150 }} src={student.profile_picture} />
                <Typography variant="h4">{student.name}</Typography>
                <Typography variant="h6" color="gray">
                    Class {student.class}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Chip
                        label={`Gender: ${student.gender}`}
                        color="primary"
                    />
                </Box>
            </Box>

            {/* Right side */}
            <Box
                sx={{
                    bgcolor: "#404147",
                    width: { xs: "100%", md: "70%" },
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Details :
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <InfoRow label="Age" value={student.age} />
                    <InfoRow label="Email" value={student.email} />
                    <InfoRow label="Phone" value={student.phone} />
                    <InfoRow label="Address" value={student.address} />
                    <InfoRow label="Studied From" value={student.studied_from} />

                </Box>
            </Box>

        </Box>

    )
}

export default StudentProfile;