const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite connection
const dbPath = path.join(__dirname, 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  name TEXT,
  date TEXT DEFAULT (datetime('now'))
)`, (err) => {
  if (err) {
    console.error('Failed to create users table:', err.message);
  } else {
    console.log('Users table ready');
  }
});

module.exports = db;