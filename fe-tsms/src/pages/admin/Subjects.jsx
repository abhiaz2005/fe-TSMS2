import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Collapse,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClassIcon from "@mui/icons-material/Class";
import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { url } from "../../config/apiConfig";
import { useAuth } from "../../contexts/authcontext/AuthContext";

const Subjects = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [groupedSubjects, setGroupedSubjects] = useState([]);
    const [classList, setClassList] = useState([]);
    const [expandOpen, setExpandOpen] = useState(null);

    const [subjects, setSubjects] = useState([]);
    const [groupedData, setGroupedData] = useState([]);

    // ── Subject dialog ──────────────────────────────────────────
    const [subjectDialog, setSubjectDialog] = useState(false);
    const [subjectForm, setSubjectForm] = useState({ name: "" });
    const [subjectEditId, setSubjectEditId] = useState(null);
    const [deleteSubjectDialog, setDeleteSubjectDialog] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // ── ClassSubject dialog ─────────────────────────────────────
    const [csDialog, setCsDialog] = useState(false);
    const [csForm, setCsForm] = useState({ classId: "" });
    const [csEditId, setCsEditId] = useState(null);
    const [activeSubject, setActiveSubject] = useState(null);
    const [deleteCsDialog, setDeleteCsDialog] = useState(false);
    const [selectedCs, setSelectedCs] = useState(null);

    // ── Auth error ──────────────────────────────────────────────
    const handleErr = (err, fallback) => {
        if (err.response?.status === 401) {
            logout();
            localStorage.setItem("isLog", false);
            navigate("/");
            toast.error(err.response?.data?.responseDescription || "Please login again");
        } else {
            toast.error(err.response?.data?.responseDescription || fallback);
        }
    };

    // ── Fetch ───────────────────────────────────────────────────
    // const fetchGrouped = async () => {
    //     try {
    //         const res = await api.get(url.getGroupedSubjects, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         // console.log(res.data);
    //         setGroupedSubjects(res.data?.data || []);
    //     } catch (err) { handleErr(err, "Failed to load subjects"); }
    // };

    const fetchClasses = async () => {
        try {
            const res = await api.get(url.getAllClass, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClassList(res.data.data || []);
        } catch (err) { handleErr(err, "Failed to load classes"); }
    };

    const fetchSubjects = async () => {
        try {
            const res = await api.get(url.getAllSubject, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubjects(res.data.data || []);
        } catch (err) { handleErr(err, "Failed to load subjects"); }
    };

    const fetchGrouped = async () => {
        try {
            const res = await api.get(url.getGroupedSubjects, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroupedData(res.data.data || []);
        } catch (err) { handleErr(err, "Failed to load grouped"); }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchGrouped();
            await fetchClasses();
            await fetchSubjects();
        }

        loadData();
    }, []);

    // ── Subject CRUD ────────────────────────────────────────────
    const handleSubjectSubmit = async () => {
        if (!subjectForm.name.trim()) { toast.error("Enter subject name"); return; }
        try {
            if (subjectEditId) {
                await api.put(url.editSubject, { id: subjectEditId, name: subjectForm.name }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Subject updated!");
            } else {
                await api.post(url.addSubject, { name: subjectForm.name }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Subject added!");
            }
            await fetchGrouped();
            closeSubjectDialog();
        } catch (err) { handleErr(err, "Failed to save subject"); }
    };

    const handleSubjectDelete = async () => {
        try {
            await api.delete(`${url.deleteAllClassSubjectBySubject}?subjectId=${selectedSubject.subject.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 2️⃣ Phir Subject delete karo
            await api.delete(`${url.deleteSubject}/${selectedSubject.subject.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Subject deleted!");
            await fetchSubjects();
            await fetchGrouped();
            setDeleteSubjectDialog(false);
            setSelectedSubject(null);
        } catch (err) { handleErr(err, "Failed to delete subject"); }
    };

    const openSubjectEdit = (group) => {
        setSubjectEditId(group.subject.id);
        setSubjectForm({ name: group.subject.name });
        setSubjectDialog(true);
    };

    const closeSubjectDialog = () => {
        setSubjectDialog(false);
        setSubjectEditId(null);
        setSubjectForm({ name: "" });
    };

    // ── ClassSubject CRUD ───────────────────────────────────────
    const handleCsSubmit = async () => {
        if (!csForm.classId) { toast.error("Select class"); return; }
        try {
            if (csEditId) {
                await api.put(url.editClassSubject, { id: csEditId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Updated!");
            } else {
                await api.post(url.addClassSubject, {
                    subjectId: activeSubject.subject.id,
                    classId: csForm.classId,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Class assigned!");
            }
            await fetchGrouped();
            closeCsDialog();
        } catch (err) { handleErr(err, "Failed to save"); }
    };

    const handleCsDelete = async () => {
        try {
            await api.delete(`${url.deleteClassSubject}/${selectedCs.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Removed!");
            await fetchGrouped();
            setDeleteCsDialog(false);
            setSelectedCs(null);
        } catch (err) { handleErr(err, "Failed to remove"); }
    };

    const openCsAdd = (group) => {
        setActiveSubject(group);
        setCsEditId(null);
        setCsForm({ classId: "" });
        setCsDialog(true);
    };

    const closeCsDialog = () => {
        setCsDialog(false);
        setCsEditId(null);
        setCsForm({ classId: "" });
        setActiveSubject(null);
    };

    // ── already assigned class ids for this subject ─────────────
    const assignedClassIds = activeSubject
        ? (activeSubject.classSubjects || []).map((cs) => cs.studentClass?.id)
        : [];

    const mergedSubjects = subjects.map((subject) => {
        const group = groupedData.find((g) => g.subject?.id === subject.id);
        return {
            subject,
            classSubjects: group?.classSubjects || [],
        };
    });

    return (
        <Box sx={{ mt: 10, px: { xs: 2, md: 4 }, pb: 6 }}>

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MenuBookIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                    <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                        Subjects
                    </Typography>
                </Box>
                <IconButton
                    onClick={() => setSubjectDialog(true)}
                    sx={{ bgcolor: "#1976d2", color: "white", "&:hover": { bgcolor: "#1565c0" } }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {/* Empty */}
            {mergedSubjects.length === 0 && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography sx={{ color: "#a39d9d" }}>No subjects found. Add one!</Typography>
                </Box>
            )}

            {/* Subject List */}
            {mergedSubjects.map((group, index) => (
                <Box key={group.subject?.id} sx={{ mb: 2 }}>

                    {/* Subject Row */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: "#404147",
                            borderRadius: expandOpen === index ? "8px 8px 0 0" : 2,
                            px: 2,
                            py: 1.5,
                            cursor: "pointer",
                            transition: "background 0.15s",
                            "&:hover": { bgcolor: "#4a4b52" },
                        }}
                        onClick={() => setExpandOpen(expandOpen === index ? null : index)}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <MenuBookIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                            <Typography sx={{ color: "white", fontWeight: 600, fontSize: 16 }}>
                                {group.subject?.name}
                            </Typography>
                            <Chip
                                label={`${group.classSubjects?.length || 0} classes`}
                                size="small"
                                sx={{ bgcolor: "#2a2b30", color: "#a0a0a0", height: 20, fontSize: 11 }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); openSubjectEdit(group); }}>
                                <CreateIcon sx={{ color: "#989994", fontSize: 18 }} />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSelectedSubject(group); setDeleteSubjectDialog(true); }}>
                                <DeleteIcon sx={{ color: "#d32f2f", fontSize: 18 }} />
                            </IconButton>
                            {expandOpen === index
                                ? <ExpandLess sx={{ color: "white" }} />
                                : <ExpandMore sx={{ color: "white" }} />
                            }
                        </Box>
                    </Box>

                    {/* ClassSubject Rows */}
                    <Collapse in={expandOpen === index} timeout={150} unmountOnExit>
                        <Box sx={{ bgcolor: "#35363b", borderRadius: "0 0 8px 8px", px: 2, pt: 1, pb: 1.5 }}>

                            {(group.classSubjects || []).length === 0 && (
                                <Typography sx={{ color: "#a39d9d", fontSize: 13, py: 1, pl: 1 }}>
                                    No classes assigned yet.
                                </Typography>
                            )}

                            {(group.classSubjects || []).map((cs) => (
                                <Box
                                    key={cs.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        bgcolor: "#2e2f34",
                                        borderRadius: 1.5,
                                        px: 2,
                                        py: 0.8,
                                        mt: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <ClassIcon sx={{ color: "#5c9bd6", fontSize: 17 }} />
                                        <Typography sx={{ color: "white", fontSize: 14 }}>
                                            {cs.studentClass?.name || cs.studentClass?.studentClass}
                                        </Typography>
                                    </Box>
                                    <IconButton size="small" onClick={() => { setSelectedCs(cs); setDeleteCsDialog(true); }}>
                                        <DeleteIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            ))}

                            {/* Add Class button */}
                            <Button
                                startIcon={<AddIcon />}
                                size="small"
                                onClick={(e) => { e.stopPropagation(); openCsAdd(group); }}
                                sx={{
                                    mt: 1.5,
                                    color: "#1976d2",
                                    textTransform: "none",
                                    fontSize: 13,
                                    "&:hover": { bgcolor: "#1976d215" },
                                }}
                            >
                                Add Class
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            ))}

            {/* ── Dialog: Add/Edit Subject ── */}
            <Dialog open={subjectDialog} onClose={closeSubjectDialog} fullWidth maxWidth="xs">
                <DialogTitle>{subjectEditId ? "Edit Subject" : "Add Subject"}</DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                    <TextField
                        fullWidth
                        label="Subject Name"
                        value={subjectForm.name}
                        onChange={(e) => setSubjectForm({ name: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSubjectSubmit()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeSubjectDialog} color="error">Cancel</Button>
                    <Button variant="contained" onClick={handleSubjectSubmit}>
                        {subjectEditId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: Delete Subject ── */}
            <Dialog open={deleteSubjectDialog} onClose={() => { setDeleteSubjectDialog(false); setSelectedSubject(null); }}>
                <DialogTitle>Delete Subject</DialogTitle>
                <DialogContent>
                    <Typography>
                        Delete <strong>{selectedSubject?.subject?.name}</strong>? All class assignments will also be removed.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDeleteSubjectDialog(false); setSelectedSubject(null); }}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleSubjectDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: Add ClassSubject ── */}
            <Dialog open={csDialog} onClose={closeCsDialog} fullWidth maxWidth="xs">
                <DialogTitle>Assign Class — {activeSubject?.subject?.name}</DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                    <FormControl fullWidth>
                        <InputLabel>Class</InputLabel>
                        <Select
                            label="Class"
                            value={csForm.classId}
                            onChange={(e) => setCsForm({ classId: e.target.value })}
                        >
                            {classList
                                .filter((cls) => !assignedClassIds.includes(cls.id))
                                .map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>{cls.studentClass}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCsDialog} color="error">Cancel</Button>
                    <Button variant="contained" onClick={handleCsSubmit}>Assign</Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: Delete ClassSubject ── */}
            <Dialog open={deleteCsDialog} onClose={() => { setDeleteCsDialog(false); setSelectedCs(null); }}>
                <DialogTitle>Remove Class</DialogTitle>
                <DialogContent>
                    <Typography>
                        Remove <strong>{selectedCs?.studentClass?.name || selectedCs?.studentClass?.studentClass}</strong> from this subject?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDeleteCsDialog(false); setSelectedCs(null); }}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleCsDelete}>Remove</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Subjects;