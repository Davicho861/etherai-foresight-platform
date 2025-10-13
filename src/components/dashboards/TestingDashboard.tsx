import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00D4FF', '#FF6B00', '#FFD700', '#FF0080', '#00FF80'];

interface TestingData {
  testCoverage: number;
  totalTests: number;
  passingTests: number;
  failingTests: number;
  flakyTests: number;
  testExecutionTime: string;
  coverageByComponent: Array<{
    component: string;
    coverage: number;
  }>;
  testTrends: Array<{
    date: string;
    coverage: number;
    tests: number;
  }>;
  automationStatus: {
    unitTests: string;
    integrationTests: string;
    e2eTests: string;
    performanceTests: string;
  };
}

const TestingDashboard: React.FC = () => {
  const [data, setData] = useState<TestingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/testing');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching testing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-etherneon text-xl">Cargando datos de pruebas...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-xl">Error al cargar datos</div>
      </div>
    );
  }

  const testResultsData = [
    { name: 'Pasando', value: data.passingTests, color: '#00D4FF' },
    { name: 'Fallando', value: data.failingTests, color: '#FF6B00' },
    { name: 'Flaky', value: data.flakyTests, color: '#FFD700' }
  ];

  const automationData = Object.entries(data.automationStatus).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    status: value,
    value: value === 'Active' ? 100 : value === 'In Progress' ? 50 : 0
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-etherblue-dark/60 to-etherblue-800/60 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-etherneon flex items-center">
          <span className="mr-3">⚖️</span> El Juicio de Ares - Calidad y Pruebas
        </h2>
        <p className="text-gray-300">El veredicto divino sobre la calidad del código que forjará el futuro de Praevisio AI</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-800/80 to-emerald-800/80 p-6 rounded-xl border border-green-600/30"
        >
          <div className="text-2xl font-bold text-green-400">{data.testCoverage}%</div>
          <div className="text-sm text-gray-300">Cobertura de Pruebas</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-800/80 to-cyan-800/80 p-6 rounded-xl border border-blue-600/30"
        >
          <div className="text-2xl font-bold text-blue-400">{data.totalTests.toLocaleString()}</div>
          <div className="text-sm text-gray-300">Tests Totales</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-6 rounded-xl border border-purple-600/30"
        >
          <div className="text-2xl font-bold text-purple-400">{data.passingTests.toLocaleString()}</div>
          <div className="text-sm text-gray-300">Tests Pasando</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-800/80 to-pink-800/80 p-6 rounded-xl border border-red-600/30"
        >
          <div className="text-2xl font-bold text-red-400">{data.flakyTests}</div>
          <div className="text-sm text-gray-300">Tests Flaky</div>
        </motion.div>
      </div>

      {/* Dashboard de Calidad de Código */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🧪 Dashboard de Calidad de Código</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Cobertura de Pruebas</span>
              <span className="text-2xl font-bold text-green-400">{data.testCoverage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-green-400 h-3 rounded-full" style={{ width: `${data.testCoverage}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-etherneon">{data.passingTests.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Tests Pasando</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{data.flakyTests}</div>
              <div className="text-xs text-gray-400">Densidad de Bugs</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resultados de Tests */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📊 Resultados de Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={testResultsData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {testResultsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}`, 'Tests']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {testResultsData.map((result, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: result.color }}
                  ></div>
                  <span className="text-gray-300">{result.name}</span>
                </div>
                <span className="font-semibold text-white">{result.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cobertura por Componente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🎯 Cobertura por Componente</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.coverageByComponent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="component" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Bar dataKey="coverage" fill="#00D4FF" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tendencias de Tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📈 Tendencias de Calidad</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.testTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Line type="monotone" dataKey="coverage" stroke="#00D4FF" strokeWidth={2} />
            <Line type="monotone" dataKey="tests" stroke="#FF6B00" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Estado de Automatización */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🤖 Estado de Automatización</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {automationData.map((item, index) => (
            <div key={index} className="p-4 bg-etherblue-800/30 rounded-lg">
              <div className="text-sm text-gray-300 mb-2">{item.name}</div>
              <div className={`font-medium ${
                item.status === 'Active' ? 'text-green-400' :
                item.status === 'In Progress' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {item.status}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    item.status === 'Active' ? 'bg-green-400' :
                    item.status === 'In Progress' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestingDashboard;