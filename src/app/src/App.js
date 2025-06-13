import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos/');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      setError('Failed to load todos. Please try again.');
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        setDescription('');
        await fetchTodos(); // Refresh list
      } else {
        const err = await response.json();
        setError('Failed to add todo. Please try again.');
        console.error('Failed to add todo:', err);
      }
    } catch (error) {
      setError('Error submitting todo. Please try again.');
      console.error('Error submitting todo:', error);
    }
    setLoading(false);
  };

  // Handle task deletion
  const handleDelete = async (id) => {
    setDeletingId(id);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTodos(); // Refresh list
      } else {
        const err = await response.json();
        setError('Failed to delete todo. Please try again.');
        console.error('Failed to delete todo:', err);
      }
    } catch (error) {
      setError('Error deleting todo. Please try again.');
      console.error('Error deleting todo:', error);
    }
    setDeletingId(null);
  };

  return (
    <div className="container">
      <h2>TODO App</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={description}
          placeholder="Enter a new TODO"
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <button type="submit" disabled={loading} className="button">
          {loading ? 'Adding...' : 'Add TODO'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo._id} className="listItem">
            <span>{todo.description}</span>
            <button 
              onClick={() => handleDelete(todo._id)} 
              className="delete-button"
              disabled={deletingId === todo._id}
            >
              {deletingId === todo._id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
