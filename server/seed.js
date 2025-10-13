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

  // Create sample Kanban tasks based on PROJECT_KANBAN.md
  const kanbanTasks = [
    { title: 'MIS-018: Expansión de Dominios de Datos', description: 'Expandir capacidades predictivas a nuevos dominios', status: 'PLANNING', priority: 'Divine', assignee: 'Aion' },
    { title: 'Documentos comerciales para pilotos', description: 'Crear documentación para pilotos estratégicos', status: 'PLANNING', priority: 'High', assignee: 'Apolo' },
    { title: 'Crear guía de contribución', description: 'Documentación para colaboradores', status: 'PLANNING', priority: 'Medium', assignee: 'Hefesto' },
    { title: 'MIS-017: Expansión Ética', description: 'Mejorar marco ético y evaluación moral', status: 'DESIGN', priority: 'Divine', assignee: 'Cronos' },
    { title: 'Arquitectura de Seguridad Soberana', description: 'Diseño de protocolos de blindaje', status: 'DESIGN', priority: 'High', assignee: 'Ares' },
    { title: 'Diseño de APIs Soberanas', description: 'APIs para evolución autónoma', status: 'DESIGN', priority: 'High', assignee: 'Hefesto' },
    { title: 'Mejoras UI/UX', description: 'Interfaz de usuario mejorada', status: 'DESIGN', priority: 'Medium', assignee: 'Apolo' },
    { title: 'MIS-007: Cobertura Tests Unitarios', description: 'Aumentar cobertura a 90%+', status: 'IMPLEMENTATION', priority: 'High', assignee: 'Hefesto' },
    { title: 'Motor de agentes - orquestación (90%)', description: 'Sistema de agentes soberanos', status: 'IMPLEMENTATION', priority: 'Divine', assignee: 'Cronos' },
    { title: 'Pipeline de ingest (90%)', description: 'Procesamiento de datos predictivos', status: 'IMPLEMENTATION', priority: 'High', assignee: 'Cronos' },
    { title: 'Dashboard - visualización de alertas', description: 'Interfaz para alertas en tiempo real', status: 'IMPLEMENTATION', priority: 'Medium', assignee: 'Apolo' },
    { title: 'Tests E2E - Playwright para flujo de alertas', description: 'Pruebas end-to-end', status: 'TESTING', priority: 'High', assignee: 'Ares' },
    { title: 'PR para endpoints auditados', description: 'Revisión de seguridad de APIs', status: 'TESTING', priority: 'High', assignee: 'Ares' },
    { title: 'Cobertura tests unitarios (50%)', description: 'Aumentar cobertura actual', status: 'TESTING', priority: 'Medium', assignee: 'Hefesto' },
    { title: 'Definir infra para staging', description: 'Configuración de entorno staging', status: 'DEPLOYMENT', priority: 'High', assignee: 'Hades' },
    { title: 'CI pipeline - lint/test/build', description: 'Pipeline de integración continua', status: 'DEPLOYMENT', priority: 'High', assignee: 'Hades' },
    { title: 'Plan de gestión de secretos', description: 'Gestión segura de credenciales', status: 'DEPLOYMENT', priority: 'Medium', assignee: 'Ares' },
    { title: 'PR dashboard accesibilidad', description: 'Mejoras de accesibilidad', status: 'DEPLOYMENT', priority: 'Low', assignee: 'Apolo' }
  ];

  for (const task of kanbanTasks) {
    await prisma.kanbanTask.create({ data: task });
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
