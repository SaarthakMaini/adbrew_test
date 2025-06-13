import React, { useState } from 'react';
import axios from 'axios';

const TodoForm = ({ onTodoAdded }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await axios.post('http://localhost:8000/rest/todos/', 
        { description },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data && response.data._id) {
        setDescription('');
        onTodoAdded();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo-form-container">
      <h2>Add New Todo</h2>
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(''); // Clear error when user types
            }}
            placeholder="What needs to be done?"
            className="form-control"
            disabled={isSubmitting}
            aria-label="Todo description"
          />
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            'Add Todo'
          )}
        </button>
      </form>
    </div>
  );
};

export default TodoForm; 