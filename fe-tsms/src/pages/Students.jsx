import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Collapse, Divider } from '@mui/material'
import { StudentList } from '../data/student'
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useParams } from 'react-router-dom';
import StudentProfile from '../components/commons/StudentProfile';


const Students = () => {
    const [open, setOpen] = useState(false);

    const { id } = useParams();

    const studentIdNumber = Number(id);

    const studentData = id
        ? StudentList.find((s) => s.id === studentIdNumber)
        : null;
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
                            {StudentList.map((student, index) => (
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
                                                src={`${student.profile_picture}?w=80&h=80&fit=crop`}
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
                                                    Class {student.class}
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
                                                    secondary={<Typography color="gray">{student.gender}</Typography>}
                                                />
                                            </ListItem>
                                            <Divider sx={{ bgcolor: "#55575e" }} />

                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText
                                                    primary={<Typography color="white">📧 Email</Typography>}
                                                    secondary={<Typography color="gray">{student.email}</Typography>}
                                                />
                                            </ListItem>
                                            <Divider sx={{ bgcolor: "#55575e" }} />

                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText
                                                    primary={<Typography color="white">🎂 Age</Typography>}
                                                    secondary={<Typography color="gray">{student.age}</Typography>}
                                                />
                                            </ListItem>
                                            <Divider sx={{ bgcolor: "#55575e" }} />

                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText
                                                    primary={<Typography color="white">📘 Studied From</Typography>}
                                                    secondary={<Typography color="gray">{student.studied_from}</Typography>}
                                                />
                                            </ListItem>
                                            <Divider sx={{ bgcolor: "#55575e" }} />

                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText
                                                    primary={<Typography color="white">🏫 Address</Typography>}
                                                    secondary={
                                                        <Typography color="gray">
                                                            {student.address.substring(0, 30)}...
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider sx={{ bgcolor: "#55575e" }} />

                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText
                                                    primary={<Typography color="white">📞 Parent Contact</Typography>}
                                                    secondary={<Typography color="gray">{student.phone}</Typography>}
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

