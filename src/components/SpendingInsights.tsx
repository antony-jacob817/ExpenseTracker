import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Lightbulb } from 'lucide-react';

const SpendingInsights: React.FC = () => {
  const { comparison } = useExpenses();
  
  if (!comparison || !comparison.tips.length) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center py-6">
          <Lightbulb className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Add more expenses to get personalized insights
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <span>Smart Insights</span>
      </h2>
      
      <div className="space-y-4">
        {comparison.tips.map((tip, index) => (
          <div 
            key={index} 
            className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-sm text-gray-700 dark:text-gray-200">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingInsights;