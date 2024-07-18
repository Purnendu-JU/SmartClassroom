import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Nav from './Nav';

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
  
        if (resClass.status === 200 && json.success) {
          localStorage.removeItem('classToken');
          localStorage.setItem('classToken', json.auth);
          setClassName(json.name);
        } else {
          console.error('Error in getClass:', json.error);
          alert(json.error || "Invalid credentials");
          return;
        }
  
        const classToken = localStorage.getItem('classToken');
        if (token && classToken) {
          const resRole = await fetch('https://backend-classroom.vercel.app/api/auth/getrole', {
            method: 'GET',
            headers: {
              'auth-token': token,
              'auth': classToken
            },
          });
          const roleData = await resRole.json();
  
          if (resRole.status === 200) {
            setRole(roleData.role);
          } else {
            console.error('Error in getRole:', roleData.error);
          }
        }
      } catch (err) {
        console.error('Error in fetchRoleAndClass:', err);
      }
    };
  
    fetchRoleAndClass();
  }, [classname, subjectname]);
  
  

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
