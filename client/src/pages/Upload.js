import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);

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
        </div>
    );
}

export default Upload;
