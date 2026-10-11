import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { marketApi, gameApi, keychainApi, hiveApi } from '../services/api';
import ExplorerCardComponent from '../components/ExplorerCard';
import type { ExplorerCard } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

export default function MarketPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [cards, setCards] = useState<Record<string, ExplorerCard>>({});
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [filterRarity, setFilterRarity] = useState('all');

  const { isLoggedIn, account } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadMarket();
  }, []);

  const loadMarket = async () => {
    try {
      const [ls, allCards, mStats] = await Promise.all([
        marketApi.getListings(),
        gameApi.getCards(),
        marketApi.getStats(),
      ]);
      setListings(ls);
      setStats(mStats);
      const cardMap: Record<string, ExplorerCard> = {};
      allCards.forEach((c: ExplorerCard) => { cardMap[c.id] = c; });
      setCards(cardMap);
    } catch (err) {
      toast.error('Failed to load market');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listing: any) => {
    if (!isLoggedIn || !account) {
      navigate('/login');
      return;
    }
    const card = cards[listing.cardId];
    if (!card) return;

    setPurchasing(listing.id);
    try {
      const amount = listing.price.replace(' HIVE', '');

      let txResult;
      if (keychainApi.isInstalled()) {
        txResult = await keychainApi.transfer(
          account.name,
          listing.seller,
          amount,
          'HIVE',
          `safariya-buy:${listing.cardId}:${listing.id}`
        );
      } else if (account.postingKey || (account as any).activeKey) {
        // For demo - in production this would use active key for transfers
        toast.error('Active key required for transfers. Please use Hive Keychain.');
        return;
      } else {
        toast.error('Please login with Hive Keychain to purchase cards');
        return;
      }

      if (!txResult?.success) {
        toast.error(txResult?.error || 'Purchase failed');
        return;
      }

      // Record purchase
      await gameApi.purchaseCard(account.name, listing.cardId, txResult.result?.id);
      toast.success(`🎉 ${card.name} added to your collection!`);
      loadMarket();
    } catch (err: any) {
      toast.error(err?.message || 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const filtered = listings.filter(l =>
    filterRarity === 'all' || cards[l.cardId]?.rarity === filterRarity
  );

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>🏪 Card Market</h1>
          <p className="section-subtitle">Buy and sell Explorer cards using HIVE tokens</p>
        </div>

        {/* Market Stats */}
        {stats && (
          <div className="stats-row" style={{ marginBottom: '28px' }}>
            <div className="stat-card">
              <div className="stat-number" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>
                {stats.totalVolume}
              </div>
              <div className="stat-label">Total Volume</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeListings}</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ fontSize: '1.2rem' }}>{stats.averageCardPrice}</div>
              <div className="stat-label">Avg Price</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          {/* Listings */}
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['all', 'common', 'rare', 'epic', 'legendary'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRarity(r)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px',
                    border: `1px solid ${filterRarity === r ? 'var(--gold)' : 'var(--border)'}`,
                    background: filterRarity === r ? 'rgba(245,200,66,0.15)' : 'transparent',
                    color: filterRarity === r ? 'var(--gold)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: '0.85rem',
                  }}
                >
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="loading-spinner" />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No listings found for this filter
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map((listing) => {
                  const card = cards[listing.cardId];
                  if (!card) return null;
                  return (
                    <div key={listing.id} className="market-listing">
                      {/* Card mini preview */}
                      <div style={{ flexShrink: 0 }}>
                        <ExplorerCardComponent card={card} compact />
                      </div>

                      {/* Card info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-primary)', fontSize: '1rem' }}>
                              {card.name}
                            </h3>
                            <span className={`rarity-badge ${card.rarity}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                              {card.rarity.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>
                              🔴 {listing.price}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              by @{listing.seller}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>⚔️ {card.attack}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🛡️ {card.defense}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>❤️ {card.hp}</span>
                          <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>✨ {card.ability}</span>
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ padding: '8px 24px', fontSize: '0.9rem' }}
                          onClick={() => handleBuy(listing)}
                          disabled={purchasing === listing.id}
                        >
                          {purchasing === listing.id ? (
                            <><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Buying...</>
                          ) : (
                            <>🛒 Buy Now</>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar - Recent Sales */}
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '16px', fontSize: '1rem' }}>
                📈 Recent Sales
              </h3>
              {stats?.recentSales?.map((sale: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <div style={{ color: 'var(--text-primary)' }}>{cards[sale.cardId]?.name || sale.cardId}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sale.time}</div>
                  </div>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>🔴 {sale.price}</span>
                </div>
              ))}
            </div>

            {/* Sell your card panel */}
            <div className="card">
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: '12px', fontSize: '1rem' }}>
                💰 Sell Your Cards
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
                List your Explorer cards for other players to buy. Set your price in HIVE tokens.
              </p>
              {isLoggedIn ? (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => toast('Card selling coming in next update! 🚀', { icon: '📣' })}
                >
                  + List a Card
                </button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                  🎮 Login to Sell
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
