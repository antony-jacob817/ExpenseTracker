import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { calculatePieSegments, getCategoryColor, getCategoryEmoji, formatCurrency } from '../utils/chartUtils';

const DataVisualization: React.FC = () => {
  const { categoryTotals, monthlyData } = useExpenses();
  const [activeTab, setActiveTab] = useState<'pie' | 'bar'>('pie');
  
  // Calculate SVG dimensions
  const svgSize = 220;
  const radius = svgSize / 2 - 10;
  
  // Calculate pie chart segments
  const pieSegments = calculatePieSegments(categoryTotals, radius);
  
  // Prepare data for bar chart
  const months = Object.keys(monthlyData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  }).slice(-6); // Last 6 months
  
  const maxMonthlyAmount = Math.max(
    ...months.map(month => monthlyData[month].total)
  );
  
  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'pie'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('pie')}
        >
          Category Breakdown
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'bar'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('bar')}
        >
          Monthly Trend
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'pie' ? (
          <>
            <div className="flex justify-center items-center">
              {categoryTotals.length > 0 ? (
                <div className="chart-container" style={{ maxWidth: `${svgSize}px` }}>
                  <svg 
                    width={svgSize} 
                    height={svgSize} 
                    viewBox={`0 0 ${svgSize} ${svgSize}`}
                    className="pie-chart"
                  >
                    {pieSegments.map((segment, index) => (
                      <path
                        key={index}
                        d={segment.path}
                        fill={segment.color}
                        className="pie-segment"
                      />
                    ))}
                    <circle
                      cx={svgSize / 2}
                      cy={svgSize / 2}
                      r={radius / 2}
                      fill="var(--color-card)"
                    />
                  </svg>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No data available for pie chart
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {categoryTotals.length > 0 ? (
                  categoryTotals.map(category => (
                    <div key={category.category} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: getCategoryColor(category.category) }}
                      ></div>
                      <div className="flex-1 flex items-center">
                        <span className="mr-2">{getCategoryEmoji(category.category)}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(category.total)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {category.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No categories to display
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-medium mb-4">Monthly Spending Trend</h3>
              
              {months.length > 0 ? (
                <div className="h-60 flex items-end justify-between gap-2">
                  {months.map(month => {
                    const monthData = monthlyData[month];
                    const barHeight = (monthData.total / maxMonthlyAmount) * 100;
                    
                    return (
                      <div key={month} className="flex flex-col items-center flex-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {formatCurrency(monthData.total)}
                        </div>
                        <div 
                          className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-md bar-chart-bar"
                          style={{ 
                            height: `${Math.max(barHeight, 4)}%`,
                            opacity: 0.6 + (barHeight / 400)
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '100%' }}>
                          {month.split(' ')[0].substring(0, 3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No data available for bar chart
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Monthly Comparison</h3>
              
              {months.length >= 2 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Highest Month</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {months.reduce((highest, month) => 
                          monthlyData[month].total > monthlyData[highest].total ? month : highest
                        , months[0])}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {formatCurrency(monthlyData[months.reduce((highest, month) => 
                          monthlyData[month].total > monthlyData[highest].total ? month : highest
                        , months[0])].total)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lowest Month</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {months.reduce((lowest, month) => 
                          monthlyData[month].total < monthlyData[lowest].total ? month : lowest
                        , months[0])}
                      </p>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        {formatCurrency(monthlyData[months.reduce((lowest, month) => 
                          monthlyData[month].total < monthlyData[lowest].total ? month : lowest
                        , months[0])].total)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Monthly Spending</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(
                        months.reduce((sum, month) => sum + monthlyData[month].total, 0) / months.length
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Need at least two months of data for comparison
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataVisualization;