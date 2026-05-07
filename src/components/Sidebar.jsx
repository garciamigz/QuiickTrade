import React from 'react';

const Sidebar = ({ filters, onFilterChange }) => {
  const games = ["Counter Strike 2", "Roblox", "Dota 2", "Warframe"];
  const categoriesByGame = {
    "Counter Strike 2": ["Skins", "Cosmetics", "Weapons"],
    "Roblox": ["Cosmetics", "Mounts", "Limiteds"],
    "Dota 2": ["Skins", "Cosmetics", "Weapons"],
    "Warframe": ["Skins", "Cosmetics", "Mounts"]
  };

  const handleGameChange = (game) => {
    const newGames = filters.games.includes(game)
      ? filters.games.filter(g => g !== game)
      : [...filters.games, game];
    onFilterChange({ ...filters, games: newGames });
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  // Get relevant categories based on selected games
  const availableCategories = Array.from(new Set(
    filters.games.flatMap(game => categoriesByGame[game] || [])
  ));

  return (
    <aside className="sidebar">
      <div className="filter-group">
        <h3>Game Selector</h3>
        {games.map(game => (
          <div key={game} className="filter-option">
            <input 
              type="checkbox" 
              id={game} 
              checked={filters.games.includes(game)}
              onChange={() => handleGameChange(game)}
            />
            <label htmlFor={game}>{game}</label>
          </div>
        ))}
      </div>

      {filters.games.length > 0 && (
        <div className="filter-group">
          <h3>Item Categories</h3>
          {availableCategories.map(cat => (
            <div key={cat} className="filter-option">
              <input 
                type="checkbox" 
                id={cat} 
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              <label htmlFor={cat}>{cat}</label>
            </div>
          ))}
        </div>
      )}

      <div className="filter-group">
        <h3>Value Range: ${filters.valueRange[0]} - ${filters.valueRange[1]}+</h3>
        <input 
          type="range" 
          min="0" 
          max="5000" 
          step="50"
          value={filters.valueRange[1]} 
          onChange={(e) => onFilterChange({ ...filters, valueRange: [0, parseInt(e.target.value)] })}
          className="value-slider" 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-gray)', fontSize: '0.8rem' }}>
          <span>$0</span>
          <span>$5000+</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
