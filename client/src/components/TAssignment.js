import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Input,
  Card,
  CardContent,
  CardActions,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const TAssignment = () => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dialogTitle, setDialogTitle] = useState('');
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
      setSubmittedAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAssignment = async () => {
    if (assignmentTitle.length === 0) {
      alert('Title cannot be blank');
      return;
    }

    const formData = new FormData();
    formData.append('title', assignmentTitle);
    formData.append('file', assignmentFile);

    try {
      const res = await fetch('https://backend-classroom.vercel.app/api/auth/postassignment', {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken'),
        },
        body: formData,
      });

      if (res.ok) {
        fetchAssignments();
        setOpenDialog(false);
        setAssignmentTitle('');
        setAssignmentFile(null);
        alert('Assignment Posted Successfully');
      } else {
        alert('Failed to Post Assignment. Please try again!!!');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedStudents(assignment.students);
    setDialogTitle(assignment.title);
    setViewDialogOpen(true);
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
        {submittedAssignments.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            No assignments assigned till now.
          </Typography>
        ) : (
          submittedAssignments.map((assignment, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: '#FFF0F5',
                mb: 3,
                borderRadius: '16px',
                boxShadow: 4,
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Title: {assignment.title}
                </Typography>
                {assignment.file && (
                  <Typography sx={{ mt: 1 }}>
                    File:{' '}
                    <Link
                      href={`https://drive.google.com/uc?id=${assignment.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {assignment.file}
                    </Link>
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#1976D2',
                    ':hover': { backgroundColor: '#125ea6' },
                    textTransform: 'none',
                    borderRadius: '16px',
                  }}
                  onClick={() => handleViewSubmissions(assignment)}
                >
                  View Student Submissions
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 30, right: 30, backgroundColor: '#1976D2' }}
        onClick={() => setOpenDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialog for Posting Assignment */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Post New Assignment</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Assignment Title"
            variant="outlined"
            margin="normal"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          <Input
            fullWidth
            type="file"
            accept=".pdf"
            onChange={(e) => setAssignmentFile(e.target.files[0])}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handlePostAssignment}
            endIcon={<SendIcon />}
            sx={{
              backgroundColor: '#1976D2',
              ':hover': { backgroundColor: '#125ea6' },
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Post Assignment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Viewing Student Submissions */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Submissions for "{dialogTitle}"</DialogTitle>
        <DialogContent dividers>
          {selectedStudents.length === 0 ? (
            <Typography>No submissions yet.</Typography>
          ) : (
            <Box>
              {selectedStudents.map((student, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                  p={1}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {student.name}
                  </Typography>
                  <Link
                    href={`https://drive.google.com/uc?id=${student.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    View File
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TAssignment;
