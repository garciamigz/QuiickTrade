import React, { useState } from 'react';

const PostItemModal = ({ isOpen, onClose, onPost }) => {
  const [formData, setFormData] = useState({
    name: '',
    game: 'Counter Strike 2',
    description: '',
    value: '',
    tags: '',
    preferences: '',
    visibility: 'public'
  });
  const [screenshot, setScreenshot] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit!");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert("Invalid file type! Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      setScreenshot(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPost({ ...formData, screenshot });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--black-light)', border: '1px solid var(--gold)',
        padding: '30px', borderRadius: '15px', width: '600px', maxWidth: '90%',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 className="gold-glow" style={{ marginBottom: '20px' }}>List New Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Item Name *</label>
            <input 
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px' }}
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Game *</label>
              <select 
                name="game" value={formData.game} onChange={handleChange}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px' }}
              >
                <option>Counter Strike 2</option>
                <option>Roblox</option>
                <option>Dota 2</option>
                <option>Warframe</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Estimated Value ($) *</label>
              <input 
                type="number" name="value" required
                value={formData.value} onChange={handleChange}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange}
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px', height: '80px', resize: 'none' }}
            ></textarea>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Tags</label>
              <input 
                type="text" name="tags" placeholder="rare, limited"
                value={formData.tags} onChange={handleChange}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px' }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Visibility</label>
              <select 
                name="visibility" value={formData.visibility} onChange={handleChange}
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px' }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Trade Preferences</label>
            <input 
              type="text" name="preferences" placeholder="Desired item or value range..."
              value={formData.preferences} onChange={handleChange}
              style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', border: '1px solid #444', color: 'white', borderRadius: '5px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Upload Screenshot (Max 5MB)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              style={{ color: 'var(--text-gray)' }} 
            />
          </div>

          <div className="modal-actions" style={{ display: 'flex', gap: '15px' }}>
            <button type="submit" className="btn-gold" style={{ flex: 1 }}>Submit Listing</button>
            <button type="button" className="btn-outline-gold" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItemModal;
