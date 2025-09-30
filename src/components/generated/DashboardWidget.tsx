import React from 'react';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  description?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, value, description }) => {
  return (
    <div className="bg-etherblue-dark/50 border border-gray-700 rounded-lg p-4">
      <h4 className="text-sm text-gray-300 mb-2">{title}</h4>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {description && <div className="text-xs text-gray-400">{description}</div>}
    </div>
  );
};

export default DashboardWidget;