import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos/');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
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
        console.error('Failed to add todo:', err);
      }
    } catch (error) {
      console.error('Error submitting todo:', error);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>TODO App</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={description}
          placeholder="Enter a new TODO"
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Adding...' : 'Add TODO'}
        </button>
      </form>

      <ul style={styles.list}>
        {todos.map((todo) => (
          <li key={todo._id} style={styles.listItem}>
            {todo.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  list: {
    padding: 0,
    listStyleType: 'none',
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default App;
