import { useState, useEffect } from 'react';
import ExpenseForm from './Components/ExpenseForm';
import ExpenseList from './Components/ExpenseList';
import DeletedExpenses from './Components/DeletedExpenses';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [deletedExpenses, setDeletedExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        const savedExpenses = localStorage.getItem('expenses');
        const savedDeleted = localStorage.getItem('deletedExpenses');
        
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
        
        if (savedDeleted) {
          setDeletedExpenses(JSON.parse(savedDeleted));
        }
      } catch (error) {
        console.error('Failed to load data from localStorage', error);
        // Initialize with empty arrays if loading fails
        setExpenses([]);
        setDeletedExpenses([]);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save before initial load completes
    
    const saveData = () => {
      try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('deletedExpenses', JSON.stringify(deletedExpenses));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
      }
    };
    
    saveData();
  }, [expenses, deletedExpenses, isLoaded]);

  const addExpense = (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: Date.now(),
      date: new Date().toISOString()
    };
    setExpenses(prev => [expenseWithId, ...prev]);
  };

  const deleteExpense = (id) => {
    const expenseToDelete = expenses.find(exp => exp.id === id);
    if (expenseToDelete) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      setDeletedExpenses(prev => [expenseToDelete, ...prev]);
    }
  };

  const restoreExpense = (id) => {
    const expenseToRestore = deletedExpenses.find(exp => exp.id === id);
    if (expenseToRestore) {
      setDeletedExpenses(prev => prev.filter(expense => expense.id !== id));
      setExpenses(prev => [expenseToRestore, ...prev]);
    }
  };

  const permanentlyDeleteExpense = (id) => {
    setDeletedExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const clearAllDeleted = () => {
    setDeletedExpenses([]);
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);
  
  if (!isLoaded) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faMoneyBillWave} className="header-icon" />
            Smart Spend
          </h1>
          <div className="total-display">
            <p className="total-label">Total Expenses:</p>
            <p className="total-amount">₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main>
        <div className="main-content">
          <div className="form-section">
            <ExpenseForm onAddExpense={addExpense} />
          </div>

          <div className="list-section">
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={deleteExpense}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
        </div>

        {deletedExpenses.length > 0 && (
          <div className="deleted-section">
            <DeletedExpenses
              deletedExpenses={deletedExpenses}
              onRestore={restoreExpense}
              onPermanentDelete={permanentlyDeleteExpense}
              onClearAll={clearAllDeleted}
            />
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>&copy; <span id="currentYear"></span> SmartSpend. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;