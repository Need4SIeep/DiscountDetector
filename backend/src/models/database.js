const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/costtracker.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

const getDB = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }
  return db;
};

const initDB = () => {
  const database = getDB();
  
  database.serialize(() => {
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
      if (err) {
        console.log('Table already exists or creation error:', err.message);
      }
      
      // Try to add new columns if they don't exist (migration)
      database.all("PRAGMA table_info(products)", (err, columns) => {
        if (!err && columns) {
          const columnNames = columns.map(c => c.name);
          
          // Add capacity column if it doesn't exist
          if (!columnNames.includes('capacity')) {
            console.log('🔄 Migrating: Adding capacity column...');
            database.run(`ALTER TABLE products ADD COLUMN capacity REAL DEFAULT 1`, (err) => {
              if (!err) console.log('✓ capacity column added');
            });
          }
          
          // Add pricePerCapacity column if it doesn't exist
          if (!columnNames.includes('pricePerCapacity')) {
            console.log('🔄 Migrating: Adding pricePerCapacity column...');
            database.run(`ALTER TABLE products ADD COLUMN pricePerCapacity REAL`, (err) => {
              if (!err) console.log('✓ pricePerCapacity column added');
            });
          }
          
          // Make purchaseDate NOT NULL if not already (data migration)
          const purchaseDateColumn = columns.find(c => c.name === 'purchaseDate');
          if (purchaseDateColumn && !purchaseDateColumn.notnull) {
            console.log('🔄 Migrating: Making purchaseDate required...');
            database.run(`
              UPDATE products SET purchaseDate = CURRENT_DATE WHERE purchaseDate IS NULL
            `, (err) => {
              if (!err) console.log('✓ purchaseDate updated');
            });
          }
        }
      });
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
      if (err) {
        console.log('Users table error:', err.message);
      } else {
        console.log('✓ Users table ready');
        
        // Check if default admin exists
        database.get('SELECT * FROM users WHERE isAdmin = 1 LIMIT 1', (err, admin) => {
          if (!admin) {
            console.log('ℹ️  No admin user found. Create one with POST /api/auth/register');
          }
        });
      }
    });

    console.log('Database initialized successfully');
  });
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
  run,
  get,
  all,
  clearAll
};
