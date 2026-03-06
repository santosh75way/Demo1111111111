import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

// ── Prisma client (same adapter setup as the app) ──────────────────────────
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌  DATABASE_URL is not set in .env');
  process.exit(1);
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Seed data ───────────────────────────────────────────────────────────────
const ADMIN_USERS = [
  {
    email: 'admin@example.com',
    password: 'Admin@123',
    fullName: 'Super Admin',
  },
];

// ── Helper ───────────────────────────────────────────────────────────────────
async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

// ── Main seeder ──────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱  Starting database seed...\n');

  for (const admin of ADMIN_USERS) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (existing) {
      console.log(`⚠️   Admin already exists: ${admin.email} — skipping.`);
      continue;
    }

    const hashed = await hashPassword(admin.password);

    const created = await prisma.user.create({
      data: {
        email: admin.email,
        password: hashed,
        fullName: admin.fullName,
        role: 'ADMIN',
      },
    });

    console.log(`✅  Admin created:`);
    console.log(`    ID       : ${created.id}`);
    console.log(`    Email    : ${created.email}`);
    console.log(`    Full Name: ${created.fullName}`);
    console.log(`    Role     : ${created.role}`);
    console.log(`    Password : ${admin.password}  (plain — store safely)\n`);
  }

  console.log('🎉  Seeding complete.\n');
}

// ── Run ───────────────────────────────────────────────────────────────────────
main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
