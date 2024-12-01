import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
    const [uploads, setUploads] = useState([]);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            const response = await axios.get('/uploads');
            setUploads(response.data);
        } catch (error) {
            console.error('Failed to fetch uploads:', error);
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
                    <button onClick={() => updateStatus(selectedUpload.id, 'Processing')}>
                        Start Analysis
                    </button>
                    <input
                        type="file"
                        onChange={(e) => setReport(e.target.files[0])}
                    />
                    <button onClick={() => uploadReport(selectedUpload.id)}>
                        Upload Report
                    </button>
                </div>
            )}
        </div>
    );
}

export default Admin;