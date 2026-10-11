import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { gameApi } from '../services/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentBattles, setRecentBattles] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      gameApi.getLeaderboard(),
      gameApi.getRecentBattles(),
    ])
      .then(([lb, battles]) => {
        setLeaderboard(lb);
        setRecentBattles(battles);
      })
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  const rankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>🏆 Hall of Explorers</h1>
          <p className="section-subtitle">Africa's greatest adventurers, ranked by rating and conquest</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          {/* Leaderboard */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="loading-spinner" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌍</div>
                <p>No explorers yet. Be the first to conquer Africa!</p>
              </div>
            ) : (
              leaderboard.map((player, idx) => (
                <div key={player.username} className="leaderboard-row">
                  <span
                    className={`leaderboard-rank ${idx < 3 ? 'top-3' : ''}`}
                    style={{ fontSize: idx < 3 ? '1.5rem' : '1rem', minWidth: '48px' }}
                  >
                    {rankEmoji(idx + 1)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      @{player.username}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Level {player.level} · {player.territoriesCaptured || 0} territories
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--nature)' }}>
                      {player.wins}W <span style={{ color: 'var(--text-muted)' }}>/</span>{' '}
                      <span style={{ color: '#e74c3c' }}>{player.losses}L</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {player.wins + player.losses > 0
                        ? `${Math.round((player.wins / (player.wins + player.losses)) * 100)}% win rate`
                        : 'No battles'}
                    </div>
                  </div>
                  <div
                    style={{
                      background: idx === 0
                        ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.2))'
                        : idx === 1
                        ? 'rgba(192,192,192,0.15)'
                        : idx === 2
                        ? 'rgba(205,127,50,0.15)'
                        : 'rgba(245,200,66,0.05)',
                      border: `1px solid ${idx < 3 ? 'rgba(245,200,66,0.3)' : 'transparent'}`,
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 700,
                      color: 'var(--gold)',
                    }}
                  >
                    ⭐ {player.rating}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar - Recent Battles */}
          <div>
            <div className="card">
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '16px', fontSize: '1rem' }}>
                ⚔️ Recent Battles
              </h3>
              {recentBattles.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No battles yet</p>
              ) : (
                recentBattles.slice(0, 8).map((b, i) => (
                  <div
                    key={b.id || i}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        @{b.attacker}
                      </span>
                      <span style={{ color: b.winner === b.attacker ? 'var(--nature)' : '#e74c3c', fontWeight: 700, fontSize: '0.8rem' }}>
                        {b.winner === b.attacker ? '🏆 WIN' : '💔 LOSE'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                      {b.territory ? `📍 ${b.territory}` : '⚔️ Quick Battle'} · +{b.xpGained} XP
                      {parseFloat(b.hiveReward || '0') > 0 && (
                        <span style={{ color: 'var(--gold)', marginLeft: '6px' }}>+{b.hiveReward} HIVE</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Stats card */}
            <div className="card" style={{ marginTop: '16px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '12px', fontSize: '1rem' }}>
                📊 Global Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Explorers</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{leaderboard.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Battles</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{recentBattles.length}+</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Top Rating</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                    {leaderboard[0]?.rating || 'N/A'} ⭐
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
