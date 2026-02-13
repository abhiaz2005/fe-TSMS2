import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import CakeIcon from "@mui/icons-material/Cake";
import BoyIcon from "@mui/icons-material/Boy";
import WomanIcon from '@mui/icons-material/Woman';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import VillaIcon from '@mui/icons-material/Villa';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { useForm } from "react-hook-form";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const payload = {
        name: data.name,
        email: data.email,
        // password: data.password,
        dob: data.dob,
        // age: null,

      };

      const res = await api.post("/auth/register", payload);

      console.log("SUCCESS:", res.data);
      if (res.data.responseCode === 200) {
        toast.success(res?.data?.responseDescription);
      } else {
        toast.error(res?.data?.responseDescription);
      }
    } catch (err) {
      console.log("ERROR FULL:", err);

      const errorMsg =
        err.response?.data?.message ||
        "Internal Server Error";

      console.log("ERROR MSG:", errorMsg);
      setServerError(errorMsg);
      toast.error("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#686262",
        height: "100vh",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          px: {
            md: 10,
            xs: 3,
          },
          py: {
            xs: 5,
            md: 10,
          },
          bgcolor: "#807e79",
          borderRadius: 6,
        }}
      >
        <Typography
          gutterBottom
          variant="h4"
          fontWeight={900}
          textAlign={"center"}
          color="#fff"
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <PersonIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Name"
            fullWidth
            placeholder="Enter name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", { required: "Name is required!!" })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <MailIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Email"
            type="email"
            fullWidth
            placeholder="Enter email"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("email", { required: "Email is required!!" })}
          />

          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <CallIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Phone number"
            fullWidth
            type="number"
            placeholder="Enter phone number"
            error={!!errors.phoneno}
            helperText={errors.phoneno?.message}
            {...register("phoneno", { required: "Phone Number is required!!" })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <CakeIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Date Of Birth"
            fullWidth
            type="date"
            placeholder="Enter Date of birth"
            error={!!errors.dob}
            helperText={errors.dob?.message}
            {...register("dob", {
              required: "Date of birth is required!!",
              valueAsDate: false, // ⭐ IMPORTANT
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <BoyIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Father's name"
            fullWidth
            placeholder="Enter Father's name"
            error={!!errors.fatherName}
            helperText={errors.fatherName?.message}
            {...register("fatherName", {
              required: "father Name is required!!"
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <WomanIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Mother's name"
            fullWidth
            placeholder="Enter Mother's name"
            error={!!errors.fatherName}
            helperText={errors.fatherName?.message}
            {...register("motherName", {
              required: "Mother Name is required!!"
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <WomanIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Mother's name"
            fullWidth
            placeholder="Enter Mother's name"
            error={!!errors.fatherName}
            helperText={errors.fatherName?.message}
            {...register("motherName", {
              required: "Mother Name is required!!"
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <MenuBookIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Studied From"
            fullWidth
            type="date"
            placeholder="Enter studied from"
            error={!!errors.studiedFrom}
            helperText={errors.studiedFrom?.message}
            {...register("studiedFrom", {
              required: "Studied from is required!!",
              valueAsDate: false,
            })}
          />
          {/* Address section */}
          <Typography color="white" variant="h6">
            Address
          </Typography>
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <VillaIcon/>
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="State"
            fullWidth
            placeholder="Enter state "
            error={!!errors.state}
            helperText={errors.state?.message}
            {...register("state", {
              required: "State is required!!"
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <HomeFilled />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="City"
            fullWidth
            placeholder="Enter city "
            error={!!errors.city}
            helperText={errors.city?.message}
            {...register("city", {
              required: "City is required!!"
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <PersonPinCircleIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Pincode"
            fullWidth
            placeholder="Enter pincode "
            error={!!errors.pincode}
            helperText={errors.pincode?.message}
            type="number"
            {...register("pincode", {
              required: "Pincode is required!!"
            })}
          />
          <TextField
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d6d6d6",
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: "white" },
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#dbcbcb" }}>
                    <StreetviewIcon />
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: {
                  color: "white",
                  "&.Mui-focused": {
                    color: "#ffdddd",
                  },
                },
              },
            }}
            label="Street"
            fullWidth
            placeholder="Enter street "
            error={!!errors.street}
            helperText={errors.street?.message}
            {...register("street", {
              required: "Street is required!!"
            })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: "#ff5c5c",
              borderRadius: 3,
              fontWeight: 800,
              "&:hover": {
                bgcolor: "#ff3b3b",
              },
            }}
          > 
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size={22} />
            ) : (
              "Register"
            )}
          </Button>
        </form>
        {serverError && (
          <Typography
            color="#ff3b3b"
            textAlign="center"
            sx={{ my: 2, fontWeight: 600 }}
          >
            {serverError}
          </Typography>
        )}
        <Typography
          textAlign="center"
          sx={{ mt: 3 }}
          color="#ccc"
          fontSize={14}
        >
          Already a user?
          <Typography
            component={Link}
            to={'/login'}
            sx={{
              ml: 1,
              color: "#4da6ff",
              fontWeight: 600,
              cursor: "pointer",
              fontStyle: 'none',
              textDecoration: 'none'
            }}
          >
            Login now
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterForm;
