require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const res = await pool.query('SELECT "id", "firstName", "lastName", "email", "qualification", "createdAt" FROM "Teacher" ORDER BY "createdAt" DESC');
    console.log(JSON.stringify({ count: res.rows.length, teachers: res.rows }, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err.message || err);
    process.exit(2);
  } finally {
    await pool.end();
  }
})();
