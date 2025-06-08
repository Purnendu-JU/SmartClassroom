import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Link as MuiLink,
  Stack,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const SAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('https://backend-classroom.vercel.app/api/auth/getassignment', {
        method: 'GET',
        headers: {
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken'),
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenSubmit = (title) => {
    navigate(`/submit-assignment/${encodeURIComponent(title)}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          mb: 3,
          fontWeight: 'bold',
          color: '#FC6736',
        }}
      >
        Assignments
      </Typography>

      <Box
        sx={{
          backgroundColor: '#FFE4E1',
          borderRadius: '20px',
          padding: 4,
          boxShadow: 3,
        }}
      >
        {assignments.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            No assignments till now.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
            <Stack spacing={3}>
              {assignments.map((assignment, index) => (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: '#FFF0F5',
                    borderRadius: '16px',
                    boxShadow: 4,
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                      📌 {assignment.title}
                    </Typography>

                    {assignment.file && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Question:{' '}
                        <MuiLink
                          href={`https://drive.google.com/uc?id=${assignment.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ color: '#1976D2', fontWeight: 500 }}
                        >
                          {assignment.file}
                        </MuiLink>
                      </Typography>
                    )}

                    {assignment.studentFile ? (
                      <Typography variant="body1">
                        ✅ Submitted File:{' '}
                        <MuiLink
                          href={`https://drive.google.com/uc?id=${assignment.studentFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ color: '#388E3C', fontWeight: 500 }}
                        >
                          {assignment.studentFile}
                        </MuiLink>
                      </Typography>
                    ) : (
                      <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#1976D2',
                            ':hover': { backgroundColor: '#125ea6' },
                            textTransform: 'none',
                            borderRadius: '16px',
                          }}
                          onClick={() => handleOpenSubmit(assignment.title)}
                        >
                          Submit Assignment
                        </Button>
                      </CardActions>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SAssignment;
