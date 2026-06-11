import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios.js";
import { url } from "../../config/apiConfig.js";
import { useAuth } from "../../contexts/authcontext/AuthContext.jsx";
import { toast } from "react-toastify";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";


const calcGrade = (pct) => {
    if (pct >= 90) return { label: "A+", color: "success" };
    if (pct >= 75) return { label: "A", color: "primary" };
    if (pct >= 60) return { label: "B", color: "warning" };
    if (pct >= 40) return { label: "C", color: "warning" };
    return { label: "F", color: "error" };
};

const StudentReportView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReport = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`${url.getStudentReport}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReportData(res.data.data);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                localStorage.setItem("isLog", false);
                navigate("/");
                toast.error("Please login again");
            } else {
                toast.error(err.response?.data?.responseDescription || "Failed to load report");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`${url.generateReport}?studentId=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const base64 = res.data.data?.pdf;
            if (!base64) { toast.error("PDF not received"); return; }

            const byteChars = atob(base64);
            const byteNumbers = Array.from(byteChars).map((c) => c.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, "_blank");

        } catch (err) {
            if (err.response?.status === 401) {
                logout(); localStorage.setItem("isLog", false); navigate("/");
                toast.error("Please login again");
            } else {
                toast.error(err.response?.data?.responseDescription || "Failed to generate PDF");
            }
        }
    };

    useEffect(() => {
        if (id) fetchReport();
    }, [id]);

    if (loading) return (
        <Box sx={{ mt: 15, textAlign: "center" }}>
            <Typography variant="h5" color="primary">Loading...</Typography>
        </Box>
    );

    if (!reportData) return (
        <Box sx={{ mt: 15, textAlign: "center" }}>
            <Typography color="white">No report found 😕</Typography>
        </Box>
    );

    const student = reportData.user;
    const marks = reportData.marks || [];

    // ── Group by examType ─────────────────────────────────────
    const termExams = {};
    const subjectTests = {};

    marks.forEach((mark) => {
        const examMaster = mark.exam.examMasterDto;
        const examName = examMaster.examName;
        const examType = examMaster.examType;

        if (examType === "TERM_EXAM") {
            if (!termExams[examName]) termExams[examName] = [];
            termExams[examName].push(mark);
        } else {
            if (!subjectTests[examName]) subjectTests[examName] = [];
            subjectTests[examName].push(mark);
        }
    });

    // ── Overall summary (all TERM_EXAM marks) ────────────────
    const termMarksAll = Object.values(termExams).flat();
    const totalFull = termMarksAll.reduce((s, m) => s + m.exam.fullMark, 0);
    const totalSecured = termMarksAll.reduce((s, m) => s + m.securedMark, 0);
    const percentage = totalFull > 0 ? (totalSecured / totalFull) * 100 : 0;
    const overallGrade = calcGrade(percentage);

    // ── Reusable marks table ──────────────────────────────────
    const MarksTable = ({ examMarks }) => (
        <TableContainer>
            <Table size="medium">
                <TableHead sx={{ "& th": { color: "white", fontWeight: 700, borderBottom: "2px solid #555" } }}>
                    <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell align="center">Full Marks</TableCell>
                        <TableCell align="center">Obtained</TableCell>
                        <TableCell align="center">%</TableCell>
                        <TableCell align="center">Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {examMarks.map((mark) => {
                        const full = mark.exam.fullMark;
                        const secured = mark.securedMark;
                        const p = full > 0 ? (secured / full) * 100 : 0;
                        const g = calcGrade(p);
                        return (
                            <TableRow key={mark.id}>
                                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                                    {mark.exam.classSubject.subject.name}
                                </TableCell>
                                <TableCell align="center" sx={{ color: "#bbb" }}>{full}</TableCell>
                                <TableCell align="center" sx={{ color: "#bbb" }}>{secured}</TableCell>
                                <TableCell align="center" sx={{ color: "#bbb" }}>{p.toFixed(1)}%</TableCell>
                                <TableCell align="center">
                                    <Chip label={g.label} color={g.color} size="small" />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // ── Summary cards row ─────────────────────────────────────
    const SummaryRow = ({ examMarks }) => {
        const tFull = examMarks.reduce((s, m) => s + m.exam.fullMark, 0);
        const tSecured = examMarks.reduce((s, m) => s + m.securedMark, 0);
        const pct = tFull > 0 ? (tSecured / tFull) * 100 : 0;
        const grade = calcGrade(pct);

        return (
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                {[
                    { label: "Total", value: tFull },
                    { label: "Obtained", value: tSecured },
                    { label: "Percentage", value: `${pct.toFixed(1)}%` },
                ].map((item) => (
                    <Box key={item.label} sx={{
                        bgcolor: "#2e2f34", borderRadius: 2, p: 1.5,
                        textAlign: "center", flex: 1, minWidth: 90,
                    }}>
                        <Typography variant="caption" color="gray"
                            sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                            {item.label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                    </Box>
                ))}
                <Box sx={{
                    bgcolor: "#1a2744", borderRadius: 2, p: 1.5,
                    textAlign: "center", flex: 1, minWidth: 90,
                }}>
                    <Typography variant="caption" color="gray"
                        sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                        Grade
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#c9a84c" }}>
                        {grade.label}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ my: 10, p: 2, color: "white" }}>

            {/* ── Student Info + Overall Summary ── */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>

                {/* Left — Avatar */}
                <Box sx={{
                    width: { xs: "100%", md: "30%" },
                    bgcolor: "#404147", p: 3, borderRadius: 2,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                    <Avatar sx={{ width: 120, height: 120 }} src={student.image || ""} alt={student.name} />
                    <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 700 }}>
                        {student.name}
                    </Typography>
                    <Typography color="gray">Class {student.section?.studentClass || "-"}</Typography>
                    <Chip label={student.gender || "-"} color="primary" size="small" />
                    <IconButton
                        onClick={handleGenerateReport}
                        sx={{ bgcolor: "#2e2f34", mt: 1 }}
                        title="Download PDF Report"
                    >
                        <PictureAsPdfIcon sx={{ color: "#ff5252" }} />
                    </IconButton>
                </Box>

                {/* Right — Overall summary */}
                <Box sx={{
                    width: { xs: "100%", md: "70%" },
                    bgcolor: "#404147", p: 3, borderRadius: 2,
                    display: "flex", flexDirection: "column", gap: 2,
                }}>
                    <Typography variant="h6">📊 Overall Summary</Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {[
                            { label: "Total Marks", value: totalFull },
                            { label: "Obtained", value: totalSecured },
                            { label: "Percentage", value: `${percentage.toFixed(1)}%` },
                        ].map((item) => (
                            <Box key={item.label} sx={{
                                bgcolor: "#2e2f34", borderRadius: 2, p: 2,
                                minWidth: 120, textAlign: "center", flex: 1,
                            }}>
                                <Typography variant="caption" color="gray"
                                    sx={{ letterSpacing: 1, textTransform: "uppercase" }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                                    {item.value}
                                </Typography>
                            </Box>
                        ))}
                        <Box sx={{
                            bgcolor: "#1a2744", borderRadius: 2, p: 2,
                            minWidth: 120, textAlign: "center", flex: 1,
                        }}>
                            <Typography variant="caption" color="gray"
                                sx={{ letterSpacing: 1, textTransform: "uppercase" }}>
                                Overall Grade
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: "#c9a84c" }}>
                                {overallGrade.label}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* ── TERM EXAMs — one card per exam ── */}
            {Object.entries(termExams).map(([examName, examMarks]) => (
                <Box key={examName} sx={{ bgcolor: "#404147", borderRadius: 2, p: 2, mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">📝 {examName}</Typography>
                        <Chip label="Term Exam" color="primary" size="small" />
                    </Box>
                    <MarksTable examMarks={examMarks} />
                    <SummaryRow examMarks={examMarks} />
                </Box>
            ))}

            {/* ── SUBJECT TESTs — one combined card ── */}
            {Object.keys(subjectTests).length > 0 && (
                <Box sx={{ bgcolor: "#404147", borderRadius: 2, p: 2, mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">🧪 Subject Tests</Typography>
                        <Chip label="Subject Test" color="warning" size="small" />
                    </Box>

                    {Object.entries(subjectTests).map(([examName, examMarks]) => (
                        <Box key={examName} sx={{ mb: 3 }}>
                            <Typography sx={{
                                fontWeight: 700, color: "#1a2744", bgcolor: "#eee8d8",
                                px: 2, py: 0.5, borderRadius: 1, mb: 1,
                                fontSize: 13, letterSpacing: 1, textTransform: "uppercase",
                            }}>
                                {examName}
                            </Typography>
                            <MarksTable examMarks={examMarks} />
                        </Box>
                    ))}
                </Box>
            )}

        </Box>
    );
};

export default StudentReportView;