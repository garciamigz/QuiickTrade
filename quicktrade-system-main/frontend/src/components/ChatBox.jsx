import React, { useState } from 'react';

const ChatBox = ({ isOpen, onClose, recipient }) => {
  const [message, setMessage] = useState('');
  const [activeConvo, setActiveConvo] = useState(0);
  
  const [conversations, setConversations] = useState([
    { 
      id: 0, 
      user: recipient || 'Owner of Dragon Lore', 
      messages: [{ sender: 'System', content: 'You are now connected. Be careful when trading!' }] 
    },
    { 
      id: 1, 
      user: 'Trader_Alice', 
      messages: [{ sender: 'Trader_Alice', content: 'Is the AWP still available?' }] 
    }
  ]);

  if (!isOpen) return null;

  const sendMessage = () => {
    if (!message.trim()) return;
    const updatedConvos = [...conversations];
    updatedConvos[activeConvo].messages.push({ sender: 'You', content: message });
    setConversations(updatedConvos);
    setMessage('');
  };

  return (
    <div className="chat-box-overlay" style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: '600px', height: '500px', backgroundColor: 'var(--black-light)',
      border: '1px solid var(--gold)', borderRadius: '12px', display: 'flex',
      zIndex: 1001, boxShadow: '0 0 20px rgba(0,0,0,0.5)', overflow: 'hidden'
    }}>
      {/* Conversation List */}
      <div className="convo-list" style={{
        width: '200px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #333', fontWeight: 'bold', color: 'var(--gold)' }}>
          Chats
        </div>
        {conversations.map((convo, idx) => (
          <div 
            key={convo.id} 
            onClick={() => setActiveConvo(idx)}
            style={{
              padding: '15px', cursor: 'pointer', borderBottom: '1px solid #222',
              backgroundColor: activeConvo === idx ? '#222' : 'transparent',
              fontSize: '0.9rem'
            }}
          >
            {convo.user}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="chat-header" style={{
          padding: '15px', borderBottom: '1px solid var(--gold)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h4 className="gold-glow">{conversations[activeConvo].user}</h4>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button title="Report" style={{ color: '#ff4444', fontSize: '0.8rem' }}>🚩 Report</button>
            <button onClick={onClose} style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>×</button>
          </div>
        </div>

        <div className="chat-messages" style={{
          flex: 1, padding: '15px', overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: '10px'
        }}>
          {conversations[activeConvo].messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'You' ? 'var(--gold)' : '#333',
              color: msg.sender === 'You' ? 'var(--black)' : 'white',
              padding: '8px 12px', borderRadius: '12px', maxWidth: '80%',
              fontSize: '0.8rem'
            }}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="chat-input-container" style={{
          padding: '15px', borderTop: '1px solid #333', display: 'flex', gap: '10px'
        }}>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1, backgroundColor: 'var(--black)', border: '1px solid #444',
              color: 'white', padding: '8px 12px', borderRadius: '20px', outline: 'none'
            }}
          />
          <button onClick={sendMessage} className="btn-gold" style={{ padding: '8px 15px', borderRadius: '20px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
