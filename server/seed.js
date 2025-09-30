// Seed script: tries to use Prisma if available, otherwise fallback to in-memory seed
async function main() {
	try {
		const prisma = (await import('./src/prisma.js')).default;
		// Create demo lead
		await prisma.lead.create({ data: { name: 'Demo User', email: 'demo@example.com', sector: 'Colombia', message: 'Quiero una demo' } });

		// Create some ModuleData for Colombia
		const now = new Date();
		const items = [
			{ country: 'colombia', category: 'social', label: 'sentiment_negative', value: 0.45, timestamp: now },
			{ country: 'colombia', category: 'economic', label: 'inflation', value: 0.082, timestamp: now },
			{ country: 'colombia', category: 'environmental', label: 'drought_risk', value: 0.3, timestamp: now }
		];
		for (const it of items) {
			await prisma.moduleData.create({ data: it });
		}

		console.log('Seeded demo data with Prisma');
		process.exit(0);
	} catch (e) {
		const storage = global.__PRAEVISIO_CONTACTS = global.__PRAEVISIO_CONTACTS || [];
		storage.push({ id: 'c_demo1', name: 'Demo User', email: 'demo@example.com', organization: 'Praevisio', message: 'Quiero una demo', interestedModule: 'Colombia', createdAt: new Date().toISOString() });
		console.log('Prisma not available; seeded in-memory demo contact');
		process.exit(0);
	}
}

main();
