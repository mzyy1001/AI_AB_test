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


db.run(`CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  filepath TEXT,
  mimetype TEXT,
  size INTEGER,
  uploadDate TEXT DEFAULT (datetime('now'))
)`, (err) => {
  if (err) {
      console.error('Failed to create files table:', err.message);
  } else {
      console.log('Files table ready');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE,
  submitDate TEXT DEFAULT (datetime('now'))
)`, (err) => {
  if (err) {
      console.error('Failed to create urls table:', err.message);
  } else {
      console.log('URLs table ready');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT,
    password TEXT,
    usageCount INTEGER DEFAULT 0,
    date TEXT DEFAULT (datetime('now'))
  )`, (err) => {
    if (err) console.error('Failed to create users table:', err.message);
    else console.log('Users table ready');
  });

  db.run(`CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    companyName TEXT,
    contactInfo TEXT,
    submitDate TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) console.error('Failed to create surveys table:', err.message);
    else console.log('Surveys table ready');
  });
});

db.serialize(() => {
  // Add 'status' and 'reportPath' to 'files' table
  db.run("ALTER TABLE files ADD COLUMN status TEXT DEFAULT 'Pending'", (err) => {
      if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding status to files table:', err.message);
      } else {
          console.log('Status column ensured in files table.');
      }
  });

  db.run("ALTER TABLE files ADD COLUMN reportPath TEXT", (err) => {
      if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding reportPath to files table:', err.message);
      } else {
          console.log('ReportPath column ensured in files table.');
      }
  });

  // Add 'updateDate' to 'files' table
  db.run("ALTER TABLE files ADD COLUMN updateDate TEXT", (err) => {
      if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding updateDate to files table:', err.message);
      } else {
          console.log('UpdateDate column ensured in files table.');
      }
  });

  // Add 'status' to 'urls' table
  db.run("ALTER TABLE urls ADD COLUMN status TEXT DEFAULT 'Pending'", (err) => {
      if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding status to urls table:', err.message);
      } else {
          console.log('Status column ensured in urls table.');
      }
  });

  db.run("ALTER TABLE urls ADD COLUMN updateDate TEXT", (err) => {
    if (err && !err.message.includes("duplicate column")) {
        console.error("Error adding updateDate to urls table:", err.message);
    } else {
        console.log("updateDate column ensured in urls table.");
    }
  });
});

module.exports = db;