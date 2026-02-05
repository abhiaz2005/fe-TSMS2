import React, { useState } from 'react'
import { Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import { useForm } from 'react-hook-form'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const onSubmit = (data) => {
    setServerError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log(data)
      if (data.username === 'admin' && data.password === "1234") {
        alert("login successful");
      } else {
        setServerError("Invalid Credential");
      }
    }, 2000)
  }
  return (
    <Box sx={{

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#686262',
      height: '100vh'
    }}>
      <Paper
        elevation={8}
        sx={{
          px: 10,
          py: {
            xs: 5,
            md: 10
          },
          bgcolor: '#807e79',
          borderRadius: 6,
        }}>
        <Typography gutterBottom variant='h4' fontWeight={900} textAlign={'center'} color='#fff'>
          Log in
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} >
          <TextField
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d6d6d6',
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: 'white' },
                startAdornment: (
                  <InputAdornment position='start' sx={{ color: '#dbcbcb' }}>
                    <MailIcon />
                  </InputAdornment>
                )
              },
              inputLabel: {
                sx: {
                  color: 'white',
                  '&.Mui-focused': {
                    color: '#ffdddd',
                  },
                }
              }
            }}
            label='Email'
            fullWidth
            placeholder='Enter email'
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username", { required: "Username is required!!" })}
          />
          <TextField
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d6d6d6',
                },
              },
            }}
            slotProps={{
              input: {
                sx: { color: 'white' },
                startAdornment: (
                  <InputAdornment position='start' sx={{ color: '#dbcbcb' }}>
                    <LockIcon />
                  </InputAdornment>
                )
              },
              inputLabel: {
                sx: {
                  color: 'white',
                  '&.Mui-focused': {
                    color: '#ffdddd',
                  },
                }
              }
            }}
            label='Password'
            fullWidth
            placeholder='Enter password'
            type='password'
            error={!!errors.username}
            helperText={errors.password?.message}
            {...register("password", { required: "Password is required!!" })}
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
            {loading ? <CircularProgress sx={{ color: "white" }}  size={22} /> : "Log in"}
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
          Not a user?
          <Typography
            component="a"
            sx={{
              ml: 1,
              color: "#4da6ff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Register now
          </Typography>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Login