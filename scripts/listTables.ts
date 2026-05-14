import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL not set');
  const pool = new Pool({ connectionString });
  const res = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public';");
  console.log('Tables:', res.rows.map(r => r.tablename));
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
