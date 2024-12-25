require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../database/db');  
const router = express.Router();
const nodemailer = require('nodemailer');

// GET route to fetch all contacts
router.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM contacts';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// POST route to add a new contact
router.post('/contacts', (req, res) => {
    const { firstName, lastName, workEmail, company, jobTitle, phone, country, productsInterested } = req.body;
    const sql = 'INSERT INTO contacts (firstName, lastName, workEmail, company, jobTitle, phone, country, productsInterested) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [firstName, lastName, workEmail, company, jobTitle, phone, country, productsInterested];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: {
                id: this.lastID,
                firstName,
                lastName,
                workEmail,
                company,
                jobTitle,
                phone,
                country,
                productsInterested
            }
        });
    });
});

module.exports = router;