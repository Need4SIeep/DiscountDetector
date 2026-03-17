const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/costtracker.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✓ Data directory created at:', dataDir);
  } catch (err) {
    console.error('❌ Error creating data directory:', err);
  }
} else {
  console.log('✓ Data directory exists at:', dataDir);
}

// Check if database file exists at startup
if (fs.existsSync(DB_PATH)) {
  console.log('✓ Database file found, loading existing data from:', DB_PATH);
} else {
  console.log('⚠️  Database file not found at:', DB_PATH);
  console.log('   New database will be created on first access');
}

let db;
let dbReady = false;

const getDB = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err);
      } else {
        console.log('✓ Connected to SQLite database at:', DB_PATH);
        dbReady = true;
      }
    });
    
    // Set error handler on the database connection
    db.on('error', (err) => {
      console.error('❌ Database error event:', err);
    });
  }
  return db;
};

const isDBReady = () => dbReady;

const initDB = () => {
  try {
    const database = getDB();
    
    database.serialize(() => {
      try {
        // Create products table with new schema
        database.run(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT,
            price REAL NOT NULL,
            quantity INTEGER DEFAULT 1,
            capacity REAL NOT NULL,
            unit TEXT NOT NULL,
            purchaseDate TEXT NOT NULL,
            pricePerCapacity REAL,
            notes TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err && err.code !== 'SQLITE_ERROR') {
            console.error('❌ Products table error:', err.message);
          }
          
          // Try to add new columns if they don't exist (migration)
          try {
            database.all("PRAGMA table_info(products)", (err, columns) => {
              if (err) {
                console.error('❌ Could not check table columns:', err);
                return;
              }
              
              if (columns) {
                const columnNames = columns.map(c => c.name);
                
                // Add capacity column if it doesn't exist
                if (!columnNames.includes('capacity')) {
                  console.log('🔄 Migrating: Adding capacity column...');
                  database.run(`ALTER TABLE products ADD COLUMN capacity REAL DEFAULT 1`, (err) => {
                    if (err && err.code !== 'SQLITE_ERROR') {
                      console.error('❌ Error adding capacity column:', err);
                    } else if (!err) {
                      console.log('✓ capacity column added');
                    }
                  });
                }
                
                // Add pricePerCapacity column if it doesn't exist
                if (!columnNames.includes('pricePerCapacity')) {
                  console.log('🔄 Migrating: Adding pricePerCapacity column...');
                  database.run(`ALTER TABLE products ADD COLUMN pricePerCapacity REAL`, (err) => {
                    if (err && err.code !== 'SQLITE_ERROR') {
                      console.error('❌ Error adding pricePerCapacity:', err);
                    } else if (!err) {
                      console.log('✓ pricePerCapacity column added');
                    }
                  });
                }
                
                // Add userId column if it doesn't exist
                if (!columnNames.includes('userId')) {
                  console.log('🔄 Migrating: Adding userId column...');
                  database.run(`ALTER TABLE products ADD COLUMN userId INTEGER`, (err) => {
                    if (err && err.code !== 'SQLITE_ERROR') {
                      console.error('❌ Error adding userId:', err);
                    } else if (!err) {
                      console.log('✓ userId column added');
                    }
                  });
                }
              }
            });
          } catch (e) {
            console.error('❌ Column migration error:', e);
          }
        });

        // Create users table
        database.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            isAdmin BOOLEAN DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err && err.code !== 'SQLITE_ERROR') {
            console.error('❌ Users table error:', err.message);
          } else {
            console.log('✓ Users table ready');
          }
        });

        console.log('✓ Database initialized successfully');
      } catch (e) {
        console.error('❌ Error during database initialization:', e);
      }
    });
  } catch (e) {
    console.error('❌ Fatal database initialization error:', e);
  }
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().get(sql, params, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDB().all(sql, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

const clearAll = () => {
  return new Promise((resolve, reject) => {
    getDB().run('DELETE FROM products', (err) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        console.log('✓ All products deleted');
        resolve();
      }
    });
  });
};

module.exports = {
  initDB,
  getDB,
  isDBReady,
  run,
  get,
  all,
  clearAll
};
