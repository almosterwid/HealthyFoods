import React, { useEffect, useState } from 'react';

function FoodForm({ food, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    food: '',
    origin: '',
    calories: '',
    protein: '',
    fiber: '',
    vitamin_c: '',
    antioxidant: '',
  });

  useEffect(() => {
    if (food) {
      setForm({
        food: food.food || '',
        origin: food.origin || '',
        calories: food.calories || '',
        protein: food.protein || '',
        fiber: food.fiber || '',
        vitamin_c: food.vitaminC || '',
        antioxidant: food.antioxidant || '',
      });
    } else {
      setForm({
        food: '',
        origin: '',
        calories: '',
        protein: '',
        fiber: '',
        vitamin_c: '',
        antioxidant: '',
      });
    }
  }, [food]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields simply
    if (!form.food || !form.origin) {
      alert('Food and Origin are required');
      return;
    }

    // Convert numbers to proper types before submitting
    const payload = {
      food: form.food,
      origin: form.origin,
      calories: parseInt(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      fiber: parseFloat(form.fiber) || 0,
      vitamin_c: parseFloat(form.vitamin_c) || 0,
      antioxidant: parseInt(form.antioxidant) || 0,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h2>{food ? 'Edit Food' : 'Add Food'}</h2>
      <input
        name="food"
        value={form.food}
        onChange={handleChange}
        placeholder="Food name"
        required
        disabled={!!food} // disable editing food name when editing
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        name="origin"
        value={form.origin}
        onChange={handleChange}
        placeholder="Origin (string)"
        required
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        name="calories"
        value={form.calories}
        onChange={handleChange}
        placeholder="Calories"
        type="number"
        min="0"
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        name="protein"
        value={form.protein}
        onChange={handleChange}
        placeholder="Protein"
        type="number"
        step="0.01"
        min="0"
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        name="fiber"
        value={form.fiber}
        onChange={handleChange}
        placeholder="Fiber"
        type="number"
        step="0.01"
        min="0"
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        name="vitamin_c"
        value={form.vitamin_c}
        onChange={handleChange}
        placeholder="Vitamin C"
        type="number"
        step="0.01"
        min="0"
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        name="antioxidant"
        value={form.antioxidant}
        onChange={handleChange}
        placeholder="Antioxidant"
        type="number"
        min="0"
        style={{ marginBottom: 10, width: '100%', padding: 8 }}
      />
      <button type="submit" style={{ marginRight: 10, padding: '10px 20px' }}>
        Save
      </button>
      <button type="button" onClick={onCancel} style={{ padding: '10px 20px' }}>
        Cancel
      </button>
    </form>
  );
}

export default FoodForm;
