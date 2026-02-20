import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Collapse, Divider } from '@mui/material'
import { StudentList } from '../data/student'
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useParams } from 'react-router-dom';
import StudentProfile from '../components/commons/StudentProfile';
import { api } from '../api/axios';
import { url } from "../config/apiConfig"



const Students = () => {
    const [open, setOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);



    const { id } = useParams();

    const studentIdNumber = Number(id);

    const studentData = id
        ? StudentList.find((s) => s.id === studentIdNumber)
        : null;

    const studentAddress = (student) => {
        const fullAddress = [
            student?.presentAddress?.street,
            student?.presentAddress?.city,
            student?.presentAddress?.pincode,
            student?.presentAddress?.state,
        ].filter(Boolean)
            .join(",");
        console.log(fullAddress)
        return fullAddress.length > 50
            ? `${fullAddress.substring(0, 50)}...`
            : (fullAddress || "_") ;
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
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        fetchStudents();
    }, []);

    if (loading) return <Box sx={{ mt: 15 }}>
        <Typography variant='h3' color='primary'>
            Loading ...
        </Typography>
    </Box>





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
                            {students.map((student, index) => (
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
                                                    Class {student.section || '_'}
                                                </Typography>
                                            }
                                        />

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
                                                    secondary={<Typography color="gray">{student.phoneNo}</Typography>}
                                                />
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                </Box>
                            ))}

                        </List>
                    </Box>
                ) : (

                    <Box sx={{ my: 10, p: 2, color: "white" }}>
                        {studentData ? (
                            <StudentProfile student={studentData} />
                        ) : (
                            <Typography sx={{ color: "white", p: 2 }}>
                                Student not found 😕
                            </Typography>
                        )}
                    </Box>
                )
            }
        </Box>
    )
}

export default Students

