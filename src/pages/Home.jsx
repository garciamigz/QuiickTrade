import React, { useState } from "react";
import "./home.css";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";
import Footer from "../components/Footer";
import TradeModal from "../components/TradeModal";
import ChatBox from "../components/ChatBox";
import PostItemModal from "../components/PostItemModal";

export default function Home() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  
  const [filters, setFilters] = useState({
    games: [],
    categories: [],
    valueRange: [0, 5000]
  });

  const [items, setItems] = useState([
    { id: 1, name: "Dragon Lore AWP", game: "Counter Strike 2", category: "Skins", value: 1500, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2G9S68Yk2L-Vp46gjQfs_0VvYm_wIoXGdgQ6YV7U_gK5lL--jJ_u7p_BznF9-n51SOfS_is/360fx360f" },
    { id: 2, name: "Dominus Empyreus", game: "Roblox", category: "Limiteds", value: 5000, image: "https://tr.rbxcdn.com/39360879201f807865c697818e7e169d/420/420/Hat/Png" },
    { id: 3, name: "Dragonclaw Hook", game: "Dota 2", category: "Cosmetics", value: 200, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpov7as3vXdzptv1D9S5d26m5SCnvL7I7vUkmNI-cB1teXCoI72jAax_0s-Nm71coSWcgRrYV7S-le2ye3thJe0upvLwHUw7Cc8pSGKNoS6Uis/360fx360f" },
    { id: 4, name: "Excalibur Prime", game: "Warframe", category: "Skins", value: 1000, image: "https://static.wikia.nocookie.net/warframe/images/6/6e/ExcaliburPrimeNew.png" },
    { id: 5, name: "Karambit | Doppler", game: "Counter Strike 2", category: "Skins", value: 800, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYi59_92_mYWFk-71N77um25V4dB8xO3Ept2tjAex-0NtZzjzJ4TAd1A3YFmB_Fm8xeu8g5S8vJzKy3Z9-n5160mY66M/360fx360f" },
    { id: 6, name: "Valkyrie Helm", game: "Roblox", category: "Limiteds", value: 1200, image: "https://tr.rbxcdn.com/f88b0561e1b438274f8287d35502c462/420/420/Hat/Png" },
  ]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("Logged out!");
  };

  const handleTrade = (item) => {
    if (!token) {
      alert("Please login to trade!");
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleMessage = (item) => {
    if (!token) {
      alert("Please login to message owners!");
      return;
    }
    setChatRecipient("Owner of " + item.name);
    setIsChatOpen(true);
  };

  const handleBookmark = (itemId) => {
    if (!token) {
      alert("Please login to bookmark items!");
      return;
    }
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handlePostItem = (newItem) => {
    const itemToAdd = {
      id: items.length + 1,
      ...newItem,
      image: "https://via.placeholder.com/150"
    };
    setItems([itemToAdd, ...items]);
    alert("Item listed successfully!");
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = filters.games.length === 0 || filters.games.includes(item.game);
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
    const matchesValue = item.value >= filters.valueRange[0] && item.value <= filters.valueRange[1];
    return matchesSearch && matchesGame && matchesCategory && matchesValue;
  });

  return (
    <div className="home-container">
      <TopBar 
        token={token} 
        logout={logout} 
        onPostItem={() => setIsPostModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="main-layout">
        <Sidebar filters={filters} onFilterChange={setFilters} />
        
        <div className="center-content">
          <div className="hero-section" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 className="gold-glow" style={{ fontSize: '3rem', marginBottom: '10px' }}>Trade Smarter, Trade Faster</h1>
            <p style={{ color: 'var(--text-gray)', fontSize: '1.2rem' }}>The ultimate cross-game trading platform.</p>
          </div>

          <div className="item-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  isBookmarked={favorites.includes(item.id)}
                  onTrade={handleTrade} 
                  onMessage={handleMessage} 
                  onBookmark={() => handleBookmark(item.id)}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-gray)' }}>
                <h3>No items found matching your criteria.</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {selectedItem && (
        <TradeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          item={selectedItem} 
        />
      )}

      <ChatBox 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        recipient={chatRecipient} 
      />

      <PostItemModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPost={handlePostItem} 
      />
    </div>
  );
}
