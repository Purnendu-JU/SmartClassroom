import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

const SAttendance = () => {
  const [attendanceCode, setAttendanceCode] = useState('');
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const navigate = useNavigate();

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      if (attendanceCode.length !== 6) {
        throw new Error('Enter correct code');
      }

      const res = await fetch(
        'https://backend-classroom.vercel.app/api/auth/markattendance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            auth: localStorage.getItem('classToken'),
          },
          body: JSON.stringify({ code: attendanceCode }),
        }
      );

      if (res.ok) {
        setIsAttendanceMarked(true);
        alert('Marked');
        navigate('/landing', { replace: true });
      } else if (res.status === 401) {
        alert('Incorrect attendance code. Please try again.');
      } else if (res.status === 400) {
        alert('Already marked');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 10 }}>
      <Box
        sx={{
          backgroundColor: '#FFF0F5',
          borderRadius: '20px',
          padding: 5,
          boxShadow: 4,
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
            color: '#FC6736',
          }}
        >
          🎯 Mark Your Attendance
        </Typography>

        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: '16px',
            backgroundColor: '#FAFAFA',
            textAlign: 'center',
          }}
        >
          {isAttendanceMarked ? (
            <Typography
              variant="h6"
              sx={{ color: '#388E3C', fontWeight: 'bold' }}
            >
              ✅ Attendance marked for today.
            </Typography>
          ) : (
            <>
              <TextField
                fullWidth
                label="Enter Attendance Code"
                variant="outlined"
                margin="normal"
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                }}
              />

              <Stack direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMarkAttendance}
                  startIcon={<CheckIcon />}
                  sx={{
                    mt: 2,
                    backgroundColor: '#1976D2',
                    ':hover': { backgroundColor: '#125ea6' },
                    textTransform: 'none',
                    borderRadius: '12px',
                    paddingX: 3,
                    paddingY: 1.2,
                    fontSize: '16px',
                  }}
                >
                  Mark Attendance
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default SAttendance;
