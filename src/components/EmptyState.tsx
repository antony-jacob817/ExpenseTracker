import React from 'react';
import { ReceiptIndianRupee, ArrowDown } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="card empty-state">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
          <ReceiptIndianRupee  className="h-16 w-16 text-blue-500 dark:text-blue-400" />
        </div>
        
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            No expenses tracked yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first expense using the form above to start tracking your spending
          </p>
        </div>
        
        <ArrowDown className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-bounce mt-4" />
      </div>
    </div>
  );
};

export default EmptyState;