import React from 'react';

const TradeModal = ({ isOpen, onClose, item }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--black-light)', border: '1px solid var(--gold)',
        padding: '30px', borderRadius: '15px', width: '500px', maxWidth: '90%'
      }}>
        <h2 className="gold-glow" style={{ marginBottom: '20px' }}>Make a Trade Offer</h2>
        
        <div className="offer-summary" style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
          <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #333' }} />
          <div>
            <h3>{item.name}</h3>
            <p style={{ color: 'var(--gold)' }}>Value: ${item.value}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>Game: {item.game}</p>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Your Offer</label>
          <select style={{
            width: '100%', padding: '12px', backgroundColor: 'var(--black)',
            border: '1px solid var(--gold)', color: 'white', borderRadius: '8px'
          }}>
            <option>Select an item from your inventory...</option>
            <option>M4A4 | Howl ($2000)</option>
            <option>Knife Skins ($500)</option>
            <option>Robux ($100)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Message (Optional)</label>
          <textarea 
            placeholder="Add a message to your offer..."
            style={{
              width: '100%', padding: '12px', backgroundColor: 'var(--black)',
              border: '1px solid var(--gold)', color: 'white', borderRadius: '8px',
              height: '80px', resize: 'none'
            }}
          ></textarea>
        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-gold" style={{ flex: 1 }}>Send Offer</button>
          <button className="btn-outline-gold" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
