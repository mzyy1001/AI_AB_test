// client/src/pages/Admin.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [report, setReport] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log(token);
    if (!token) {
      window.location.href = '/admin-login';
    } else {
      const token = localStorage.getItem('adminToken');
      axios.defaults.headers.common['Authorization'] = token;
      fetchUploads();
      fetchSurveys();
      fetchUsers();
    }
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/uploads');
      // console.log('API response:', response.data);
      setUploads(response.data);
    } catch (error) {
      console.error('Failed to fetch uploads:', error);
    }
  };

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/surveys');
      // console.log('API response:', response.data);
      setSurveys(response.data);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/getUsers');
      console.log('API response:', response.data); // Log the API response
      if (Array.isArray(response.data)) {
        setUsers(response.data); // Ensure the response data is an array
      } else {
        console.error('API response is not an array');
        setUsers([]); // Set to an empty array if response is not an array
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]); // Set to an empty array in case of error
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/uploads/${id}`, { status });
      alert('Status updated successfully');
      fetchUploads();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const uploadReport = async (id) => {
    const formData = new FormData();
    formData.append('report', report);
    
    try {
      await axios.post(`/uploads/${id}/report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Report uploaded successfully');
      fetchUploads();
    } catch (error) {
      console.error('Failed to upload report:', error);
    }
  };

  const updateUsageCount = async (userId, usageCount) => {
    try {
      await axios.post('http://localhost:5000/users/updateUsageCount', { userId, usageCount });
      alert('Usage count updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update usage count:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr key={upload.id}>
              <td>{upload.id}</td>
              <td>{upload.filename}</td>
              <td>{upload.type}</td>
              <td>{upload.status}</td>
              <td>
                <button onClick={() => setSelectedUpload(upload)}>Analyze</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUpload && (
        <div>
          <h2>Analyze Upload: {selectedUpload.filename}</h2>
          <button onClick={() => updateStatus(selectedUpload.id, 'Processing')}>Start Analysis</button>
          <input type="file" onChange={(e) => setReport(e.target.files[0])} />
          <button onClick={() => uploadReport(selectedUpload.id)}>Upload Report</button>
        </div>
      )}

      <h2>Survey Submissions</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
            <th>Contact Info</th>
            <th>Submit Date</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td>{survey.id}</td>
              <td>{survey.companyName}</td>
              <td>{survey.contactInfo}</td>
              <td>{new Date(survey.submitDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Manage Users</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Usage Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.usageCount}</td>
              <td>
                <input
                  type="number"
                  value={user.usageCount}
                  onChange={(e) => updateUsageCount(user.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;