import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      nav: {
        features: "Características",
        solutions: "Soluciones",
        demo: "Demo",
        contact: "Contacto",
        requestDemo: "Solicitar Demo"
      },
      hero: {
        title: "Anticipa el Futuro, Actúa Hoy",
        subtitle: "EtherAI Foresight: Predicciones precisas al 90% para un mundo más preparado y resiliente",
        cta: "Despliega Portal Cósmico",
        watchVideo: "Ver Demo Épica (90s)"
      },
      portal: {
        title: "Portal Foresight Global",
        subtitle: "Simula el poder de la IA híbrida cuántica-clásica",
        step1: "Input Tarea Global/LATAM",
        step2: "Planificación Autónoma",
        step3: "Ejecución Predictiva",
        step4: "Insights Explicables & Outputs",
        placeholder: "Predecir sequía Perú Q1 2026...",
        orchestrating: "Orquestando Visión LATAM/Global...",
        weaving: "Tejiendo Predicciones Híbridas...",
        revealing: "Revelando Éter Explicable...",
        forged: "Futuro Forjado Accionable",
        newTask: "Nueva Época LATAM",
        export: "Export PDF LATAM Report",
        share: "Share ONU Insight"
      },
      sectors: {
        health: "Salud",
        economy: "Economía",
        politics: "Política",
        climate: "Clima"
      }
    }
  },
  en: {
    translation: {
      nav: {
        features: "Features",
        solutions: "Solutions",
        demo: "Demo",
        contact: "Contact",
        requestDemo: "Request Demo"
      },
      hero: {
        title: "Anticipate the Future, Act Today",
        subtitle: "EtherAI Foresight: 90% accurate predictions for a more prepared and resilient world",
        cta: "Launch Cosmic Portal",
        watchVideo: "Watch Epic Demo (90s)"
      },
      portal: {
        title: "Global Foresight Portal",
        subtitle: "Simulate the power of quantum-classical hybrid AI",
        step1: "Global/LATAM Task Input",
        step2: "Autonomous Planning",
        step3: "Predictive Execution",
        step4: "Explainable Insights & Outputs",
        placeholder: "Predict Peru drought Q1 2026...",
        orchestrating: "Orchestrating LATAM/Global Vision...",
        weaving: "Weaving Hybrid Predictions...",
        revealing: "Revealing Explainable Ether...",
        forged: "Actionable Future Forged",
        newTask: "New LATAM Epoch",
        export: "Export LATAM PDF Report",
        share: "Share UN Insight"
      },
      sectors: {
        health: "Health",
        economy: "Economy",
        politics: "Politics",
        climate: "Climate"
      }
    }
  },
  pt: {
    translation: {
      nav: {
        features: "Características",
        solutions: "Soluções",
        demo: "Demo",
        contact: "Contato",
        requestDemo: "Solicitar Demo"
      },
      hero: {
        title: "Antecipe o Futuro, Aja Hoje",
        subtitle: "EtherAI Foresight: Previsões 90% precisas para um mundo mais preparado e resiliente",
        cta: "Lançar Portal Cósmico",
        watchVideo: "Assistir Demo Épica (90s)"
      },
      portal: {
        title: "Portal Foresight Global",
        subtitle: "Simule o poder da IA híbrida quântica-clássica",
        step1: "Input Tarefa Global/LATAM",
        step2: "Planejamento Autônomo",
        step3: "Execução Preditiva",
        step4: "Insights Explicáveis & Outputs",
        placeholder: "Prever seca Peru Q1 2026...",
        orchestrating: "Orquestrando Visão LATAM/Global...",
        weaving: "Tecendo Previsões Híbridas...",
        revealing: "Revelando Éter Explicável...",
        forged: "Futuro Acionável Forjado",
        newTask: "Nova Época LATAM",
        export: "Exportar Relatório LATAM PDF",
        share: "Compartilhar Insight ONU"
      },
      sectors: {
        health: "Saúde",
        economy: "Economia",
        politics: "Política",
        climate: "Clima"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.split('-')[0] || 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
