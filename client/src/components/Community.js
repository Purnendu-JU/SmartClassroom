import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Community = () => {
  const [user, setUser] = useState({ id: '', fname: '', lname: '', displayName: 'User' }); // Initialize user with appropriate fields
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null); // To handle any errors
  const [validationError, setValidationError] = useState(null); // To handle validation errors

  useEffect(() => {
    // Fetch user information
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

        if (!response.ok) {
          throw new Error(`Error fetching user information: ${response.statusText}`);
        }

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

    // Fetch messages
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

        if (!response.ok) {
          throw new Error(`Error fetching messages: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Fetched data is not an array');
        }

        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      }
    };

    fetchUser();
    fetchMessages();
  }, []);

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
        setValidationError(null); // Clear validation error if the message is sent successfully
      } catch (error) {
        console.error('Error sending message:', error);
        setError(error.message);
      }
    } else {
      setValidationError('Message cannot be empty');
    }
  };

  return (
    <Container sx={{ border: 'solid thick #FC6736', borderRadius: '1%', marginTop: '70px', backgroundColor: 'lavenderblush' }}>
      <Typography variant="h2" component="div" sx={{ mt: 2, mb: 4 }}>
        Community
      </Typography>
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
      {validationError && (
        <Typography color="error">
          {validationError}
        </Typography>
      )}
      <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {Array.isArray(messages) && messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${msg.username}: ${msg.message}`} />
          </ListItem>
        ))}
      </List>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={!!validationError}
          helperText={validationError}
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ mt: 2, marginBottom: '20px', marginLeft: '10px' }}
        >
          <SendIcon />
        </Button>
      </div>
    </Container>
  );
};

export default Community;
