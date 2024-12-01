import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, LinearProgress } from '@mui/material';

function UserPage() {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:3000/history');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            });
            alert(response.data.message || 'File uploaded successfully!');
            fetchHistory(); // Refresh history after successful upload
        } catch (error) {
            console.error('File upload failed:', error);
            alert('File upload failed!');
        } finally {
            setProgress(0);
        }
    };

    const handleUrlUpload = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/upload-url', { url });
            alert(response.data.message || 'URL uploaded successfully!');
            fetchHistory(); // Refresh history after successful upload
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
                                            <a
                                                href={`http://localhost:3000/${item.reportPath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
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
        </Container>
    );
}

export default UserPage;