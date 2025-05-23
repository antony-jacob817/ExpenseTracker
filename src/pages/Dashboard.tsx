import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import MonthlyOverview from '../components/MonthlyOverview';
import DataVisualization from '../components/DataVisualization';
import SpendingInsights from '../components/SpendingInsights';
import EmptyState from '../components/EmptyState';

const Dashboard: React.FC = () => {
  const { expenses, loading } = useExpenses();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-400 rounded-full"></div>
          <div className="space-y-4">
            <div className="h-4 bg-blue-400 rounded w-36"></div>
            <div className="h-4 bg-blue-400 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <ExpenseForm />
          </div>
        </div>
        <div>
          <MonthlyOverview />
        </div>
      </div>
      
      {expenses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
                <ExpenseList />
              </div>
            </div>
            <div>
              <SpendingInsights />
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Expense Breakdown</h2>
            <DataVisualization />
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Dashboard;