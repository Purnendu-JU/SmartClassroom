import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Grid, Box, Avatar, Stack, Paper
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate, useParams } from 'react-router-dom';
// import Nav from './Nav';

const InsideClass = () => {
  const { classname, subjectname } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [className, setClassName] = useState('');

  useEffect(() => {
    const fetchRoleAndClass = async () => {
      try {
        const token = localStorage.getItem('token');
        const resClass = await fetch('https://backend-classroom.vercel.app/api/auth/getclass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({ Cname: classname, Sname: subjectname })
        });

        const json = await resClass.json();

        if (resClass.ok && json.success) {
          localStorage.setItem('classToken', json.auth);
          setClassName(json.name);
        } else {
          alert(json.error || "Invalid class details");
          return;
        }

        const classToken = localStorage.getItem('classToken');
        const resRole = await fetch('https://backend-classroom.vercel.app/api/auth/getrole', {
          method: 'GET',
          headers: {
            'auth-token': token,
            'auth': classToken
          },
        });

        const roleData = await resRole.json();
        if (resRole.ok) {
          setRole(roleData.role);
        }
      } catch (err) {
        console.error('Error fetching role/class:', err);
      }
    };

    fetchRoleAndClass();
  }, [classname, subjectname]);

  const handleNavigation = (path) => {
    if (path === 'assignment') {
      navigate(role === 'teacher' ? '/tassignment' : '/sassignment');
    } else if (path === 'attendance') {
      navigate(role === 'teacher' ? '/tattendance' : '/sattendance');
    } else {
      navigate(`/${path}`);
    }
  };

  const cards = [
    {
      title: 'Assignments',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'white' }} />,
      bgColor: '#42a5f5',
      action: () => handleNavigation('assignment'),
    },
    {
      title: 'Attendance',
      icon: <EventAvailableIcon sx={{ fontSize: 40, color: 'white' }} />,
      bgColor: '#ab47bc',
      action: () => handleNavigation('attendance'),
    },
    {
      title: 'Announcements',
      icon: <AnnouncementIcon sx={{ fontSize: 40, color: 'white' }} />,
      bgColor: '#66bb6a',
      action: () => navigate('/announcement'),
    },
    {
      title: 'Community',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'white' }} />,
      bgColor: '#ffa726',
      action: () => navigate('/community'),
    }
  ];

  return (
    <>
      {/* <Nav className={className} /> */}

      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        {/* Class Header */}
        <Card
          sx={{
            backgroundColor: '#FC6736',
            color: 'white',
            mb: 4,
            borderRadius: 3,
            boxShadow: 4,
            p: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'white', color: '#FC6736', fontWeight: 'bold' }}>
              {className?.[0] || '?'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {className || 'Loading...'}
              </Typography>
              <Typography variant="subtitle1">{subjectname}</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Light Box for All Cards */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            backgroundColor: 'rgba(243, 195, 195, 0.9)', // translucent over image
            borderRadius: 3,
            backdropFilter: 'blur(3px)',
            boxShadow: 6,
          }}
        >
          <Grid container spacing={4}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  onClick={card.action}
                  sx={{
                    backgroundColor: card.bgColor,
                    color: 'white',
                    p: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 8,
                    },
                  }}
                >
                  {card.icon}
                  <Typography variant="h6" fontWeight="600" mt={2}>
                    {card.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default InsideClass;
