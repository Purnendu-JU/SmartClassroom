import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Landing from './LandingPage';
import Login from './LoginPage.js';
import SignUp from './Signup.js';
import Navbar from './components/Navbar.js';
import SAttendance from './components/SAttendance.js';
import TAttendance from './components/TAttendance.js';
import Community from './components/Community.js';
import Home from './components/Home.js';
import TAssignment from './components/TAssignment.js';
import SAssignment from './components/SAssignment.js';
import SubmitAssignment from './components/SubmitAssignment'; // Import SubmitAssignment
import AnnouncementSection from './components/Announcement.js';
import InsideClass from './components/InsideClass.js';
import JoinClass from './components/JoinClass.js';
import CreateClass from './components/CreateClass.js';
import EditProfile from './components/EditProfile.js';

const PrivateRoute = ({ element, token }) => {
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
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Optional: sync token state if localStorage changes outside React (rare)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      {/* Show Navbar only if logged in */}
      {token && <Navbar />}

      <Routes>
        {/* Pass setToken to Login so it can update token state on login */}
        <Route path="/" element={<Login onLoginSuccess={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Protected routes */}
        <Route path="/landing" element={<PrivateRoute element={<Landing />} token={token} />} />
        <Route path="/sattendance" element={<PrivateRoute element={<SAttendance />} token={token} />} />
        <Route path="/tattendance" element={<PrivateRoute element={<TAttendance />} token={token} />} />
        <Route path="/tassignment" element={<PrivateRoute element={<TAssignment />} token={token} />} />
        <Route path="/sassignment" element={<PrivateRoute element={<SAssignment />} token={token} />} />
        <Route path="/submit-assignment/:title" element={<PrivateRoute element={<SubmitAssignment />} token={token} />} />
        <Route path="/community" element={<PrivateRoute element={<Community />} token={token} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} token={token} />} />
        <Route path="/announcement" element={<PrivateRoute element={<AnnouncementSection />} token={token} />} />
        <Route path="/insideclass/:classname/:subjectname" element={<PrivateRoute element={<InsideClass />} token={token} />} />
        <Route path="/joinclass" element={<PrivateRoute element={<JoinClass />} token={token} />} />
        <Route path="/createclass" element={<PrivateRoute element={<CreateClass />} token={token} />} />
        <Route path="/editprofile" element={<PrivateRoute element={<EditProfile />} token={token} />} />
        <Route path="/rolebasedredirect/:path" element={<PrivateRoute element={<RoleBasedRedirect />} token={token} />} />
      </Routes>
    </Router>
  );
};

export default App;
