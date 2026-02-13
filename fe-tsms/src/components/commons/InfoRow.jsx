import { Box, Typography } from '@mui/material';
import React from 'react'

const InfoRow = ({ label, value }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #555",
            pb: 1,
            mx:{
                md:3
            }
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

export default InfoRow