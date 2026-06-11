import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Collapse, Divider } from '@mui/material'
import { StudentList } from '../../data/student'
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from 'react-router-dom';
import StudentProfile from '../users/StudentProfile';
import { api } from '../../api/axios';
import { useAuth } from "../../contexts/authcontext/AuthContext";
import { toast } from "react-toastify";
import { url } from "../../config/apiConfig"
import {
    // existing...
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, IconButton
} from '@mui/material'
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
    Checkbox,
    FormControlLabel
} from "@mui/material";



const Students = () => {
    const [open, setOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentProfile, setStudentProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sameAddress, setSameAddress] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();




    const { id } = useParams();

    const studentIdNumber = Number(id);

    const handleSameAddress = (checked) => {

        setSameAddress(checked);

        if (checked) {
            setEditForm({
                ...editForm,
                permanentAddress: {
                    ...editForm.presentAddress
                }
            });
        }
    };

    // const studentData = id
    //     ? StudentList.find((s) => s.id === studentIdNumber)
    //     : null;

    const studentAddress = (student) => {
        const fullAddress = [
            student?.presentAddress?.street,
            student?.presentAddress?.city,
            student?.presentAddress?.pincode,
            student?.presentAddress?.state,
        ].filter(Boolean)
            .join(",");
        // console.log(fullAddress)
        return fullAddress.length > 50
            ? `${fullAddress.substring(0, 50)}...`
            : (fullAddress || "_");
    }

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(url.getAllStudent, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.responseCode == 200) {
                setStudents(res.data.data);
            }
        } catch (err) {
            if (err.response.status == 401) {
                logout();
                localStorage.setItem("isLog", false);
                navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            } else {
                toast.error(
                    err.response?.data?.responseDescription || "Registration failed"
                );
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchStudentById = async (studentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get(`${url.getStudent}?id=${studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.responseCode === 200) {
                setStudentProfile(res.data.data);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                logout(); localStorage.setItem("isLog", false); navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            } else {
                toast.error(err.response?.data?.responseDescription || "Failed to load student");
            }
        }finally{
            setLoading(false);
        }
    };
    const handleEditOpen = (student) => {
        console.log(student)
        setEditForm({
            id: student.id,
            name: student.name || "",
            email: student.email || "",
            gender: student.gender || "",
            dob: student.dob ? dayjs(student.dob) : null,
            fatherName: student.fatherName || "",
            motherName: student.motherName || "",
            sectionId: student.section?.id || "",
            studiedFrom: student.studiedFrom ? dayjs(student.studiedFrom) : null,
            phoneNo: student.phoneNo || "",
            presentAddress: {
                street: student.presentAddress?.street || "",
                city: student.presentAddress?.city || "",
                state: student.presentAddress?.state || "",
                pincode: student.presentAddress?.pincode || "",
            },
            permanentAddress: {
                street: student.permanentAddress?.street || "",
                city: student.permanentAddress?.city || "",
                state: student.permanentAddress?.state || "",
                pincode: student.permanentAddress?.pincode || "",
            },
        });
        setEditDialogOpen(true);
    };

    const handleUpdateStudent = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...editForm,
                dob: editForm.dob ? editForm.dob.toISOString() : null,
                studiedFrom: editForm.studiedFrom ? editForm.studiedFrom.toISOString() : null,
            };
            const res = await api.put(url.updateStudent, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            toast.success(res.data.responseDescription || "Student updated!");
            setEditDialogOpen(false);
            await fetchStudents();
        } catch (err) {
            if (err.response?.status === 401) {
                logout(); localStorage.setItem("isLog", false); navigate("/");
                toast.error(err.response?.data?.responseDescription || "Please login again");
            } else {
                toast.error(err.response?.data?.responseDescription || "Update failed");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get(url.getAllClass, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.responseCode === 200) {
                setClasses(res.data.data || []);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                // Profile page — sirf ek student fetch karo
                await fetchStudentById(studentIdNumber);
            } else {
                // List page — sab fetch karo
                await fetchStudents();
                await fetchClasses();
            }
        };
        loadData();
    }, [id]);

    if (loading) return <Box sx={{ mt: 15 }}>
        <Typography variant='h3' color='primary'>
            Loading ...
        </Typography>
    </Box>




    console.log("id from params : ",id)
    return (
        <Box>
            {
                
                !id ? (
                    <Box
                        sx={{
                            my: 15,
                            // mx: 10,
                            textAlign: "center",
                            p: 2,
                            color: 'white',
                            "@media (max-width:600px)": {
                                mt: 10,
                            },

                        }}
                    >
                        <List >
                            {students && students.length > 0 ? (
                                students.map((student, index) => (
                                    <Box key={student.id}>
                                        <ListItem
                                            sx={{
                                                color: "white",
                                                mb: 2,
                                                borderRadius: 2,
                                                bgcolor: "#404147",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setOpen(open === index ? null : index)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={`${student.image}?w=80&h=80&fit=crop`}
                                                    alt={student.name}
                                                    slotProps={{
                                                        img: {
                                                            loading: 'lazy',
                                                            referrerPolicy: 'no-referrer'
                                                        }
                                                    }}
                                                />
                                            </ListItemAvatar>

                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ color: "white", fontWeight: "bold" }}>
                                                        {student.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography sx={{ color: "gray" }} variant="body2">
                                                        Class {student.section?.studentClass || '_'}
                                                    </Typography>
                                                }
                                            />
                                            <IconButton onClick={(e) => { e.stopPropagation(); handleEditOpen(student); }}>
                                                <CreateIcon sx={{ color: "#989994" }} />
                                            </IconButton>
                                            {open === index ? (
                                                <ExpandMore
                                                    sx={{ color: "white" }}
                                                    onClick={() => setOpen(null)}
                                                />
                                            ) : (
                                                <ExpandLess
                                                    sx={{ color: "white" }}
                                                    onClick={() => setOpen(index)}
                                                />
                                            )}
                                        </ListItem>

                                        <Collapse in={open === index}
                                            timeout={150}
                                            unmountOnExit>
                                            <List
                                                component="div"
                                                disablePadding
                                                sx={{
                                                    bgcolor: "#404147",
                                                    borderRadius: 2,
                                                    ml: 1.5,
                                                    mb: 2,
                                                }}
                                            >
                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={<Typography color="white">🧑‍🦰 Gender</Typography>}
                                                        secondary={<Typography color="gray">{student.gender || "_"}</Typography>}
                                                    />
                                                </ListItem>
                                                <Divider sx={{ bgcolor: "#55575e" }} />

                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={<Typography color="white">📧 Email</Typography>}
                                                        secondary={<Typography color="gray">{student.email || "_"}</Typography>}
                                                    />
                                                </ListItem>
                                                <Divider sx={{ bgcolor: "#55575e" }} />

                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={<Typography color="white">🎂 Age</Typography>}
                                                        secondary={<Typography color="gray">{student.age || "_"}</Typography>}
                                                    />
                                                </ListItem>
                                                <Divider sx={{ bgcolor: "#55575e" }} />

                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={<Typography color="white">📘 Studied From</Typography>}
                                                        secondary={<Typography color="gray">{student.studiedFrom || "_"}</Typography>}
                                                    />
                                                </ListItem>
                                                <Divider sx={{ bgcolor: "#55575e" }} />

                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={<Typography color="white">🏫 Address</Typography>}
                                                        secondary={
                                                            <Typography color="gray">
                                                                {
                                                                    studentAddress(student)
                                                                }
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider sx={{ bgcolor: "#55575e" }} />

                                                <ListItem sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        primary={<Typography color="white">📞 Parent Contact</Typography>}
                                                        secondary={<Typography color="gray">{student.phoneNo || "_"}</Typography>}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Collapse>
                                    </Box>
                                ))
                            ) : (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#989994",
                                        textAlign: "center",
                                        mt: 4,
                                        fontStyle: "italic"
                                    }}
                                >
                                    No Students found !
                                </Typography>
                            )}

                        </List>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Dialog open={editDialogOpen} fullWidth maxWidth="md">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 2 }}>
                                    <DialogTitle>Edit Student</DialogTitle>
                                    <IconButton onClick={() => setEditDialogOpen(false)}>
                                        <CloseIcon sx={{ color: "#e11212" }} />
                                    </IconButton>
                                </Box>
                                <DialogContent>
                                    {editForm && (
                                        <Grid container spacing={2}>
                                            {/* Basic Info */}
                                            <Grid item size={{ xs: 12, sm: 6 }}>
                                                <TextField fullWidth label="Name" value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                            </Grid>
                                            <Grid item size={{ xs: 12, sm: 6 }}>
                                                <TextField fullWidth label="Email" value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                                            </Grid>
                                            <Grid item size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select label="Gender" value={editForm.gender}
                                                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                                        renderValue={(val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}
                                                    >
                                                        <MenuItem value="MALE">Male</MenuItem>
                                                        <MenuItem value="FEMALE">Female</MenuItem>
                                                        <MenuItem value="OTHER">Other</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item size={{ xs: 12, sm: 6 }}>
                                                <DatePicker label="Date of Birth" value={editForm.dob}
                                                    onChange={(val) => setEditForm({ ...editForm, dob: val })}
                                                    slotProps={{ textField: { fullWidth: true } }} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField fullWidth label="Father Name" value={editForm.fatherName}
                                                    onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField fullWidth label="Mother Name" value={editForm.motherName}
                                                    onChange={(e) => setEditForm({ ...editForm, motherName: e.target.value })} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField fullWidth label="Parent Contact" value={editForm.phoneNo}
                                                    onChange={(e) => setEditForm({ ...editForm, phoneNo: e.target.value })} />
                                            </Grid>
                                            {/* Section + Studied From - apni row mein */}
                                            <FormControl fullWidth>
                                                <InputLabel>Section</InputLabel>
                                                <Select
                                                    value={editForm.sectionId || ""}
                                                    label="Section"
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            sectionId: e.target.value
                                                        })
                                                    }
                                                >
                                                    {classes.map((cls) => (
                                                        <MenuItem
                                                            key={cls.id}
                                                            value={cls.id}
                                                        >
                                                            {cls.studentClass}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <DatePicker label="Studied From" value={editForm.studiedFrom}
                                                    onChange={(val) => setEditForm({ ...editForm, studiedFrom: val })}
                                                    slotProps={{ textField: { fullWidth: true } }} />
                                            </Grid>

                                            {/* Present Address */}
                                            <Box sx={{ width: "100%", mt: 2, mb: 1 }}>
                                                <Divider sx={{ mb: 1 }} />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#1976d2"
                                                    }}
                                                >
                                                    Present Address
                                                </Typography>
                                            </Box>

                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Street"
                                                    value={editForm.presentAddress.street}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            presentAddress: {
                                                                ...editForm.presentAddress,
                                                                street: e.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    value={editForm.presentAddress.city}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            presentAddress: {
                                                                ...editForm.presentAddress,
                                                                city: e.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="State"
                                                    value={editForm.presentAddress.state}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            presentAddress: {
                                                                ...editForm.presentAddress,
                                                                state: e.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>



                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Pincode"
                                                    value={editForm.presentAddress.pincode}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            presentAddress: {
                                                                ...editForm.presentAddress,
                                                                pincode: e.target.value
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>

                                            {/* Permanent Address */}
                                            <Box sx={{ width: "100%", mt: 2, mb: 1 }}>
                                                <Divider sx={{ mb: 1 }} />
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: "#1976d2"
                                                        }}
                                                    >
                                                        Permanent Address
                                                    </Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={sameAddress}
                                                                onChange={(e) =>
                                                                    handleSameAddress(e.target.checked)
                                                                }
                                                            />
                                                        }
                                                        label="Same as Present Address"
                                                    />
                                                </Box>
                                            </Box>


                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Street"
                                                    value={editForm.permanentAddress.street}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            permanentAddress: {
                                                                ...editForm.permanentAddress,
                                                                street: e.target.value
                                                            }
                                                        })
                                                    }
                                                    disabled={sameAddress}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    value={editForm.permanentAddress.city}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            permanentAddress: {
                                                                ...editForm.permanentAddress,
                                                                city: e.target.value
                                                            }
                                                        })
                                                    }
                                                    disabled={sameAddress}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="State"
                                                    value={editForm.permanentAddress.state}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            permanentAddress: {
                                                                ...editForm.permanentAddress,
                                                                state: e.target.value
                                                            }
                                                        })
                                                    }
                                                    disabled={sameAddress}
                                                />
                                            </Grid>



                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Pincode"
                                                    value={editForm.permanentAddress.pincode}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            permanentAddress: {
                                                                ...editForm.permanentAddress,
                                                                pincode: e.target.value
                                                            }
                                                        })
                                                    }
                                                    disabled={sameAddress}
                                                />
                                            </Grid>


                                        </Grid>
                                    )}
                                </DialogContent>
                                <DialogActions sx={{ px: 3, pb: 2 }}>
                                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                                    <Button variant="contained" onClick={handleUpdateStudent} disabled={isUpdating}>
                                        {isUpdating ? "Updating..." : "Update"}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </LocalizationProvider>
                    </Box>
                ) : (

                    <Box sx={{ my: 10, p: 2, color: "white" }}>
                        {studentProfile?.id ? (
                            <StudentProfile student={studentProfile} />
                        ) : (
                            <Typography sx={{ color: "white", p: 2 }}>Student not found 😕</Typography>
                        )}
                    </Box>
                )
            }
        </Box>
    )
}

export default Students

