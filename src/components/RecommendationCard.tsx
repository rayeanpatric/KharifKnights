
import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  onClick?: () => void;
  variant?: 'default' | 'warning' | 'alert';
}

const RecommendationCard = ({ 
  title, 
  description, 
  icon, 
  actionLabel,
  onClick,
  variant = 'default'
}: RecommendationCardProps) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'warning':
        return 'border-e-yellow';
      case 'alert':
        return 'border-e-red';
      default:
        return 'border-gray-800';
    }
  };

  return (
    <div className={`border ${getBorderColor()} bg-e-dark-accent rounded-lg p-4 mb-4`}>
      <div className="flex items-center mb-2">
        {icon}
        <h3 className={`ml-2 font-medium ${variant === 'alert' ? 'text-e-red' : ''}`}>{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      {actionLabel && (
        <Button 
          onClick={onClick} 
          variant="outline" 
          className={`w-full justify-center text-sm ${
            variant === 'alert' ? 'border-e-red text-e-red hover:bg-e-red/10' : 
            variant === 'warning' ? 'border-e-yellow text-e-yellow hover:bg-e-yellow/10' : 
            'text-e-green border-e-green hover:bg-e-green/10'
          }`}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default RecommendationCard;
