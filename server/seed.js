import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite dev.db with sample data...');

  // Create sample leads
  const leadsData = [
    { name: 'Equipo Local', email: 'local@praevisio.test', sector: 'community', message: 'Inicialización nativa' },
    { name: 'Developer', email: 'dev@praevisio.test', sector: 'engineering', message: 'Seed data para desarrollo' }
  ];

  for (const l of leadsData) {
    // Email is not declared unique in the schema; use findFirst/create defensively
    const existing = await prisma.lead.findFirst({ where: { email: l.email } });
    if (!existing) {
      await prisma.lead.create({ data: l });
    }
  }

  // Create some ModuleData points
  const now = new Date();
  const moduleSamples = [
    { country: 'COL', category: 'climate', value: 12.3, label: 'temp-index', timestamp: now },
    { country: 'PER', category: 'economic', value: 34.2, label: 'gdp-index', timestamp: now },
    { country: 'ARG', category: 'social', value: 7.1, label: 'event-count', timestamp: now }
  ];

  for (const m of moduleSamples) {
    await prisma.moduleData.create({ data: m });
  }

  const leadCount = await prisma.lead.count();
  const moduleCount = await prisma.moduleData.count();

  console.log(`Seed complete. Leads: ${leadCount}, ModuleData points: ${moduleCount}`);
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
