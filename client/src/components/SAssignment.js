import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Link as MuiLink } from '@mui/material';
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
                    'auth': localStorage.getItem('classToken')
                }
            });
            const data = await res.json();

            if (Array.isArray(data)) {
                setAssignments(data);
            } else {
                console.error("Fetched data is not an array:", data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenSubmit = (title) => {
        navigate(`/submit-assignment/${encodeURIComponent(title)}`);
    };

    return (
        <Container sx={{ border: 'solid thick #FC6736', mt: 4, backgroundColor: 'lavenderblush' }}>
            <Typography variant="h2" component="div" sx={{ mt: 2, mb: 4 }}>
                Assignments
            </Typography>
            {assignments.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    No assignments till now.
                </Typography>
            ) : (
                <List>
                    {assignments.map((assignment, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`Title: ${assignment.title}`}
                                secondary={
                                    <>
                                        Question -
                                        <MuiLink
                                            component={Link}
                                            to={`https://drive.google.com/uc?id=${assignment.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {assignment.file}
                                        </MuiLink>
                                        {assignment.studentFile ? (
                                            <div>
                                                Solution -
                                                <MuiLink
                                                    component={Link}
                                                    to={`https://drive.google.com/uc?id=${assignment.studentFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {assignment.studentFile}
                                                </MuiLink>
                                            </div>
                                        ) : (
                                            <Button style={{ marginLeft: '15em' }}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenSubmit(assignment.title)}
                                            >
                                                Submit Assignment
                                            </Button>
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default SAssignment;
