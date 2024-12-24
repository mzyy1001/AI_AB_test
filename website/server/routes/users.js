require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../database/db');  
const router = express.Router();
const nodemailer = require('nodemailer');



router.post('/register', (req, res) => {
  const { email, password, name, firstName, lastName, company, jobTitle, phone, country, productsInterested } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return res.status(500).json({ error: 'Error generating salt' });
        }

        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
          }

          const sql = `
            INSERT INTO users 
            (email, password, username, firstName, lastName, company, jobTitle, phone, country, productsInterested) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const values = [email, hash, name, firstName || null, lastName || null, company || null, jobTitle || null, phone || null, country || null, productsInterested || null];

          db.run(sql, values, (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ message: 'User registered successfully' });
          });
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        const payload = { id: user.id, email: user.email, name: user.name };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;

            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});


// Forgot password - send reset link
router.post('/forgotPassword', (req, res) => {
  const { email } = req.body;

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create reset URL
    const resetURL = `/resetPassword/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: HOST_EMAIL,
        pass: HOST_EMAIL_PASSWARD
      }
    });

    const mailOptions = {
      from: HOST_EMAIL,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click this link to reset your password: ${resetURL}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'Password reset link sent to your email' });
    });
  });
});

router.post('/resetPassword/:token', (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Verify reset token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password and update user
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) throw err;

        db.run(`UPDATE users SET password = ? WHERE id = ?`, [hash, decoded.id], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Password has been reset successfully' });
        });
      });
    });
  });
});

// Get user usage count
router.get('/usageCount', passport.authenticate('user-strategy', { session: false }), (req, res) => {
  db.get(`SELECT usageCount FROM users WHERE id = ?`, [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ usageCount: row.usageCount });
  });
});

// Update Usage Count
router.post('/updateUsageCount', passport.authenticate('admin-strategy', { session: false }), (req, res) => {
  const { userId, usageCount } = req.body;

  db.run(`UPDATE users SET usageCount = ? WHERE id = ?`, [usageCount, userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Usage count updated successfully' });
  });
});

// get all users
router.get('/getUsers', passport.authenticate('admin-strategy', { session: false }), (req, res) => {
  console.log('getUsers reached');
  db.all('SELECT id, email, username, usageCount FROM users', [], (err, rows) => {
    if (err) {
      console.error('Failed to fetch users:', err.message);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    console.log('Users fetched from DB:', rows);
    res.json(rows || []);
  });
});

router.get(
  '/current',
  passport.authenticate('user-strategy', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    });
  }
);

router.get('/validate-token', 
  passport.authenticate('admin-strategy', { session: false }), 
  (req, res) => {
    // If authentication succeeds, passport adds the user to `req.user`
    res.json({
      valid: true,
      message: 'Token is valid',
      user: req.user, // You can include user details from the token
    });
  }
);

router.use((req, res, next) => {
  console.log(`Unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

module.exports = router;