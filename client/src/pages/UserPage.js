import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UploadAndHistory() {
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
        <div>
            <h1>Upload File or Submit URL</h1>
            <form onSubmit={handleFileUpload}>
                <input type="file" onChange={handleFileChange} />
                {progress > 0 && <progress value={progress} max="100">{progress}%</progress>}
                <button type="submit">Upload File</button>
            </form>

            <form onSubmit={handleUrlUpload}>
                <input
                    type="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={handleUrlChange}
                />
                <button type="submit">Submit URL</button>
            </form>

            <h2>Your Upload History</h2>
            {history.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>File/URL Name</th>
                            <th>Type</th>
                            <th>Report</th>
                            <th>Status</th>
                            <th>Upload Date</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.filename}</td>
                                <td>{item.type}</td>
                                <td>
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
                                </td>
                                <td>{item.status}</td>
                                <td>{new Date(item.uploadDate).toLocaleDateString()}</td>
                                <td>{item.updateDate ? new Date(item.updateDate).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No history available.</p>
            )}
        </div>
    );
}

export default UploadAndHistory;
