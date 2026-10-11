import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { gameApi, hiveApi } from '../services/api';
import ParticleBackground from '../components/ParticleBackground';

export default function HomePage() {
  const { isLoggedIn, account } = useGameStore();
  const navigate = useNavigate();
  const [hivePrice, setHivePrice] = useState<number | null>(null);
  const [blockchainProps, setBlockchainProps] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live data
    hiveApi.getPrice().then(data => setHivePrice(data.price)).catch(() => {});
    hiveApi.getProps().then(data => setBlockchainProps(data)).catch(() => {});
    gameApi.getLeaderboard().then(data => setLeaderboard(data.slice(0, 5))).catch(() => {});
  }, []);

  const features = [
    {
      icon: '🃏',
      title: 'African Explorer Cards',
      desc: 'Collect 8 unique NFT cards from Maasai Warriors to Sphinx Guardians — each with unique abilities and lore',
    },
    {
      icon: '⚔️',
      title: 'Territory Battles',
      desc: 'Conquer 10 iconic African territories from the Sahara to Madagascar. Earn HIVE rewards for every victory',
    },
    {
      icon: '🏆',
      title: 'Earn Real HIVE',
      desc: 'Every battle win earns you real HIVE cryptocurrency. Trade cards in the marketplace for maximum profit',
    },
    {
      icon: '🔗',
      title: 'Hive Blockchain',
      desc: 'All game actions are recorded on the Hive blockchain — zero gas fees, lightning fast, fully decentralized',
    },
    {
      icon: '🌍',
      title: 'Explore Africa',
      desc: 'Journey through 5 regions: North Africa, East Africa, Central Africa, West Africa, and Southern Africa',
    },
    {
      icon: '🏪',
      title: 'Card Marketplace',
      desc: 'Buy, sell and trade Explorer cards with other players. The market is powered by HIVE token',
    },
  ];

  const regions = [
    { id: 'north', name: 'North Africa', emoji: '🏜️', territories: 2, color: '#c9950c' },
    { id: 'east', name: 'East Africa', emoji: '🦁', territories: 4, color: '#8B4513' },
    { id: 'central', name: 'Central Africa', emoji: '🌿', territories: 1, color: '#2d5a1b' },
    { id: 'south', name: 'Southern Africa', emoji: '💎', territories: 2, color: '#1a4a7a' },
    { id: 'west', name: 'West Africa', emoji: '🥁', territories: 1, color: '#9b59b6' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <ParticleBackground />

      {/* ===== HERO SECTION ===== */}
      <section className="hero" style={{ paddingTop: '80px' }}>
        {/* Decorative sun circle */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        <div className="hero-content" style={{ zIndex: 2, position: 'relative' }}>
          <div
            style={{
              fontSize: '5rem',
              marginBottom: '16px',
              filter: 'drop-shadow(0 0 20px rgba(245,200,66,0.4))',
            }}
          >
            🌍
          </div>
          <h1 className="hero-title">SAFARIYA</h1>
          <p className="hero-subtitle">Africa Explorer · Hive Blockchain Game</p>
          <p className="hero-description">
            Collect legendary African explorer cards, battle for territories across the continent,
            and earn real <strong style={{ color: 'var(--gold)' }}>HIVE</strong> cryptocurrency rewards.
            A trading card game where Africa's rich heritage meets Web3 gaming.
          </p>

          <div className="hero-badges">
            <span className="hero-badge">⚡ Zero Gas Fees</span>
            <span className="hero-badge">🔴 Hive Powered</span>
            <span className="hero-badge">🃏 8 NFT Cards</span>
            <span className="hero-badge">🗺️ 10 Territories</span>
            <span className="hero-badge">💰 Play to Earn</span>
          </div>

          <div className="hero-buttons">
            {isLoggedIn ? (
              <>
                <button
                  className="btn btn-primary"
                  style={{ padding: '14px 32px', fontSize: '1.1rem' }}
                  onClick={() => navigate('/battle')}
                >
                  ⚔️ Battle Now
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '14px 32px', fontSize: '1.1rem' }}
                  onClick={() => navigate('/explore')}
                >
                  🗺️ Explore Africa
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                  🎮 Start Playing Free
                </Link>
                <Link to="/cards" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                  🃏 View Cards
                </Link>
              </>
            )}
          </div>

          {/* Hive live stats */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginTop: '40px',
              flexWrap: 'wrap',
            }}
          >
            {hivePrice && (
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(226,0,52,0.1)',
                  border: '1px solid rgba(226,0,52,0.3)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                🔴 HIVE: <strong style={{ color: 'white' }}>${hivePrice.toFixed(4)}</strong>
              </div>
            )}
            {blockchainProps && (
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(245,200,66,0.05)',
                  border: '1px solid rgba(245,200,66,0.2)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                ⛓️ Block: <strong style={{ color: 'var(--gold)' }}>#{blockchainProps.head_block_number?.toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== GAME STATS ===== */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="stats-row">
          {[
            { num: '8', label: 'Explorer Cards' },
            { num: '10', label: 'Territories' },
            { num: '5', label: 'African Regions' },
            { num: '100%', label: 'On-Chain' },
            { num: '∞', label: 'Adventures' },
          ].map((s, i) => (
            <div key={i} className="stat-card fade-in">
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section
        style={{
          padding: '60px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(139,69,19,0.08) 0%, transparent 70%)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title" style={{ fontSize: '2.2rem' }}>⚡ Game Features</h2>
          <p className="section-subtitle">Everything you need for the ultimate African adventure</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((f, i) => (
            <div key={i} className="card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '8px', fontSize: '1.1rem' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== AFRICA REGIONS ===== */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title" style={{ fontSize: '2.2rem' }}>🗺️ African Regions</h2>
          <p className="section-subtitle">5 regions, 10 territories to explore and conquer</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {regions.map((r) => (
            <Link
              key={r.id}
              to="/explore"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="territory-card"
                style={{
                  textAlign: 'center',
                  background: `linear-gradient(180deg, rgba(${r.color === '#c9950c' ? '201,149,12' : r.color === '#8B4513' ? '139,69,19' : r.color === '#2d5a1b' ? '45,90,27' : r.color === '#1a4a7a' ? '26,74,122' : '155,89,182'}, 0.15) 0%, var(--card-bg) 100%)`,
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{r.emoji}</div>
                <div style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>
                  {r.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {r.territories} Territories
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== TOP EXPLORERS ===== */}
      {leaderboard.length > 0 && (
        <section style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="section-title">🏆 Top Explorers</h2>
            <p className="section-subtitle">The bravest adventurers on the continent</p>
          </div>
          {leaderboard.map((p: any, i: number) => (
            <div key={p.username} className="leaderboard-row">
              <span className={`leaderboard-rank ${i < 3 ? 'top-3' : ''}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600 }}>
                @{p.username}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginRight: '16px' }}>
                Lv.{p.level} · {p.wins}W/{p.losses}L
              </span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                ⭐ {p.rating}
              </span>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/leaderboard" className="btn btn-secondary">
              View Full Leaderboard →
            </Link>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section
        style={{
          padding: '80px 20px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, transparent, rgba(139,69,19,0.15), transparent)',
          margin: '40px 0',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🦁</div>
        <h2
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '2.5rem',
            color: 'var(--gold)',
            marginBottom: '16px',
          }}
        >
          Ready for Adventure?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Join thousands of explorers on the Hive blockchain. Start with 3 free starter cards and conquer Africa!
        </p>
        <Link to="/login" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
          🌍 Begin Your Safari
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          padding: '40px 20px',
          borderTop: '1px solid var(--border)',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
        }}
      >
        <div>
          <div style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '12px' }}>
            🌍 SAFARIYA
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Africa Explorer is a Hive blockchain-powered trading card game celebrating Africa's rich heritage.
          </p>
          <div style={{ marginTop: '12px' }}>
            <span className="hive-badge">🔴 Hive Blockchain</span>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Game</h4>
          {[
            { to: '/cards', label: '🃏 Cards' },
            { to: '/battle', label: '⚔️ Battle' },
            { to: '/explore', label: '🗺️ Explore' },
            { to: '/market', label: '🏪 Market' },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '6px', fontSize: '0.9rem' }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Community</h4>
          {[
            { href: 'https://openhive.chat', label: '💬 OpenHive Chat' },
            { href: 'https://hive.blog', label: '📝 Hive Blog' },
            { href: 'https://github.com/peddipedderu/safariya', label: '💻 GitHub' },
            { href: 'https://hive.io/eco/', label: '🌐 Hive Ecosystem' },
          ].map(l => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '6px', fontSize: '0.9rem' }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Info</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>
            Account: @peddipedderu<br />
            Built with ❤️ on Hive<br />
            v1.0.0 · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
