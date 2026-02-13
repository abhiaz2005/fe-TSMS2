import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { examList } from '../data/exams'


const Exams = () => {
    return (
        <Box
        sx={{
            mt:15
        }}
        >
            {
                <List 
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    mx:3,
                }}
                >
                    <ListItem
                            
                            sx={{
                                    mt:1,
                                    color: "white",
                                    mb: 0.5,
                                    borderRadius: 2,
                                    bgcolor: "#404147",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color: "white", fontWeight: "bold" }}>
                                            Exam Name
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color: "white", fontWeight: "bold" }}>
                                           Full mark
                                        </Typography>
                                    }
                                />
                            </ListItem>
                    {
                        examList.map((exam, index) => (
                            <ListItem
                            key={index}
                            sx={{
                                    mt:1,
                                    color: "#a39d9d",
                                    mb: 0.5,
                                    borderRadius: 2,
                                    bgcolor: "#404147",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color: "white", fontWeight: "bold" }}>
                                            {exam.name}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color: "white", fontWeight: "bold" }}>
                                            {exam.fullMark}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))
                    }
                </List>
            }
        </Box>
    )
}

export default Exams