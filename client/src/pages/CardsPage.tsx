import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { gameApi } from '../services/api';
import ExplorerCardComponent from '../components/ExplorerCard';
import type { ExplorerCard } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

const RARITY_ORDER = { common: 0, rare: 1, epic: 2, legendary: 3 };

type FilterRarity = 'all' | 'common' | 'rare' | 'epic' | 'legendary';
type FilterElement = 'all' | 'fire' | 'water' | 'earth' | 'wind' | 'nature';

export default function CardsPage() {
  const [cards, setCards] = useState<ExplorerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');
  const [filterElement, setFilterElement] = useState<FilterElement>('all');
  const [sortBy, setSortBy] = useState<'rarity' | 'attack' | 'defense' | 'hp'>('rarity');
  const [selectedCard, setSelectedCard] = useState<ExplorerCard | null>(null);
  const [playerCardIds, setPlayerCardIds] = useState<string[]>([]);

  const { isLoggedIn, account } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const [allCards] = await Promise.all([gameApi.getCards()]);
      setCards(allCards);

      if (isLoggedIn && account) {
        const player = await gameApi.getPlayer(account.name).catch(() => null);
        if (player?.explorers) {
          setPlayerCardIds(player.explorers.map((e: any) => e.cardId));
        }
      }
    } catch (err) {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const filtered = cards
    .filter(c => filterRarity === 'all' || c.rarity === filterRarity)
    .filter(c => filterElement === 'all' || c.element === filterElement)
    .sort((a, b) => {
      if (sortBy === 'rarity') return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      return b[sortBy] - a[sortBy];
    });

  const rarityCount = (r: FilterRarity) => r === 'all' ? cards.length : cards.filter(c => c.rarity === r).length;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>🃏 Explorer Cards</h1>
          <p className="section-subtitle">
            8 legendary African explorers — collect them all and build your ultimate team
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '28px',
            padding: '16px',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}
        >
          {/* Rarity filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['all', 'common', 'rare', 'epic', 'legendary'] as FilterRarity[]).map(r => (
              <button
                key={r}
                onClick={() => setFilterRarity(r)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${filterRarity === r ? 'var(--gold)' : 'var(--border)'}`,
                  background: filterRarity === r ? 'rgba(245,200,66,0.15)' : 'transparent',
                  color: filterRarity === r ? 'var(--gold)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: filterRarity === r ? 600 : 400,
                }}
              >
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                <span style={{ marginLeft: '4px', opacity: 0.7 }}>({rarityCount(r)})</span>
              </button>
            ))}
          </div>

          <div style={{ width: '1px', background: 'var(--border)' }} />

          {/* Element filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { val: 'all', emoji: '🌐' },
              { val: 'fire', emoji: '🔥' },
              { val: 'water', emoji: '💧' },
              { val: 'earth', emoji: '🌍' },
              { val: 'wind', emoji: '💨' },
              { val: 'nature', emoji: '🌿' },
            ].map(({ val, emoji }) => (
              <button
                key={val}
                onClick={() => setFilterElement(val as FilterElement)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: `1px solid ${filterElement === val ? 'var(--gold)' : 'var(--border)'}`,
                  background: filterElement === val ? 'rgba(245,200,66,0.1)' : 'transparent',
                  color: filterElement === val ? 'var(--gold)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {emoji} {val === 'all' ? 'All' : val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', background: 'var(--border)' }} />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '6px 12px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="rarity">Sort: Rarity</option>
            <option value="attack">Sort: Attack</option>
            <option value="defense">Sort: Defense</option>
            <option value="hp">Sort: HP</option>
          </select>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map((card) => (
              <div key={card.id} onClick={() => setSelectedCard(card)}>
                <ExplorerCardComponent
                  card={card}
                  owned={playerCardIds.includes(card.id)}
                  showLore={false}
                />
              </div>
            ))}
          </div>
        )}

        {/* Card Detail Modal */}
        {selectedCard && (
          <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
              <button
                onClick={() => setSelectedCard(null)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px' }}>
                <ExplorerCardComponent card={selectedCard} showLore owned={playerCardIds.includes(selectedCard.id)} />

                <div>
                  <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '8px' }}>
                    {selectedCard.name}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{selectedCard.description}</p>

                  {/* Stats bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {[
                      { label: '⚔️ Attack', val: selectedCard.attack, max: 10 },
                      { label: '🛡️ Defense', val: selectedCard.defense, max: 10 },
                      { label: '⚡ Speed', val: selectedCard.speed, max: 10 },
                      { label: '❤️ Health', val: selectedCard.hp, max: 35 },
                    ].map(({ label, val, max }) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{val}</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${(val / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Special ability */}
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(245,200,66,0.08)',
                      border: '1px solid rgba(245,200,66,0.25)',
                      borderRadius: '10px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '4px' }}>
                      ✨ Special Ability: {selectedCard.ability}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Region: {selectedCard.region.charAt(0).toUpperCase() + selectedCard.region.slice(1)} Africa
                    </div>
                  </div>

                  {/* Lore */}
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '10px',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                    }}
                  >
                    "{selectedCard.lore}"
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {playerCardIds.includes(selectedCard.id) ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => { setSelectedCard(null); navigate('/battle'); }}
                      >
                        ⚔️ Use in Battle
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => { setSelectedCard(null); navigate('/market'); }}
                      >
                        🏪 Buy on Market
                      </button>
                    )}
                    <button className="btn btn-ghost" onClick={() => setSelectedCard(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
