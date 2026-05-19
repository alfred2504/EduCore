#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const emails = [
  'alice.teacher@example.com',
  'bob.instructor@example.com',
  'carol.mentor@example.com',
];

(async () => {
  try {
    for (const email of emails) {
      const normalized = email.trim().toLowerCase();
      const userRes = await pool.query('SELECT id FROM "User" WHERE email = $1', [normalized]);
      if (userRes.rows.length === 0) {
        console.log('No user found', normalized);
        continue;
      }
      const userId = userRes.rows[0].id;

      // Delete teacher record if exists
      const teacherRes = await pool.query('SELECT id FROM "Teacher" WHERE "userId" = $1', [userId]);
      if (teacherRes.rows.length > 0) {
        await pool.query('DELETE FROM "Teacher" WHERE "userId" = $1', [userId]);
        console.log('Deleted Teacher record for', normalized);
      } else {
        console.log('No Teacher record for', normalized);
      }

      // Delete the user
      await pool.query('DELETE FROM "User" WHERE id = $1', [userId]);
      console.log('Deleted User', normalized);
    }

    console.log('Done');
  } catch (err) {
    console.error('Error removing seeded teachers:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
