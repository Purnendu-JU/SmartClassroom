import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Link, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom'

const SAttendance = () => {
  const [attendanceCode, setAttendanceCode] = useState('');
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const navigate = useNavigate();
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      if(attendanceCode.length !== 6){
        throw new Error('Enter correct code');
      }
      const res = await fetch('https://backend-classroom.vercel.app/api/auth/markattendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken')
        },
        body: JSON.stringify({ code: attendanceCode })
      });
      if (res.ok) {
        setIsAttendanceMarked(true);
        alert('Marked');
        // window.location.href = '/insideclass';
        navigate('/insideclass', { replace: true });
      } 
      else if(res.status === 401){
        alert('Incorrect attendance code. Please try again.');
      }
      if(res.status === 400){
        alert('Already marked');
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Container sx={{border:'solid thick #FC6736',mt:4, backgroundColor:'lavenderblush'}}>
      <Typography variant="h2" component="div" sx={{ mt: 2, mb: 4 }}>
        Attendance
      </Typography>
      {isAttendanceMarked ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Attendance marked for today.
        </Typography>
      ) : (
        <>
          <TextField
            fullWidth
            label="Attendance Code"
            variant="outlined"
            margin="normal"
            value={attendanceCode}
            onChange={(e) => setAttendanceCode(e.target.value)}
          />
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMarkAttendance}
              sx={{ mt: 2 ,mb:4}}
              startIcon={<CheckIcon />}
            >
              Mark Attendance
            </Button>
          </Grid>
          {/* <Grid sx={{mb:2}}>
            <Link href='/landing' >
              <ArrowBackIcon/>
            </Link>
          </Grid> */}
        </>
      )}
    </Container>
  );
};

export default SAttendance;
