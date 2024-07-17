import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Landing from './LandingPage';
import Login from './LoginPage.js';
import SignUp from './Signup.js';
import Navbar from './components/Navbar.js';
import SwipeableTemporaryDrawer from './components/Sidebar.js';
import SAttendance from './components/SAttendance.js';
import TAttendance from './components/TAttendance.js';
import Community from './components/Community.js';
import Chatbot from './components/Chatbot.js';
import Home from './components/Home.js';
import TAssignment from './components/TAssignment.js';
import SAssignment from './components/SAssignment.js';
import SubmitAssignment from './components/SubmitAssignment'; // Import SubmitAssignment
import AnnouncementSection from './components/Announcement.js';
import InsideClass from './components/InsideClass.js';
import JoinClass from './components/JoinClass.js';
import CreateClass from './components/CreateClass.js';
import EditProfile from './components/EditProfile.js';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/" />;
};

const RoleBasedRedirect = ({ path }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('https://backend-classroom.vercel.app/api/auth/getrole', {
            method: 'GET',
            headers: {
              'auth-token': localStorage.getItem('token'),
              'auth': localStorage.getItem('classToken')
            },
          });
          const data = await res.json();
          console.log(data.role);
          setRole(data.role);
          if (data.role === 'teacher') {
            if (path === 'assignment') navigate('/tassignment');
            if (path === 'attendance') navigate('/tattendance');
          } else {
            if (path === 'assignment') navigate('/sassignment');
            if (path === 'attendance') navigate('/sattendance');
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkRoleAndRedirect();
  }, [navigate, path]);

  return null;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landing" element={<PrivateRoute element={<Landing />} />} />
        <Route path="/navbar" element={<PrivateRoute element={<Navbar />} />} />
        <Route path="/sidebar" element={<PrivateRoute element={<SwipeableTemporaryDrawer />} />} />
        <Route path="/sattendance" element={<PrivateRoute element={<SAttendance />} />} />
        <Route path="/tattendance" element={<PrivateRoute element={<TAttendance />} />} />
        <Route path="/tassignment" element={<PrivateRoute element={<TAssignment />} />} />
        <Route path="/sassignment" element={<PrivateRoute element={<SAssignment />} />} />
        <Route path="/submit-assignment/:title" element={<PrivateRoute element={<SubmitAssignment />} />} /> {/* Add new route */}
        <Route path="/community" element={<PrivateRoute element={<Community />} />} />
        <Route path="/chatbot" element={<PrivateRoute element={<Chatbot />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/announcement" element={<PrivateRoute element={<AnnouncementSection />} />} />
        <Route path="/insideclass" element={<PrivateRoute element={<InsideClass />} />} />
        <Route path="/joinclass" element={<PrivateRoute element={<JoinClass />} />} />
        <Route path="/createclass" element={<PrivateRoute element={<CreateClass />} />} />
        <Route path="/editprofile" element={<PrivateRoute element={<EditProfile />} />} />
        <Route path="/rolebasedredirect/:path" element={<PrivateRoute element={<RoleBasedRedirect />} />} />
      </Routes>
    </Router>
  );
};

export default App;
