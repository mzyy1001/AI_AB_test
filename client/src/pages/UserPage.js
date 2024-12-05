// client/src/pages/UserPage.js
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserPage() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    fetchHistory();
    fetchUsageCount();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchUsageCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/usageCount');
      setUsageCount(response.data.usageCount);
    } catch (error) {
      console.error('Failed to fetch usage count:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    e.preventDefault();
    if (usageCount <= 0) {
      alert('You have no remaining usage count. Please recharge.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      alert(response.data.message || 'File uploaded successfully!');
      fetchHistory(); // Refresh history after successful upload
      fetchUsageCount(); // Refresh usage count after successful upload
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed!');
    } finally {
      setProgress(0);
    }
  };

  const handleUrlUpload = async (e) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    e.preventDefault();
    if (usageCount <= 0) {
      alert('You have no remaining usage count. Please recharge.');
      return;
    }

    try {
      const response = await axios.post('/upload-url', { url });
      alert(response.data.message || 'URL uploaded successfully!');
      fetchHistory(); // Refresh history after successful upload
      fetchUsageCount(); // Refresh usage count after successful upload
    } catch (error) {
      console.error('URL upload failed:', error);
      alert('URL upload failed!');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload File or Submit URL
      </Typography>
      <Typography variant="h6" gutterBottom>
        Remaining Usage Count: {usageCount}
      </Typography>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
        <Button type="submit" variant="contained" color="primary">
          Upload File
        </Button>
      </form>

      <form onSubmit={handleUrlUpload}>
        <TextField
          type="url"
          label="Enter URL"
          value={url}
          onChange={handleUrlChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit URL
        </Button>
      </form>

      <Typography variant="h5" gutterBottom>
        Your Upload History
      </Typography>
      {history.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>File/URL Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Report</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.filename}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {item.reportPath ? (
                      <a href={`/${item.reportPath}`} target="_blank" rel="noopener noreferrer">
                        View Report
                      </a>
                    ) : (
                      'No Report'
                    )}
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{new Date(item.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell>{item.updateDate ? new Date(item.updateDate).toLocaleDateString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No history available.</Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Need more usage count? <Link to="/recharge">Recharge here</Link>
      </Typography>
    </Container>
  );
}

export default UserPage;