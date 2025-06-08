import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Alert,
  Divider,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const AnnouncementSection = () => {
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          'https://backend-classroom.vercel.app/api/auth/getannouncement',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token'),
              auth: localStorage.getItem('classToken'),
            },
          }
        );
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
    setError(null);
    try {
      if (announcementTitle.trim().length === 0) {
        throw new Error('Announcement title cannot be blank');
      }
      if (announcementContent.trim().length === 0) {
        throw new Error('Announcement content cannot be blank');
      }

      const formData = new FormData();
      formData.append('title', announcementTitle.trim());
      formData.append('content', announcementContent.trim());
      files.forEach((file) => formData.append('files', file));

      const response = await fetch(
        'https://backend-classroom.vercel.app/api/auth/postannouncement',
        {
          method: 'POST',
          headers: {
            'auth-token': localStorage.getItem('token'),
            auth: localStorage.getItem('classToken'),
          },
          body: formData,
        }
      );

      const json = await response.json();
      if (response.ok) {
        setAnnouncements((prev) => [json, ...prev]); // newest on top
        setAnnouncementTitle('');
        setAnnouncementContent('');
        setFiles([]);
        setOpenDialog(false);
      } else {
        throw new Error(
          json.errors ? json.errors.map((err) => err.msg).join(', ') : 'Failed to post announcement'
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8, position: 'relative' }}>
      <Box sx={{ backgroundColor: '#f0f0ff', borderRadius: '8px', border: '1px solid #ccc', overflow: 'hidden' }}>
  <Box
    sx={{
      backgroundColor: '#3f51b5',
      color: 'white',
      padding: '12px 0',
      textAlign: 'center',
      width: '100%',
    }}
  >
    <Typography variant="h4" fontWeight="bold">
      Announcements
    </Typography>
  </Box>

  {/* Your announcements cards here */}
</Box>


      {announcements.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
          No announcements to display.
        </Typography>
      ) : (
        announcements.map((announcement, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              backgroundColor: '#e6e6fa', // very light color
              minHeight: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {announcement.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}
              >
                {announcement.content}
              </Typography>
            </Box>

            <Box mt={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ fontSize: '0.85rem', color: 'text.secondary' }}
              >
                <Typography>Posted by: {announcement.creatorName}</Typography>
                <Typography>{formatDate(announcement.date)}</Typography>
              </Stack>

              {announcement.files && announcement.files.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {announcement.files.map((fileId, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        color="inherit"
                        href={`https://drive.google.com/uc?id=${fileId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<InsertDriveFileIcon />}
                        sx={{ textTransform: 'none', mb: 1 }}
                      >
                        File {idx + 1}
                      </Button>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
          </Paper>
        ))
      )}

      {/* Floating Add Button */}
      {isCreator && (
        <Tooltip title="Post Announcement">
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 32, right: 32 }}
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Dialog for Posting Announcement */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Post a new announcement</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              required
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              inputProps={{ maxLength: 100 }}
              autoFocus
            />

            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              required
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              inputProps={{ maxLength: 1000 }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ textTransform: 'none' }}
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                  accept="*"
                />
              </Button>

              {files.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {files.map((file, i) => (
                    <Chip
                      key={i}
                      icon={<InsertDriveFileIcon />}
                      label={file.name}
                      onDelete={() => removeFile(i)}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handlePostAnnouncement}
            variant="contained"
            color="primary"
            disabled={!announcementTitle.trim() || !announcementContent.trim()}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnnouncementSection;
