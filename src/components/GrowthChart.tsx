
import React from 'react';

interface GrowthChartProps {
  data: number[];
  height?: number;
  color?: string;
}

const GrowthChart = ({ data, height = 50, color = "#0FCE66" }: GrowthChartProps) => {
  const max = Math.max(...data);
  
  return (
    <div className="flex items-end h-full gap-1 w-full">
      {data.map((value, index) => {
        const barHeight = max > 0 ? (value / max) * 100 : 0;
        return (
          <div 
            key={index} 
            className="flex-grow"
            style={{ height: `${height}px` }}
          >
            <div 
              className="w-full rounded-sm transition-all duration-300 ease-in-out"
              style={{ 
                backgroundColor: color,
                height: `${barHeight}%`,
                minHeight: value > 0 ? '4px' : '0'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GrowthChart;
