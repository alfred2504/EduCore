import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL not set');

  const pool = new Pool({ connectionString, max: 2, idleTimeoutMillis: 30000 });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as now');
    console.log('OK', res.rows[0]);
    client.release();
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
