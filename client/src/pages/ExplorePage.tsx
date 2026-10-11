import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { gameApi } from '../services/api';
import type { Territory } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

const TERRITORY_DATA: Record<string, {
  emoji: string;
  description: string;
  climate: string;
  wildlife: string[];
  historicalFact: string;
  color: string;
}> = {
  'sahara': {
    emoji: '🏜️', color: '#c9950c',
    description: 'The world\'s largest hot desert, spanning 9 million km²',
    climate: 'Extreme heat, scarce rainfall',
    wildlife: ['🐪 Camel', '🦂 Scorpion', '🦅 Eagle', '🐍 Viper'],
    historicalFact: 'Once a fertile grassland 10,000 years ago, the Sahara was home to ancient civilizations',
  },
  'kilimanjaro': {
    emoji: '🏔️', color: '#4a7a9b',
    description: 'Africa\'s highest peak at 5,895 meters, capped with eternal snow',
    climate: 'From tropical base to arctic summit',
    wildlife: ['🐘 Elephant', '🦁 Lion', '🦒 Giraffe', '🦎 Chameleon'],
    historicalFact: 'First climbed in 1889 by Hans Meyer and Ludwig Purtscheller',
  },
  'congo-rainforest': {
    emoji: '🌿', color: '#2d5a1b',
    description: 'The world\'s second-largest rainforest, the lungs of Africa',
    climate: 'Hot and humid, heavy year-round rainfall',
    wildlife: ['🦍 Gorilla', '🐘 Forest Elephant', '🦜 Parrot', '🐊 Crocodile'],
    historicalFact: 'Home to the Pygmy peoples, one of humanity\'s oldest hunter-gatherer cultures',
  },
  'serengeti': {
    emoji: '🦁', color: '#8B6914',
    description: 'Home to the greatest wildlife spectacle on Earth - the Great Migration',
    climate: 'Tropical savanna, distinct wet and dry seasons',
    wildlife: ['🦁 Lion', '🐆 Cheetah', '🦓 Zebra', '🦒 Wildebeest'],
    historicalFact: 'The Serengeti hosts 1.5 million wildebeest and 500,000 gazelles in annual migration',
  },
  'nile-delta': {
    emoji: '🏺', color: '#1a5a8a',
    description: 'Where the ancient Nile meets the Mediterranean, cradle of civilization',
    climate: 'Mediterranean, mild winters and hot summers',
    wildlife: ['🐊 Nile Crocodile', '🦛 Hippo', '🦩 Flamingo', '🐟 Nile Perch'],
    historicalFact: 'Ancient Egypt\'s agricultural civilization was entirely dependent on Nile floods',
  },
  'kalahari': {
    emoji: '🦊', color: '#9b5a14',
    description: 'A vast semi-arid savanna spanning Botswana, Namibia, and South Africa',
    climate: 'Semi-arid, hot summers, cold winters',
    wildlife: ['🦊 Meerkat', '🦁 Lion', '🐆 Leopard', '🦩 Ostrich'],
    historicalFact: 'The San people (Bushmen) have lived in the Kalahari for over 20,000 years',
  },
  'great-rift-valley': {
    emoji: '⛰️', color: '#7a4a14',
    description: 'A geological wonder stretching 6,000km — the birthplace of humanity',
    climate: 'Varied — from highland cool to lowland heat',
    wildlife: ['🦩 Flamingo', '🦒 Giraffe', '🦁 Lion', '🐘 Elephant'],
    historicalFact: 'Lucy, one of humanity\'s oldest ancestors, was found in Ethiopia\'s Rift Valley in 1974',
  },
  'victoria-lake': {
    emoji: '🌊', color: '#1a4a7a',
    description: 'Africa\'s largest lake and the world\'s largest tropical lake',
    climate: 'Equatorial, warm and humid year-round',
    wildlife: ['🐊 Crocodile', '🦛 Hippo', '🦅 Fish Eagle', '🐟 Cichlid'],
    historicalFact: 'Lake Victoria contains over 500 species of cichlid fish, most found nowhere else',
  },
  'madagascar': {
    emoji: '🦎', color: '#6b3a8a',
    description: 'The world\'s fourth-largest island, home to species found nowhere else on Earth',
    climate: 'Tropical, with distinct wet and dry seasons',
    wildlife: ['🦎 Chameleon', '🦁 Fossa', '🐸 Tomato Frog', '🦜 Vasa Parrot'],
    historicalFact: 'Over 90% of Madagascar\'s wildlife is endemic, having evolved in isolation for 88 million years',
  },
  'cape-of-good-hope': {
    emoji: '⚓', color: '#1a5a7a',
    description: 'Where the Atlantic meets the Indian Ocean at Africa\'s southern tip',
    climate: 'Mediterranean, with summer drought and winter rain',
    wildlife: ['🐧 African Penguin', '🦭 Seal', '🐋 Whale', '🦅 Cape Vulture'],
    historicalFact: 'Portuguese explorer Bartolomeu Dias was the first European to round the Cape in 1488',
  },
};

export default function ExplorePage() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const { isLoggedIn, account } = useGameStore();
  const navigate = useNavigate();

  const regions = ['all', 'north', 'east', 'central', 'south'];
  const regionNames: Record<string, string> = {
    all: '🌍 All Regions',
    north: '🏜️ North Africa',
    east: '🦁 East Africa',
    central: '🌿 Central Africa',
    south: '💎 Southern Africa',
  };

  useEffect(() => {
    gameApi.getTerritories().then(setTerritories).catch(() => toast.error('Failed to load territories')).finally(() => setLoading(false));
  }, []);

  const filtered = territories.filter(t => filterRegion === 'all' || t.region === filterRegion);

  const getLevelColor = (level: number) => {
    if (level <= 2) return 'var(--common)';
    if (level <= 3) return 'var(--rare)';
    if (level <= 4) return 'var(--epic)';
    return 'var(--legendary)';
  };

  const getLevelLabel = (level: number) => {
    if (level <= 1) return '⭐ Novice';
    if (level <= 2) return '⭐⭐ Explorer';
    if (level <= 3) return '⭐⭐⭐ Veteran';
    if (level <= 4) return '⭐⭐⭐⭐ Elite';
    return '⭐⭐⭐⭐⭐ Legendary';
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>🗺️ Explore Africa</h1>
          <p className="section-subtitle">10 territories across 5 regions. Conquer them all to earn HIVE rewards.</p>
        </div>

        {/* Region Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setFilterRegion(r)}
              style={{
                padding: '8px 16px', borderRadius: '20px',
                border: `1px solid ${filterRegion === r ? 'var(--gold)' : 'var(--border)'}`,
                background: filterRegion === r ? 'rgba(245,200,66,0.15)' : 'rgba(0,0,0,0.2)',
                color: filterRegion === r ? 'var(--gold)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.9rem',
                fontWeight: filterRegion === r ? 600 : 400,
              }}
            >
              {regionNames[r]}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="stats-row" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-number">{territories.length}</div>
            <div className="stat-label">Total Territories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{territories.filter(t => t.owner).length}</div>
            <div className="stat-label">Conquered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{territories.filter(t => !t.owner).length}</div>
            <div className="stat-label">Unclaimed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>
              {territories.filter(t => t.owner === account?.name).length}
            </div>
            <div className="stat-label">Yours</div>
          </div>
        </div>

        {/* Territories Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="territories-grid">
            {filtered.map((territory) => {
              const data = TERRITORY_DATA[territory.id];
              const isOwned = territory.owner === account?.name;
              return (
                <div
                  key={territory.id}
                  className="territory-card"
                  style={{
                    borderColor: isOwned ? 'var(--nature)' : territory.owner ? '#e74c3c' : 'var(--border)',
                    background: `linear-gradient(180deg, rgba(${data?.color?.includes('#') ? '139,69,19' : '80,40,10'}, 0.12) 0%, var(--card-bg) 100%)`,
                  }}
                  onClick={() => setSelectedTerritory(territory)}
                >
                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    {isOwned ? (
                      <span style={{ background: 'rgba(50,205,50,0.2)', color: 'var(--nature)', padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                        YOUR LAND
                      </span>
                    ) : territory.owner ? (
                      <span style={{ background: 'rgba(231,76,60,0.2)', color: '#e74c3c', padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                        CONTESTED
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(245,200,66,0.1)', color: 'var(--gold)', padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                        UNCLAIMED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{data?.emoji || '🗺️'}</div>
                  <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '1rem' }}>
                    {territory.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px', lineHeight: 1.4 }}>
                    {data?.description || ''}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: getLevelColor(territory.level), fontSize: '0.8rem', fontWeight: 600 }}>
                      {getLevelLabel(territory.level)}
                    </span>
                    <span style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Bonus:</span>{' '}
                      <span style={{ color: 'var(--gold)' }}>{territory.bonus}</span>
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px', fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                      🔴 {territory.rewards?.hive} HIVE
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      ✨ {territory.rewards?.xp} XP
                    </span>
                  </div>

                  {territory.owner && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Held by <span style={{ color: 'var(--sunset)' }}>@{territory.owner}</span>
                    </div>
                  )}

                  {/* Hover action */}
                  <div
                    style={{
                      marginTop: '12px',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      textAlign: 'center',
                    }}
                    className="territory-action"
                  >
                    <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                      Click to view →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Territory Detail Modal */}
        {selectedTerritory && (
          <div className="modal-overlay" onClick={() => setSelectedTerritory(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
              <button
                onClick={() => setSelectedTerritory(null)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>

              {(() => {
                const data = TERRITORY_DATA[selectedTerritory.id];
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '4rem' }}>{data?.emoji}</div>
                      <div>
                        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: '1.5rem' }}>
                          {selectedTerritory.name}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{data?.description}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>☁️ Climate</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{data?.climate}</div>
                      </div>
                      <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>⚡ Difficulty</div>
                        <div style={{ color: 'var(--gold)', fontWeight: 600 }}>Level {selectedTerritory.level} Territory</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>🦁 Wildlife</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {data?.wildlife.map((w) => (
                          <span key={w} style={{ padding: '4px 10px', background: 'rgba(45,90,27,0.2)', border: '1px solid rgba(45,90,27,0.4)', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '14px 16px', background: 'rgba(245,200,66,0.05)',
                        border: '1px solid rgba(245,200,66,0.2)', borderRadius: '10px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ color: 'var(--gold)', fontWeight: 600, marginBottom: '4px', fontSize: '0.85rem' }}>
                        📜 Historical Fact
                      </div>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                        {data?.historicalFact}
                      </p>
                    </div>

                    {/* Rewards */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                      <div className="stat-card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.3rem' }}>
                          🔴 {selectedTerritory.rewards?.hive}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>HIVE Reward</div>
                      </div>
                      <div className="stat-card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ color: 'var(--nature)', fontWeight: 700, fontSize: '1.3rem' }}>
                          ✨ {selectedTerritory.rewards?.xp}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>XP Reward</div>
                      </div>
                      <div className="stat-card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                          {selectedTerritory.owner ? (
                            <span style={{ color: 'var(--sunset)' }}>@{selectedTerritory.owner.slice(0, 10)}</span>
                          ) : (
                            <span style={{ color: 'var(--nature)' }}>Unclaimed!</span>
                          )}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Current Owner</div>
                      </div>
                    </div>

                    {/* Battle button */}
                    {isLoggedIn ? (
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                        onClick={() => {
                          setSelectedTerritory(null);
                          navigate('/battle');
                        }}
                      >
                        ⚔️ Battle for {selectedTerritory.name}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                        onClick={() => navigate('/login')}
                      >
                        🎮 Login to Battle
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
