require('dotenv').config();

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../database/db');

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


router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  // Extract file details from the request
  const { filename, path: filepath, mimetype, size } = req.file;

  // Save file metadata to the database
  const query = `INSERT INTO files (filename, filepath, mimetype, size) VALUES (?, ?, ?, ?)`;

  db.run(query, [filename, filepath, mimetype, size], function (err) {
      if (err) {
          console.error('Failed to save file to database:', err.message);
          return res.status(500).json({ error: 'Failed to save file metadata' });
      }
      // Respond with success message and file ID
      res.status(200).json({ 
          message: 'File uploaded successfully', 
          file: req.file, 
          fileId: this.lastID 
      });
  });
});

router.post('/upload-url', (req, res) => {
  const { url } = req.body; // Extract the URL from the request body

  if (!url || !url.startsWith('http')) {
      return res.status(400).json({ error: 'Invalid URL provided' });
  }

  // Save the URL to the database
  const query = `INSERT INTO urls (url) VALUES (?)`;
  db.run(query, [url], function (err) {
      if (err) {
          console.error('Failed to save URL to database:', err.message);
          return res.status(500).json({ error: 'Failed to save URL' });
      }

      // Respond with success message and the inserted URL ID
      res.status(200).json({
          message: 'URL uploaded successfully',
          url,
          urlId: this.lastID
      });
  });
});

router.put('/uploads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
      return res.status(400).json({ error: 'Missing status' });
  }

  const query = `
      UPDATE files SET status = ? WHERE id = ?
      UNION
      UPDATE urls SET status = ? WHERE id = ?
  `;

  db.run(query, [status, id, status, id], function (err) {
      if (err) {
          console.error('Failed to update status:', err.message);
          return res.status(500).json({ error: 'Failed to update status' });
      }
      res.json({ message: 'Status updated successfully' });
  });
});

router.post('/uploads/:id/report', upload.single('report'), (req, res) => {
  const { id } = req.params;
  const { file } = req;

  if (!file) {
      return res.status(400).json({ error: 'No report uploaded' });
  }

  const query = `UPDATE files SET reportPath = ?, status = 'Completed' WHERE id = ?`;

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
      console.log('Fetched uploads:', rows); // Debug log
      res.json(rows);
  });
});

module.exports = router;
