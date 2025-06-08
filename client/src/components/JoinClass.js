import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JoinClass = () => {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleJoinClass = async () => {
    setError(null);
    try {
      if (classCode.length !== 6) {
        throw new Error('Please enter a 6-digit class code.');
      }

      const response = await fetch('https://backend-classroom.vercel.app/api/auth/joinclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ code: classCode }),
      });

      const json = await response.json();
      localStorage.setItem('classToken', json.auth);

      if (!response.ok) {
        throw new Error(json.error || 'An unexpected error occurred.');
      }

      navigate('/landing', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, mt: 10, borderRadius: 3, backgroundColor: 'lavenderblush' }}>
        <Typography variant="h4" gutterBottom align="center" color="#FC6736" fontWeight="bold">
          Join a Class
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Ask your teacher for the 6-digit class code.
        </Typography>

        <TextField
          fullWidth
          label="Class Code"
          variant="outlined"
          margin="normal"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          error={!!error}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinClass}
            sx={{ mt: 3, px: 5 }}
          >
            Join Class
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JoinClass;
