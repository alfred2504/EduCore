#!/usr/bin/env node
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/checkUser.js <email>');
  process.exit(1);
}

(async () => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log(JSON.stringify({ found: true, user }, null, 2));
      process.exit(0);
    } else {
      console.log(JSON.stringify({ found: false }, null, 2));
      process.exit(0);
    }
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
})();
