import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    console.log('Calling prisma.$connect()');
    await prisma.$connect();
    console.log('Connected. Running raw query...');
    const res = await prisma.$queryRawUnsafe('SELECT 1 as v');
    console.log('Query result:', res);
  } catch (e) {
    console.error('DETAILED ERROR:', e);
    if ((e as any).cause) console.error('CAUSE:', (e as any).cause);
  } finally {
    try { await prisma.$disconnect(); } catch {}
  }
}

main();
