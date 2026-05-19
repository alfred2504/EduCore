#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/checkUserPg.js <email>');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const res = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (res.rows.length > 0) {
      console.log(JSON.stringify({ found: true, user: res.rows[0] }, null, 2));
      process.exit(0);
    } else {
      console.log(JSON.stringify({ found: false }, null, 2));
      process.exit(0);
    }
  } catch (err) {
    console.error('Error querying DB:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
