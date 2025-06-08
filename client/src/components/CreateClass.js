import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert, Paper, Box } from '@mui/material';

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateClass = async () => {
    setError(null);
    setValidationErrors({});

    try {
      if (className.length < 3) {
        throw new Error('Class name must be at least 3 characters.');
      } else if (subjectName.length < 5) {
        throw new Error('Subject name must be at least 5 characters.');
      }

      const response = await fetch('https://backend-classroom.vercel.app/api/auth/createclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ Cname: className, Sname: subjectName }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setValidationErrors(errorData.errors || {});
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
      } else {
        const json = await response.json();
        localStorage.setItem('classToken', json.auth);
        setClassCode(json.ccode);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, mt: 10, borderRadius: 3, backgroundColor: 'lavenderblush' }}>
        <Typography variant="h4" align="center" gutterBottom color="#FC6736" fontWeight="bold">
          Create a Class
        </Typography>

        <TextField
          fullWidth
          label="Class Name"
          variant="outlined"
          margin="normal"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          error={!!validationErrors.Cname}
          helperText={validationErrors.Cname || 'Minimum 3 characters required'}
        />

        <TextField
          fullWidth
          label="Subject Name"
          variant="outlined"
          margin="normal"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          error={!!validationErrors.Sname}
          helperText={validationErrors.Sname || 'Minimum 5 characters required'}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please fix the above validation issues before submitting.
          </Alert>
        )}

        {classCode && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Class created successfully! Your class code is: <strong>{classCode}</strong>
          </Alert>
        )}

        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClass}
            sx={{ mt: 3, px: 5 }}
          >
            Create Class
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateClass;
