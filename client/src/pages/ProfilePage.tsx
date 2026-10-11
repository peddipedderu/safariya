import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGameStore } from '../store/gameStore';
import { gameApi, hiveApi } from '../services/api';
import ExplorerCardComponent from '../components/ExplorerCard';

export default function ProfilePage() {
  const { isLoggedIn, account, player, setPlayer } = useGameStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hiveAccount, setHiveAccount] = useState<any>(null);
  const [playerExplorers, setPlayerExplorers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !account) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [isLoggedIn, account]);

  const loadProfile = async () => {
    try {
      const [hiveData, playerData] = await Promise.all([
        hiveApi.getAccount(account!.name),
        gameApi.getPlayer(account!.name).catch(() => null),
      ]);
      setHiveAccount(hiveData);
      if (playerData) {
        setPlayer(playerData);
        setPlayerExplorers(playerData.explorers || []);
      }
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || !account) return null;

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const xpForNextLevel = (player?.level || 1) * 500;
  const currentXP = player?.xp || 0;
  const xpProgress = Math.min((currentXP % 500) / 500, 1);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Profile Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--card-bg), var(--panel-bg))',
            border: '2px solid var(--earth)',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background */}
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '40%',
              background: 'radial-gradient(ellipse at right, rgba(139,69,19,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--amber))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', flexShrink: 0,
                boxShadow: '0 0 20px rgba(245,200,66,0.4)',
              }}
            >
              🦁
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '4px' }}>
                @{account.name}
              </h1>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="hive-badge">🔴 Hive Explorer</span>
                {player && (
                  <>
                    <span className="hero-badge">Level {player.level}</span>
                    <span className="hero-badge">⭐ {player.rating} Rating</span>
                  </>
                )}
              </div>

              {/* XP Progress */}
              {player && (
                <div style={{ maxWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Level Progress</span>
                    <span style={{ color: 'var(--gold)' }}>{currentXP % 500} / 500 XP</span>
                  </div>
                  <div className="progress-bar" style={{ height: '10px' }}>
                    <div className="progress-fill" style={{ width: `${xpProgress * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {player && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="stat-card" style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div className="stat-number" style={{ color: 'var(--nature)', fontSize: '1.5rem' }}>
                    {player.wins}
                  </div>
                  <div className="stat-label">Wins</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div className="stat-number" style={{ color: '#e74c3c', fontSize: '1.5rem' }}>
                    {player.losses}
                  </div>
                  <div className="stat-label">Losses</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div className="stat-number" style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>
                    {player.territoriesCaptured}
                  </div>
                  <div className="stat-label">Territories</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hive Wallet */}
        {hiveAccount && (
          <div className="wallet-display" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '16px' }}>
              💰 Hive Wallet
            </h3>
            <div className="balance-row">
              <span style={{ color: 'var(--text-secondary)' }}>🔴 HIVE Balance</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                {hiveAccount.balance}
              </span>
            </div>
            <div className="balance-row">
              <span style={{ color: 'var(--text-secondary)' }}>💵 HBD Balance</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                {hiveAccount.hbd_balance}
              </span>
            </div>
            <div className="balance-row">
              <span style={{ color: 'var(--text-secondary)' }}>⚡ Vesting Shares</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {hiveAccount.vesting_shares?.split('.')[0]} VESTS
              </span>
            </div>
            <div className="balance-row">
              <span style={{ color: 'var(--text-secondary)' }}>📊 Reputation</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {hiveAccount.reputation ? Math.floor(Math.log10(Math.abs(hiveAccount.reputation)) * 9 - 56) : 25}
              </span>
            </div>
          </div>
        )}

        {/* My Explorer Cards */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '16px' }}>
            🃏 My Explorers ({playerExplorers.length})
          </h3>
          {playerExplorers.length === 0 ? (
            <div
              style={{
                textAlign: 'center', padding: '40px', background: 'var(--card-bg)',
                borderRadius: '16px', border: '1px dashed var(--border)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🃏</div>
              <p style={{ color: 'var(--text-muted)' }}>No Explorer cards yet</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => navigate('/market')}
              >
                🏪 Visit Market
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {playerExplorers.map((explorer) =>
                explorer.cardData ? (
                  <ExplorerCardComponent
                    key={explorer.id}
                    card={explorer.cardData}
                    owned
                  />
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Achievements */}
        {player?.achievements && player.achievements.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '16px' }}>
              🏆 Achievements
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {player.achievements.map((a) => (
                <span
                  key={a}
                  style={{
                    padding: '6px 14px', background: 'rgba(245,200,66,0.1)',
                    border: '1px solid rgba(245,200,66,0.3)', borderRadius: '20px',
                    color: 'var(--gold)', fontSize: '0.85rem',
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
