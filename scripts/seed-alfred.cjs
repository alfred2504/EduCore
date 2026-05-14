const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnv(path.join(process.cwd(), '.env'));
loadEnv(path.join(process.cwd(), '.env.local'));

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const passwordHash = await bcrypt.hash('#Alfred2504', 10);

  await prisma.user.updateMany({
    where: {
      role: 'SYSTEM_ADMIN',
      email: {
        not: 'alfredmakura6@gmail.com',
      },
    },
    data: {
      role: 'SCHOOL_ADMIN',
      status: 'APPROVED',
    },
  });

  const alfred = await prisma.user.upsert({
    where: { email: 'alfredmakura6@gmail.com' },
    update: {
      name: 'Alfred Makura',
      password: passwordHash,
      role: 'SYSTEM_ADMIN',
      status: 'APPROVED',
    },
    create: {
      name: 'Alfred Makura',
      email: 'alfredmakura6@gmail.com',
      password: passwordHash,
      role: 'SYSTEM_ADMIN',
      status: 'APPROVED',
    },
  });

  console.log(`Seeded system admin: ${alfred.email}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
