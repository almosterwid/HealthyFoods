import React, { useEffect, useState } from 'react';
import FoodForm from './FoodForm';
import FoodList from './FoodList';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [editingFood, setEditingFood] = useState(null);

  const fetchFoods = async () => {
    try {
      const res = await fetch('http://localhost:8080/foods');
      const data = await res.json();
      setFoods(data); // replace state fully to avoid duplicates
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleCreateOrUpdate = async (foodData) => {
    const method = editingFood ? 'PUT' : 'POST';
    const url = editingFood
      ? `http://localhost:8080/foods/${encodeURIComponent(editingFood.food)}`
      : 'http://localhost:8080/foods';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData),
      });
      setEditingFood(null);
      fetchFoods();
    } catch (error) {
      console.error('Failed to save food:', error);
    }
  };

  const handleDelete = async (foodName) => {
    try {
      await fetch(`http://localhost:8080/foods/${encodeURIComponent(foodName)}`, {
        method: 'DELETE',
      });
      fetchFoods();
    } catch (error) {
      console.error('Failed to delete food:', error);
    }
  };

  // Filter foods by food name and origin, case-insensitive
  const filteredFoods = foods.filter((f) => {
    const term = search.toLowerCase();
    return (
      f.food.toLowerCase().includes(term) ||
      (f.origin && f.origin.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
      <h1>Healthy Foods</h1>
      <input
        type="text"
        placeholder="Search by food or origin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      />
      <FoodForm
        food={editingFood}
        onSubmit={handleCreateOrUpdate}
        onCancel={() => setEditingFood(null)}
      />
      <FoodList foods={filteredFoods} onEdit={setEditingFood} onDelete={handleDelete} />
    </div>
  );
}

export default App;
