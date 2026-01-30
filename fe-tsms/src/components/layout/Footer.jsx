import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationPinIcon from "@mui/icons-material/LocationPin";

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          bgcolor: "#1A1A19",
          color: "white",
          p: 1,
          mb: 0,
        }}
      >
        <Box
          sx={{
            my: 3,
            "& svg": {
              fontSize: "60px",
              cursor: "pointer",
              mr: 2,
            },
            "& svg:hover": {
              color: "goldenrod",
              transform: "translateX(5px)",
              transition: "all 400ms",
            },
            "@media (max-width:600px)": {
              "& svg": {
                fontSize: "2rem",
              },
            },
          }}
        >
          <IconButton
            component="a"
            href="https://wa.me/917873087322?text=Hi%20%21%21%0AI%20want%20to%20contact%20Genius%20Guidelines%20%E2%88%86"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color:'white'
            }}
          >
            <WhatsAppIcon />
          </IconButton>
          <IconButton
            component="a"
            href="https://maps.app.goo.gl/ftT7ZSmbv6s6tocSA"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color:'white'
            }}
          >
            <LocationPinIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          sx={{
            "@media (max-width:600px)": {
              fontSize: "0.8rem",
            },
          }}
        >
          All rights reserved &copy; <i>Genius Guidelines</i>
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
