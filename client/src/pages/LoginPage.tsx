import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGameStore } from '../store/gameStore';
import { hiveApi, keychainApi, gameApi } from '../services/api';
import ParticleBackground from '../components/ParticleBackground';

type LoginTab = 'keychain' | 'keys';

export default function LoginPage() {
  const [tab, setTab] = useState<LoginTab>('keychain');
  const [username, setUsername] = useState('');
  const [postingKey, setPostingKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [keychainAvailable, setKeychainAvailable] = useState(false);

  const { setAccount, setPlayer } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    setKeychainAvailable(keychainApi.isInstalled());
  }, []);

  const handleKeychainLogin = async () => {
    if (!username.trim()) {
      toast.error('Enter your Hive username!');
      return;
    }
    setLoading(true);
    try {
      // Verify account exists on Hive
      const accountData = await hiveApi.getAccount(username.trim().toLowerCase());
      
      // Try Keychain login
      const result = await keychainApi.login(username.trim().toLowerCase());
      if (!result.success) {
        toast.error(result.error || 'Keychain login failed');
        return;
      }

      // Init player
      await gameApi.initPlayer(username.trim().toLowerCase());
      const player = await gameApi.getPlayer(username.trim().toLowerCase());

      setAccount({
        name: username.trim().toLowerCase(),
        balance: accountData.balance,
        hbd_balance: accountData.hbd_balance,
        reputation: accountData.reputation,
      });
      setPlayer(player);

      toast.success(`🌍 Welcome to Africa, ${username}!`);
      navigate('/explore');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Login failed. Check your username.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyLogin = async () => {
    if (!username.trim() || !postingKey.trim()) {
      toast.error('Enter your username and posting key!');
      return;
    }
    if (!postingKey.startsWith('5')) {
      toast.error('Invalid posting key format (should start with 5)');
      return;
    }
    setLoading(true);
    try {
      // Verify account and key work
      const accountData = await hiveApi.getAccount(username.trim().toLowerCase());
      
      // Test broadcast to verify key (dry run)
      await hiveApi.broadcast(
        username.trim().toLowerCase(),
        postingKey.trim(),
        'login',
        { timestamp: Date.now(), game: 'safariya' }
      );

      // Init player on server
      await gameApi.initPlayer(username.trim().toLowerCase());
      const player = await gameApi.getPlayer(username.trim().toLowerCase()).catch(() => null);

      setAccount({
        name: username.trim().toLowerCase(),
        postingKey: postingKey.trim(),
        balance: accountData.balance,
        hbd_balance: accountData.hbd_balance,
        reputation: accountData.reputation,
      });
      if (player) setPlayer(player);

      toast.success(`🦁 Welcome to Safariya, ${username}!`);
      navigate('/explore');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'radial-gradient(ellipse at center, rgba(139,69,19,0.2) 0%, transparent 70%), var(--dark-bg)',
        padding: '20px',
      }}
    >
      <ParticleBackground />

      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🌍</div>
          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '2.5rem',
              color: 'var(--gold)',
              textShadow: '0 0 30px rgba(245,200,66,0.5)',
              letterSpacing: '4px',
            }}
          >
            SAFARIYA
          </h1>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '3px', fontSize: '0.8rem', marginTop: 4 }}>
            AFRICA EXPLORER
          </p>
          <span className="hive-badge" style={{ marginTop: '12px', display: 'inline-flex' }}>
            🔴 Powered by Hive Blockchain
          </span>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '2px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.3rem' }}>
            Enter the Savanna
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Connect with your Hive account to begin your African adventure
          </p>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => setTab('keychain')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: tab === 'keychain' ? 'var(--gold)' : 'transparent',
                color: tab === 'keychain' ? 'var(--dark-bg)' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
            >
              🔑 Keychain
              {keychainAvailable && (
                <span
                  style={{
                    marginLeft: '6px',
                    background: 'var(--nature)',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                  }}
                >
                  ✓
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('keys')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: tab === 'keys' ? 'var(--gold)' : 'transparent',
                color: tab === 'keys' ? 'var(--dark-bg)' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
            >
              🗝️ Private Key
            </button>
          </div>

          {/* Username field (both tabs) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }}>
              Hive Username
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
                placeholder="peddipedderu"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                onKeyPress={(e) => e.key === 'Enter' && tab === 'keychain' && handleKeychainLogin()}
              />
            </div>
          </div>

          {/* Keychain Tab */}
          {tab === 'keychain' && (
            <div>
              {!keychainAvailable && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255,107,53,0.1)',
                    border: '1px solid rgba(255,107,53,0.3)',
                    borderRadius: '10px',
                    color: 'var(--sunset)',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                  }}
                >
                  ⚠️ Hive Keychain not detected.{' '}
                  <a
                    href="https://hive-keychain.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--gold)', textDecoration: 'underline' }}
                  >
                    Install it here
                  </a>{' '}
                  for the most secure login, or use Private Key tab.
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                onClick={handleKeychainLogin}
                disabled={loading || !keychainAvailable}
              >
                {loading ? (
                  <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Connecting...</>
                ) : (
                  <>🔑 Login with Keychain</>
                )}
              </button>
            </div>
          )}

          {/* Keys Tab */}
          {tab === 'keys' && (
            <div>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,200,0,0.08)',
                  border: '1px solid rgba(255,200,0,0.2)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}
              >
                ⚠️ Never share your owner/master key. Only the <strong style={{ color: 'var(--gold)' }}>Posting Key</strong> is needed for gameplay.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                  Posting Private Key
                </label>
                <input
                  type="password"
                  value={postingKey}
                  onChange={(e) => setPostingKey(e.target.value.trim())}
                  placeholder="5Ka4bAoL..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  onKeyPress={(e) => e.key === 'Enter' && handleKeyLogin()}
                />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                onClick={handleKeyLogin}
                disabled={loading}
              >
                {loading ? (
                  <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Logging in...</>
                ) : (
                  <>🗝️ Login with Key</>
                )}
              </button>
            </div>
          )}

          {/* Footer links */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            New to Hive?{' '}
            <a
              href="https://signup.hive.io"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--gold)', textDecoration: 'none' }}
            >
              Create a free account →
            </a>
          </div>
        </div>

        {/* Back home */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
