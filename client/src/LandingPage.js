import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import SwipeableTemporaryDrawer from './components/Sidebar';
import TAssignment  from './components/TAssignment';
import Community from './components/Community';
import Home from './components/Home';
 
const theme = createTheme();

export default 
function Landing() {
  return (
    <ThemeProvider theme={theme}>
        {/* <Navbar/> */}
        <SwipeableTemporaryDrawer/>
        <Home/>
        {/* <Attendance/>
        <Assignment/>
        <Community/>
        <QuizSection/> */}
        {/* <Chatbot/> */}
        
    </ThemeProvider>
  );
}