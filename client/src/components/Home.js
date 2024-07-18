import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Grid, Avatar } from '@mui/material';
import { Link } from "react-router-dom";

const Home = () => {
  const [classesData, setClassesData] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('https://backend-classroom.vercel.app/api/auth/landing', {
          headers: {
            'auth-token': localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const allClasses = [...data.createdClasses, ...data.enrolledClasses];
        setClassesData(allClasses);
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="div" sx={{ mt: 2, mb: 4 }}>
        My Classes
      </Typography>
      <Grid container spacing={3}>
        {classesData.map((classInfo) => (
          <Grid item key={classInfo._id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ border: 'solid black', boxShadow: 5, backgroundColor: 'lavender', borderRadius: '8%' }}>
              <Avatar sx={{ width: 90, height: 90, margin: '0 auto', border: 'solid black', color: 'lavenderblush', marginTop: 8 }}>
                {classInfo.Cname.charAt(0)}
              </Avatar>
              <CardContent sx={{ height: '150px', width: '250px' }}>
                <Typography variant="h4" gutterBottom>
                  {classInfo.Cname}
                </Typography>
                <Typography color="textSecondary">Subject: {classInfo.Sname}</Typography>
                <Typography color="textSecondary">Teacher: {`${classInfo.user.fname} ${classInfo.user.lname}`}</Typography>
              </CardContent>
              <Button variant="contained" color="primary" fullWidth>
                <Link to={`/insideclass/${classInfo.Cname}/${classInfo.Sname}`} style={{ textDecoration: 'none', color: 'white' }}>Enter Class</Link>
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
