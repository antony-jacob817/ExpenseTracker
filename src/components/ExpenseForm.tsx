import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { getDefaultDateString } from '../utils/dateUtils';
import { ExpenseCategory } from '../types';
import { PlusCircle } from 'lucide-react';

const categories: ExpenseCategory[] = [
  'Food', 
  'Transport', 
  'Entertainment', 
  'Shopping', 
  'Housing', 
  'Utilities', 
  'Healthcare', 
  'Travel', 
  'Education', 
  'Other'
];

const ExpenseForm: React.FC = () => {
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState<string>(getDefaultDateString());
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    addExpense({
      amount: amountNum,
      category,
      date,
      description
    });
    
    // Reset form
    setAmount('');
    setCategory('Food');
    setDate(getDefaultDateString());
    setDescription('');
    setError('');
    
    // Show success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-md animate-fade-in">
          Expense added successfully!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="form-label">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="form-input pl-8"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            required
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            className="form-input"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <button 
          type="submit" 
          className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Expense</span>
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;