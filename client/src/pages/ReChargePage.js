import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function RechargePage() {
  const [companyName, setCompanyName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // console.log('Token from localStorage:', token); 
    try {
      const response = await axios.post(
        'http://localhost:3000/users/submitSurvey',
        { companyName, contactInfo },
        {
          headers: {
            Authorization: token, // Include the token in the request headers
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Recharge
      </Typography>
      <form onSubmit={handleSurveySubmit}>
        <TextField
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contact Info"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Survey
        </Button>
      </form>
    </Container>
  );
}

export default RechargePage;