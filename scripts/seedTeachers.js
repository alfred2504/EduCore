#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sample = [
  { name: 'Alice Teacher', email: 'alice.teacher@example.com', password: 'Password123!', qualification: 'MEd' },
  { name: 'Bob Instructor', email: 'bob.instructor@example.com', password: 'Password123!', qualification: 'PhD' },
  { name: 'Carol Mentor', email: 'carol.mentor@example.com', password: 'Password123!', qualification: 'BEd' },
];

(async () => {
  try {
    for (const s of sample) {
      const normalized = s.email.trim().toLowerCase();
      const userRes = await pool.query('SELECT id FROM "User" WHERE email = $1', [normalized]);
      let userId;
      if (userRes.rows.length === 0) {
        const hashed = await bcrypt.hash(s.password, 10);
        userId = crypto.randomBytes(12).toString('hex');
        await pool.query(
          'INSERT INTO "User" ("id","name","email","password","role","status","createdAt") VALUES ($1,$2,$3,$4,$5,$6,NOW())',
          [userId, s.name, normalized, hashed, 'TEACHER', 'APPROVED']
        );
        console.log('Created user', normalized);
      } else {
        userId = userRes.rows[0].id;
        console.log('User exists', normalized);
      }

      const teacherRes = await pool.query('SELECT id FROM "Teacher" WHERE "userId" = $1', [userId]);
      if (teacherRes.rows.length === 0) {
        const id = crypto.randomBytes(12).toString('hex');
        const nameParts = s.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        await pool.query(
          'INSERT INTO "Teacher" ("id","firstName","lastName","email","qualification","userId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())',
          [id, firstName, lastName, normalized, s.qualification, userId]
        );
        console.log('Created teacher record for', normalized);
      } else {
        console.log('Teacher already exists for', normalized);
      }
    }
  } catch (err) {
    console.error('Error seeding teachers:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
