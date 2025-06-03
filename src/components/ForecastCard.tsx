
import React, { ReactNode } from 'react';

interface ForecastCardProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

const ForecastCard = ({ title, subtitle, children }: ForecastCardProps) => {
  return (
    <div className="bg-e-dark-accent rounded-lg p-5">
      <div className="mb-4">
        <h3 className="font-medium">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default ForecastCard;
