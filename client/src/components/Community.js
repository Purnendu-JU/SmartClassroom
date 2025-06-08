import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, List, Paper, Box, Avatar, Divider, Slide } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ForumIcon from '@mui/icons-material/Forum';

const Community = () => {
  const [user, setUser] = useState({ id: '', fname: '', lname: '', displayName: 'User' });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://backend-classroom.vercel.app/api/auth/getuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            'auth': localStorage.getItem('classToken')
          },
        });

        if (!response.ok) throw new Error(`Error fetching user information: ${response.statusText}`);
        const userData = await response.json();
        setUser({
          id: userData._id,
          fname: userData.fname,
          lname: userData.lname,
          displayName: `${userData.fname} ${userData.lname}`,
        });
      } catch (error) {
        console.error('Error fetching user information:', error);
        setError(error.message);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch('https://backend-classroom.vercel.app/api/auth/getcommunity', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            'auth': localStorage.getItem('classToken')
          },
        });

        if (!response.ok) throw new Error(`Error fetching messages: ${response.statusText}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Fetched data is not an array');
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      }
    };

    fetchUser();
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (user && message.trim() !== '') {
      try {
        const response = await fetch('https://backend-classroom.vercel.app/api/auth/postcommunity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            'auth': localStorage.getItem('classToken')
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            setValidationError(errorData.errors[0].msg);
          } else {
            throw new Error(`Error sending message: ${response.statusText}`);
          }
          return;
        }

        const newMessage = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, username: user.displayName },
        ]);
        setMessage('');
        setValidationError(null);
      } catch (error) {
        console.error('Error sending message:', error);
        setError(error.message);
      }
    } else {
      setValidationError('Message cannot be empty');
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        border: '2px solid #FC6736',
        borderRadius: 3,
        padding: 4,
        marginTop: '80px',
        backgroundColor: '#fff8f0',
        boxShadow: 3,
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <ForumIcon sx={{ fontSize: 50, color: '#FC6736', mr: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
          Community Board
        </Typography>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* Message Area */}
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          borderRadius: 2,
          p: 2,
          mb: 2,
          backgroundColor: '#fff',
        }}
      >
        <List disablePadding>
          {Array.isArray(messages) && messages.map((msg, index) => (
            <Slide direction="up" in={true} mountOnEnter unmountOnExit key={index}>
              <Paper
                elevation={2}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#ffe7e0',
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#FC6736', mr: 1.5 }}>
                    {msg.username?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {msg.username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      {/* Input Field */}
      <Box display="flex" alignItems="flex-start" gap={2}>
        <TextField
          fullWidth
          label="Type your message..."
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={!!validationError}
          helperText={validationError}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FC6736',
            color: '#fff',
            height: '56px',
            minWidth: '56px',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: '#fa5c29',
            },
          }}
          onClick={handleSendMessage}
        >
          <SendIcon />
        </Button>
      </Box>
    </Container>
  );
};

export default Community;
