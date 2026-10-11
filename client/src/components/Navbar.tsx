import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function Navbar() {
  const { account, isLoggedIn, player, logout } = useGameStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <span style={{ fontSize: '1.8rem' }}>🌍</span>
        <span>SAFARIYA</span>
        <span
          style={{
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '2px',
            marginLeft: '-4px',
            marginTop: '14px',
          }}
        >
          AFRICA EXPLORER
        </span>
      </Link>

      {/* Nav links */}
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>🏠 Home</Link>
        <Link to="/explore" className={isActive('/explore')}>🗺️ Explore</Link>
        <Link to="/cards" className={isActive('/cards')}>🃏 Cards</Link>
        <Link to="/battle" className={isActive('/battle')}>⚔️ Battle</Link>
        <Link to="/market" className={isActive('/market')}>🏪 Market</Link>
        <Link to="/leaderboard" className={isActive('/leaderboard')}>🏆 Ranks</Link>
      </div>

      {/* User section */}
      <div className="navbar-user">
        {isLoggedIn && account ? (
          <>
            {player && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  background: 'rgba(245,200,66,0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245,200,66,0.2)',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lv.{player.level}</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {player.rating} ⭐
                </span>
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ gap: '8px' }}
              >
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span style={{ color: 'var(--gold)' }}>@{account.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>▼</span>
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    minWidth: '180px',
                    zIndex: 1001,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="nav-link"
                    style={{ display: 'block', padding: '12px 16px' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/wallet"
                    className="nav-link"
                    style={{ display: 'block', padding: '12px 16px' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    💰 Wallet
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={handleLogout}
                      className="nav-link"
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#e74c3c',
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px' }}>
            🎮 Play Now
          </Link>
        )}

        {/* Hive badge */}
        <span className="hive-badge">
          <span style={{ fontSize: '0.9rem' }}>🔴</span> HIVE
        </span>
      </div>
    </nav>
  );
}
