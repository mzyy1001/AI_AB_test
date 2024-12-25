import React, { useState } from 'react';
import styles from '../css/FileUpload.module.css';  // Adjust path accordingly

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleFileUpload = () => {
        console.log(file, description);
        // Handle file upload logic here (e.g., API call)
    };

    return (
        <div className={styles.fileUploadContainer}>
            <div className={styles.fileUpload}>
                <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                <label htmlFor="fileInput" className={styles.dragArea}>
                    Drag and drop files here or click to browse
                </label>
                <button onClick={handleFileUpload} className={styles.uploadButton}>
                    Upload File
                </button>
            </div>
            <div className={styles.urlSection}>
                <input
                    type="url"
                    placeholder="Enter URL"
                    className={styles.urlInput}
                />
                <button className={styles.submitButton}>Submit URL</button>
            </div>
            <textarea
                placeholder="Describe what you want to submit..."
                value={description}
                onChange={handleDescriptionChange}
                className={styles.descriptionInput}
            />
            <button onClick={handleFileUpload} className={styles.submitDescriptionButton}>
                Submit Description
            </button>

            <div className={styles.fileList}>
                <div className={styles.fileRow}>
                    <span className={styles.fileName}>example.mp4</span>
                    <span className={styles.fileType}>File</span>
                    <span className={styles.fileStatus}>Status</span>
                    <span className={styles.fileDate}>2024/11/28</span>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
