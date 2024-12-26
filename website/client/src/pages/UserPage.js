import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/UserPage.module.css';
import logo from '../public/logo.png';

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
      const response = await axios.get('/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchUsageCount = async () => {
    try {
      const response = await axios.get('/api/users/usageCount');
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
    
    //PLEASE CHANGE AFTERWARDS. USEAGE COUNT IS DISABLED.
    if (false /* usageCount <= 0 */) {
      alert('You have no remaining usage count. Please recharge.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post('/api/upload', formData, {
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
    
    //PLEASE CHANGE AFTERWARDS. USEAGE COUNT IS DISABLED.
    if (false /* usageCount <= 0 */) {
      alert('You have no remaining usage count. Please recharge.');
      return;
    }

    try {
      const response = await axios.post('/api/upload-url', { url });
      // alert(response.data.message || 'URL uploaded successfully!');
      fetchHistory();
      fetchUsageCount();
    } catch (error) {
      console.error('URL upload failed:', error);
      alert('URL upload failed!');
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header with back arrow, dot, and gray cutoff line */}
      <header className={styles.header}>
        <div className={styles.icon}>
          <Link to="/" className={styles.arrow}></Link>
        </div>
        <div className={styles.logo} >
          <img src={logo} alt="Logo" style={{
            height: "40px",
            width: "75px",
            display: "block",
          }} />
        </div>

        <div className={styles.navLinks}>
          <a href="/user/dashboard" className={styles.navbtn}>Dashboard</a>
          <a href="/user/abtest" className={styles.navbtn}>AB Testing</a>
        </div>
      </header>
      <div className={styles.cutoffLine}></div>

      <div className={styles.body}>
        {/* File and URL upload section */}
        <div className={styles.uploadSection}>
          <form onSubmit={handleFileUpload} className={styles.uploadForm}>
            <label className={styles.fileLabel}>
              Drag and drop files here or click to browse
              <input type="file" onChange={handleFileChange} />
              <button type="submit" className={styles.uploadButton}>Upload File</button>
            </label>
            {progress > 0 && <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>}

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

        {/* History Table */}
        <div className={styles.historySection}>
          {history.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>File/URL Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
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
            <p className={styles.noHistory}>No history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
