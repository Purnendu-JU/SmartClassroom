import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JoinClass = () => {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleJoinClass = async () => {
    setError(null);
    try {
      if(classCode.length !== 6){
        throw new Error('Please Enter correct code');
      }
      const response = await fetch('https://backend-classroom.vercel.app/api/auth/joinclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ code: classCode })
      });
      const json = await response.json();
      localStorage.setItem('classToken', json.auth);
      if (!response.ok) {
        throw new Error(json.error || 'An error occurred');
      }

      alert(`Joining class with code: ${classCode}`);
      // window.location.href = "/landing"
      navigate('/landing', { replace: true });
    } catch (error) {
      console.error('Error joining class:', error);
      setError(error.message);
    }
  };

  return (
    <Container sx={{ border: 'solid thick #FC6736', borderRadius: '1%', marginTop: '70px', backgroundColor: 'lavenderblush' }}>
      <Typography variant="h2" component="div" sx={{ mt: 2, mb: 4 }}>
        Join a Class
      </Typography>
      <Typography variant="h5" component="div" sx={{ mt: 2, mb: 4 }}>
        Ask your teacher for the class code
      </Typography>
      <TextField
        fullWidth
        label="Class Code (required)"
        variant="outlined"
        margin="normal"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
      />
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleJoinClass}
        sx={{ mt: 2, marginBottom: '20px' }}
      >
        Join Class
      </Button>
    </Container>
  );
};

export default JoinClass;
