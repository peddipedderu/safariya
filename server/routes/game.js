import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple file-based DB for game state
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'gamedb.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {
  players: {},
  explorers: {},
  territories: INIT_TERRITORIES(),
  battles: [],
  market: []
});

function INIT_TERRITORIES() {
  return {
    'sahara': { id: 'sahara', name: 'Sahara Desert', region: 'north', level: 1, bonus: 'fire', owner: null, rewards: { hive: '0.050', xp: 100 } },
    'kilimanjaro': { id: 'kilimanjaro', name: 'Mt. Kilimanjaro', region: 'east', level: 3, bonus: 'wind', owner: null, rewards: { hive: '0.150', xp: 350 } },
    'congo-rainforest': { id: 'congo-rainforest', name: 'Congo Rainforest', region: 'central', level: 2, bonus: 'nature', owner: null, rewards: { hive: '0.100', xp: 200 } },
    'serengeti': { id: 'serengeti', name: 'Serengeti Plains', region: 'east', level: 2, bonus: 'earth', owner: null, rewards: { hive: '0.100', xp: 200 } },
    'nile-delta': { id: 'nile-delta', name: 'Nile Delta', region: 'north', level: 1, bonus: 'water', owner: null, rewards: { hive: '0.050', xp: 100 } },
    'kalahari': { id: 'kalahari', name: 'Kalahari Basin', region: 'south', level: 2, bonus: 'earth', owner: null, rewards: { hive: '0.100', xp: 200 } },
    'great-rift-valley': { id: 'great-rift-valley', name: 'Great Rift Valley', region: 'east', level: 4, bonus: 'fire', owner: null, rewards: { hive: '0.200', xp: 500 } },
    'victoria-lake': { id: 'victoria-lake', name: 'Lake Victoria', region: 'east', level: 3, bonus: 'water', owner: null, rewards: { hive: '0.150', xp: 350 } },
    'madagascar': { id: 'madagascar', name: 'Madagascar Isle', region: 'east', level: 5, bonus: 'nature', owner: null, rewards: { hive: '0.500', xp: 1000 } },
    'cape-of-good-hope': { id: 'cape-of-good-hope', name: 'Cape of Good Hope', region: 'south', level: 5, bonus: 'wind', owner: null, rewards: { hive: '0.500', xp: 1000 } },
  };
}

// Africa Explorer NFT cards data
const EXPLORER_CARDS = {
  'maasai-warrior': {
    id: 'maasai-warrior', name: 'Maasai Warrior', rarity: 'common',
    element: 'earth', attack: 3, defense: 2, speed: 4, hp: 8,
    ability: 'Spear Throw', description: 'Fierce warrior from the East African savanna',
    cost: '5.000 HIVE', image: '/assets/cards/maasai-warrior.svg',
    region: 'east', lore: 'Masters of the spear, the Maasai protect their lands with unyielding courage.'
  },
  'sahara-nomad': {
    id: 'sahara-nomad', name: 'Sahara Nomad', rarity: 'common',
    element: 'fire', attack: 2, defense: 3, speed: 5, hp: 7,
    ability: 'Sand Veil', description: 'Swift desert traveler who knows all hidden paths',
    cost: '5.000 HIVE', image: '/assets/cards/sahara-nomad.svg',
    region: 'north', lore: 'The desert holds no secrets from those who cross it daily.'
  },
  'congo-shaman': {
    id: 'congo-shaman', name: 'Congo Shaman', rarity: 'rare',
    element: 'nature', attack: 5, defense: 2, speed: 3, hp: 10,
    ability: 'Jungle Hex', description: 'Ancient mystic from the heart of the rainforest',
    cost: '15.000 HIVE', image: '/assets/cards/congo-shaman.svg',
    region: 'central', lore: 'The spirits of the forest speak through his ancient rituals.'
  },
  'nile-priestess': {
    id: 'nile-priestess', name: 'Nile Priestess', rarity: 'rare',
    element: 'water', attack: 4, defense: 4, speed: 3, hp: 12,
    ability: 'Flood Blessing', description: 'Guardian of the sacred Nile waters',
    cost: '15.000 HIVE', image: '/assets/cards/nile-priestess.svg',
    region: 'north', lore: 'The Nile\'s power flows through her veins, blessing all who fight beside her.'
  },
  'kilimanjaro-titan': {
    id: 'kilimanjaro-titan', name: 'Kilimanjaro Titan', rarity: 'epic',
    element: 'wind', attack: 7, defense: 5, speed: 2, hp: 18,
    ability: 'Mountain Roar', description: 'Colossus born from Africa\'s highest peak',
    cost: '50.000 HIVE', image: '/assets/cards/kilimanjaro-titan.svg',
    region: 'east', lore: 'From the top of the world, he commands the very winds of the continent.'
  },
  'serengeti-queen': {
    id: 'serengeti-queen', name: 'Serengeti Queen', rarity: 'epic',
    element: 'earth', attack: 6, defense: 6, speed: 5, hp: 20,
    ability: 'Great Migration', description: 'She commands the animals of the plains',
    cost: '50.000 HIVE', image: '/assets/cards/serengeti-queen.svg',
    region: 'east', lore: 'The animals of the Serengeti bow before her, ready to answer her call.'
  },
  'sphinx-guardian': {
    id: 'sphinx-guardian', name: 'Sphinx Guardian', rarity: 'legendary',
    element: 'fire', attack: 10, defense: 8, speed: 4, hp: 30,
    ability: 'Ancient Riddle', description: 'Immortal guardian of pharaonic secrets',
    cost: '200.000 HIVE', image: '/assets/cards/sphinx-guardian.svg',
    region: 'north', lore: 'Time itself bows before the eternal Sphinx. Its riddles destroy the unworthy.'
  },
  'ubuntu-elder': {
    id: 'ubuntu-elder', name: 'Ubuntu Elder', rarity: 'legendary',
    element: 'nature', attack: 8, defense: 10, speed: 3, hp: 35,
    ability: 'Unity Shield', description: 'Embodies the spirit of Ubuntu - I am because we are',
    cost: '200.000 HIVE', image: '/assets/cards/ubuntu-elder.svg',
    region: 'south', lore: '"I am because we are." The Elder draws power from every soul on the continent.'
  },
};

async function initDB() {
  await db.read();
  if (!db.data.territories || Object.keys(db.data.territories).length === 0) {
    db.data.territories = INIT_TERRITORIES();
    await db.write();
  }
}
initDB().catch(console.error);

// Get all explorer cards
router.get('/cards', (req, res) => {
  res.json(Object.values(EXPLORER_CARDS));
});

// Get specific card
router.get('/cards/:id', (req, res) => {
  const card = EXPLORER_CARDS[req.params.id];
  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

// Get player profile
router.get('/player/:username', async (req, res) => {
  try {
    await db.read();
    const player = db.data.players[req.params.username];
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const playerExplorers = (db.data.explorers[req.params.username] || []).map(e => ({
      ...e,
      cardData: EXPLORER_CARDS[e.cardId]
    }));
    res.json({ ...player, explorers: playerExplorers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create / initialize player
router.post('/player/init', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    await db.read();
    if (db.data.players[username]) {
      return res.json({ existing: true, player: db.data.players[username] });
    }

    const newPlayer = {
      username,
      level: 1,
      xp: 0,
      wins: 0,
      losses: 0,
      territoriesCaptured: 0,
      joinedAt: new Date().toISOString(),
      starterPack: false,
      rating: 1000,
      region: 'explorer',
      achievements: [],
      dailyQuestDone: false,
      lastDailyReset: new Date().toISOString(),
    };

    db.data.players[username] = newPlayer;
    // Give 3 starter cards
    db.data.explorers[username] = [
      { id: uuidv4(), cardId: 'maasai-warrior', level: 1, xp: 0, equippedItems: [] },
      { id: uuidv4(), cardId: 'sahara-nomad', level: 1, xp: 0, equippedItems: [] },
      { id: uuidv4(), cardId: 'nile-priestess', level: 1, xp: 0, equippedItems: [] },
    ];
    await db.write();
    res.json({ existing: false, player: newPlayer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get territories
router.get('/territories', async (req, res) => {
  try {
    await db.read();
    res.json(Object.values(db.data.territories));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Battle endpoint - PvP or PvE
router.post('/battle', async (req, res) => {
  try {
    const { attacker, attackerCards, territory, mode } = req.body;
    if (!attacker || !attackerCards || !attackerCards.length) {
      return res.status(400).json({ error: 'Missing battle data' });
    }

    await db.read();

    // Calculate battle result using game logic
    const attackerPower = attackerCards.reduce((sum, cid) => {
      const card = EXPLORER_CARDS[cid];
      return sum + (card ? card.attack + card.speed + card.hp / 3 : 0);
    }, 0);

    // Generate enemy team based on territory or rating
    const enemyCards = generateEnemyTeam(territory, attackerPower);
    const enemyPower = enemyCards.reduce((sum, card) => sum + card.attack + card.speed + card.hp / 3, 0);

    // Add randomness factor (±20%)
    const randomFactor = 0.8 + Math.random() * 0.4;
    const finalAttackerPower = attackerPower * randomFactor;
    const attackerWon = finalAttackerPower > enemyPower;

    const battleResult = {
      id: uuidv4(),
      attacker,
      attackerCards,
      enemyCards: enemyCards.map(c => c.id),
      territory: territory || null,
      winner: attackerWon ? attacker : 'enemy',
      xpGained: attackerWon ? 150 : 30,
      hiveReward: attackerWon ? (territory ? db.data.territories[territory]?.rewards?.hive || '0.050' : '0.050') : '0',
      timestamp: new Date().toISOString(),
      rounds: generateBattleRounds(attackerCards, enemyCards, attackerWon),
    };

    // Update player stats
    if (db.data.players[attacker]) {
      if (attackerWon) {
        db.data.players[attacker].wins += 1;
        db.data.players[attacker].xp += battleResult.xpGained;
        db.data.players[attacker].rating += 25;
        if (territory && db.data.territories[territory]) {
          db.data.territories[territory].owner = attacker;
          db.data.players[attacker].territoriesCaptured += 1;
        }
        // Level up check
        const newLevel = Math.floor(db.data.players[attacker].xp / 500) + 1;
        db.data.players[attacker].level = Math.min(newLevel, 50);
      } else {
        db.data.players[attacker].losses += 1;
        db.data.players[attacker].xp += battleResult.xpGained;
        db.data.players[attacker].rating = Math.max(800, db.data.players[attacker].rating - 15);
      }
    }

    db.data.battles.unshift(battleResult);
    if (db.data.battles.length > 1000) db.data.battles = db.data.battles.slice(0, 1000);
    await db.write();

    res.json(battleResult);
  } catch (err) {
    console.error('Battle error:', err);
    res.status(500).json({ error: err.message });
  }
});

function generateEnemyTeam(territory, attackerPower) {
  const cardValues = Object.values(EXPLORER_CARDS);
  if (territory) {
    // Territory-themed enemies
    const territoryData = INIT_TERRITORIES()[territory];
    const territoryLevel = territoryData?.level || 1;
    const filtered = cardValues.filter(c => {
      if (territoryLevel <= 2) return c.rarity === 'common';
      if (territoryLevel <= 3) return c.rarity === 'common' || c.rarity === 'rare';
      if (territoryLevel <= 4) return c.rarity === 'rare' || c.rarity === 'epic';
      return c.rarity === 'epic' || c.rarity === 'legendary';
    });
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }
  // Random matchmaking
  const shuffled = cardValues.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function generateBattleRounds(attackerCards, enemyCards, attackerWon) {
  const rounds = [];
  const totalRounds = 3 + Math.floor(Math.random() * 3);
  for (let i = 1; i <= totalRounds; i++) {
    const attackerCard = attackerCards[Math.floor(Math.random() * attackerCards.length)];
    const enemyCard = enemyCards[Math.floor(Math.random() * enemyCards.length)];
    const attackerCardData = EXPLORER_CARDS[attackerCard];
    rounds.push({
      round: i,
      attackerCard,
      enemyCard: enemyCard?.id || 'unknown',
      damage: Math.floor(Math.random() * 10) + 3,
      counterDamage: Math.floor(Math.random() * 8) + 2,
      abilityUsed: i % 2 === 0 ? attackerCardData?.ability : null,
      narrative: generateRoundNarrative(i, attackerCardData, enemyCard, i === totalRounds && attackerWon)
    });
  }
  return rounds;
}

function generateRoundNarrative(round, attacker, enemy, finalWin) {
  const narratives = [
    `${attacker?.name || 'Explorer'} charges forward with fierce determination!`,
    `A powerful clash echoes across the African plains!`,
    `${attacker?.name || 'Explorer'} uses ${attacker?.ability || 'their ability'}, shaking the earth!`,
    `The battle intensifies - both fighters draw on ancient power!`,
    finalWin
      ? `${attacker?.name || 'Explorer'} delivers the final blow, claiming victory for Africa!`
      : `The enemy counters with overwhelming force!`,
  ];
  return narratives[Math.min(round - 1, narratives.length - 1)];
}

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    await db.read();
    const players = Object.values(db.data.players)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 50)
      .map((p, idx) => ({ rank: idx + 1, ...p }));
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy a card (after Hive payment verified)
router.post('/cards/purchase', async (req, res) => {
  try {
    const { username, cardId, txId } = req.body;
    if (!username || !cardId) return res.status(400).json({ error: 'Missing fields' });

    const card = EXPLORER_CARDS[cardId];
    if (!card) return res.status(404).json({ error: 'Card not found' });

    await db.read();
    if (!db.data.explorers[username]) db.data.explorers[username] = [];

    const newExplorer = {
      id: uuidv4(),
      cardId,
      level: 1,
      xp: 0,
      equippedItems: [],
      purchasedAt: new Date().toISOString(),
      txId: txId || null,
    };

    db.data.explorers[username].push(newExplorer);
    await db.write();

    res.json({ success: true, explorer: { ...newExplorer, cardData: card } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent battles
router.get('/battles/recent', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.battles.slice(0, 20));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
