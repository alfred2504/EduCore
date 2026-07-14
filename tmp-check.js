const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query('SELECT id, email, role, status, name FROM "User" ORDER BY "createdAt" DESC');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
