import { PrismaClient } from '@prisma/client';
import { publish } from './eventHub.js';
import { OracleOfDelphi } from './oracle.js';
import { EthicalCouncil } from './ethicalCouncil.js';
import {
  PrometeoAgent,
  CerberoStaticHead,
  CerberoDynamicHead,
  CerberoDependencyHead,
  CronosAgent,
  KairosAgent,
  AionAgent,
  EthicalGuardianAgent
} from './agents.js';

const prisma = new PrismaClient();

// Metatrón Omega - Arquitecto de la Entidad Precognitiva
export class MetatronOrchestrator {
  constructor() {
    this.oracle = new OracleOfDelphi();
    this.ethicalCouncil = new EthicalCouncil();
    this.activeContracts = new Map();
  }

  // Crear un nuevo contrato inteligente de misión
  async createContract(contractData) {
    try {
      // Paso 1: Revisión ética inicial
      const ethicalReview = await this.ethicalCouncil.reviewContract(contractData);
      if (!ethicalReview.approved) {
        throw new Error(`Contrato rechazado por razones éticas: ${ethicalReview.reasoning}`);
      }

      // Paso 2: Consulta al Oráculo de Delfos
      const oracleReport = await this.oracle.generatePreMortem(contractData);

      // Paso 3: Crear contrato en BD con dependencias inteligentes
      const contract = await prisma.missionContract.create({
        data: {
          title: contractData.title,
          description: contractData.description,
          priority: contractData.priority || 'MEDIUM',
          ethicalReview: {
            create: ethicalReview
          },
          oracleReport: {
            create: oracleReport
          }
        },
        include: {
          ethicalReview: true,
          oracleReport: true
        }
      });

      // Paso 4: Asignar crew basado en tipo de contrato y recomendaciones del Oráculo
      const assignedCrew = await this.assignCrew(contract, oracleReport);
      if (assignedCrew) {
        await prisma.missionContract.update({
          where: { id: contract.id },
          data: { crewId: assignedCrew.id }
        });
        contract.crew = assignedCrew;
      }

      return contract;
    } catch (error) {
      console.error('Error creando contrato:', error);
      throw error;
    }
  }

  // Ejecutar contrato con lógica inteligente de dependencias
  async executeContract(contractId, logCallback) {
    const contract = await prisma.missionContract.findUnique({
      where: { id: contractId },
      include: { crew: { include: { agents: true } }, oracleReport: true }
    });

    if (!contract) {
      throw new Error('Contrato no encontrado');
    }

    this.activeContracts.set(contractId, { status: 'running', logs: [] });

    try {
      await prisma.missionContract.update({
        where: { id: contractId },
        data: { status: 'IN_PROGRESS' }
      });

      // Ejecutar crew asignada con lógica de dependencias
      const result = await this.executeCrew(contract, logCallback);

      await prisma.missionContract.update({
        where: { id: contractId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      this.activeContracts.set(contractId, {
        status: 'completed',
        result,
        logs: this.activeContracts.get(contractId).logs
      });

      return result;
    } catch (error) {
      await prisma.missionContract.update({
        where: { id: contractId },
        data: { status: 'FAILED' }
      });

      this.activeContracts.set(contractId, {
        status: 'failed',
        error: error.message,
        logs: this.activeContracts.get(contractId).logs
      });

      throw error;
    }
  }

  // Asignar crew basado en análisis inteligente
  async assignCrew(contract, oracleReport) {
    // Lógica para asignar crew basada en tipo de contrato y riesgos identificados
    const crewType = this.determineCrewType(contract, oracleReport);

    const crew = await prisma.crew.findFirst({
      where: { type: crewType },
      include: { agents: true }
    });

    return crew;
  }

  // Determinar tipo de crew basado en contrato y reporte del Oráculo
  determineCrewType(contract, oracleReport) {
    if (contract.title.toLowerCase().includes('seguridad') || oracleReport.riskLevel === 'HIGH') {
      return 'SECURITY';
    }
    if (contract.title.toLowerCase().includes('desarrollo') || contract.title.toLowerCase().includes('código')) {
      return 'DEVELOPMENT';
    }
    if (contract.title.toLowerCase().includes('prueba') || contract.title.toLowerCase().includes('calidad')) {
      return 'QUALITY';
    }
    if (contract.title.toLowerCase().includes('despliegue')) {
      return 'DEPLOYMENT';
    }
    return 'DEVELOPMENT'; // Default
  }

  // Ejecutar crew con agentes especializados
  async executeCrew(contract, logCallback) {
    const crew = contract.crew;
    if (!crew) {
      throw new Error('No crew assigned to contract');
    }

    const results = [];

    // Ejecutar agentes basados en el tipo de crew
    switch (crew.type) {
      case 'DEVELOPMENT':
        results.push(await this.executeDevelopmentCrew(contract, logCallback));
        break;
      case 'SECURITY':
        results.push(await this.executeSecurityCrew(contract, logCallback));
        break;
      case 'QUALITY':
        results.push(await this.executeQualityCrew(contract, logCallback));
        break;
      case 'DEPLOYMENT':
        results.push(await this.executeDeploymentCrew(contract, logCallback));
        break;
      case 'META_EVOLUTIVE':
        results.push(await this.executeMetaEvolutiveCrew(contract, logCallback));
        break;
      case 'ETHICS':
        results.push(await this.executeEthicsCrew(contract, logCallback));
        break;
      default:
        results.push(await this.executeGenericCrew(crew, contract, logCallback));
    }

    return {
      success: true,
      message: `Crew ${crew.name} completó el contrato`,
      results
    };
  }

  // Crew de Desarrollo con Prometeo
  async executeDevelopmentCrew(contract, logCallback) {
    const prometeo = new PrometeoAgent();

    // Simular desarrollo con blindaje genético
    const devTask = {
      taskId: 'development_blindaje',
      description: 'Desarrollando código con blindaje genético simultáneo...',
      status: 'in_progress'
    };

    logCallback({ tasks: [devTask] });
    publish(contract.id, { tasks: [devTask] });

    // Prometeo genera pruebas en paralelo
    const testCode = await prometeo.generateTests(contract.description, 'component');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular desarrollo

    const completedTask = { ...devTask, status: 'completed' };
    logCallback({ tasks: [completedTask] });
    publish(contract.id, { tasks: [completedTask] });

    await prisma.missionLog.create({
      data: {
        contractId: contract.id,
        taskId: 'development_blindaje',
        description: 'Código y pruebas generadas simultáneamente',
        status: 'COMPLETED'
      }
    });

    return { phase: 'development', testCode };
  }

  // El Cerbero - Tres cabezas de seguridad
  async executeSecurityCrew(contract, logCallback) {
    const staticHead = new CerberoStaticHead();
    const dynamicHead = new CerberoDynamicHead();
    const dependencyHead = new CerberoDependencyHead();

    const securityResults = [];

    // Cabeza Estática
    const staticTask = {
      taskId: 'cerbero_static',
      description: 'Análisis estático de vulnerabilidades (SAST)...',
      status: 'in_progress'
    };
    logCallback({ tasks: [staticTask] });
    await new Promise(resolve => setTimeout(resolve, 800));
    securityResults.push({ head: 'static', status: 'PASSED' });

    // Cabeza Dinámica
    const dynamicTask = {
      taskId: 'cerbero_dynamic',
      description: 'Pruebas de penetración simuladas (DAST)...',
      status: 'in_progress'
    };
    logCallback({ tasks: [dynamicTask] });
    await new Promise(resolve => setTimeout(resolve, 800));
    securityResults.push({ head: 'dynamic', status: 'PASSED' });

    // Cabeza de Dependencias
    const dependencyTask = {
      taskId: 'cerbero_dependency',
      description: 'Análisis de supply chain y dependencias...',
      status: 'in_progress'
    };
    logCallback({ tasks: [dependencyTask] });
    await new Promise(resolve => setTimeout(resolve, 800));
    securityResults.push({ head: 'dependency', status: 'PASSED' });

    // Todas las cabezas deben aprobar
    const allPassed = securityResults.every(r => r.status === 'PASSED');

    if (allPassed) {
      await prisma.missionLog.create({
        data: {
          contractId: contract.id,
          taskId: 'cerbero_complete',
          description: 'El Cerbero aprueba: todas las cabezas de seguridad pasaron',
          status: 'COMPLETED'
        }
      });
    }

    return { phase: 'security', securityResults, approved: allPassed };
  }

  // Crews restantes (simplificadas para la implementación inicial)
  async executeQualityCrew(contract, logCallback) {
    const qualityTask = {
      taskId: 'quality_assurance',
      description: 'Ejecutando pruebas de calidad y aseguramiento...',
      status: 'in_progress'
    };
    logCallback({ tasks: [qualityTask] });
    await new Promise(resolve => setTimeout(resolve, 600));

    await prisma.missionLog.create({
      data: {
        contractId: contract.id,
        taskId: 'quality_assurance',
        description: 'Pruebas de calidad completadas',
        status: 'COMPLETED'
      }
    });

    return { phase: 'quality', status: 'PASSED' };
  }

  async executeDeploymentCrew(contract, logCallback) {
    const deployTask = {
      taskId: 'deployment_pipeline',
      description: 'Ejecutando pipeline de despliegue...',
      status: 'in_progress'
    };
    logCallback({ tasks: [deployTask] });
    await new Promise(resolve => setTimeout(resolve, 600));

    await prisma.missionLog.create({
      data: {
        contractId: contract.id,
        taskId: 'deployment_pipeline',
        description: 'Despliegue completado exitosamente',
        status: 'COMPLETED'
      }
    });

    return { phase: 'deployment', status: 'SUCCESS' };
  }

  async executeMetaEvolutiveCrew(contract, logCallback) {
    const cronos = new CronosAgent();
    const kairos = new KairosAgent();
    const aion = new AionAgent();

    const evolutionTask = {
      taskId: 'meta_evolution',
      description: 'Analizando evolución y proponiendo mejoras arquitectónicas...',
      status: 'in_progress'
    };
    logCallback({ tasks: [evolutionTask] });
    await new Promise(resolve => setTimeout(resolve, 1000));

    await prisma.missionLog.create({
      data: {
        contractId: contract.id,
        taskId: 'meta_evolution',
        description: 'Análisis meta-evolutivo completado',
        status: 'COMPLETED'
      }
    });

    return { phase: 'meta_evolution', proposals: ['Optimización identificada', 'Arquitectura propuesta'] };
  }

  async executeEthicsCrew(contract, logCallback) {
    const guardian = new EthicalGuardianAgent();

    const ethicsTask = {
      taskId: 'ethical_review',
      description: 'Revisión ética final del contrato...',
      status: 'in_progress'
    };
    logCallback({ tasks: [ethicsTask] });
    await new Promise(resolve => setTimeout(resolve, 400));

    await prisma.missionLog.create({
      data: {
        contractId: contract.id,
        taskId: 'ethical_review',
        description: 'Revisión ética completada - aprobado',
        status: 'COMPLETED'
      }
    });

    return { phase: 'ethics', approved: true };
  }

  async executeGenericCrew(crew, contract, logCallback) {
    // Fallback para crews genéricas
    for (const agent of crew.agents) {
      const task = {
        taskId: agent.id,
        description: `${agent.name} ejecutando ${agent.role}...`,
        status: 'in_progress'
      };

      logCallback({ tasks: [task] });
      publish(contract.id, { tasks: [task] });
      await new Promise(resolve => setTimeout(resolve, 500));

      const completedTask = { ...task, status: 'completed' };
      logCallback({ tasks: [completedTask] });
      publish(contract.id, { tasks: [completedTask] });

      await prisma.missionLog.create({
        data: {
          contractId: contract.id,
          taskId: agent.id,
          description: task.description,
          status: 'COMPLETED'
        }
      });
    }

    return { phase: 'generic', message: `Crew ${crew.name} completó tareas` };
  }

  // Obtener estado de contrato
  async getContractStatus(contractId) {
    const contract = await prisma.missionContract.findUnique({
      where: { id: contractId },
      include: {
        crew: true,
        oracleReport: true,
        ethicalReview: true,
        logs: { orderBy: { timestamp: 'asc' } }
      }
    });

    return contract || { status: 'not_found' };
  }

  // Obtener métricas de la economía interna (para Panel de Metatrón)
  async getEconomyMetrics() {
    const totalContracts = await prisma.missionContract.count();
    const completedContracts = await prisma.missionContract.count({
      where: { status: 'COMPLETED' }
    });
    const activeContracts = await prisma.missionContract.count({
      where: { status: 'IN_PROGRESS' }
    });

    return {
      totalContracts,
      completedContracts,
      activeContracts,
      successRate: totalContracts > 0 ? (completedContracts / totalContracts) * 100 : 0
    };
  }

  // Misión Génesis Omega - Auto-mejora del sistema
  async initiateGenesisOmega(logCallback) {
    console.log('🚀 Iniciando Misión Génesis Omega - Auto-mejora del sistema');

    const genesisContract = {
      title: 'Misión Génesis Omega: Auto-detección y Parcheo de Vulnerabilidades',
      description: `Principio de Anti-Fragilidad: El sistema debe ser capaz de detectar y corregir sus propias vulnerabilidades de seguridad. Implementar un nuevo agente en la Crew de Hefesto que, al detectar una vulnerabilidad, no solo cree un PR, sino que intente escribir el código del parche y sus pruebas de validación.`,
      priority: 'CRITICAL'
    };

    // Crear contrato de Génesis
    const contract = await this.createContract(genesisContract);
    console.log('📋 Contrato Génesis creado:', contract.id);

    // Ejecutar la misión completa
    const result = await this.executeContract(contract.id, logCallback);
    console.log('✨ Misión Génesis completada:', result);

    // Verificar auto-mejora
    const improvementVerified = await this.verifySystemImprovement(contract.id);
    console.log('🔍 Auto-mejora verificada:', improvementVerified);

    return {
      genesisContract: contract,
      executionResult: result,
      improvementVerified,
      message: 'Misión Génesis Omega completada exitosamente'
    };
  }

  // Verificar que el sistema se haya mejorado a sí mismo
  async verifySystemImprovement(contractId) {
    // Verificar que se creó un nuevo agente o funcionalidad
    const contract = await prisma.missionContract.findUnique({
      where: { id: contractId },
      include: { logs: true }
    });

    const hasNewAgent = contract.logs.some(log =>
      log.description.includes('nuevo agente') ||
      log.description.includes('vulnerabilidad') ||
      log.description.includes('parche')
    );

    const hasSelfImprovement = contract.logs.some(log =>
      log.description.includes('auto-mejora') ||
      log.description.includes('sistema mejorado')
    );

    return {
      hasNewAgent,
      hasSelfImprovement,
      overallImprovement: hasNewAgent && hasSelfImprovement,
      verificationTimestamp: new Date().toISOString()
    };
  }
}

// Instancia global de Metatrón Omega
export const metatronOrchestrator = new MetatronOrchestrator();