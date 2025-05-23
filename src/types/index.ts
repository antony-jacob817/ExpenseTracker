export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Housing' 
  | 'Utilities' 
  | 'Healthcare' 
  | 'Travel' 
  | 'Education' 
  | 'Other';

export interface MonthlyTotal {
  month: string;
  total: number;
  categories: Record<string, number>;
}

export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyComparison {
  currentMonth: MonthlyTotal;
  previousMonth: MonthlyTotal | null;
  differences: Record<string, number>;
  tips: string[];
}