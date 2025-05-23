import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onDelete, filter, onFilterChange }) => {
  return (
    <section className="expense-list">
      <div className="list-header">
        <h2>Your Expenses</h2>
        <div className="filter-group">
          <label htmlFor="filter">Filter by:</label>
          <select 
            id="filter" 
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <ul id="expenses">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <img
              src="https://img.icons8.com/?size=100&id=jl0y3hy9xCQ1&format=png&color=808080"
              alt="No expenses"
              style={{ width: 80, height: 80, marginBottom: 12 }}
            />
            No expenses found. Add one above!
          </div>
        ) : (
          expenses.map(expense => (
            <ExpenseItem 
              key={expense.id} 
              expense={expense} 
              onDelete={onDelete} 
            />
          ))
        )}
      </ul>
    </section>
  );
};

export default ExpenseList;