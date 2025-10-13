import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Test connection immediately to fail fast if DATABASE_URL is not available
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error.message);
  process.exit(1);
});

export default prisma;
