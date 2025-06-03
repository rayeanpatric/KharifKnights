
import React, { ReactNode } from 'react';
import GrowthChart from './GrowthChart';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: {
    value: number;
    type: 'increase' | 'decrease';
  };
  unit?: string;
  color?: string;
  icon: ReactNode;
  lastUpdated?: string;
  chartData?: number[];
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  unit = '', 
  color = "#0FCE66", 
  icon, 
  lastUpdated,
  chartData = [] 
}: MetricCardProps) => {
  return (
    <div className="bg-e-dark-accent rounded-lg p-5 flex flex-col">
      <div className="flex items-center mb-1 text-gray-400 text-sm">
        {icon}
        <h3 className="ml-2">{title}</h3>
      </div>
      {lastUpdated && (
        <p className="text-xs text-gray-500 mb-2">Last updated {lastUpdated}</p>
      )}
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="ml-1">{unit}</span>}
      </div>
      <div className="flex items-center mt-1 mb-4">
        <span className={`text-xs ${change.type === 'increase' ? 'text-e-green' : 'text-e-red'}`}>
          {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}% from yesterday
        </span>
      </div>
      {chartData.length > 0 && (
        <div className="mt-auto">
          <GrowthChart data={chartData} color={color} />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>Now</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
