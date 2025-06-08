import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DisableIcon from '@mui/icons-material/Block';

const TAttendance = () => {
  const [attendanceCode, setAttendanceCode] = useState('');
  const [codeToDisable, setCodeToDisable] = useState('');
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const res = await fetch(
        'https://backend-classroom.vercel.app/api/auth/getattendance',
        {
          method: 'GET',
          headers: {
            'auth-token': localStorage.getItem('token'),
            auth: localStorage.getItem('classToken'),
          },
        }
      );
      const data = await res.json();
      setAttendanceRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const res = await fetch(
        'https://backend-classroom.vercel.app/api/auth/generateattendance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            auth: localStorage.getItem('classToken'),
          },
        }
      );
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
      const res = await fetch(
        'https://backend-classroom.vercel.app/api/auth/disablecode',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            auth: localStorage.getItem('classToken'),
          },
          body: JSON.stringify({ code: codeToDisable }),
        }
      );

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

  const openDialog = (index) => {
    setSelectedRecordIndex(index);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedRecordIndex(null);
  };

  return (
    <Container sx={{ mt: 6, mb: 10 }}>
      <Box
        sx={{
          backgroundColor: '#FFF0F5',
          borderRadius: '20px',
          padding: 5,
          boxShadow: 4,
          maxWidth: '800px',
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
          📋 Attendance Panel
        </Typography>

        {attendanceCode && (
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              mb: 3,
              textAlign: 'center',
              backgroundColor: '#E0F7FA',
              borderRadius: '12px',
              fontSize: '18px',
            }}
          >
            Generated Attendance Code: <strong>{attendanceCode}</strong>
          </Paper>
        )}

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleGenerateCode}
            startIcon={<AssignmentIcon />}
            sx={{
              backgroundColor: '#1976D2',
              ':hover': { backgroundColor: '#125ea6' },
              textTransform: 'none',
              borderRadius: '12px',
              paddingX: 3,
              paddingY: 1.2,
              fontSize: '16px',
            }}
          >
            Generate Code
          </Button>
        </Stack>

        <TextField
          fullWidth
          required
          label="Code to Disable"
          variant="outlined"
          margin="normal"
          value={codeToDisable}
          onChange={(e) => setCodeToDisable(e.target.value)}
          sx={{ mt: 4, backgroundColor: '#fff', borderRadius: '10px' }}
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleDisableCode}
            startIcon={<DisableIcon />}
            sx={{
              backgroundColor: '#D32F2F',
              ':hover': { backgroundColor: '#B71C1C' },
              textTransform: 'none',
              borderRadius: '12px',
              paddingX: 3,
              paddingY: 1.2,
              fontSize: '16px',
              mt: 1,
            }}
          >
            Disable Code
          </Button>
        </Stack>

        <Typography
          variant="h4"
          sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: '#444' }}
        >
          📅 Attendance Records
        </Typography>

        {attendanceRecords.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No attendance taken till now.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {attendanceRecords.map((record, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: '#FAFAFA',
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: '#333' }}
                  >
                    📅 Date: {new Date(record.date).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openDialog(index)}
                    sx={{ borderRadius: '12px', textTransform: 'none' }}
                  >
                    Show Attendance
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}

        {/* Dialog for showing attendance list */}
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            Attendance on{' '}
            {selectedRecordIndex !== null &&
              new Date(attendanceRecords[selectedRecordIndex].date).toLocaleDateString()}
          </DialogTitle>
          <DialogContent dividers>
            <List>
              {selectedRecordIndex !== null &&
              attendanceRecords[selectedRecordIndex].students.length > 0 ? (
                attendanceRecords[selectedRecordIndex].students.map((student, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText
                      primary={<Typography sx={{ color: '#333' }}>{student}</Typography>}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ mt: 1, color: '#777', fontStyle: 'italic' }}>
                  No students present.
                </Typography>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TAttendance;
