import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const AnnouncementSection = () => {
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('https://backend-classroom.vercel.app/api/auth/getannouncement', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            'auth': localStorage.getItem('classToken')
          }
        });
        const json = await response.json();
        if (response.ok) {
          setAnnouncements(json.announces);
          setIsCreator(json.isCreator);
        } else {
          throw new Error(json.error || 'Failed to fetch announcements');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAnnouncements();
  }, []);

  const handlePostAnnouncement = async () => {
    try {
      if (announcementTitle.length === 0) {
        throw new Error('Announcement title cannot be blank');
      } else if (announcementContent.length === 0) {
        throw new Error('Announcement content cannot be blank');
      }

      const formData = new FormData();
      formData.append('title', announcementTitle.trim());
      formData.append('content', announcementContent.trim());
      files.forEach(file => formData.append('files', file));

      const response = await fetch('https://backend-classroom.vercel.app/api/auth/postannouncement', {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('token'),
          'auth': localStorage.getItem('classToken')
        },
        body: formData
      });

      const json = await response.json();
      if (response.ok) {
        setAnnouncements((prevAnnouncements) => [
          ...prevAnnouncements,
          json
        ]);

        // Reset the form fields
        setAnnouncementTitle('');
        setAnnouncementContent('');
        setFiles([]);
      } else {
        throw new Error(json.errors ? json.errors.map(err => err.msg).join(', ') : 'Failed to post announcement');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container sx={{ border: 'solid thick #FC6736', borderRadius: '1%', marginTop: '50px', backgroundColor: 'lavenderblush' }}>
      <Typography variant="h3" component="div" sx={{ mt: 2, mb: 4 }}>
        Announcement Section
      </Typography>
      
      {isCreator && (
        <>
          <TextField
            fullWidth
            label="Announcement Title (required)"
            variant="outlined"
            margin="normal"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Announcement Content (required)"
            variant="outlined"
            margin="normal"
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            sx={{ mt: 2 }}
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ marginTop: '16px' }}
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostAnnouncement}
            sx={{ mt: 2 }}
          >
            Post Announcement
          </Button>
        </>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h5" component="div" sx={{ mt: 4, mb: 2 }}>
        Announcements
      </Typography>
      {announcements.length === 0 ? (
        <Typography variant='body1' sx={{ mt: 2 }}>
          No announcements available.
        </Typography>
      ) : (
        announcements.map((announcement, index) => (
          <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ccc' }}>
            <Typography variant="h6">{announcement.title}</Typography>
            <Typography variant="body1">{announcement.content}</Typography>
            <Typography variant="subtitle2">Posted by: {announcement.creatorName}</Typography>
            <Typography variant="subtitle2">Date: {formatDate(announcement.date)}</Typography>
            {announcement.files && announcement.files.map((file, fileIndex) => (
              <div key={fileIndex}>
                <a href={`https://drive.google.com/uc?id=${file}`} target="_blank" rel="noopener noreferrer">
                  {file}
                </a>
              </div>
            ))}
          </div>
        ))
      )}
    </Container>
  );
};

export default AnnouncementSection;
