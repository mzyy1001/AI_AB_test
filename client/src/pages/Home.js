import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

function Home() {
    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Welcome to AI_AB_test
            </Typography>
            <Typography variant="body1" gutterBottom>
                This is a platform for conducting A/B tests using AI models. You can upload videos or submit URLs for analysis.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/login">
                Go to Login
            </Button>
        </Container>
    );
}

export default Home;