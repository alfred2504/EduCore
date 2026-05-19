#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const teacherRes = await pool.query('SELECT id, "firstName", "lastName", email, "userId", qualification, "createdAt" FROM "Teacher" ORDER BY "createdAt" DESC');
    const userRes = await pool.query('SELECT id, name, email, role, status, "createdAt" FROM "User" WHERE role = $1 ORDER BY "createdAt" DESC', ['TEACHER']);

    const joinedRes = await pool.query(`SELECT u.id as user_id, u.email as user_email, u.name as user_name, t.id as teacher_id, t.email as teacher_email, t."firstName" as teacher_first, t."lastName" as teacher_last
FROM "User" u
LEFT JOIN "Teacher" t ON t."userId" = u.id
WHERE u.role = $1
ORDER BY u."createdAt" DESC`, ['TEACHER']);

    console.log('=== Teacher rows ===');
    console.log({ count: teacherRes.rows.length, rows: teacherRes.rows });

    console.log('\n=== User rows with role=TEACHER ===');
    console.log({ count: userRes.rows.length, rows: userRes.rows });

    console.log('\n=== Joined (users with role TEACHER and their Teacher row if any) ===');
    console.log({ count: joinedRes.rows.length, rows: joinedRes.rows });

    // Show users that have role=TEACHER but no teacher record
    const missing = joinedRes.rows.filter(r => !r.teacher_id);
    console.log('\n=== Users with role=TEACHER but NO Teacher record ===');
    console.log({ count: missing.length, rows: missing });

  } catch (err) {
    console.error('Error diagnosing teachers:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
