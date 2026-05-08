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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>Value Range</h3>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '8px', color: 'var(--gold)', fontSize: '0.8rem' }}>$</span>
            <input 
              type="number" 
              value={filters.valueRange[1]} 
              onChange={(e) => onFilterChange({ ...filters, valueRange: [0, Math.max(0, parseInt(e.target.value) || 0)] })}
              style={{ 
                width: '80px', 
                padding: '4px 4px 4px 18px', 
                backgroundColor: 'var(--black)', 
                border: '1px solid var(--gold)', 
                color: 'white', 
                borderRadius: '4px',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="5000" 
          step="50"
          value={Math.min(5000, filters.valueRange[1])} 
          onChange={(e) => onFilterChange({ ...filters, valueRange: [0, parseInt(e.target.value)] })}
          className="value-slider" 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-gray)', fontSize: '0.8rem', marginBottom: '15px' }}>
          <span>$0</span>
          <span>$5000+</span>
        </div>

        {/* Currency Conversion Display */}
        <div className="currency-converter" style={{ 
          backgroundColor: 'rgba(212, 175, 55, 0.05)', 
          padding: '12px', 
          borderRadius: '8px', 
          border: '1px solid rgba(212, 175, 55, 0.2)' 
        }}>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: '8px', textTransform: 'uppercase' }}>Estimated Conversion</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-gray)' }}>₱ Pesos (PHP)</span>
              <span className="gold-glow">₱{(filters.valueRange[1] * 56.5).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-gray)' }}>€ Euro (EUR)</span>
              <span className="gold-glow">€{(filters.valueRange[1] * 0.93).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-gray)' }}>¥ Yen (JPY)</span>
              <span className="gold-glow">¥{(filters.valueRange[1] * 155.8).toLocaleString()}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>* Rates are estimates based on market average.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
