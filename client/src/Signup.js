import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import {Link, useNavigate} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const theme = createTheme();

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { firstName, lastName, email, password, confirmPassword} = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      alert('Password and confirm password not same');
      return;
    }
    const response = await fetch('https://backend-classroom.vercel.app/api/auth/signup', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({fname: firstName, lname: lastName, email: email, password: password})
    });
    const json = await response.json();
    if(json.success){
      localStorage.setItem('token', json.authtoken);
      // window.location.href = '/landing';
      navigate('/landing', { replace: true });
    }
    else{
      alert("Invalid input");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 'solid thick #FC6736',
            borderRadius: '2%',
            opacity: '90%',
            backgroundColor: 'lavenderblush'
          }}
        >
          <Avatar sx={{ mt: 2, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form onSubmit={onSubmit} method="post" action="/signup">
            <Box sx={{ mt: 1, mr: 2, ml: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstName}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControl fullWidth >
                    <InputLabel id="role-label"></InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={role}
                      onChange={onChange}
                    >
                      <MenuItem value="teacher">Teacher</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign up
              </Button>
              <Grid container sx={{ mb: '10px' }}>
              <Grid item xs>
                <Link to="/" variant="body2">
                  <ArrowBackIcon/>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
