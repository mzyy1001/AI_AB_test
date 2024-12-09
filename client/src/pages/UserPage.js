import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/UserPage.module.css';

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
      const response = await axios.get('/users/usageCount');
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
      fetchHistory();
      fetchUsageCount();
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
      fetchHistory();
      fetchUsageCount();
    } catch (error) {
      console.error('URL upload failed:', error);
      alert('URL upload failed!');
    }
  };

  return (
    <div className={styles.body}>
      {/* Updated Header Section */}
      <header className={styles.header}>
        <h1 className={styles.labTitle}>AI_LAB_TEST</h1>
        <div className={styles.underline}></div>
        <h2 className={styles.mainTitle}>Advanced AI Testing Platform</h2>
        <p className={styles.subtitle}>
          A sophisticated platform for conducting A/B tests using AI models. Upload videos or submit URLs for analysis.
        </p>
      </header>

      {/* Upload Section */}
      <div className={styles.uploadContainer}>
        <h1>Upload File or Submit URL</h1>
        <p>Remaining Usage Count: {usageCount}</p>
        <form onSubmit={handleFileUpload} className={styles.uploadForm}>
          <div className={styles.fileInput}>
            <label className={styles.fileLabel}>
              <input type="file" onChange={handleFileChange} />
              Drag and drop files here or click to browse
            </label>
          </div>
          {progress > 0 && <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>}
          <button type="submit" className={styles.uploadButton}>Upload File</button>
        </form>
        <form onSubmit={handleUrlUpload} className={styles.uploadForm}>
          <input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={handleUrlChange}
            className={styles.urlInput}
          />
          <button type="submit" className={styles.uploadButton}>Submit URL</button>
        </form>
      </div>

      {/* History Section */}
      <div className={styles.historySection}>
        {history.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>File/URL Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.filename}</td>
                  <td>{item.type}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.uploadDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No history available.</p>
        )}
      </div>
    </div>
  );
}

export default UserPage;
