import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Input, List, ListItem, ListItemText, Link } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const TAssignment = () => {
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await fetch('https://backend-classroom.vercel.app/api/auth/getassignment', {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                    'auth': localStorage.getItem('classToken')
                }
            });
            const data = await res.json();
            setSubmittedAssignments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePostAssignment = async () => {
        const formData = new FormData();
        if (assignmentTitle.length === 0) {
            alert('Title cannot be blank');
            return;
        }
        formData.append('title', assignmentTitle);
        formData.append('file', assignmentFile);

        try {
            const res = await fetch('https://backend-classroom.vercel.app/api/auth/postassignment', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                    'auth': localStorage.getItem('classToken')
                },
                body: formData
            });
            if (res.ok) {
                fetchAssignments();
                alert('Assignment Posted Successfully');
            } else {
                alert('Failed to Post Assignment. Please try again!!!');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <Container sx={{ border: 'solid thick #FC6736', mt: 4, backgroundColor: 'lavenderblush' }}>
            <Typography variant="h2" component="div" sx={{ mt: 2, mb: 4 }}>
                Assignment
            </Typography>
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
                sx={{ mt: 2, mb: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handlePostAssignment}
                sx={{ mt: 2, mb: 4 }}
                endIcon={<SendIcon />}
            >
                Post Assignment
            </Button>
            <Typography variant="h4" component="div" sx={{ mt: 4, mb: 2 }}>
                Submitted Assignments
            </Typography>
            {submittedAssignments.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    No assignments assigned till now.
                </Typography>
            ) : (
                <List>
                    {submittedAssignments.map((assignment, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`Title: ${assignment.title}`}
                                secondary={
                                    assignment.file && (
                                        <Link href={`https://drive.google.com/uc?id=${assignment.file}`} target="_blank" rel="noopener noreferrer">
                                            {assignment.file}
                                        </Link>
                                    )
                                }
                            />
                            <List>
                                {assignment.students.map((student, i) => (
                                    <ListItem key={i}>
                                        <ListItemText
                                            primary={`Student: ${student.name}`}
                                            secondary={
                                                student.file && (
                                                    <Link href={`https://drive.google.com/uc?id=${student.file}`} target="_blank" rel="noopener noreferrer">
                                                        {student.file}
                                                    </Link>
                                                )
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default TAssignment;
