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

		// Seed Metatrón Omega - Entidad Precognitiva

		// Crear Crews iniciales
		const crews = [
			{
				name: 'Crew Desarrollo',
				type: 'DEVELOPMENT',
				description: 'Crew responsable del desarrollo de software con blindaje genético'
			},
			{
				name: 'El Cerbero',
				type: 'SECURITY',
				description: 'Crew de seguridad con tres cabezas: Static, Dynamic, Dependency Analysis'
			},
			{
				name: 'Crew Calidad',
				type: 'QUALITY',
				description: 'Crew responsable de pruebas y validación de calidad'
			},
			{
				name: 'Crew Despliegue',
				type: 'DEPLOYMENT',
				description: 'Crew responsable del despliegue y operaciones'
			},
			{
				name: 'Arquitectos',
				type: 'META_EVOLUTIVE',
				description: 'Crew de meta-evolución y arquitectura'
			},
			{
				name: 'Consejo de Ética',
				type: 'ETHICS',
				description: 'Guardían moral de todas las misiones'
			}
		];

		for (const crewData of crews) {
			const crew = await prisma.crew.create({ data: crewData });

			// Crear agentes para cada crew
			const agents = getAgentsForCrew(crew.type);
			for (const agentData of agents) {
				await prisma.agent.create({
					data: {
						...agentData,
						crewId: crew.id
					}
				});
			}
		}

		console.log('Seeded Metatrón Omega - Entidad Precognitiva data with Prisma');
		process.exit(0);
	} catch (e) {
		const storage = global.__PRAEVISIO_CONTACTS = global.__PRAEVISIO_CONTACTS || [];
		storage.push({ id: 'c_demo1', name: 'Demo User', email: 'demo@example.com', organization: 'Praevisio', message: 'Quiero una demo', interestedModule: 'Colombia', createdAt: new Date().toISOString() });
		console.log('Prisma not available; seeded in-memory demo contact');
		process.exit(0);
	}
}

// Función para obtener agentes por tipo de crew
function getAgentsForCrew(crewType) {
	const agentsByCrew = {
		'DEVELOPMENT': [
			{
				name: 'FrontendDeveloperAgent',
				role: 'Desarrollador Frontend',
				capabilities: { 'react': true, 'typescript': true, 'testing': true },
				status: 'ACTIVE'
			},
			{
				name: 'BackendDeveloperAgent',
				role: 'Desarrollador Backend',
				capabilities: { 'nodejs': true, 'api': true, 'database': true },
				status: 'ACTIVE'
			},
			{
				name: 'Prometeo',
				role: 'Forjador de Pruebas',
				capabilities: { 'unit_tests': true, 'integration_tests': true, 'visual_regression': true },
				status: 'ACTIVE'
			}
		],
		'SECURITY': [
			{
				name: 'StaticAnalysisHead',
				role: 'Análisis Estático de Seguridad',
				capabilities: { 'sast': true, 'code_review': true, 'vulnerability_scanning': true },
				status: 'ACTIVE'
			},
			{
				name: 'DynamicAnalysisHead',
				role: 'Análisis Dinámico de Seguridad',
				capabilities: { 'dast': true, 'penetration_testing': true, 'runtime_analysis': true },
				status: 'ACTIVE'
			},
			{
				name: 'DependencyAnalysisHead',
				role: 'Análisis de Dependencias',
				capabilities: { 'supply_chain': true, 'dependency_scanning': true, 'license_check': true },
				status: 'ACTIVE'
			}
		],
		'QUALITY': [
			{
				name: 'TestAutomationAgent',
				role: 'Automatización de Pruebas',
				capabilities: { 'e2e': true, 'api_testing': true, 'performance': true },
				status: 'ACTIVE'
			},
			{
				name: 'QualityAssuranceAgent',
				role: 'Aseguramiento de Calidad',
				capabilities: { 'manual_testing': true, 'usability': true, 'accessibility': true },
				status: 'ACTIVE'
			}
		],
		'DEPLOYMENT': [
			{
				name: 'DevOpsAgent',
				role: 'Ingeniero DevOps',
				capabilities: { 'ci_cd': true, 'docker': true, 'kubernetes': true },
				status: 'ACTIVE'
			},
			{
				name: 'ReleaseManagerAgent',
				role: 'Gestor de Releases',
				capabilities: { 'versioning': true, 'rollback': true, 'monitoring': true },
				status: 'ACTIVE'
			}
		],
		'META_EVOLUTIVE': [
			{
				name: 'Cronos',
				role: 'Optimizador de Flujos',
				capabilities: { 'process_optimization': true, 'performance_analysis': true, 'bottleneck_detection': true },
				status: 'ACTIVE'
			},
			{
				name: 'Kairós',
				role: 'Agente de Oportunidad',
				capabilities: { 'trend_analysis': true, 'technology_scouting': true, 'market_intelligence': true },
				status: 'ACTIVE'
			},
			{
				name: 'Aion',
				role: 'Arquitecto del Futuro',
				capabilities: { 'architecture_design': true, 'evolution_planning': true, 'strategic_foresight': true },
				status: 'ACTIVE'
			}
		],
		'ETHICS': [
			{
				name: 'EthicalGuardianAgent',
				role: 'Guardían Ético',
				capabilities: { 'ethical_review': true, 'bias_detection': true, 'impact_assessment': true },
				status: 'ACTIVE'
			}
		]
	};

	return agentsByCrew[crewType] || [];
}

main();
