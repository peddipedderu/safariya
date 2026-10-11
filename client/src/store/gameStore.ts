import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HiveAccount {
  name: string;
  postingKey?: string;
  activeKey?: string;
  balance?: string;
  hbd_balance?: string;
  reputation?: number;
}

export interface ExplorerCard {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  element: 'fire' | 'water' | 'earth' | 'wind' | 'nature';
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  ability: string;
  description: string;
  cost: string;
  image: string;
  region: string;
  lore: string;
}

export interface PlayerExplorer {
  id: string;
  cardId: string;
  level: number;
  xp: number;
  equippedItems: string[];
  cardData?: ExplorerCard;
}

export interface Player {
  username: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  territoriesCaptured: number;
  rating: number;
  achievements: string[];
  region: string;
  explorers?: PlayerExplorer[];
}

export interface Territory {
  id: string;
  name: string;
  region: string;
  level: number;
  bonus: string;
  owner: string | null;
  rewards: { hive: string; xp: number };
}

export interface BattleResult {
  id: string;
  attacker: string;
  attackerCards: string[];
  enemyCards: string[];
  territory: string | null;
  winner: string;
  xpGained: number;
  hiveReward: string;
  timestamp: string;
  rounds: BattleRound[];
}

export interface BattleRound {
  round: number;
  attackerCard: string;
  enemyCard: string;
  damage: number;
  counterDamage: number;
  abilityUsed: string | null;
  narrative: string;
}

interface GameStore {
  // Auth
  account: HiveAccount | null;
  isLoggedIn: boolean;
  loginMethod: 'keychain' | 'keys' | null;

  // Game data
  player: Player | null;
  allCards: ExplorerCard[];
  territories: Territory[];
  leaderboard: Player[];
  lastBattle: BattleResult | null;
  isBattling: boolean;
  selectedCards: string[];

  // UI state
  isLoading: boolean;
  currentPage: string;

  // Actions
  setAccount: (account: HiveAccount | null) => void;
  setPlayer: (player: Player | null) => void;
  setAllCards: (cards: ExplorerCard[]) => void;
  setTerritories: (territories: Territory[]) => void;
  setLeaderboard: (lb: Player[]) => void;
  setLastBattle: (battle: BattleResult | null) => void;
  setIsBattling: (v: boolean) => void;
  toggleSelectedCard: (cardId: string) => void;
  clearSelectedCards: () => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      account: null,
      isLoggedIn: false,
      loginMethod: null,
      player: null,
      allCards: [],
      territories: [],
      leaderboard: [],
      lastBattle: null,
      isBattling: false,
      selectedCards: [],
      isLoading: false,
      currentPage: 'home',

      setAccount: (account) =>
        set({ account, isLoggedIn: !!account }),

      setPlayer: (player) => set({ player }),
      setAllCards: (allCards) => set({ allCards }),
      setTerritories: (territories) => set({ territories }),
      setLeaderboard: (leaderboard) => set({ leaderboard }),
      setLastBattle: (lastBattle) => set({ lastBattle }),
      setIsBattling: (isBattling) => set({ isBattling }),

      toggleSelectedCard: (cardId) => {
        const { selectedCards } = get();
        if (selectedCards.includes(cardId)) {
          set({ selectedCards: selectedCards.filter((c) => c !== cardId) });
        } else if (selectedCards.length < 3) {
          set({ selectedCards: [...selectedCards, cardId] });
        }
      },

      clearSelectedCards: () => set({ selectedCards: [] }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          account: null,
          isLoggedIn: false,
          loginMethod: null,
          player: null,
          selectedCards: [],
          lastBattle: null,
        }),
    }),
    {
      name: 'safariya-store',
      partialize: (state) => ({
        account: state.account
          ? { name: state.account.name } // Don't persist private keys!
          : null,
        isLoggedIn: false, // Always require re-login
        loginMethod: state.loginMethod,
      }),
    }
  )
);
