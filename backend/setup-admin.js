#!/usr/bin/env node

/**
 * Admin Setup Script
 * Run this script to promote a user to admin or create an admin user
 *
 * Usage:
 *   node setup-admin.js list              - Show all users
 *   node setup-admin.js promote <id>      - Promote user by ID to admin
 *   node setup-admin.js create <name>     - Create a new admin user
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const DB_PATH = path.join(__dirname, './data/costtracker.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✓ Connected to database');
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => {
  rl.question(prompt, (answer) => {
    resolve(answer);
  });
});

async function listUsers() {
  console.log('\n📋 All Users:\n');
  
  return new Promise((resolve) => {
    db.all('SELECT id, username, isAdmin, createdAt FROM users', [], (err, rows) => {
      if (err) {
        console.error('❌ Error fetching users:', err);
        resolve();
        return;
      }

      if (!rows || rows.length === 0) {
        console.log('No users found.');
        resolve();
        return;
      }

      rows.forEach(user => {
        const adminBadge = user.isAdmin ? '👑 ADMIN' : '👤 User';
        const date = new Date(user.createdAt).toLocaleDateString();
        console.log(`  ID: ${user.id} | Username: ${user.username.padEnd(20)} | ${adminBadge.padEnd(12)} | Created: ${date}`);
      });
      console.log('');
      resolve();
    });
  });
}

async function promoteUser(userId) {
  return new Promise((resolve) => {
    db.run(
      'UPDATE users SET isAdmin = 1 WHERE id = ?',
      [userId],
      function(err) {
        if (err) {
          console.error('❌ Error promoting user:', err);
          resolve(false);
          return;
        }

        if (this.changes === 0) {
          console.error('❌ User not found with ID:', userId);
          resolve(false);
          return;
        }

        console.log(`✓ User ID ${userId} has been promoted to admin!`);
        resolve(true);
      }
    );
  });
}

async function createAdminUser(username, password) {
  return new Promise(async (resolve) => {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
        [username, hashedPassword, 1],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              console.error('❌ Username already exists!');
            } else {
              console.error('❌ Error creating user:', err);
            }
            resolve(false);
            return;
          }

          console.log(`✓ Admin user "${username}" created successfully!`);
          console.log(`  User ID: ${this.lastID}`);
          resolve(true);
        }
      );
    } catch (err) {
      console.error('❌ Error:', err);
      resolve(false);
    }
  });
}

async function interactiveMode() {
  console.log('\n🔐 Admin Setup Tool\n');
  
  const action = await question('What would you like to do? (list/promote/create): ').then(a => a.toLowerCase());

  if (action === 'list') {
    await listUsers();
  } else if (action === 'promote') {
    await listUsers();
    const userId = await question('Enter the User ID to promote to admin: ');
    const confirmed = await question(`Promote user ${userId} to admin? (yes/no): `);
    
    if (confirmed.toLowerCase() === 'yes') {
      await promoteUser(parseInt(userId));
    } else {
      console.log('Cancelled.');
    }
  } else if (action === 'create') {
    const username = await question('Enter new admin username: ');
    const password = await question('Enter password (min 6 chars): ');
    
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
    } else {
      const confirmed = await question(`Create admin user "${username}"? (yes/no): `);
      if (confirmed.toLowerCase() === 'yes') {
        await createAdminUser(username, password);
      } else {
        console.log('Cancelled.');
      }
    }
  } else {
    console.log('Unknown action');
  }

  rl.close();
  db.close();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    await interactiveMode();
  } else if (args[0] === 'list') {
    await listUsers();
    rl.close();
    db.close();
  } else if (args[0] === 'promote' && args[1]) {
    const success = await promoteUser(parseInt(args[1]));
    rl.close();
    db.close();
    process.exit(success ? 0 : 1);
  } else if (args[0] === 'create' && args[1] && args[2]) {
    const success = await createAdminUser(args[1], args[2]);
    rl.close();
    db.close();
    process.exit(success ? 0 : 1);
  } else {
    console.log('Usage:');
    console.log('  node setup-admin.js list              - Show all users');
    console.log('  node setup-admin.js promote <id>      - Promote user by ID');
    console.log('  node setup-admin.js create <name> <pwd> - Create new admin');
    console.log('  node setup-admin.js                   - Interactive mode');
    rl.close();
    db.close();
  }
}

main().catch(console.error);
