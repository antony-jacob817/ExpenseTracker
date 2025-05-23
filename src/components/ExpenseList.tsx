import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { formatDate, getMonthYearFromDate, groupExpensesByMonth } from '../utils/dateUtils';
import { formatCurrency, getCategoryEmoji } from '../utils/chartUtils';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense => 
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group expenses by month
  const groupedExpenses = groupExpensesByMonth(filteredExpenses);
  
  // Sort months in descending order (most recent first)
  const sortedMonths = Object.keys(groupedExpenses).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Toggle month expansion
  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };
  
  // Initialize all months as expanded if not set
  React.useEffect(() => {
    const currentExpansionState: Record<string, boolean> = {};
    sortedMonths.forEach(month => {
      if (expandedMonths[month] === undefined) {
        currentExpansionState[month] = true;
      }
    });
    
    if (Object.keys(currentExpansionState).length > 0) {
      setExpandedMonths(prev => ({
        ...prev,
        ...currentExpansionState
      }));
    }
  }, [sortedMonths]);
  
  // Handle expense deletion with animation
  const handleDelete = (id: string) => {
    setDeletingId(id);
    
    // Wait for animation to complete
    setTimeout(() => {
      deleteExpense(id);
      setDeletingId(null);
    }, 300);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by category or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
          🔍
        </span>
      </div>
      
      {sortedMonths.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No expenses found. Try a different search term.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMonths.map(month => (
            <div key={month} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div 
                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => toggleMonth(month)}
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{month}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {formatCurrency(
                      groupedExpenses[month].reduce((sum, expense) => sum + expense.amount, 0)
                    )}
                  </span>
                  {expandedMonths[month] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedMonths[month] && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {groupedExpenses[month]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(expense => (
                      <div 
                        key={expense.id} 
                        className={`px-4 py-3 expense-item ${deletingId === expense.id ? 'deleting' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-xl" aria-hidden="true">
                              {getCategoryEmoji(expense.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {expense.category}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(expense.date)}
                                </span>
                              </div>
                              {expense.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                  {expense.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {formatCurrency(expense.amount)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(expense.id);
                              }}
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                              aria-label="Delete expense"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;