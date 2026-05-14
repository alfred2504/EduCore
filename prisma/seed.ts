import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

console.log("Creating connection pool...");
const pool = new Pool({
  connectionString,
});

console.log("Creating adapter and PrismaClient...");
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");
  const existingYear =
    await prisma.academicYear.findFirst();

  if (!existingYear) {
    console.log("Creating academic year 2026...");
    await prisma.academicYear.create({
      data: {
        name: "2026",
        isCurrent: true,
      },
    });

    console.log(
      "✓ Academic year seeded"
    );
  } else {
    console.log("Academic year already exists");
  }

  // Ensure a development SYSTEM_ADMIN exists for local testing
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "alfredmakura6@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "#Alfred2504";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    console.log(`Creating SYSTEM_ADMIN ${adminEmail}...`);
    const hashed = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: "Alfred Makura",
        email: adminEmail,
        password: hashed,
        role: "SYSTEM_ADMIN",
        status: "APPROVED",
      },
    });

    console.log("✓ Admin user seeded");
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting...");
    await prisma.$disconnect();
    console.log("✓ Done");
  });