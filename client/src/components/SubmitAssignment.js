import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Input } from '@mui/material';

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
            const res = await fetch('https://backend-classroom.vercel.app/api/auth/submitassignment', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                    'auth': localStorage.getItem('classToken')
                },
                body: formData
            });

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
        <Container>
            <Typography variant="h4" component="div" sx={{ mt: 2, mb: 4 }}>
                Submit Assignment: {title}
            </Typography>
            <Input
                fullWidth
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                sx={{ mt: 2, mb: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2, mb: 4 }}
            >
                Submit Assignment
            </Button>
        </Container>
    );
};

export default SubmitAssignment;
