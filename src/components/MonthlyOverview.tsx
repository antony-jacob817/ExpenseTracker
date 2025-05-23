import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/chartUtils';
import { getCurrentMonth } from '../utils/dateUtils';
import { TrendingDown, TrendingUp } from 'lucide-react';

const MonthlyOverview: React.FC = () => {
  const { currentMonthTotal, comparison } = useExpenses();
  
  // Calculate percent change from last month
  const percentChange = comparison?.previousMonth
    ? ((currentMonthTotal - comparison.previousMonth.total) / comparison.previousMonth.total) * 100
    : 0;
  
  const isIncrease = percentChange > 0;
  
  return (
    <div className="card h-full">
      <h2 className="text-xl font-semibold mb-2">Monthly Overview</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {getCurrentMonth()} spending summary
      </p>
      
      <div className="flex flex-col items-start space-y-6">
        <div className="w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(currentMonthTotal)}
          </p>
          
          {comparison?.previousMonth && (
            <div className={`mt-2 flex items-center text-sm ${
              isIncrease 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-green-500 dark:text-green-400'
            }`}>
              {isIncrease ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>
                {isIncrease ? '+' : ''}{Math.abs(percentChange).toFixed(1)}% from last month
              </span>
            </div>
          )}
        </div>
        
        {comparison?.previousMonth && (
          <div className="w-full pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Month</p>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {formatCurrency(comparison.previousMonth.total)}
            </p>
          </div>
        )}
        
        <div className="w-full pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Categories</p>
          <div className="mt-2 space-y-2">
            {!comparison?.currentMonth ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No data for current month
              </p>
            ) : (
              Object.entries(comparison.currentMonth.categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOverview;