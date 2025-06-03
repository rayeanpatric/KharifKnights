
import React, { ReactNode } from 'react';

interface WeatherDayProps {
  day: string;
  icon: ReactNode;
  temp: string;
}

const WeatherDay = ({ day, icon, temp }: WeatherDayProps) => {
  return (
    <div className="text-center">
      <p className="text-sm mb-2">{day}</p>
      <div className="flex justify-center mb-1">
        {icon}
      </div>
      <p className="text-sm">{temp}</p>
    </div>
  );
};

export default WeatherDay;
