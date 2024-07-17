import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, TextField, List, ListItem, ListItemText } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TAttendance = () => {
  const [attendanceCode, setAttendanceCode] = useState('');
  const [codeToDisable, setCodeToDisable] = useState('');
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const res = await fetch('https://backend-classroom.vercel.app/api/auth/getattendance', {
        method: 'GET',
        headers: {
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken')
        }
      });
      const data = await res.json();
      setAttendanceRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const res = await fetch('https://backend-classroom.vercel.app/api/auth/generateattendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken')
        }
      });
      const data = await res.json();
      setAttendanceCode(data.code);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisableCode = async () => {
    setError('');
    if (codeToDisable.length !== 6) {
      setError('Code must be exactly 6 characters long.');
      return;
    }

    try {
      const res = await fetch('https://backend-classroom.vercel.app/api/auth/disablecode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken')
        },
        body: JSON.stringify({ code: codeToDisable })
      });

      if (res.status === 400) {
        const data = await res.json();
        setError(data.errors[0].msg);
      } else if (res.status === 404) {
        setError('Attendance record not found');
      } else if (!res.ok) {
        setError('An unexpected error occurred. Please try again.');
      } else {
        setCodeToDisable('');
        setAttendanceCode('');
        alert('Disabled Successfully');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Container sx={{ border: 'solid thick #FC6736', mt: 4, backgroundColor: 'lavenderblush' }}>
      <Typography variant="h2" component="div" sx={{ mt: 2, mb: 4 }}>
        Attendance
      </Typography>
      {attendanceCode && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Generated Attendance Code: {attendanceCode}
        </Typography>
      )}
      <Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateCode}
          sx={{ mt: 2, mb: 4 }}
          startIcon={<AssignmentIcon />}
        >
          Generate Code
        </Button>
      </Grid>
      <TextField
        fullWidth
        required
        label="Code to Disable"
        variant="outlined"
        margin="normal"
        value={codeToDisable}
        onChange={(e) => setCodeToDisable(e.target.value)}
      />
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDisableCode}
          sx={{ mb: 2 }}
        >
          Disable Code
        </Button>
      </Grid>
      <Typography variant="h4" component="div" sx={{ mt: 4, mb: 2 }}>
        Attendance Records
      </Typography>
      {attendanceRecords.length === 0 ? (
        <Typography variant='body1' sx = {{mt:2}}>
          No attendance taken till now.
        </Typography>
      ) : (
        <List>
        {attendanceRecords.map((record, index) => (
          <ListItem key={index} sx={{ mb: 2 }}>
            <ListItemText
              primary={`Date: ${new Date(record.date).toLocaleDateString()}`}
              secondary={`Students: ${record.students.join(', ')}`}
            />
          </ListItem>
        ))}
      </List>
      )}
    </Container>
  );
};

export default TAttendance;
