require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../database/db');  
const router = express.Router();
const nodemailer = require('nodemailer');

// Submit survey
router.post('/submitSurvey', passport.authenticate('user-strategy', { session: false }), (req, res) => {
    const { companyName, contactInfo } = req.body;
  
    if (!req.user) {
      console.error('Authentication error: User not found');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
  
    if (!companyName || !contactInfo) {
      console.error('Validation error: Missing fields', { companyName, contactInfo });
      return res.status(400).json({ error: 'Missing required fields: companyName or contactInfo' });
    }
  
    db.run(
      `INSERT INTO surveys (userId, companyName, contactInfo) VALUES (?, ?, ?)`,
      [req.user.id, companyName, contactInfo],
      (err) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
  
        res.json({ message: 'Survey submitted successfully' });
      }
    );
  });
  
  // Get all surveys 
  router.get('/surveys', passport.authenticate('admin-strategy', { session: false }), (req, res) => {
    console.log('getsurveys reached');
    db.all('SELECT * FROM surveys', [], (err, rows) => {
      if (err) {
        console.error('Failed to fetch surveys:', err.message);
        return res.status(500).json({ error: 'Failed to fetch surveys' });
      }
      console.log('getsurveys reached');
      res.json(rows);
    });
  });

module.exports = router;