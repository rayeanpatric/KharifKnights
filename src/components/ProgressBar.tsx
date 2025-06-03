
import React from 'react';
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  return (
    <div className={cn("w-full h-2 bg-gray-800 rounded-full overflow-hidden", className)}>
      <div 
        className="h-full bg-e-green rounded-full" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
