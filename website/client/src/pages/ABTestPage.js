import React, { useState } from 'react';
import styles from '../css/ABTestPage.module.css';
import { Link } from 'react-router-dom';
import logo from '../public/logo.png';
import chartImg from '../public/ABTestResult.png';

// Add new state for storing submissions and URL input
function ABTestPage() {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [submissions, setSubmissions] = useState([]);

    function shortenString(str) {
        if (!str) return '';
        return str.length > 14 ? str.slice(0, 14) + '...' : str;
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // ...existing code...
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    // Modify file upload to add a new submission if a file exists
    const handleFileUpload = () => {
        if (file) {
            setSubmissions([
                ...submissions,
                {
                    id: new Date().getTime(),
                    name: file.name,
                    type: 'File',
                    status: 'Pending',
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setFile(null);
        }
    };

    // Create a handler for URL submission
    const handleURLSubmit = () => {
        if (urlInput) {
            setSubmissions([
                ...submissions,
                {
                    id: new Date().getTime(),
                    name: urlInput,
                    type: 'URL',
                    status: 'Pending',
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setUrlInput('');
        }
    };

    // Create a handler for description submission
    const handleDescriptionSubmit = () => {
        if (description) {
            setSubmissions([
                ...submissions,
                {
                    id: new Date().getTime(),
                    name: description,
                    type: 'Desc',
                    status: 'Pending',
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setDescription('');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.icon}>
                    <Link to="/" className={styles.arrow}></Link>
                </div>
                <div className={styles.logo} >
                    <img src={logo} alt="Logo" style={{ height: "40px", width: "75px", display: "block" }} />
                </div>

                <div className={styles.navLinks}>
                    <a href="/user" className={styles.navbtn}>Uploads</a>
                    <a href="/user/dashboard" className={styles.navbtn}>Dashboard</a>
                </div>
            </header>
            <div className={styles.cutoffLine}></div>

            <div className={styles.body}>
                <div className={styles.FileUpload}>
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
                                Upload File&nbsp;&nbsp; +
                            </button>
                        </label>
                    </div>
                    <div className={styles.urlSection}>
                        <input
                            type="url"
                            placeholder="Enter URL"
                            className={styles.urlInput}
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <button onClick={handleURLSubmit} className={styles.submitURLButton}>
                            Submit URL&nbsp;&nbsp; +
                        </button>
                    </div>
                    <textarea
                        placeholder="Describe what you want to submit..."
                        value={description}
                        onChange={handleDescriptionChange}
                        className={styles.descriptionInput}
                    />
                    <button onClick={handleDescriptionSubmit} className={styles.submitDescriptionButton}>
                        Submit Description&nbsp;&nbsp; +
                    </button>

                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th>ID</th>
                                <th>File/URL Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Upload Date</th>
                                <th>Select</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.tableRow}>
                                <td>1</td>
                                <td>{shortenString('example.mp4')}</td>
                                <td>File</td>
                                <td>Pending</td>
                                <td>{new Date().toLocaleDateString()}</td>
                                <td>
                                    <input type='checkbox' className={styles.checkbox} />
                                </td>
                                <td>
                                    <button className={styles.submitButton}>Submit</button>
                                    <button className={styles.clearButton}>Clear</button>
                                </td>
                            </tr>

                            {submissions.map((item, index) => (
                                <tr key={item.id} className={styles.tableRow}>
                                    <td>{index + 2}</td>
                                    <td>{shortenString(item.name)}</td>
                                    <td>{item.type}</td>
                                    <td>{item.status}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <input type='checkbox' className={styles.checkbox} />
                                    </td>
                                    <td>
                                        <button className={styles.submitButton}>Submit</button>
                                        <button className={styles.clearButton}>Clear</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.ops}>
                        <button className={styles.submitAllButton}>Test</button>
                        <button className={styles.clearAllButton}>Restart</button>
                    </div>
                </div>

                <div className={styles.chartSection}>
                    <span className={styles.chartLabel}>AB Test Result</span>
                    <img src={chartImg} className={styles.chart} />
                </div>
            </div>
        </div>
    );
}

export default ABTestPage;
// ...existing code...