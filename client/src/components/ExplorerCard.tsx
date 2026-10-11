import React from 'react';
import type { ExplorerCard } from '../store/gameStore';

interface Props {
  card: ExplorerCard;
  selected?: boolean;
  owned?: boolean;
  onClick?: () => void;
  compact?: boolean;
  showLore?: boolean;
}

const ELEMENT_EMOJI: Record<string, string> = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  wind: '💨',
  nature: '🌿',
};

const RARITY_STARS: Record<string, string> = {
  common: '⭐',
  rare: '⭐⭐',
  epic: '⭐⭐⭐',
  legendary: '⭐⭐⭐⭐',
};

const CARD_ART: Record<string, string> = {
  'maasai-warrior': '🗡️',
  'sahara-nomad': '🏜️',
  'congo-shaman': '🌿',
  'nile-priestess': '🏺',
  'kilimanjaro-titan': '🏔️',
  'serengeti-queen': '🦁',
  'sphinx-guardian': '🪬',
  'ubuntu-elder': '👑',
};

export default function ExplorerCardComponent({
  card,
  selected = false,
  owned = false,
  onClick,
  compact = false,
  showLore = false,
}: Props) {
  return (
    <div
      className={`explorer-card rarity-${card.rarity} ${selected ? 'selected' : ''} fade-in`}
      onClick={onClick}
      style={{
        width: compact ? '160px' : '200px',
        minHeight: compact ? '230px' : '300px',
        cursor: onClick ? 'pointer' : 'default',
        outline: selected ? '3px solid var(--gold)' : 'none',
        outlineOffset: '3px',
        position: 'relative',
      }}
    >
      {/* Selected indicator */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            background: 'var(--gold)',
            borderRadius: '50%',
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            boxShadow: '0 0 10px rgba(245,200,66,0.8)',
            fontSize: '14px',
            fontWeight: '900',
            color: 'var(--dark-bg)',
          }}
        >
          ✓
        </div>
      )}

      {/* Owned badge */}
      {owned && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: -8,
            background: 'var(--green-jungle)',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            fontSize: '12px',
          }}
        >
          ✅
        </div>
      )}

      {/* Card Header */}
      <div className="card-header">
        <span className={`rarity-badge ${card.rarity}`}>{card.rarity.toUpperCase()}</span>
        <span className={`element-badge element-${card.element}`}>
          {ELEMENT_EMOJI[card.element]} {card.element}
        </span>
      </div>

      {/* Card Art */}
      <div
        className="card-art"
        style={{
          background: `linear-gradient(180deg, 
            rgba(${card.element === 'fire' ? '139,69,19' : card.element === 'water' ? '30,80,120' : card.element === 'nature' ? '45,90,27' : '80,60,20'}, 0.3) 0%, 
            transparent 100%)`,
          fontSize: compact ? '4rem' : '5rem',
        }}
      >
        {CARD_ART[card.id] || '🦁'}
      </div>

      {/* Card Name */}
      <div
        style={{
          padding: '8px 12px 4px',
          fontSize: compact ? '0.85rem' : '0.95rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'Cinzel, serif',
          textAlign: 'center',
        }}
      >
        {card.name}
      </div>

      {/* Rarity Stars */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', marginBottom: 4 }}>
        {RARITY_STARS[card.rarity]}
      </div>

      {/* Stats */}
      {!compact && (
        <div className="card-stats">
          <div className="stat-item">
            ⚔️ <span className="stat-value">{card.attack}</span>
          </div>
          <div className="stat-item">
            🛡️ <span className="stat-value">{card.defense}</span>
          </div>
          <div className="stat-item">
            ⚡ <span className="stat-value">{card.speed}</span>
          </div>
          <div className="stat-item">
            ❤️ <span className="stat-value">{card.hp}</span>
          </div>
        </div>
      )}

      {/* Ability */}
      {!compact && (
        <div
          style={{
            margin: '4px 10px 10px',
            padding: '6px 10px',
            background: 'rgba(245,200,66,0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(245,200,66,0.2)',
            fontSize: '0.8rem',
            color: 'var(--gold)',
            textAlign: 'center',
          }}
        >
          ✨ {card.ability}
        </div>
      )}

      {/* Lore */}
      {showLore && !compact && (
        <div
          style={{
            padding: '0 10px 10px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            borderTop: '1px solid var(--border)',
            paddingTop: '8px',
          }}
        >
          "{card.lore}"
        </div>
      )}

      {/* Cost */}
      {!compact && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Cost</span>
          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
            🔴 {card.cost.replace(' HIVE', '')} HIVE
          </span>
        </div>
      )}
    </div>
  );
}
