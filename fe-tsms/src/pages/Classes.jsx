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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { url } from "../config/apiConfig";
import { useAuth } from "../contexts/authcontext/AuthContext";


const Classes = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);
    const [classList, setClassList] = useState([]);

    const [form, setForm] = useState({
        studentClass: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);

        setEditMode(false);
        setEditingId(null);

        setForm({
            studentClass: ""
        });
    };

    const fetchClasses = async () => {
        try {
            const res = await api.get(url.getAllClass, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setClassList(res.data.data || []);
        } catch (err) {
            if (err.response.status == 401) {
                logout();
                localStorage.setItem("isLog", false);
                navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            }else {
                toast.error(
                    err.response?.data?.responseDescription || "Failed to load classes"
                );
            }

        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchClasses();
        }
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                studentClass: form.studentClass
            };

            await api.post(url.addClass, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            await fetchClasses();

            toast.success("Class added successfully");

            handleClose();

        } catch (err) {
             if (err.response.status == 401) {
                logout();
                localStorage.setItem("isLog", false);
                navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            }else {
                toast.error(
                    err.response?.data?.responseDescription || "Failed to add class"
                );
            }
        }
    };

    const handleEdit = (cls) => {
        setEditMode(true);
        setEditingId(cls.id);

        setForm({
            studentClass: cls.studentClass
        });

        setOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                id: editingId,
                studentClass: form.studentClass
            };

            await api.post(url.addClass, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            await fetchClasses();

            toast.success("Class updated successfully");

            handleClose();

        } catch (err) {
             if (err.response.status == 401) {
                logout();
                localStorage.setItem("isLog", false);
                navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            }else {
                toast.error(
                    err.response?.data?.responseDescription || "Failed to update class"
                );
            }
        }
    };

    const handleDeleteClick = (cls) => {
        setSelectedClass(cls);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(
                `${url.deleteClass}/${selectedClass.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchClasses();

            setDeleteOpen(false);
            setSelectedClass(null);

            toast.success("Class deleted successfully");

        } catch (err) {
             if (err.response.status == 401) {
                logout();
                localStorage.setItem("isLog", false);
                navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            }else {
                toast.error(
                    err.response?.data?.responseDescription || "Failed to delete class"
                );
            }
        }
    };

    return (
        <Box sx={{ mt: 10 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mx: 4,
                    mb: 2
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: "bold" }}
                >
                    Classes
                </Typography>

                <IconButton
                    onClick={handleOpen}
                    sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        "&:hover": { bgcolor: "#1565c0" }
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <Box sx={{ px: 5, mb: 5 }}>
                <TableContainer
                    component={Paper}
                    sx={{
                        bgcolor: "#404147",
                        borderRadius: 2
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#494e6b" }}>
                                <TableCell
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Class Name
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {classList.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell sx={{ color: "white" }}>
                                        {cls.studentClass}
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleEdit(cls)}
                                        >
                                            <CreateIcon
                                                sx={{ color: "#989994" }}
                                            />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDeleteClick(cls)}
                                        >
                                            <DeleteIcon
                                                sx={{ color: "#d32f2f" }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {classList.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={2}
                                        sx={{
                                            color: "#a39d9d",
                                            textAlign: "center",
                                            py: 4
                                        }}
                                    >
                                        No classes found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editMode ? "Edit Class" : "Add Class"}
                </DialogTitle>

                <DialogContent sx={{ pt: "20px !important" }}>
                    <TextField
                        fullWidth
                        label="Class Name"
                        name="studentClass"
                        value={form.studentClass}
                        onChange={handleChange}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="error"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            editMode
                                ? handleUpdate
                                : handleSubmit
                        }
                    >
                        {editMode ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedClass(null);
                }}
            >
                <DialogTitle>
                    Delete Class
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>
                            {selectedClass?.studentClass}
                        </strong>
                        ?
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteOpen(false);
                            setSelectedClass(null);
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Classes;