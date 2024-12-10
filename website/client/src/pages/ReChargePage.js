import React, { useState } from 'react';
import { Container, Button, Typography } from '@mui/material';
import axios from 'axios';
import styles from '../css/RechargePage.module.css';

function RechargePage() {
  const [companyName, setCompanyName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        '/users/submitSurvey',
        { companyName, contactInfo },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(response.data.message || 'Survey submitted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Unauthorized: Please log in again.');
      } else {
        alert('Survey submission failed!');
      }
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.rechargeContainer}>
        <h1 variant="h4" className={styles.headerTitle}>
          Recharge
        </h1>
        <form onSubmit={handleSurveySubmit} className={styles.form}>
          <div className={styles.inputFieldContainer}>
            <label className={styles.inputLabel}>Company Name</label>
            <textarea
              className={styles.inputField}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              rows="4" // Define the height of the textarea
            />
          </div>

          <div className={styles.inputFieldContainer}>
            <label className={styles.inputLabel}>Contact Info</label>
            <textarea
              className={styles.inputField}
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Enter your contact info"
              rows="4"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
}

export default RechargePage;
