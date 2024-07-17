import React, { useState } from 'react';
import { Fab, TextField, Paper, AppBar, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ThreePIcon from '@mui/icons-material/ThreeP';
import SmartToyIcon from '@mui/icons-material/SmartToy';
const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setChatHistory((prevChat) => [...prevChat, { type: 'user', text: message }]);
      // Add logic for chatbot response here
      // For simplicity, let's assume a basic response
      setChatHistory((prevChat) => [...prevChat, { type: 'bot', text: 'Hello! How can I help you?' }]);
      setMessage('');
    }
  };

  return (
    <>
      {!isOpen && (
        <Fab
          color="success"
          style={{ position: 'fixed', bottom: '20px', right: '20px', color:'lightgreen' }}
          onClick={() => setIsOpen(true)}
        >
          <ThreePIcon />
        </Fab>
      )}
      {isOpen && (
        <Paper
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            height: '400px',
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '10px', height: '100%' }}>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                style={{
                  textAlign: chat.type === 'user' ? 'right' : 'left',
                  marginBottom: '10px',
                }}
              >
                {chat.text}
              </div>
            ))}
          </div>
          <div style={{position:'absolute', top:'0px', width:'100%' }}>
          <AppBar position='static'>
              <Toolbar>
              <SmartToyIcon sx={{ width: 30, height: 30, marginRight:'10px'}} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                  Chatbot
                </Typography>
                
              </Toolbar>
            </AppBar>
          </div>
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex' }}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Type your message"
              variant="outlined"
              fullWidth
            />
            <Fab color="primary" size="small" onClick={handleSendMessage} style={{ marginLeft: '10px' }}>
              <SendIcon />
            </Fab>
          </div>
        </Paper>
      )}
    </>
  );
};

export default Chatbot;
