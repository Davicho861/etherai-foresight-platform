import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Play, Pause, RotateCcw, Download, Share2, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface TaskReplayPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PredictionData {
  scenario: string;
  probability: number;
  explanation: string;
  factors: Array<{ name: string; impact: number }>;
}

const MOCK_TASKS = [
  {
    id: 'latam-1',
    region: 'LATAM',
    title: 'Predecir sequía Perú Q1 2026',
    sector: 'climate',
    prediction: {
      scenario: 'Alta Probabilidad de Sequía',
      probability: 0.87,
      explanation: 'Basado en patrones climáticos históricos y modelos de predicción actuales',
      factors: [
        { name: 'Patrones Climáticos', impact: 45 },
        { name: 'El Niño/La Niña', impact: 30 },
        { name: 'Deforestación', impact: 15 },
        { name: 'Temperatura Océano', impact: 10 }
      ]
    }
  },
  {
    id: 'latam-2',
    region: 'LATAM',
    title: 'Análisis migración Colombia 2026',
    sector: 'politics',
    prediction: {
      scenario: 'Flujo Migratorio Moderado',
      probability: 0.72,
      explanation: 'Factores económicos y sociales indican movimiento poblacional estable',
      factors: [
        { name: 'Situación Económica', impact: 40 },
        { name: 'Seguridad Regional', impact: 35 },
        { name: 'Oportunidades Laborales', impact: 15 },
        { name: 'Políticas Fronterizas', impact: 10 }
      ]
    }
  },
  {
    id: 'global-1',
    region: 'GLOBAL',
    title: 'Riesgo pandemia global ONU 2026',
    sector: 'health',
    prediction: {
      scenario: 'Riesgo Moderado de Emergencia Sanitaria',
      probability: 0.65,
      explanation: 'Vigilancia continua de vectores emergentes y capacidad de respuesta global',
      factors: [
        { name: 'Nuevas Variantes', impact: 35 },
        { name: 'Capacidad Sanitaria', impact: 30 },
        { name: 'Movilidad Global', impact: 20 },
        { name: 'Vacunación', impact: 15 }
      ]
    }
  }
];

export const TaskReplayPortal: React.FC<TaskReplayPortalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [selectedTask, setSelectedTask] = useState<typeof MOCK_TASKS[0] | null>(null);
  const [progress, setProgress] = useState(0);

  const steps = [
    t('portal.step1'),
    t('portal.step2'),
    t('portal.step3'),
    t('portal.step4')
  ];

  const statusMessages = [
    t('portal.orchestrating'),
    t('portal.weaving'),
    t('portal.revealing'),
    t('portal.forged')
  ];

  useEffect(() => {
    if (isPlaying && currentStep < 3) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStep((step) => step + 1);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStep]);

  const handleSelectTask = useCallback((task: typeof MOCK_TASKS[0]) => {
    setSelectedTask(task);
    setTaskInput(task.title);
    setIsPlaying(true);
    setCurrentStep(0);
    setProgress(0);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setSelectedTask(null);
    setTaskInput('');
  }, []);

  const confidenceData = selectedTask ? [
    { name: 'Confianza', value: Math.round(selectedTask.prediction.probability * 100) },
    { name: 'Incertidumbre', value: 100 - Math.round(selectedTask.prediction.probability * 100) }
  ] : [];

  const COLORS = ['hsl(var(--cosmic-accent-latam))', 'hsl(var(--cosmic-secondary))'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[hsl(var(--cosmic-primary))] to-[hsl(var(--etherblue-dark))] rounded-3xl shadow-2xl border border-white/10"
            style={{
              backdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-cosmic), 0 0 80px rgba(124, 58, 237, 0.3)'
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
              <div>
                <h2 className="text-3xl font-bold font-sf-pro bg-gradient-to-r from-white to-[hsl(var(--cosmic-accent-latam))] bg-clip-text text-transparent">
                  {t('portal.title')}
                </h2>
                <p className="text-sm text-white/60 mt-1">{t('portal.subtitle')}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Task Input Section */}
              {currentStep === 0 && !selectedTask && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Input
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder={t('portal.placeholder')}
                      className="pl-4 pr-12 py-6 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[hsl(var(--cosmic-accent-latam))] focus:ring-2 focus:ring-[hsl(var(--cosmic-accent-latam))]/50"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-[hsl(var(--cosmic-accent-latam))]"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Predefined Tasks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {MOCK_TASKS.map((task) => (
                      <Card
                        key={task.id}
                        className="p-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-[hsl(var(--cosmic-accent-latam))]/50 hover:scale-105 transition-all cursor-pointer group"
                        onClick={() => handleSelectTask(task)}
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-[hsl(var(--cosmic-accent-latam))] shrink-0 mt-1 group-hover:animate-pulse" />
                          <div>
                            <div className="text-xs text-[hsl(var(--cosmic-accent-global))] font-semibold mb-1">
                              {task.region}
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-2">{task.title}</h3>
                            <div className="text-xs text-white/60">
                              {task.prediction.probability * 100}% precisión
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Replay Progress */}
              {selectedTask && currentStep < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white font-sf-pro">
                      {statusMessages[currentStep]}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white/80 hover:text-white"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleReset}
                        className="text-white/80 hover:text-white"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <Progress value={progress} className="h-2 bg-white/10" />

                  <div className="grid grid-cols-4 gap-2">
                    {steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          idx === currentStep
                            ? 'bg-[hsl(var(--cosmic-accent-latam))]/20 border-[hsl(var(--cosmic-accent-latam))] text-white'
                            : idx < currentStep
                            ? 'bg-white/10 border-white/20 text-white/60'
                            : 'bg-white/5 border-white/10 text-white/40'
                        }`}
                      >
                        <div className="text-xs font-medium">{step}</div>
                      </div>
                    ))}
                  </div>

                  {/* Animated visualization based on step */}
                  <Card className="p-6 bg-white/5 border-white/10 min-h-[300px] flex items-center justify-center">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-[hsl(var(--cosmic-gradient-start))] to-[hsl(var(--cosmic-gradient-end))] animate-pulse flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-white/80">{statusMessages[currentStep]}</p>
                    </motion.div>
                  </Card>
                </motion.div>
              )}

              {/* Results - Step 4 */}
              {selectedTask && currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white font-sf-pro">
                      {selectedTask.prediction.scenario}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('portal.export')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('portal.share')}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Confidence Chart */}
                    <Card className="p-6 bg-white/5 border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Nivel de Confianza</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={confidenceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {confidenceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-4">
                        <div className="text-3xl font-bold text-[hsl(var(--cosmic-accent-latam))]">
                          {Math.round(selectedTask.prediction.probability * 100)}%
                        </div>
                        <div className="text-sm text-white/60">Precisión de Predicción</div>
                      </div>
                    </Card>

                    {/* Factors Chart */}
                    <Card className="p-6 bg-white/5 border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Factores de Influencia</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={selectedTask.prediction.factors}>
                          <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 10 }} />
                          <YAxis tick={{ fill: 'white' }} />
                          <Tooltip />
                          <Bar dataKey="impact" fill="hsl(var(--cosmic-secondary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  {/* Explanation */}
                  <Card className="p-6 bg-gradient-to-br from-[hsl(var(--cosmic-secondary))]/20 to-[hsl(var(--cosmic-accent-latam))]/20 border-[hsl(var(--cosmic-accent-latam))]/30">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[hsl(var(--cosmic-accent-latam))]" />
                      IA Explicable
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      {selectedTask.prediction.explanation}
                    </p>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReset}
                      className="flex-1 bg-gradient-to-r from-[hsl(var(--cosmic-gradient-start))] to-[hsl(var(--cosmic-gradient-end))] hover:scale-105 transition-transform"
                    >
                      {t('portal.newTask')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
