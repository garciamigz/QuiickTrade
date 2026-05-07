import React, { useState, useEffect } from 'react';
import './reports.css';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

export default function Reports() {
  const [token] = useState(localStorage.getItem("token"));
  const [reportData, setReportData] = useState({
    tradesPerGame: [
      { game: 'Counter Strike 2', total_trades: 45 },
      { game: 'Roblox', total_trades: 32 },
      { game: 'Dota 2', total_trades: 18 },
      { game: 'Warframe', total_trades: 12 }
    ],
    itemDistribution: [
      { game: 'Counter Strike 2', count: 120 },
      { game: 'Roblox', count: 85 },
      { game: 'Dota 2', count: 45 },
      { game: 'Warframe', count: 30 }
    ],
    recentActivity: [
      { trade_id: 101, status: 'completed', timestamp: '2026-05-07 14:30', offered_item: 'Dragon Lore AWP', requested_item: 'Dominus Empyreus' },
      { trade_id: 102, status: 'pending', timestamp: '2026-05-07 15:15', offered_item: 'Karambit | Doppler', requested_item: 'Valkyrie Helm' },
      { trade_id: 103, status: 'cancelled', timestamp: '2026-05-07 16:00', offered_item: 'Dragonclaw Hook', requested_item: 'Excalibur Prime' }
    ]
  });

  const exportCSV = () => {
    const headers = "Trade ID,Status,Timestamp,Offered Item,Requested Item\n";
    const rows = reportData.recentActivity.map(r => 
      `${r.trade_id},${r.status},${r.timestamp},${r.offered_item},${r.requested_item}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'quicktrade_report.csv');
    a.click();
    alert("Report exported as CSV!");
  };

  return (
    <div className="reports-container">
      <TopBar token={token} />
      
      <main className="reports-content">
        <div className="reports-header">
          <h1 className="gold-glow">Analytics & Reports</h1>
          <button className="btn-gold" onClick={exportCSV}>Export CSV</button>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="gold-glow">Trades per Game</h3>
            <div className="bar-chart-sim">
              {reportData.tradesPerGame.map(game => (
                <div key={game.game} className="bar-row">
                  <span className="bar-label">{game.game}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${(game.total_trades / 50) * 100}%` }}></div>
                  </div>
                  <span className="bar-value">{game.total_trades}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3 className="gold-glow">Item Distribution</h3>
            <div className="stats-list">
              {reportData.itemDistribution.map(item => (
                <div key={item.game} className="stat-item">
                  <span style={{ color: 'var(--text-gray)' }}>{item.game}</span>
                  <span className="gold-glow" style={{ fontWeight: 'bold' }}>{item.count} Items</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="activity-section">
          <h3 className="gold-glow" style={{ marginBottom: '20px' }}>Recent Activity Logs</h3>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Trade ID</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Offered</th>
                <th>Requested</th>
              </tr>
            </thead>
            <tbody>
              {reportData.recentActivity.map(activity => (
                <tr key={activity.trade_id}>
                  <td>#{activity.trade_id}</td>
                  <td className={`status-${activity.status}`}>{activity.status}</td>
                  <td>{activity.timestamp}</td>
                  <td>{activity.offered_item}</td>
                  <td>{activity.requested_item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
