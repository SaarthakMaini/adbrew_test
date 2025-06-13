import React from 'react';

const TodoList = ({ todos, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <h2>Your Todos</h2>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <div className="todo-description">{todo.description}</div>
            <div className="todo-date">
              {new Date(todo.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList; 