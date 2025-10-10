import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Brain, label: 'Centro de Mando', href: '#demo', active: true },
    { icon: TrendingUp, label: 'Análisis Predictivo', href: '#analisis' },
    { icon: Shield, label: 'Evaluación de Riesgos', href: '#riesgos' },
    { icon: Truck, label: 'Optimización Logística', href: '#logistica' }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Praevisio AI</h2>
        <nav className="space-y-2" data-testid="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
                item.active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 mt-8">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-sm">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Todos los sistemas operativos</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;