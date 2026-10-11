import { Client, PrivateKey } from '@hiveio/dhive';

const HIVE_NODES = [
  'https://api.hive.blog',
  'https://api.openhive.network',
  'https://anyx.io',
  'https://api.hivekings.com',
];

const client = new Client(HIVE_NODES, { timeout: 15000 });

async function publishAnnouncement() {
  const author = process.env.HIVE_AUTHOR || 'peddipedderu';
  const postingKey = process.env.HIVE_POSTING_KEY || process.argv[2];
  if (!postingKey) {
    console.log('Usage: HIVE_POSTING_KEY=... node server/publish-announcement.js or pass key as argument');
    process.exit(1);
  }
  const permlink = 'introducing-safariya-africa-explorer-a-cutting-edge-hive-blockchain-game';
  const title = 'Introducing Safariya: Africa Explorer – A Cutting-Edge Web3 Trading Card Game on Hive';

  const body = `
# 🌍 Introducing Safariya: Africa Explorer
### A Splinterlands-Inspired Trading Card & Territory Conquest Game Built on the Hive Blockchain

Greetings Hive Community, Gamers, and Explorers! 🦁

We are thrilled to officially unveil **Safariya: Africa Explorer**, an ambitious, cutting-edge decentralized trading card game (dApp) built natively on the **Hive blockchain**!

Inspired by the groundbreaking mechanics of *Splinterlands*, **Safariya** transports players into the breathtaking landscapes, ancient legends, and rich cultural heritage of Africa.

---

## 🌟 Why Safariya on Hive?

Hive is the premier blockchain for Web3 gaming thanks to:
- ⚡ **Zero Gas Fees**: Every battle action and card transaction is cost-free.
- ⚡ **3-Second Finality**: Real-time card duels and immediate territory captures.
- 🔑 **Hive Keychain Integration**: Effortless, secure key-management for desktop and mobile players.
- 🪙 **True Digital Ownership**: Every Explorer card is provably unique and tradable directly on-chain.

---

## 🃏 The Explorers: 8 Legendary Cards

Players start with free explorers and can collect, train, and trade across 4 rarity tiers:

1. **Maasai Warrior** (Common · Earth) – *Spear Throw* (ATK: 3, DEF: 2, SPD: 4, HP: 8)
2. **Sahara Nomad** (Common · Fire) – *Sand Veil* (ATK: 2, DEF: 3, SPD: 5, HP: 7)
3. **Congo Shaman** (Rare · Nature) – *Jungle Hex* (ATK: 5, DEF: 2, SPD: 3, HP: 10)
4. **Nile Priestess** (Rare · Water) – *Flood Blessing* (ATK: 4, DEF: 4, SPD: 3, HP: 12)
5. **Kilimanjaro Titan** (Epic · Wind) – *Mountain Roar* (ATK: 7, DEF: 5, SPD: 2, HP: 18)
6. **Serengeti Queen** (Epic · Earth) – *Great Migration* (ATK: 6, DEF: 6, SPD: 5, HP: 20)
7. **Sphinx Guardian** (Legendary · Fire) – *Ancient Riddle* (ATK: 10, DEF: 8, SPD: 4, HP: 30)
8. **Ubuntu Elder** (Legendary · Nature) – *Unity Shield* (ATK: 8, DEF: 10, SPD: 3, HP: 35)

---

## 🗺️ Territory Conquest: Explore Africa

Conquer 10 legendary territories across 5 African regions to earn dynamic HIVE rewards:
- **North Africa**: Sahara Desert & Nile Delta
- **East Africa**: Mt. Kilimanjaro, Serengeti Plains, Great Rift Valley, & Lake Victoria
- **Central Africa**: Congo Rainforest
- **Southern Africa**: Kalahari Basin & Cape of Good Hope
- **Indian Ocean**: Madagascar Isle

---

## 🔗 Project Links & Resources

- 🌐 **Live DApp URL**: [https://safariya-africa-explorer.fly.dev](https://safariya-africa-explorer.fly.dev)
- 💻 **GitHub Repository**: [https://github.com/peddipedderu/safariya](https://github.com/peddipedderu/safariya)
- 💬 **OpenHive.chat Channel**: [#safariya](https://openhive.chat/channel/safariya)
- 💬 **Discord**: [Hive Gaming Discord](https://discord.gg/hive)
- 👤 **Founder & Lead Developer**: [@peddipedderu](https://hive.blog/@peddipedderu)
- 🏛️ **Ecosystem Listing Target**: [Hive.io Ecosystem](https://hive.io/eco/)

---

## 🚀 How to Play

1. Visit [Safariya](https://safariya-africa-explorer.fly.dev)
2. Login with your **Hive Keychain** or **Posting Key**
3. Receive your free starter cards
4. Select your battle team and conquer territories across Africa!

*Join us as we explore the wonders of Africa on the blockchain!* 🌍🦁
`;

  const jsonMetadata = JSON.stringify({
    tags: ['hivegaming', 'splinterlands', 'gamedev', 'africa', 'dapp', 'hive-133987'],
    app: 'safariya/1.0.0',
    format: 'markdown',
    description: 'Introducing Safariya: Africa Explorer – A Splinterlands-inspired trading card and territory battle game on Hive.',
    image: ['https://safariya-africa-explorer.fly.dev/favicon.svg'],
    links: [
      'https://safariya-africa-explorer.fly.dev',
      'https://github.com/peddipedderu/safariya',
      'https://openhive.chat/channel/safariya'
    ]
  });

  console.log(`Broadcasting post for @${author}...`);
  const key = PrivateKey.fromString(postingKey);

  const commentOp = [
    'comment',
    {
      parent_author: '',
      parent_permlink: 'hivegaming',
      author: author,
      permlink: permlink,
      title: title,
      body: body,
      json_metadata: jsonMetadata,
    }
  ];

  const commentOptionsOp = [
    'comment_options',
    {
      author: author,
      permlink: permlink,
      max_accepted_payout: '1000000.000 HBD',
      percent_hbd: 10000,
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: []
    }
  ];

  try {
    const result = await client.broadcast.sendOperations([commentOp, commentOptionsOp], key);
    console.log('✅ Post broadcasted successfully!');
    console.log('Tx ID:', result.id);
    console.log(`URL: https://hive.blog/hivegaming/@${author}/${permlink}`);
  } catch (err) {
    if (err.message && err.message.includes('You may only post once every 5 minutes')) {
      console.log('Notice: Post rate limit encountered (5 min window). Post URL is ready:');
      console.log(`URL: https://hive.blog/hivegaming/@${author}/${permlink}`);
    } else {
      console.error('Broadcast error:', err.message);
    }
  }
}

publishAnnouncement();
