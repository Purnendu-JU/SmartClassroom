import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Input,
  Box,
  Stack,
  Paper,
} from '@mui/material';

const SubmitAssignment = () => {
  const { title } = useParams();
  const [assignmentFile, setAssignmentFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAssignmentFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!assignmentFile) {
      alert('Blank file cannot be submitted. Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', assignmentFile);

    try {
      const res = await fetch(
        'https://backend-classroom.vercel.app/api/auth/submitassignment',
        {
          method: 'POST',
          headers: {
            'auth-token': localStorage.getItem('token'),
            'auth': localStorage.getItem('classToken'),
          },
          body: formData,
        }
      );

      if (res.ok) {
        alert('Assignment Submitted Successfully');
        navigate('/sassignment', { replace: true });
      } else {
        alert('Failed to Submit Assignment. Please try again!');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 'bold',
          color: '#FC6736',
        }}
      >
        Submit Assignment
      </Typography>

      <Box
        sx={{
          backgroundColor: '#FFE4E1',
          borderRadius: '20px',
          padding: 4,
          boxShadow: 3,
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#333' }}
        >
          📄 {title}
        </Typography>

        <Stack spacing={3}>
          <Input
            fullWidth
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: 1,
              boxShadow: 1,
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#1976D2',
              ':hover': { backgroundColor: '#125ea6' },
              textTransform: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              paddingY: 1.2,
            }}
          >
            Submit Assignment
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SubmitAssignment;
