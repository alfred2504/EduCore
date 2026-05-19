#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/createTeacherForUser.js <user-email> [qualification]');
  process.exit(1);
}

const qualification = process.argv[3] || null;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const userRes = await pool.query('SELECT id, name, email FROM "User" WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const user = userRes.rows[0];
    // Check existing teacher
    const existing = await pool.query('SELECT id FROM "Teacher" WHERE "userId" = $1', [user.id]);
    if (existing.rows.length > 0) {
      console.log('Teacher already exists for user:', email);
      process.exit(0);
    }

    const id = crypto.randomBytes(12).toString('hex');
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    await pool.query(
      'INSERT INTO "Teacher" ("id","firstName","lastName","email","qualification","userId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())',
      [id, firstName, lastName, user.email, qualification, user.id]
    );

    console.log('Teacher record created for', email);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
