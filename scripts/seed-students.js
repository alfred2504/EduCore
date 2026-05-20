#!/usr/bin/env node
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const samples = [
  {
    firstName: 'Alfred',
    lastName: 'Makura',
    grades: [85, 78, 92],
    attendanceCount: 18,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    grades: [48, 55, 50],
    attendanceCount: 12,
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    grades: [95, 88, 91],
    attendanceCount: 20,
  },
];

async function main() {
  console.log('Seeding sample students...');

  for (const s of samples) {
    // Check if student exists by name
    const existing = await prisma.student.findFirst({
      where: { firstName: s.firstName, lastName: s.lastName },
    });

    if (existing) {
      console.log(`Student ${s.firstName} ${s.lastName} already exists, skipping.`);
      continue;
    }

    const created = await prisma.student.create({
      data: {
        firstName: s.firstName,
        lastName: s.lastName,
        grades: {
          create: s.grades.map((score) => ({ score })),
        },
        attendances: {
          create: Array.from({ length: s.attendanceCount }).map(() => ({ present: true })),
        },
      },
      include: { grades: true, attendances: true },
    });

    console.log(`Created student ${created.firstName} ${created.lastName}: ${created.grades.length} grades, ${created.attendances.length} attendances`);
  }

  await prisma.$disconnect();
  console.log('Seeding complete.');
}

main().catch((e) => {
  console.error('Seeding error:', e);
  prisma.$disconnect().then(() => process.exit(1));
});
