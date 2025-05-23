import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUndo, faTimes } from '@fortawesome/free-solid-svg-icons';

const DeletedExpenses = ({ 
  deletedExpenses, 
  onRestore, 
  onPermanentDelete,
  onClearAll 
}) => {
  return (
    <div className="deleted-expenses-container">
      <div className="section-header">
        <h3>
          <FontAwesomeIcon icon={faTrashAlt} />
          Recently Deleted
          <span className="badge">{deletedExpenses.length}</span>
        </h3>
        <button 
          className="clear-all-btn"
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>
      
      <ul className="deleted-list">
        {deletedExpenses.map(expense => (
          <li key={expense.id} className="deleted-item">
            <div className="expense-info">
              <span className="category-badge">{expense.category}</span>
              <span className="amount">${expense.amount.toFixed(2)}</span>
              {expense.note && <p className="note">{expense.note}</p>}
            </div>
            <div className="actions">
              <button 
                className="btn-restore"
                onClick={() => onRestore(expense.id)}
              >
                <FontAwesomeIcon icon={faUndo} /> Restore
              </button>
              <button 
                className="btn-delete"
                onClick={() => onPermanentDelete(expense.id)}
              >
                <FontAwesomeIcon icon={faTimes} /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeletedExpenses;