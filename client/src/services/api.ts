import axios from 'axios';
import type { ExplorerCard, Territory, Player, BattleResult } from '../store/gameStore';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ===== HIVE API =====
export const hiveApi = {
  getAccount: async (username: string) => {
    const res = await api.get(`/hive/account/${username}`);
    return res.data;
  },
  getPrice: async () => {
    const res = await api.get('/hive/price');
    return res.data;
  },
  getProps: async () => {
    const res = await api.get('/hive/props');
    return res.data;
  },
  broadcast: async (username: string, postingKey: string, operation: string, data: object) => {
    const res = await api.post('/hive/broadcast', { username, postingKey, operation, data });
    return res.data;
  },
  transfer: async (from: string, to: string, amount: string, currency: string, memo: string, activeKey: string) => {
    const res = await api.post('/hive/transfer', { from, to, amount, currency, memo, activeKey });
    return res.data;
  },
  getKeychainPayload: async (username: string, action: string, data: object) => {
    const res = await api.post('/hive/keychain-payload', { username, action, data });
    return res.data;
  },
};

// ===== GAME API =====
export const gameApi = {
  getCards: async (): Promise<ExplorerCard[]> => {
    const res = await api.get('/game/cards');
    return res.data;
  },
  getCard: async (id: string): Promise<ExplorerCard> => {
    const res = await api.get(`/game/cards/${id}`);
    return res.data;
  },
  getPlayer: async (username: string): Promise<Player & { explorers: any[] }> => {
    const res = await api.get(`/game/player/${username}`);
    return res.data;
  },
  initPlayer: async (username: string) => {
    const res = await api.post('/game/player/init', { username });
    return res.data;
  },
  getTerritories: async (): Promise<Territory[]> => {
    const res = await api.get('/game/territories');
    return res.data;
  },
  battle: async (attacker: string, attackerCards: string[], territory?: string) => {
    const res = await api.post('/game/battle', { attacker, attackerCards, territory, mode: territory ? 'territory' : 'pvp' });
    return res.data as BattleResult;
  },
  getLeaderboard: async (): Promise<Player[]> => {
    const res = await api.get('/game/leaderboard');
    return res.data;
  },
  purchaseCard: async (username: string, cardId: string, txId?: string) => {
    const res = await api.post('/game/cards/purchase', { username, cardId, txId });
    return res.data;
  },
  getRecentBattles: async () => {
    const res = await api.get('/game/battles/recent');
    return res.data;
  },
};

// ===== MARKET API =====
export const marketApi = {
  getListings: async () => {
    const res = await api.get('/market/listings');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/market/stats');
    return res.data;
  },
};

// ===== HIVE KEYCHAIN HELPER =====
export const keychainApi = {
  isInstalled: () => {
    return typeof (window as any).hive_keychain !== 'undefined';
  },

  login: (username: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!(window as any).hive_keychain) {
        resolve({ success: false, error: 'Hive Keychain not installed' });
        return;
      }
      (window as any).hive_keychain.requestSignBuffer(
        username,
        `Login to Safariya - Africa Explorer at ${new Date().toISOString()}`,
        'Posting',
        (response: any) => {
          if (response.success) {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: response.message });
          }
        }
      );
    });
  },

  broadcastCustomJson: (
    username: string,
    id: string,
    json: string,
    keyType: 'Posting' | 'Active' = 'Posting'
  ): Promise<{ success: boolean; result?: any; error?: string }> => {
    return new Promise((resolve) => {
      if (!(window as any).hive_keychain) {
        resolve({ success: false, error: 'Hive Keychain not installed' });
        return;
      }
      (window as any).hive_keychain.requestCustomJson(
        username,
        id,
        keyType,
        json,
        `Safariya Game Action`,
        (response: any) => {
          if (response.success) {
            resolve({ success: true, result: response.result });
          } else {
            resolve({ success: false, error: response.message });
          }
        }
      );
    });
  },

  transfer: (
    username: string,
    to: string,
    amount: string,
    currency: string,
    memo: string
  ): Promise<{ success: boolean; result?: any; error?: string }> => {
    return new Promise((resolve) => {
      if (!(window as any).hive_keychain) {
        resolve({ success: false, error: 'Hive Keychain not installed' });
        return;
      }
      (window as any).hive_keychain.requestTransfer(
        username,
        to,
        amount,
        memo,
        currency,
        (response: any) => {
          if (response.success) {
            resolve({ success: true, result: response.result });
          } else {
            resolve({ success: false, error: response.message });
          }
        }
      );
    });
  },
};

export default api;
