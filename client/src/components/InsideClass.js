import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const InsideClass = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [className, setClassName] = useState('');
  useEffect(() => {
    const fetchRoleAndClass = async () => {
      try {
        const token = localStorage.getItem('token');
        const classToken = localStorage.getItem('classToken');
        if (token && classToken) {
          const resRole = await fetch('https://backend-classroom.vercel.app/api/auth/getrole', {
            headers: {
              'auth-token': token,
              'auth': classToken
            },
          });
          const roleData = await resRole.json();
          setRole(roleData.role);

          const resClass = await fetch('https://backend-classroom.vercel.app/api/auth/getclass', {
            headers: {
              'auth': classToken
            },
          });
          const classData = await resClass.json();
          setClassName(classData.Cname);
        }
      } 
      catch (err) {
        console.error(err);
      }
    };

    fetchRoleAndClass();
  }, []);

  const handleNavigation = (path) => {
    if (role === 'teacher') {
      if (path === 'assignment') navigate('/tassignment');
      if (path === 'attendance') navigate('/tattendance');
    } else {
      if (path === 'assignment') navigate('/sassignment');
      if (path === 'attendance') navigate('/sattendance');
    }
  };

  return (
    <>
      <Nav className={className} />
      <Container sx={{ border: 'solid thick #FC6736', mt: 4, backgroundColor: 'lavenderblush' }}>
        <Typography variant="h3" component="div" sx={{ mt: 2, mb: 4 }}>
          Inside Class
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ backgroundColor: 'greenyellow', border: 'solid black', cursor: 'pointer' }}
              onClick={() => handleNavigation('assignment')}
            >
              <CardContent>
                <AssignmentIcon sx={{ fontSize: 40, color: 'blue' }} />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Assignments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{ backgroundColor: 'greenyellow', border: 'solid black', cursor: 'pointer' }}
              onClick={() => navigate('/announcement')}
            >
              <CardContent>
                <AnnouncementIcon sx={{ fontSize: 40, color: 'green' }} />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Announcements
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{ backgroundColor: 'greenyellow', border: 'solid black', cursor: 'pointer' }}
              onClick={() => navigate('/community')}
            >
              <CardContent>
                <PeopleIcon sx={{ fontSize: 40, color: 'orange' }} />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Community
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{ mb: 4, backgroundColor: 'greenyellow', border: 'solid black', cursor: 'pointer' }}
              onClick={() => handleNavigation('attendance')}
            >
              <CardContent>
                <EventAvailableIcon sx={{ fontSize: 40, color: 'purple' }} />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Attendance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default InsideClass;
