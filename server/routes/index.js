require('dotenv').config();

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database/db');
const jwt = require('jsonwebtoken');

/*check payment*/
router.get('/surveys', (req, res) => {
    db.all('SELECT * FROM surveys', [], (err, rows) => {
      if (err) {
        console.error('Failed to fetch surveys:', err.message);
        return res.status(500).json({ error: 'Failed to fetch surveys' });
      }
      res.json(rows);
    });
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: process.env.MAX_FILESIZE * 1024 * 1024 },
});

const adminCredentials = {
    username: 'admin',
    password: 'admin', // Replace with a secure password
};

router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username === adminCredentials.username && password === adminCredentials.password) {
      // Generate a JWT token for the admin
      const payload = { username: adminCredentials.username, role: 'admin' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token: 'Bearer ' + token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

const passport = require('passport');

router.post('/upload', passport.authenticate('user-strategy', { session: false }), upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { filename, path: filepath, mimetype, size } = req.file;
  const userId = req.user.id;

  db.run(
    `INSERT INTO files (filename, filepath, mimetype, size, userId) VALUES (?, ?, ?, ?, ?)`,
    [filename, filepath, mimetype, size, userId],
    function (err) {
      if (err) {
        console.error('Failed to save file to database:', err.message);
        return res.status(500).json({ error: 'Failed to save file metadata' });
      }

      db.run(
        `UPDATE users SET usageCount = usageCount - 1 WHERE id = ? AND usageCount > 0`,
        [userId],
        function (err) {
          if (err) {
            console.error('Failed to update usage count:', err.message);
            return res.status(500).json({ error: 'Failed to update usage count' });
          }

          res.status(200).json({
            message: 'File uploaded successfully',
            file: req.file,
            fileId: this.lastID,
          });
        }
      );
    }
  );
});


router.post('/upload-url', passport.authenticate('user-strategy', { session: false }), (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  db.run(`INSERT INTO urls (url, userId) VALUES (?, ?)`, [url, userId], function (err) {
    if (err) {
      console.error('Failed to save URL to database:', err.message);
      return res.status(500).json({ error: 'Failed to save URL' });
    }

    db.run(`UPDATE users SET usageCount = usageCount - 1 WHERE id = ? AND usageCount > 0`, [userId], function (err) {
      if (err) {
        console.error('Failed to update usage count:', err.message);
        return res.status(500).json({ error: 'Failed to update usage count' });
      }

      res.status(200).json({ message: 'URL uploaded successfully', url, urlId: this.lastID });
    });
  });
});


router.put('/uploads/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Missing status' });
    }

    const queryFiles = `
        UPDATE files SET status = ?, updateDate = datetime('now') WHERE id = ?
    `;
    const queryUrls = `
        UPDATE urls SET status = ?, updateDate = datetime('now') WHERE id = ?
    `;

    db.run(queryFiles, [status, id], function (err) {
        if (err) {
            db.run(queryUrls, [status, id], function (err) {
                if (err) {
                    console.error('Failed to update status:', err.message);
                    return res.status(500).json({ error: 'Failed to update status' });
                }
                res.json({ message: 'Status updated successfully' });
            });
        } else {
            res.json({ message: 'Status updated successfully' });
        }
    });
});

router.post('/uploads/:id/report', upload.single('report'), (req, res) => {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
        return res.status(400).json({ error: 'No report uploaded' });
    }

    const query = `UPDATE files SET reportPath = ?, status = 'Completed', updateDate = datetime('now') WHERE id = ?`;

    db.run(query, [file.path, id], function (err) {
        if (err) {
            console.error('Failed to upload report:', err.message);
            return res.status(500).json({ error: 'Failed to upload report' });
        }
        res.json({ message: 'Report uploaded and status updated to Completed' });
    });
});

router.get('/uploads', (req, res) => {
  const query = `
      SELECT id, filename, filepath, mimetype, size, uploadDate, 'File' AS type, status
      FROM files
      UNION
      SELECT id, url AS filename, NULL AS filepath, NULL AS mimetype, NULL AS size, submitDate AS uploadDate, 'URL' AS type, status
      FROM urls
  `;

  db.all(query, [], (err, rows) => {
      if (err) {
          console.error('Failed to fetch uploads:', err.message);
          return res.status(500).json({ error: 'Failed to fetch uploads' });
      }
      res.json(rows);
  });
});
router.get('/history', passport.authenticate('user-strategy', { session: false }), (req, res) => {
  const userId = req.user.id;
  const query = `
      SELECT id, filename, reportPath, status, uploadDate, updateDate, 'File' AS type
      FROM files
      WHERE userId = ?
      UNION
      SELECT id, url AS filename, NULL AS reportPath, status, submitDate AS uploadDate, updateDate, 'URL' AS type
      FROM urls
      WHERE userId = ?
  `;

  db.all(query, [userId, userId], (err, rows) => {
      if (err) {
          console.error('Failed to fetch history:', err.message);
          return res.status(500).json({ error: 'Failed to fetch history' });
      }
      res.json(rows);
  });
});


module.exports = router;
