import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ExpenseItem = ({ expense, onDelete }) => {
  return (
    <li className="expense-item">
      <div className="expense-info">
        <span className="category-badge">{expense.category}</span>
        {expense.note && <p className="expense-note">{expense.note}</p>}
      </div>
      <div className="expense-amount">${expense.amount.toFixed(2)}</div>
      <button 
        className="delete-btn" 
        onClick={() => onDelete(expense.id)}
        aria-label="Delete expense"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </li>
  );
};

export default ExpenseItem;