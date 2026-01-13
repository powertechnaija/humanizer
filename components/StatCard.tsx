
import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, maxValue, color, suffix = '' }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between items-end">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-semibold text-white">{value}{suffix}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
