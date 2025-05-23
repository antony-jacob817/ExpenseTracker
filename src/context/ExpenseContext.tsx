import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, MonthlyTotal, CategoryTotal, MonthlyComparison } from '../types';
import { formatMonthYear, getCurrentMonthYear, getPreviousMonthYear } from '../utils/dateUtils';
import { generateTips } from '../utils/tipUtils';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  monthlyData: Record<string, MonthlyTotal>;
  categoryTotals: CategoryTotal[];
  currentMonthTotal: number;
  comparison: MonthlyComparison | null;
  loading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<Record<string, MonthlyTotal>>({});
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [comparison, setComparison] = useState<MonthlyComparison | null>(null);
  const [loading, setLoading] = useState(true);

  // Load expenses from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    setLoading(false);
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, loading]);

  // Calculate monthly data and category totals
  useEffect(() => {
    if (expenses.length === 0) {
      setMonthlyData({});
      setCategoryTotals([]);
      setCurrentMonthTotal(0);
      setComparison(null);
      return;
    }

    // Calculate monthly data
    const months: Record<string, MonthlyTotal> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = formatMonthYear(date);
      
      if (!months[monthYear]) {
        months[monthYear] = {
          month: monthYear,
          total: 0,
          categories: {}
        };
      }
      
      months[monthYear].total += expense.amount;
      
      if (!months[monthYear].categories[expense.category]) {
        months[monthYear].categories[expense.category] = 0;
      }
      
      months[monthYear].categories[expense.category] += expense.amount;
    });
    
    setMonthlyData(months);
    
    // Calculate current month's category totals
    const currentMonth = getCurrentMonthYear();
    const currentMonthData = months[currentMonth];
    
    if (currentMonthData) {
      setCurrentMonthTotal(currentMonthData.total);
      
      const categories: CategoryTotal[] = Object.entries(currentMonthData.categories).map(
        ([category, total]) => ({
          category,
          total,
          percentage: (total / currentMonthData.total) * 100
        })
      ).sort((a, b) => b.total - a.total);
      
      setCategoryTotals(categories);
      
      // Calculate month-to-month comparison
      const previousMonth = getPreviousMonthYear();
      const previousMonthData = months[previousMonth];
      
      if (previousMonthData) {
        const differences: Record<string, number> = {};
        const allCategories = new Set([
          ...Object.keys(currentMonthData.categories),
          ...Object.keys(previousMonthData.categories)
        ]);
        
        allCategories.forEach(category => {
          const currentAmount = currentMonthData.categories[category] || 0;
          const previousAmount = previousMonthData.categories[category] || 0;
          
          if (currentAmount > 0 || previousAmount > 0) {
            const percentChange = previousAmount === 0 
              ? 100 
              : ((currentAmount - previousAmount) / previousAmount) * 100;
            
            differences[category] = percentChange;
          }
        });
        
        const tips = generateTips(differences, currentMonthData, previousMonthData);
        
        setComparison({
          currentMonth: currentMonthData,
          previousMonth: previousMonthData,
          differences,
          tips
        });
      } else {
        setComparison({
          currentMonth: currentMonthData,
          previousMonth: null,
          differences: {},
          tips: ["This is your first month tracking expenses!"]
        });
      }
    } else {
      setCategoryTotals([]);
      setCurrentMonthTotal(0);
      setComparison(null);
    }
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider 
      value={{
        expenses,
        addExpense,
        deleteExpense,
        monthlyData,
        categoryTotals,
        currentMonthTotal,
        comparison,
        loading
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}