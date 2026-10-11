import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGameStore } from '../store/gameStore';
import { gameApi, keychainApi, hiveApi } from '../services/api';
import ExplorerCardComponent from '../components/ExplorerCard';
import type { BattleResult, ExplorerCard } from '../store/gameStore';

const TERRITORY_INFO: Record<string, { name: string; emoji: string; description: string }> = {
  'sahara': { name: 'Sahara Desert', emoji: '🏜️', description: 'Vast, relentless desert where only the fierce survive' },
  'kilimanjaro': { name: 'Mt. Kilimanjaro', emoji: '🏔️', description: 'Africa\'s roof — conquer the highest peak' },
  'congo-rainforest': { name: 'Congo Rainforest', emoji: '🌿', description: 'Dense jungle hiding ancient secrets' },
  'serengeti': { name: 'Serengeti Plains', emoji: '🦁', description: 'Where the great migration decides destiny' },
  'nile-delta': { name: 'Nile Delta', emoji: '🏺', description: 'Cradle of civilization, source of pharaonic power' },
  'kalahari': { name: 'Kalahari Basin', emoji: '🦊', description: 'Ancient desert ecosystem rich with life' },
  'great-rift-valley': { name: 'Great Rift Valley', emoji: '⛰️', description: 'Birthplace of humanity, seat of raw power' },
  'victoria-lake': { name: 'Lake Victoria', emoji: '🌊', description: 'Africa\'s inland sea, source of the Nile' },
  'madagascar': { name: 'Madagascar Isle', emoji: '🦎', description: 'Mystical island with creatures found nowhere else' },
  'cape-of-good-hope': { name: 'Cape of Good Hope', emoji: '⚓', description: 'Where two oceans meet at Africa\'s tip' },
};

type BattlePhase = 'select' | 'select-territory' | 'fighting' | 'result';

export default function BattlePage() {
  const navigate = useNavigate();
  const { isLoggedIn, account, player, allCards, selectedCards, toggleSelectedCard, clearSelectedCards, setLastBattle, lastBattle, isBattling, setIsBattling } = useGameStore();

  const [phase, setPhase] = useState<BattlePhase>('select');
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [territories, setTerritories] = useState<any[]>([]);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [battleMode, setBattleMode] = useState<'quick' | 'territory'>('quick');
  const [playerCards, setPlayerCards] = useState<ExplorerCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      const [cards, terrs] = await Promise.all([
        gameApi.getCards(),
        gameApi.getTerritories(),
      ]);
      setTerritories(terrs);

      // Get player's owned cards
      if (account) {
        const playerData = await gameApi.getPlayer(account.name).catch(() => null);
        if (playerData?.explorers) {
          const owned = playerData.explorers
            .map((e: any) => cards.find(c => c.id === e.cardId))
            .filter(Boolean) as ExplorerCard[];
          setPlayerCards(owned);
        } else {
          // Starter cards
          setPlayerCards(cards.slice(0, 3));
        }
      }
    } catch (err) {
      toast.error('Failed to load battle data');
    }
  };

  const handleStartBattle = async () => {
    if (selectedCards.length === 0) {
      toast.error('Select at least 1 Explorer card to battle!');
      return;
    }
    if (!account) return;

    setPhase('fighting');
    setIsBattling(true);
    setCurrentRound(0);
    setLoading(true);

    try {
      // Broadcast game action to Hive blockchain
      const gameAction = {
        type: 'battle_start',
        cards: selectedCards,
        territory: selectedTerritory,
        timestamp: Date.now(),
      };

      // Try keychain first, fallback to key-based broadcast
      if (keychainApi.isInstalled()) {
        await keychainApi.broadcastCustomJson(
          account.name,
          'safariya',
          JSON.stringify(gameAction)
        ).catch(() => {}); // Non-blocking
      } else if (account.postingKey) {
        await hiveApi.broadcast(account.name, account.postingKey, 'battle_start', gameAction).catch(() => {});
      }

      // Animate rounds
      const result = await gameApi.battle(
        account.name,
        selectedCards,
        selectedTerritory || undefined
      );

      setBattleResult(result);
      setLastBattle(result);

      // Animate through rounds
      for (let i = 0; i < result.rounds.length; i++) {
        await new Promise(r => setTimeout(r, 1200));
        setCurrentRound(i + 1);
      }

      await new Promise(r => setTimeout(r, 1000));
      setPhase('result');

    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Battle failed!');
      setPhase('select');
    } finally {
      setIsBattling(false);
      setLoading(false);
    }
  };

  const resetBattle = () => {
    setPhase('select');
    setBattleResult(null);
    setCurrentRound(0);
    clearSelectedCards();
    setSelectedTerritory(null);
  };

  // ===== PHASE: Select Cards =====
  if (phase === 'select') {
    return (
      <div className="page" style={{ position: 'relative' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 className="section-title" style={{ fontSize: '2rem' }}>⚔️ Battle Arena</h1>
              <p className="section-subtitle">Choose your explorers and conquer Africa</p>
            </div>
            {player && (
              <div className="stat-card" style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
                  {player.rating} ⭐
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {player.wins}W / {player.losses}L
                </div>
              </div>
            )}
          </div>

          {/* Battle Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '24px',
              maxWidth: '400px',
            }}
          >
            <button
              onClick={() => { setBattleMode('quick'); setSelectedTerritory(null); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                background: battleMode === 'quick' ? 'var(--gold)' : 'transparent',
                color: battleMode === 'quick' ? 'var(--dark-bg)' : 'var(--text-muted)',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              ⚔️ Quick Battle
            </button>
            <button
              onClick={() => setBattleMode('territory')}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                background: battleMode === 'territory' ? 'var(--gold)' : 'transparent',
                color: battleMode === 'territory' ? 'var(--dark-bg)' : 'var(--text-muted)',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              🗺️ Territory Battle
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
            {/* Card Selection */}
            <div>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--text-secondary)' }}>
                  Your Explorers ({selectedCards.length}/3 selected)
                </h3>
                {selectedCards.length > 0 && (
                  <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={clearSelectedCards}>
                    Clear
                  </button>
                )}
              </div>
              <div className="cards-grid">
                {playerCards.map((card) => (
                  <ExplorerCardComponent
                    key={card.id}
                    card={card}
                    selected={selectedCards.includes(card.id)}
                    onClick={() => toggleSelectedCard(card.id)}
                  />
                ))}
              </div>
            </div>

            {/* Battle Panel */}
            <div>
              {/* Territory selection */}
              {battleMode === 'territory' && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    🗺️ Select Territory
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {territories.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTerritory(t.id === selectedTerritory ? null : t.id)}
                        style={{
                          padding: '10px 14px',
                          background: selectedTerritory === t.id ? 'rgba(245,200,66,0.15)' : 'rgba(0,0,0,0.2)',
                          border: `1px solid ${selectedTerritory === t.id ? 'var(--gold)' : 'var(--border)'}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {TERRITORY_INFO[t.id]?.emoji || '🗺️'} {t.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>Lv.{t.level}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Reward: {t.rewards?.hive} HIVE · {t.rewards?.xp} XP
                        </div>
                        {t.owner && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--sunset)', marginTop: '2px' }}>
                            Held by @{t.owner}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected cards preview */}
              <div
                style={{
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>
                  ⚔️ Your Team ({selectedCards.length}/3)
                </h4>
                {selectedCards.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Click cards to select your team...
                  </p>
                ) : (
                  selectedCards.map((cid) => {
                    const card = playerCards.find(c => c.id === cid);
                    if (!card) return null;
                    return (
                      <div
                        key={cid}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px', background: 'rgba(245,200,66,0.05)',
                          borderRadius: '8px', marginBottom: '6px',
                          border: '1px solid rgba(245,200,66,0.2)',
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>
                          {card.id === 'maasai-warrior' ? '🗡️' : card.id === 'sahara-nomad' ? '🏜️' : card.id === 'congo-shaman' ? '🌿' : card.id === 'nile-priestess' ? '🏺' : card.id === 'kilimanjaro-titan' ? '🏔️' : card.id === 'serengeti-queen' ? '🦁' : card.id === 'sphinx-guardian' ? '🪬' : '👑'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{card.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚔️{card.attack} 🛡️{card.defense} ❤️{card.hp}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Battle button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                onClick={handleStartBattle}
                disabled={selectedCards.length === 0 || loading}
              >
                {loading ? (
                  <><div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Preparing...</>
                ) : (
                  <>⚔️ Start Battle{selectedTerritory ? ` for ${TERRITORY_INFO[selectedTerritory]?.name}` : ''}!</>
                )}
              </button>

              {selectedCards.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
                  Select 1-3 explorers to battle
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== PHASE: Fighting =====
  if (phase === 'fighting' && battleResult === null) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="battle-arena"
          style={{ maxWidth: '800px', width: '100%', margin: '0 20px', textAlign: 'center' }}
        >
          <div className="battle-vs">⚔️ BATTLE ⚔️</div>
          <div style={{ marginTop: '24px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto', width: 50, height: 50, borderWidth: 3 }} />
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '1.1rem' }}>
              Warriors clash across the African plains...
            </p>
          </div>
          <div className="battle-log" style={{ marginTop: '24px', textAlign: 'left' }}>
            <div className="battle-log-entry">🎮 Battle initiated on Hive blockchain...</div>
            <div className="battle-log-entry">🌍 Explorers enter the African arena...</div>
            <div className="battle-log-entry ability">✨ Ancient powers awakening...</div>
            <div className="battle-log-entry">⚔️ The battle begins!</div>
          </div>
        </div>
      </div>
    );
  }

  // Showing rounds in progress
  if (phase === 'fighting' && battleResult) {
    const round = battleResult.rounds[currentRound - 1];
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="battle-arena" style={{ maxWidth: '800px', width: '100%', margin: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>⚔️ Round {currentRound}</h2>
            <span style={{ color: 'var(--text-muted)' }}>{currentRound}/{battleResult.rounds.length}</span>
          </div>
          {round && (
            <div className="battle-log">
              {battleResult.rounds.slice(0, currentRound).map((r, i) => (
                <div
                  key={i}
                  className={`battle-log-entry ${r.abilityUsed ? 'ability' : ''}`}
                >
                  {r.abilityUsed ? `✨ ABILITY: ${r.abilityUsed}! ` : '⚔️ '}
                  {r.narrative} (DMG: {r.damage} / Counter: {r.counterDamage})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== PHASE: Result =====
  if (phase === 'result' && battleResult) {
    const won = battleResult.winner === account?.name;
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Result Header */}
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: won
                ? 'radial-gradient(ellipse at center, rgba(50,205,50,0.15) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(231,76,60,0.15) 0%, transparent 70%)',
              borderRadius: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>
              {won ? '🏆' : '💔'}
            </div>
            <h1
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '2.5rem',
                color: won ? 'var(--nature)' : 'var(--fire)',
                textShadow: `0 0 30px ${won ? 'rgba(50,205,50,0.5)' : 'rgba(231,76,60,0.5)'}`,
                marginBottom: '8px',
              }}
            >
              {won ? '🦁 VICTORY!' : '🏳️ DEFEAT'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
              {won
                ? `Africa bows before your might! ${selectedTerritory ? `You've captured ${TERRITORY_INFO[selectedTerritory]?.name}!` : ''}`
                : 'The enemy was stronger this time. Train harder and return!'}
            </p>

            {/* Rewards */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div className="stat-card" style={{ minWidth: '120px' }}>
                <div className="stat-number" style={{ color: won ? 'var(--nature)' : 'var(--text-muted)' }}>
                  {won ? '+' : ''}{battleResult.xpGained}
                </div>
                <div className="stat-label">XP Gained</div>
              </div>
              {won && parseFloat(battleResult.hiveReward) > 0 && (
                <div className="stat-card" style={{ minWidth: '120px' }}>
                  <div className="stat-number" style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>
                    +{battleResult.hiveReward}
                  </div>
                  <div className="stat-label">HIVE Earned</div>
                </div>
              )}
            </div>
          </div>

          {/* Battle log */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>📜 Battle Chronicle</h3>
            <div className="battle-log">
              {battleResult.rounds.map((r, i) => (
                <div key={i} className={`battle-log-entry ${r.abilityUsed ? 'ability' : ''}`}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>Round {r.round}:</span>
                  {r.abilityUsed ? `✨ ${r.abilityUsed}! ` : ''}
                  {r.narrative}
                </div>
              ))}
              <div className={`battle-log-entry ${won ? 'win' : 'lose'}`} style={{ marginTop: '8px', fontWeight: 700 }}>
                {won ? `🏆 WINNER: @${account?.name}` : '💀 Defeated by enemy forces'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={resetBattle}>
              ⚔️ Battle Again
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/explore')}>
              🗺️ Explore Map
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/leaderboard')}>
              🏆 Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
