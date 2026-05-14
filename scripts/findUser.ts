import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const email = process.argv[2] || 'alfredmakura6@gmail.com';
  console.log('Looking up user:', email);
  const user = await prisma.user.findUnique({ where: { email } });
  console.log('Result:', user);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
