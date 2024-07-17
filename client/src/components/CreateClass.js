import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState(null); // To handle API errors
  const [validationErrors, setValidationErrors] = useState({}); // To handle backend validation errors
  const handleCreateClass = async () => {
    setError(null); // Clear previous API errors
    setValidationErrors({}); // Clear previous backend validation errors
      try {
        if (className.length < 3) {
          throw new Error('Enter a proper class name');
        }
        else if(subjectName.length < 5){
          throw new Error('Enter a proper subject name');
        }
        const response = await fetch('https://backend-classroom.vercel.app/api/auth/createclass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ Cname: className, Sname: subjectName })
        });

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            setValidationErrors(errorData.errors || {}); // Handle potential error structure changes
          } else {
            throw new Error(`Error creating class: ${response.statusText}`);
          }
        } 
        else {
          const json = await response.json();
          localStorage.setItem('classToken', json.auth);
          setClassCode(json.ccode); // Assuming ccode is returned in the response (update if different)
        }
      } catch (error) {
        console.error('Error creating class:', error);
        setError(error.message); // Display a user-friendly error message
      }
  };

  const handleCloseAlert = () => {
    setError(null); // Clear the error state on closing the alert
  };

  return (
    <Container sx={{ border: 'solid thick #FC6736', borderRadius: '1%', marginTop: '70px', backgroundColor: 'lavenderblush' }}>
      <Typography variant="h4" component="div" sx={{ mt: 2, mb: 4 }}>
        Create Class
      </Typography>

      <TextField
        fullWidth
        label="Class Name (required)"
        variant="outlined"
        margin="normal"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        error={!!validationErrors.Cname}
        helperText={validationErrors.Cname || 'Class name must be at least 3 characters long'} // Display default or backend error message
      />

      <TextField
        fullWidth
        label="Subject Name (required)"
        variant="outlined"
        margin="normal"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        error={!!validationErrors.Sname}
        helperText={validationErrors.Sname || 'Subject name must be at least 5 characters long'} // Display default or backend error message
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateClass}
        sx={{ mt: 2, marginBottom: '20px' }}
        disabled={Object.keys(validationErrors).length > 0} // Disable button if there are validation errors
      >
        Create Class
      </Button>
      

      {error && (
        <Alert severity="error" onClose={handleCloseAlert}>
          {error}
        </Alert>
      )}

      {validationErrors.Cname || validationErrors.Sname ? (
        <Alert severity="warning">
          {/* Display specific validation errors if available */}
          {validationErrors.Cname && <p>Class name: {validationErrors.Cname}</p>}
          {validationErrors.Sname && <p>Subject name: {validationErrors.Sname}</p>}
          <p>Please fix the errors before creating the class.</p>
        </Alert>
      ) : null}

      {classCode && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Class Code: {classCode}
        </Typography>
      )}
    </Container>
  );
};

export default CreateClass;
