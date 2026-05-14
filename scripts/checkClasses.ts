import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    const classes = await prisma.class.findMany({
      include: { students: true, academicYear: true },
    });
    console.log({ count: classes.length });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
