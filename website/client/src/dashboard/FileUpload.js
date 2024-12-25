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
                    <span>Drag and drop files here or click to browse</span>

                    <button onClick={handleFileUpload} className={styles.uploadButton}>
                        Upload File
                    </button>
                </label>
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
                  <tr className={styles.tableRow}>
                    <td>1</td>
                    <td>example.mp4</td>
                    <td>File</td>
                    <td>Pending</td>
                    <td>2024/11/28</td>
                  </tr>
              </tbody>
            </table>

            <div className={styles.ops}>
                <button className={styles.submitAllButton}>Submit All</button>
                <button className={styles.clearAllButton}>Clear All</button>
            </div>
        </div>
    );
};

export default FileUpload;
