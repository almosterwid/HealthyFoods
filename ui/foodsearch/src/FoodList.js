import React from 'react';

function FoodList({ foods, onEdit, onDelete }) {
  if (foods.length === 0) {
    return <p>No foods found.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {foods.map((food) => (
        <li
          key={food.food} // unique key to avoid duplicate rendering
          style={{
            padding: 10,
            marginBottom: 8,
            border: '1px solid #ccc',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div>
            <strong>{food.food}</strong> — {food.origin} | Calories: {food.calories} | Protein:{' '}
            {food.protein}g
          </div>
          <div>
            <button
              onClick={() => onEdit(food)}
              style={{ marginRight: 10, padding: '5px 10px' }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(`Are you sure you want to delete "${food.food}"?`)
                ) {
                  onDelete(food.food);
                }
              }}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default FoodList;
