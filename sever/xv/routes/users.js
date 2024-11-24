const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../app'); // SQLite
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;

          db.run(
            `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
            [email, hash, name],
            (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              return res.status(201).json({ message: 'User registered successfully' });
            }
          );
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
          'your_jwt_secret',
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

// Update user profile
router.post('/updateProfile', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { email, name, password } = req.body;
  const userId = req.user.id;

  if (password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        db.run(`UPDATE users SET email = ?, name = ?, password = ? WHERE id = ?`, [email, name, hash, userId], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'User profile updated successfully' });
        });
      });
    });
  } else {
    db.run(`UPDATE users SET email = ?, name = ? WHERE id = ?`, [email, name, userId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User profile updated successfully' });
    });
  }
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

    const resetToken = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Create reset URL
    const resetURL = `http://localhost:5000/resetPassword/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
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
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
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

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    });
  }
);

module.exports = router;