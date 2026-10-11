import express from 'express';
import { Client, PrivateKey } from '@hiveio/dhive';

const router = express.Router();

const HIVE_NODES = [
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io',
  'https://api.openhive.network',
];

const client = new Client(HIVE_NODES, { timeout: 10000 });

// Get account info
router.get('/account/:username', async (req, res) => {
  try {
    const accounts = await client.database.getAccounts([req.params.username]);
    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const account = accounts[0];
    // Return safe public info
    res.json({
      name: account.name,
      balance: account.balance,
      hbd_balance: account.hbd_balance,
      vesting_shares: account.vesting_shares,
      reputation: account.reputation,
      post_count: account.post_count,
      metadata: account.json_metadata,
    });
  } catch (err) {
    console.error('Hive account fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Get HIVE/HBD price (from feed)
router.get('/price', async (req, res) => {
  try {
    const feed = await client.database.getCurrentMedianHistoryPrice();
    res.json({
      base: feed.base,
      quote: feed.quote,
      price: parseFloat(feed.base.amount) / parseFloat(feed.quote.amount),
    });
  } catch (err) {
    console.error('Price fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

// Get account history (for game transactions)
router.get('/history/:username', async (req, res) => {
  try {
    const history = await client.database.getAccountHistory(
      req.params.username,
      -1,
      50
    );
    // Filter for custom_json operations related to safariya
    const gameOps = history.filter(([, op]) => {
      return op.op[0] === 'custom_json' && op.op[1].id === 'safariya';
    });
    res.json(gameOps.map(([seq, op]) => ({
      seq,
      timestamp: op.timestamp,
      op: op.op[1]
    })));
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get global dynamic properties
router.get('/props', async (req, res) => {
  try {
    const props = await client.database.getDynamicGlobalProperties();
    res.json({
      head_block_number: props.head_block_number,
      head_block_id: props.head_block_id,
      time: props.time,
      total_vesting_shares: props.total_vesting_shares,
      total_vesting_fund_hive: props.total_vesting_fund_hive,
    });
  } catch (err) {
    console.error('Props fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch blockchain props' });
  }
});

// Broadcast custom_json game operation (server-side broadcast using posting key)
router.post('/broadcast', async (req, res) => {
  try {
    const { username, postingKey, operation, data } = req.body;
    if (!username || !postingKey || !operation || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const key = PrivateKey.fromString(postingKey);
    const accounts = await client.database.getAccounts([username]);
    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const result = await client.broadcast.json(
      {
        id: 'safariya',
        json: JSON.stringify({ action: operation, data }),
        required_auths: [],
        required_posting_auths: [username],
      },
      key
    );

    res.json({ success: true, result });
  } catch (err) {
    console.error('Broadcast error:', err);
    res.status(500).json({ error: err.message || 'Broadcast failed' });
  }
});

// Transfer HIVE or HBD
router.post('/transfer', async (req, res) => {
  try {
    const { from, to, amount, currency, memo, activeKey } = req.body;
    if (!from || !to || !amount || !currency || !activeKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const key = PrivateKey.fromString(activeKey);
    const amountStr = `${parseFloat(amount).toFixed(3)} ${currency}`;

    const result = await client.broadcast.transfer(
      { from, to, amount: amountStr, memo: memo || '' },
      key
    );

    res.json({ success: true, result });
  } catch (err) {
    console.error('Transfer error:', err);
    res.status(500).json({ error: err.message || 'Transfer failed' });
  }
});

// Get Keychain-ready payload for frontend signing
router.post('/keychain-payload', async (req, res) => {
  try {
    const { username, action, data } = req.body;
    if (!username || !action) {
      return res.status(400).json({ error: 'Missing username or action' });
    }
    const payload = {
      id: 'safariya',
      required_auths: [],
      required_posting_auths: [username],
      json: JSON.stringify({ action, data: data || {} }),
    };
    res.json({ payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
