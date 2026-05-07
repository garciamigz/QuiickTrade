import React, { useState } from 'react';
import './profile.css';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function Profile() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [activeTab, setActiveTab] = useState('favorites');

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/";
  };

  return (
    <div className="profile-container">
      <TopBar token={token} logout={logout} />
      
      <main className="profile-content">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar-placeholder">T</div>
            <div>
              <h2 className="gold-glow">Trader_Pro</h2>
              <p className="premium-badge">Premium Member</p>
            </div>
          </div>
          <div className="wallet-summary">
            <p>QTC Balance: <span className="gold-glow">5,420 Credits</span></p>
            <button className="btn-gold">Top Up</button>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'favorites' ? 'active' : ''} 
            onClick={() => setActiveTab('favorites')}
          >
            My Favorites
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''} 
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
          <button 
            className={activeTab === 'support' ? 'active' : ''} 
            onClick={() => setActiveTab('support')}
          >
            Help & Support
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'favorites' && (
            <div className="favorites-grid">
              <p style={{ color: 'var(--text-gray)' }}>You haven't bookmarked any items yet.</p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-list">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2026-05-01</td>
                    <td>Trade</td>
                    <td>Karambit | Doppler</td>
                    <td className="status-completed">Completed</td>
                    <td>$800.00</td>
                  </tr>
                  <tr>
                    <td>2026-04-28</td>
                    <td>Buy Credits</td>
                    <td>1000 QTC</td>
                    <td className="status-completed">Completed</td>
                    <td>$10.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-form">
              <div className="form-group">
                <label>Change Password</label>
                <input type="password" placeholder="New Password" />
              </div>
              <div className="form-group">
                <label>Theme Toggle</label>
                <div className="toggle-switch">
                  <span className="gold-glow">Black & Gold (Active)</span>
                </div>
              </div>
              <div className="form-group">
                <label>Notifications</label>
                <div className="checkbox-group">
                  <input type="checkbox" id="email-notif" defaultChecked />
                  <label htmlFor="email-notif">Email Alerts for Offers</label>
                </div>
              </div>
              <button className="btn-gold">Save Changes</button>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="support-section">
              <h3 className="gold-glow">Contact Support</h3>
              <form className="support-form">
                <select className="support-select">
                  <option>Account Issues</option>
                  <option>Trade Disputes</option>
                  <option>Billing / Credits</option>
                  <option>Technical Bug</option>
                </select>
                <textarea placeholder="Describe your issue..." className="support-textarea"></textarea>
                <button type="button" className="btn-gold">Submit Ticket</button>
              </form>
              <div className="live-chat-box">
                <p>Live Chat: <span className="status-completed">Online</span></p>
                <button className="btn-outline-gold">Start Chat</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
