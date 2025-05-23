import { useState } from 'react';

const ExpenseForm = ({ onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0 || !category) {
      alert('Please enter a valid amount and select a category');
      return;
    }
    
    onAddExpense({
      amount: amountValue,
      category,
      note,
      date: new Date().toISOString()
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setNote('');
  };

  return (
    <section className="add-expense">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input 
            type="number" 
            id="amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="1" 
            min="0" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>
          <input 
            type="text" 
            id="note" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Dinner with friends" 
          />
        </div>

        <button type="submit" className="btn">Add Expense</button>
      </form>
    </section>
  );
};

export default ExpenseForm;